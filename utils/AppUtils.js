import { PermissionsAndroid } from 'react-native';
import AppAsyncStorage from './AppAsyncStorage';

export default class AppUtils {

  static printResponseJson(responseJson) {
    console.log('');
    console.log('--------------DEBUG--------------------');
    console.log('-------------response------------------');
    console.log(responseJson);
    console.log('-------------response.data--------------');
    console.log(responseJson.data);
    console.log('---------------------------------------');
    if (responseJson.fullResponse.ok == true) {
      console.log('>>>>>>>>>>>>>>> OK >>>>>>>>>>>>>>>>>>>>');
      console.log('ok:' + responseJson.fullResponse.ok);
    } else {
      console.log('!!!!!!!!!!!! NOT OK !!!!!!!!!!!!!!!!!!');
      console.log('ok:' + responseJson.fullResponse.ok);
    }
    console.log('status:' + responseJson.fullResponse.status);
    console.log('---------------------------------------');
    console.log('---------------------------------------');

    console.log('');
  }

  static logout() {
    // ejecuta limpiezas al hacer logout
    AppAsyncStorage.deleteSession();
  }

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