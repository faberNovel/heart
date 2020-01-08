import {
  AnalysisEvents,
  Module,
  ModuleInterface,
  ModuleListenerInterface,
  Report
} from '@fabernovel/heart-core';
import { EventEmitter } from 'events';

import SlackClient from './api/Client';

export default class SlackModule extends Module
  implements ModuleListenerInterface {
  private slackClient: SlackClient;

  constructor(module: Partial<ModuleInterface>) {
    super(module);

    this.slackClient = new SlackClient();
  }

  /**
   * Register the events:
   * 1. take the events and their handlers from the mapping table
   * 2. register each event on the event emitter
   */
  public registerEvents(eventEmitter: EventEmitter): void {
    eventEmitter.on(AnalysisEvents.DONE, this.sendReport.bind(this));
  }

  private sendReport(report: Report): void {
    let message = `${report.analyzedUrl}: ${report.note}`;
    if (report.resultUrl) {
      message += `. <${report.resultUrl}|view full report>`;
    }
    this.slackClient.postMessage({
      text: message,
      icon_url: report.service ? report.service.logo : undefined,
      username: report.service ? report.service.name : undefined
    });
  }
}
