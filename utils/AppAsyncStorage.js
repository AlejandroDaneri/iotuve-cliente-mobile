import AsyncStorage from '@react-native-community/async-storage';

export default class AppAsyncStorage {

    // SESSION (incluye el TOKEN)
    static saveSession = async (data) => {
        await AsyncStorage.setItem('session_data', JSON.stringify({
            session_data: data,
        }));
    }
    
    static getSession = async () => {
        const data = await AsyncStorage.getItem('session_data');
        return data;
    }   
    
    static deleteSession = async (token) => {
        await AsyncStorage.removeItem('session_data');;
    }


    // TOKEN
    static saveToken = async (token) => {
        await AsyncStorage.setItem('authentication_data', JSON.stringify({
            authToken: token,
        }));
    }
    
    static getToken = async () => {
        const data = await AsyncStorage.getItem('authentication_data');
        return data;
    }
    
    static deleteToken = async (token) => {
        await AsyncStorage.removeItem('authentication_data');;
    }

}
