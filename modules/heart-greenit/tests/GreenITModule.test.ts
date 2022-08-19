import { Report } from '@fabernovel/heart-core';
import { createJsonReports } from 'greenit-cli/cli-core/analysis';
import path from 'path';
import { mocked } from 'jest-mock';

import {GreenITModule} from '../src/GreenITModule';

import successResults from './data/successReport.json';
import { conf } from './data/Conf';

jest.mock('greenit-cli/cli-core/analysis');
const mockedCreateJsonReports = mocked(createJsonReports, true);

describe('Run GreenIT analysis', () => {
  it('should be able to launch a successful analysis', async () => {

    mockedCreateJsonReports.mockResolvedValue([{
      path: path.join(__dirname, './data/successReport.json'),
      name: '1.json'
    }]);

    const moduleConfig = {
      id: '1234',
      name: 'Green IT',
      service: {
        name: 'Green IT',
        logo: 'some-logo',
      },
    };

    const module = new GreenITModule(moduleConfig);
    const analysisReport = await module.startAnalysis(conf);

    const mockReport = new Report({
      analyzedUrl: successResults.url,
      date: new Date(successResults.date),
      note: successResults.ecoIndex.toString(),
      service: moduleConfig.service,
    });

    expect(analysisReport).toStrictEqual(mockReport);
  });

  it('should be able to handle a failed analysis', async () => {

    mockedCreateJsonReports.mockResolvedValue([{
      path: path.join(__dirname, './data/errorReport.json'),
      name: '1.json'
    }]);

    const moduleConfig = {
      id: '1234',
      name: 'Green IT',
      service: {
        name: 'Green IT',
        logo: 'some-logo',
      },
    };

    const errorMessage = 'Error during GreenIT analysis';
    const module = new GreenITModule(moduleConfig);

    try {
      await module.startAnalysis(conf);
    } catch (error) {
      expect(error).toHaveProperty('message', errorMessage)
    }
  });
});
