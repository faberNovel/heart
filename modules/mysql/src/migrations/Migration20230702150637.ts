import { Migration } from "@mikro-orm/migrations"

export class Migration20230702150637 extends Migration {
  // eslint-disable-next-line @typescript-eslint/require-await
  async up(): Promise<void> {
    this.addSql(
      "create table `service` (`name` varchar(255) not null, `logo` varchar(255) null, primary key (`name`)) default character set utf8mb4 collate utf8mb4_general_ci engine = InnoDB;"
    )

    this.addSql(
      "create table `report` (`id` int unsigned not null auto_increment primary key, `analyzed_url` varchar(255) not null, `date` datetime not null, `grade` varchar(255) not null, `normalized_grade` int not null, `result` json not null, `result_url` varchar(255) null, `service_name` varchar(255) not null) default character set utf8mb4 collate utf8mb4_general_ci engine = InnoDB;"
    )
    this.addSql("alter table `report` add index `report_service_name_index`(`service_name`);")

    this.addSql(
      "alter table `report` add constraint `report_service_name_foreign` foreign key (`service_name`) references `service` (`name`) on update cascade;"
    )
  }
}
