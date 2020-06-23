export default class EndPoints {

  // Base URL for all endpoints
  //static baseURL = 'https://fiuba-taller-2-auth-server.herokuapp.com';
  static _baseURL = 'https://fiuba-taller-2-app-server-st.herokuapp.com/api/v1';

  // EndPoints -------------------------------------
  static ping = EndPoints._baseURL + '/ping';
  
  static sessions = EndPoints._baseURL + '/sessions';
  
  static users = EndPoints._baseURL + '/users';
  
  static passwordRecovery = EndPoints._baseURL + '/recovery';

  static friendships = EndPoints._baseURL + '/friendships';

  static videos = EndPoints._baseURL + '/videos';
  // views      /videos/{videoId}/views
  // likes      /videos/{videoId}/likes
  // dislikes   /videos/{videoId}/dislikes

  static comments = EndPoints._baseURL + '/comments';

}