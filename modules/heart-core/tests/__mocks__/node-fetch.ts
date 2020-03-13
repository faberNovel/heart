class Response {
  private body: string;

  constructor(body: any) {
    this.body = JSON.stringify(body);
  }

  json(): Promise<any> {
    try {
      const json = JSON.parse(this.body);

      return Promise.resolve(json);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

let response = {};
const __setMockResponse = (newResponse: any) => {
  response = newResponse;
};

const fetch = async(url: string, opts = {}): Promise<Response> => new Response(response);

export { __setMockResponse };
export default fetch;
