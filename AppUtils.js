import { PermissionsAndroid } from 'react-native';

export default class AppUtils {

  // Base URL for all endpoints
  static baseURL = 'https://fiuba-taller-2-auth-server.herokuapp.com';

  // EndPoints --
  static endpoint_ping = AppUtils.baseURL + '/ping';
  static endpoint_video_like = AppUtils.baseURL + '/video/like';
  static endpoint_video_unlike = AppUtils.baseURL + '/video/unlike';

 

  static testConsole() {
    console.log('from AppUtils -> testConsole');
  }

  static generateRandomNumber() {
    // var milliseconds = new Date().getTime();

    var RandomNumber = Math.floor(Math.random() * 10000000) + 1;
    return RandomNumber;
  }

  static async requestPermissionsAndroid() {
    const granted1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    if (granted1) {
      console.log("Ya teniamos el permiso: READ_EXTERNAL_STORAGE");
      return true;
    }
    else {
      console.log("READ_EXTERNAL_STORAGE permission denied");
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          'title': 'Chotuve necesita un permiso',
          'message': 'Por favor otorgá el permiso de acceso a tus archivos para poder continuar.\nGracias'
        }
      );
      const granted2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      if (granted2) {
        console.log("Ahora tenemos el permiso: READ_EXTERNAL_STORAGE");
        return true;
      } else {
        return false;
      }
    }
  }

}