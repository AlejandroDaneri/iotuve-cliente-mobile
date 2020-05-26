import EndPoints from '../utils/EndPoints.js';

// TODO: Revisar
// ESTA CLASE POR EL MOMENTO NO SE ESTA USANDO EN NINGUN LADO
export default class APIRequest {

  static logIn(username, password) {

    var myHeaders = new Headers({
      'Content-Type': 'application/json',
    });

    var myBody = JSON.stringify({
      username: username,
      password: password,
    });

    return fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: myHeaders,
      body: myBody,
    });
  }

  static getUser(username) {

    var myHeaders = new Headers({
      'Content-Type': 'application/json',
      'X-Auth-Token': authToken,
    });

    var myBody = JSON.stringify({
      username: this.state.userEmail,
      password: this.state.userPassword,
    });

    return fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: myHeaders,
      body: myBody,
    });
  }

}
