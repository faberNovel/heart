import Request from '../src/http/Request';

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

  it('should returns a JSON content if the GET method is used', async () => {
    const data = await Request.get(API_URL);

    expect(data).toStrictEqual(RESPONSE);
  });

  it('should returns a JSON content if the POST method is used', async () => {
    const data = await Request.post(API_URL);

    expect(data).toStrictEqual(RESPONSE);
  });
});
