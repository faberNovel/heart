
import { ModuleAnalysisInterface, ModuleListenerInterface, ReportInterface, ServiceInterface } from '@fabernovel/heart-core';

import App from '../src/App';

class TestReport implements ReportInterface<number> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: number;

  constructor(report: ReportInterface<number>) {
    Object.assign(this, report);
  }
}

test('Register events from Listener modules', () => {
  const module: ModuleListenerInterface = {
    id: 'test-listener',
    name: 'Heart Test Listener',
    service: {
      name: 'Test Listener'
    },
    registerEvents: () => {}
  };

  const registerEventsMock = jest.spyOn(module, 'registerEvents');

  // tslint:disable-next-line: no-unused-expression
  new App([module]);

  expect(registerEventsMock).toHaveBeenCalled();

  registerEventsMock.mockRestore();
});

test('Displays the results of an analysis', async () => {
  const report = new TestReport({
    analyzedUrl: 'https://blbl.ch',
    date: new Date(),
    resultUrl: undefined,
    service: { name: 'Analysis' },
    value: 12,
  });

  const module: ModuleAnalysisInterface<number> = {
    id: 'test-analysis-tool',
    name: 'Heart Test Analysis Tool',
    service: {
      name: 'Test Analysis Tool'
    },
    startAnalysis: () => new Promise((resolve) => resolve(report))
  };

  const startAnalysisMock = jest.spyOn(module, 'startAnalysis');
  const consoleLogMock = jest.spyOn(global.console, 'log');

  const app = new App([module]);
  await app.startAnalysis(module, {});

  expect(startAnalysisMock).toHaveBeenCalled();
  expect(consoleLogMock).toHaveBeenCalled();

  consoleLogMock.mockRestore();
  startAnalysisMock.mockRestore();
});

