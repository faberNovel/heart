import { Status } from '../enum/Status';

import EndpointInterface from './EndpointInterface';

/**
 * @see [Documentation]{@link https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#host}
 */
export default class HostInterface {
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
}
