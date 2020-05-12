import { AsyncStorage } from 'react-native'

export default class AppAsyncStorage {

    static saveToken = async (token) => {
        await AsyncStorage.setItem('authentication_data', JSON.stringify({
            authToken: token,
        }));
    }
    
    static getToken = async () => {
        const authData = await AsyncStorage.getItem('authentication_data');
        return authData;
    }
    
    static deleteToken = async (token) => {
        await AsyncStorage.removeItem('authentication_data');;
    }

}
