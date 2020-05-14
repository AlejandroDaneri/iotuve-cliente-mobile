export default class EndPoints {

  // Base URL for all endpoints
  //static baseURL = 'https://fiuba-taller-2-auth-server.herokuapp.com';
  static _baseURL = 'https://fiuba-taller-2-app-server-st.herokuapp.com/api/v1';

  // EndPoints --
  static ping = EndPoints._baseURL + '/ping';
  static sessions = EndPoints._baseURL + '/sessions';
  static users = EndPoints._baseURL + '/users';
  static video_like = EndPoints._baseURL + '/video/like';
  static video_unlike = EndPoints._baseURL + '/video/unlike';

}