import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode, encode } from "base-64";
import { ErrorCode, ErrorConnection, ErrorSession, ErrorStorage, ErrorVerifyLogin } from "./Responses";

export default class AccountSystem {
    constructor(url: string) {
        this.urlBase = url;
    }
    private urlBase: string = "";
    login(username: string, password: string) {
        return new Promise((resolve, reject)=>{
            axios.get(`${this.urlBase}/player_api.php?username=${username}&password=${password}`).then(async(result)=>{
                try {
                    const { user_info: { auth } } = result.data;
                    if (auth) {
                        await AsyncStorage.setItem('Session', encode(JSON.stringify({ username, password })));
                        return resolve(true);
                    }
                    reject(ErrorSession);
                } catch {
                    reject(ErrorCode);
                }
            }).catch(()=>reject(ErrorConnection));
        });
    }
    verify() {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('Session').then((data)=>{
                if (!data) return reject(ErrorVerifyLogin);
                const { username, password } = JSON.parse(decode(data));
                axios.get(`${this.urlBase}/player_api.php?username=${username}&password=${password}`).then(async(result)=>{
                    try {
                        const { user_info: { auth } } = result.data;
                        if (parseInt(auth) == 1) return resolve(true);
                        reject(ErrorSession);
                    } catch {
                        reject(ErrorCode);
                    }
                }).catch(()=>reject(ErrorConnection));
            }).catch(()=>reject(ErrorStorage));
        });
    }
    getData(): Promise<{ username: string; password: string; }> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('Session').then((data)=>{
                if (!data) return reject(ErrorVerifyLogin);
                const { username, password } = JSON.parse(decode(data));
                resolve({ username, password });
            }).catch(()=>reject(ErrorStorage));
        });
    }
}