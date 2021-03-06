import EndPoints from '../utils/EndPoints.js';

export default async function myRequest(url, options = {}) {
  printAPIRequest(url, options);

  try {
    const response = await fetch(url, options);
    const response_1 = await checkStatus(response);
    const data = await parseJSON(response_1);
    return ({ data });
  }
  catch (err) {
    return ({ err });
  }
}

function printAPIRequest() {
  console.log('--- Api request ---');
  console.log('url = ' + url);
  console.log('options = ' + options);
  console.log('--- ----------- ---');
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json().then(json => {
    return {
      data: json,
      status: response.status
    }
  })
}

export function requestPing(options) {
  return myRequest(EndPoints.ping, options);
}
