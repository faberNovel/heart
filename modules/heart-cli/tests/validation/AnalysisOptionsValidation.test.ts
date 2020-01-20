import AnalysisOptionsValidation from '../../src/validation/AnalysisOptionsValidation';


jest.mock('fs');

test('Provide no configurations', () => {
  const [errors] = AnalysisOptionsValidation.validate(undefined, undefined);

  expect(errors.length).toBe(1);
});

test('Provide two configurations', () => {
  const [errors] = AnalysisOptionsValidation.validate('', '');

  expect(errors.length).toBe(1);
});

test('Provide an inline configuration', () => {
  const [errors, config] = AnalysisOptionsValidation.validate(undefined, '{"inline": "configuration"}');

  expect(errors.length).toBe(0);
  expect(config).toBe('{"inline": "configuration"}');
});

describe('Provide a file configuration', () => {
  const MOCK_FILE_INFO = {
    'existingConfig.json': '{"url": "www.my-test.website"}',
  };

  beforeEach(() => {
    // Set up some mocked out file info before each test
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  });

  test('Provide missing file configuration', () => {
    const [errors, config] = AnalysisOptionsValidation.validate('missingConfig.json', undefined);

    expect(errors.length).toBe(1);
    expect(config).toBe('');
  });

  test('Provide existing file configuration', () => {
    const [errors, config] = AnalysisOptionsValidation.validate('existingConfig.json', undefined);

    expect(errors.length).toBe(0);
    expect(config).toBe(MOCK_FILE_INFO['existingConfig.json']);
  });
});
