import { GenericReport, ModuleAnalysisInterface, ReportArguments, ServiceInterface } from '@fabernovel/heart-core';
import * as program from 'commander';

import AnalysisCommand from '../../src/command/AnalysisCommand';

class TestReport implements GenericReport<boolean> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: boolean;

  constructor(report: ReportArguments<boolean>) {
    Object.assign(this, report);
  }

  getNote() {
    return this.value.toString();
  }

  getNormalizedNote() {
    return this.value ? 1 : 0;
  }
}

test('Create an analysis command', () => {
  const report = new TestReport({
    analyzedUrl: 'https://blbl.ch',
    date: new Date(),
    resultUrl: undefined,
    service: { name: 'Analysis' },
    value: true,
  });

  const module: ModuleAnalysisInterface = {
    id: 'test-analysis-tool',
    name: 'Heart Test Analysis Tool',
    service: {
      name: 'Test Analysis Tool'
    },
    startAnalysis: () => new Promise((resolve) => resolve(report))
  };

  AnalysisCommand.create(program, module, () => {});

  expect(program.commands[0]._name).toBe(module.id);
  expect(program.commands[0].options.length).toBe(2);
  expect(program.commands[0].options[0].short).toBe('-f');
  expect(program.commands[0].options[0].long).toBe('--file');
  expect(program.commands[0].options[1].short).toBe('-i');
  expect(program.commands[0].options[1].long).toBe('--inline');
});
