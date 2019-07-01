import { Status } from '../enum/Status';
import GradeTransformer from '../transformer/GradeTransformer';

import EndpointInterface from './EndpointInterface';
import HostInterface from './HostInterface';

export default class Host implements HostInterface {
  host: string;
  port: number;
  protocol: string;
  isPublic: boolean;
  status: Status;
  statusMessage: string;
  startTime: string;
  testTime: string;
  engineVersion: string;
  criteriaVersion: string;
  endpoints: EndpointInterface[];

  constructor(host: Partial<Host> = {}) {
    Object.assign(this, host);
  }

  /**
   * Retrieve the average endpoint percentage
   */
  getAveragePercentage(): number {
    const grades = this.endpoints.map((endpoint: EndpointInterface) => GradeTransformer.transform(endpoint.grade));

    if (0 === grades.length) {
      return 0;
    }

    const sumGrades = grades.reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    return sumGrades / grades.length;
  }
}
