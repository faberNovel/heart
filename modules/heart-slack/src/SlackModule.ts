import { AnalysisEvents, Module, ModuleInterface, ModuleListenerInterface, Report } from '@fabernovel/heart-core';
import { EventEmitter } from 'events';

import SlackClient from './api/Client';

export default class SlackModule extends Module implements ModuleListenerInterface {
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
    const reportName = report.service.name ? `[${report.service.name}]` : '';

    this.slackClient.postMessage({
      text: `${reportName}${report.analyzedUrl}: ${report.note}. <${report.resultUrl}|view full report>`,
      icon_url: report.service.logo,
    });
  }
}
