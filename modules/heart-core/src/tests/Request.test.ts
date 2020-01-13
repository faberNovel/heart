'use strict';

import Request from '../http/Request';

const api_url = 'https://jsonplaceholder.typicode.com/todos/1';
const api_returned_data = {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false
};

test('The request GET method return API json content', async () => {
    expect.assertions(1);
    return expect( Request.get(api_url)).resolves.toStrictEqual(api_returned_data);
});

test('The request POST method return API json content', async () => {
    expect.assertions(1);
    return expect( Request.post(api_url)).resolves.toStrictEqual({});
});
