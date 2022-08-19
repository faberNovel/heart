import { Status } from '../enum/Status';
import {GradeTransformer} from '../transformer/GradeTransformer';

import {EndpointInterface} from './EndpointInterface';
import {HostInterface} from './HostInterface';

export class Host implements HostInterface {
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

  constructor(host: Host) {
    this.host = host.host
    this.port = host.port
    this.protocol = host.protocol
    this.isPublic = host.isPublic
    this.status = host.status
    this.statusMessage = host.statusMessage
    this.startTime = host.startTime
    this.testTime = host.testTime
    this.engineVersion = host.engineVersion
    this.criteriaVersion = host.criteriaVersion
    this.endpoints = host.endpoints
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
