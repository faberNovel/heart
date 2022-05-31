class Response {
  private body: string;

  constructor(body: object) {
    this.body = JSON.stringify(body);
  }

  json(): Promise<object> {
    try {
      const json = JSON.parse(this.body);

      return Promise.resolve(json);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

let response = {};
const __setMockResponse = (newResponse: object) => {
  response = newResponse;
};

const fetch = async(): Promise<Response> => new Response(response);

export { __setMockResponse };
export default fetch;
