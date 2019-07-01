import { AnalysisEvents, NotificationInterface, Report } from '@fabernovel/heart-core';
import { EventEmitter } from 'events';

import SlackClient from './api/Client';

export default class Notification implements NotificationInterface {
  private slackClient: SlackClient;

  constructor() {
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
    const reportName = report.name ? `[${report.name}] ` : '';

    this.slackClient.postMessage(`${reportName}${report.analyzedUrl}: ${report.note}. <${report.resultUrl}|view full report>`);
  }
}
