import AppUtils from '../utils/AppUtils.js';

export default async function myRequest(url, options = {}) {

  console.log('sending api request, url = ' + url)

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

function getPing(options) {
  return myRequest(AppUtils.endpoint_ping, options);
}

