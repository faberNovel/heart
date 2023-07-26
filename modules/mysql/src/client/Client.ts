import { ReportEntity, type GenericReport, type Result, ServiceEntity } from "@fabernovel/heart-common"
import { MikroORM, type IMigrator } from "@mikro-orm/core"
import { SqlEntityManager, type MySqlDriver } from "@mikro-orm/mysql"
import databaseConfig from "../config/mikro-orm.config.js"

export class MySQLClient {
  #em: SqlEntityManager | undefined
  #orm: MikroORM<MySqlDriver> | undefined
  #verbose: boolean

  constructor(verbose: boolean) {
    this.#verbose = verbose
  }

  public async getMigrator(): Promise<IMigrator> {
    const orm = await this.getOrCreateOrm()

    return orm.getMigrator()
  }

  /**
   * Save the given report into the database.
   */
  public async save(report: GenericReport<Result>): Promise<void> {
    const reportEntity = await this.createReportEntity(report)

    const em = await this.getOrCreateEntityManager()
    const orm = await this.getOrCreateOrm()

    await em.persistAndFlush(reportEntity)

    return orm.close()
  }

  private async createReportEntity(report: GenericReport<Result>): Promise<ReportEntity<Result>> {
    const reportEntity = new ReportEntity<Result>(report)
    const serviceEntity = await this.getOrCreateServiceEntity(report.service)

    reportEntity.service = serviceEntity

    return reportEntity
  }

  /**
   * Get or create the ORM: avoid the opening of several DB connection at the same or in a very short interval of time.
   * As Heart is a CLI tool, having the DB connection opened during a single analysis that longs a couple of minutes is acceptable.
   */
  private async getOrCreateOrm(): Promise<MikroORM<MySqlDriver>> {
    if (this.#orm === undefined) {
      this.#orm = await MikroORM.init<MySqlDriver>({ verbose: this.#verbose, ...databaseConfig })
    }

    return this.#orm
  }

  /**
   * Get or create the entity manager
   * @link https://mikro-orm.io/docs/identity-map
   */
  private async getOrCreateEntityManager(): Promise<SqlEntityManager> {
    const orm = await this.getOrCreateOrm()

    if (this.#em === undefined) {
      this.#em = orm.em.fork()
    }

    return this.#em
  }

  private async getOrCreateServiceEntity(service: GenericReport<Result>["service"]): Promise<ServiceEntity> {
    const em = await this.getOrCreateEntityManager()

    const serviceEntity = await em.findOne(ServiceEntity, { name: service.name })

    return serviceEntity ?? new ServiceEntity(service)
  }
}
