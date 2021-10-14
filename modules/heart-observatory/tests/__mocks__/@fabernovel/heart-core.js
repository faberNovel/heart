'use strict';

const core = jest.genMockFromModule('@fabernovel/heart-core');

let scan = {};

function __setMockScan(newScan) {
  scan = {};

  Object.keys(newScan).forEach((key) => scan[key] = newScan[key]);
}

function get(url, headers) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => resolve(scan));
  });
}

function post(url, body, headers) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => resolve(scan));
  });
}

class Module {
  constructor(module) {
    Object.assign(this, module);
  }
}

class Report {
  constructor(report) {
    Object.assign(this, report);
    this.normalizedNote = this.normalizedNote || parseInt(report.note, 10) || 0;
  }
}

core.__setMockScan = __setMockScan;
core.Request.get = get;
core.Request.post = post;
core.Module = Module;
core.Report = Report;

module.exports = core;
