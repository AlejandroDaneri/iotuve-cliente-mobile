export default class EndPoints {

  // Base URL for all endpoints
  //static baseURL = 'https://fiuba-taller-2-auth-server.herokuapp.com';
  static _baseURL = 'https://fiuba-taller-2-app-server-st.herokuapp.com/api/v1';

  // EndPoints --
  static ping = EndPoints._baseURL + '/ping';
  static sessions = EndPoints._baseURL + '/sessions';
  static users = EndPoints._baseURL + '/users';
  static passwordRecovery = EndPoints._baseURL + '/recovery';
  static video_like = EndPoints._baseURL + '/video/like';
  static video_unlike = EndPoints._baseURL + '/video/unlike';
  static friendships = EndPoints._baseURL + '/friendships';

}

/*
guido321: id -> 5ecfc55ac746190fb22fac36
usuario1: id -> 5ecfc1f6171e9e9e1e2fac36
*/