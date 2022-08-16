import AnalysisOptionsValidation from '../../src/validation/AnalysisOptionsValidation';


jest.mock('fs');

test('Provide no configurations', () => {
  expect(() => {
    AnalysisOptionsValidation.validate();
  }).toThrow();
});

test('Provide two configurations', () => {
  expect(() => {
    AnalysisOptionsValidation.validate('', '');
  }).toThrow()
});

test('Provide an inline configuration', () => {
  const [config] = AnalysisOptionsValidation.validate(undefined, '{"inline": "configuration"}');
  expect(config).toEqual({"inline": "configuration"});
});

describe('Provide a file configuration', () => {
  const MOCK_FILE_INFO = {
    'existingConfig.json': JSON.stringify({"url": "www.my-test.website"}),
  };

  beforeEach(() => {
    // Set up some mocked out file info before each test
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  });

  test('Provide missing file configuration', () => {
    expect(() => {
      AnalysisOptionsValidation.validate('missingConfig.json');
    }).toThrow()
  });

  test('Provide existing file configuration', () => {
    const [config] = AnalysisOptionsValidation.validate('existingConfig.json');

    expect(config).toEqual(JSON.parse(MOCK_FILE_INFO['existingConfig.json']));
  });
});
