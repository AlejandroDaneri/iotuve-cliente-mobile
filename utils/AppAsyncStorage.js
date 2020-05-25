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

    static getTokenFromSession = async () => {
        const data = await AsyncStorage.getItem('session_data');
        let json = JSON.parse(data);
        return json.session_data.session_token;
    } 
    
    static deleteSession = async (token) => {
        await AsyncStorage.removeItem('session_data');;
    }

}
