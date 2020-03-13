import { mocked } from 'ts-jest/utils';

import Request from '../src/http/Request';


jest.mock('node-fetch');
const MockedRequest = mocked(Request, true);

describe('The different Request methods must returns a JSON content', () => {
  const API_URL = 'https://jsonplaceholder.typicode.com/todos/1';
  const RESPONSE = {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false
  };

  beforeEach(() => {
    require('node-fetch').__setMockResponse(RESPONSE);
  });

  test('The GET method must returns a JSON content', async () => {
    const data = await MockedRequest.get(API_URL);

    expect(data).toStrictEqual(RESPONSE);
  });

  test('The POST method must returns a JSON content', async () => {
    const data = await MockedRequest.post(API_URL);

    expect(data).toStrictEqual(RESPONSE);
  });
});
