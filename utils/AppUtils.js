import { Platform } from 'react-native';
//import { PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import AppAsyncStorage from './AppAsyncStorage';

export default class AppUtils {
  static printResponseJson(responseJson) {
    console.log('');
    console.log('--------------DEBUG--------------------');
    if (responseJson.fullResponse.ok == true) {
      console.log('>>>>>>>>>>>>>>> OK >>>>>>>>>>>>>>>>>>>>');
      console.log('ok:' + responseJson.fullResponse.ok);
    } else {
      console.log('!!!!!!!!!!!! NOT OK !!!!!!!!!!!!!!!!!!');
      console.log('ok:' + responseJson.fullResponse.ok);
    }
    console.log('status:' + responseJson.fullResponse.status);
    console.log('-------------response------------------');
    console.log(responseJson);
    console.log('-------------response.data--------------');
    console.log(responseJson.data);
    console.log('---------------------------------------');
    console.log('');
  }

  static capitalize(str) {
    // capitaliza un string
    var nice = str
      .trim()
      .toLowerCase()
      .replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
    return nice;
  }

  static logout() {
    // ejecuta limpiezas al hacer logout
    AppAsyncStorage.deleteSession();
    AppAsyncStorage.deleteFcmToken();
  }

  static testConsole() {
    console.log('from AppUtils -> testConsole');
  }

  static generateRandomNumber() {
    // var milliseconds = new Date().getTime();
    var RandomNumber = Math.floor(Math.random() * 10000000) + 1;
    return RandomNumber;
  }

  static async checkPermissionsLibrary() {
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    });
    console.log('Chequeando permisos: ' + permission);

    var granted = false;

    await check(permission)
      .then((resultCheck) => {
        switch (resultCheck) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'El dispositivo no cuenta con la funcionalidad necesaria para el permiso: ' +
                permission,
            );
            break;
          case RESULTS.DENIED:
            console.log('Solicitando permiso: ' + permission);
            granted = AppUtils.requestPermissionsLibrary(permission);
            break;
          case RESULTS.GRANTED:
            console.log('Ya teniamos el permiso: ' + permission);
            granted = true;
            break;
          case RESULTS.BLOCKED:
            console.log('Permiso bloqueado: ' + permission);
            break;
          default:
            console.log('Permiso denegado: ' + permission);
            break;
        }
      })
      .catch((error) => {
        console.log('Permiso denegado: ' + permission);
        return false;
      });

    return granted;
  }

  static async requestPermissionsLibrary(permission) {
    var granted = false;

    await request(permission, {
      title: 'ChoTuve',
      message:
        'Por favor otorgá el permiso de acceso a tus archivos para poder continuar.\nGracias',
    })
      .then((resultRequest) => {
        if (resultRequest === RESULTS.GRANTED) {
          console.log('Permiso otorgado: ' + permission);
          granted = true;
        } else {
          console.log('Permiso denegado: ' + permission);
          granted = false;
        }
      })
      .catch((error) => {
        console.log('Permiso denegado: ' + permission);
        return false;
      });

    return granted;
  }

  /*
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
  */
}
