import fetch, { HeadersInit, Response } from 'node-fetch';
import { stringify } from 'querystring';

export class Request {
  private static GET = 'GET';
  private static POST = 'POST';
  public static HEADER_CONTENT_TYPE = 'Content-Type';
  public static HEADER_CONTENT_TYPE_JSON = 'application/json';
  public static HEADER_CONTENT_TYPE_X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded';
  private static BASE_HEADER = {
    [Request.HEADER_CONTENT_TYPE]: Request.HEADER_CONTENT_TYPE_JSON
  };

  public static async get<T>(url: string, headers: HeadersInit | { [index: string]: string } = {}): Promise<T> {
    return await fetch(url, {
        method: Request.GET,
        headers: {...Request.BASE_HEADER, ...headers},
      }).then((res: Response) => res.json());
  }

  public static async post<T>(url: string, body: object = {}, headers: HeadersInit | { [index: string]: string } = {}): Promise<T> {
    let bodyString = '';

    headers = {...Request.BASE_HEADER, ...headers};
    switch (headers[Request.HEADER_CONTENT_TYPE]) {
      case Request.HEADER_CONTENT_TYPE_JSON:
        bodyString = JSON.stringify(body);
        break;
      case Request.HEADER_CONTENT_TYPE_X_WWW_FORM_URLENCODED:
        bodyString = stringify(body);
        break;
      default:
        return Promise.reject({error: 'invalid-header', message: 'Unsupported header Content-Type'});
        break;
    }

    return await fetch(url, {
      method: Request.POST,
      body: bodyString,
      headers
    }).then((res: Response) => res.json());
  }
}
