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

core.__setMockScan = __setMockScan;
core.Request.get = get;
core.Request.post = post;

module.exports = core;
