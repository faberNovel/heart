import { Options } from 'greenit-cli/cli-core/analysis';

export interface PageInfos {
  url: string;
}

export interface Config extends PageInfos, Options { }
