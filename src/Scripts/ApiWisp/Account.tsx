import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode, encode } from "base-64";
import { ErrorCode, ErrorConnection, ErrorSession, ErrorStorage, ErrorVerifyLogin } from "./Responses";
import { AccountData, AccountRequest } from "./Types";

export default class AccountSystem {
    constructor(url: string) {
        this.urlBase = url;
    }
    private urlBase: string = "";
    login(username: string, password: string): Promise<AccountData> {
        return new Promise((resolve, reject)=>{
            axios.get(`${this.urlBase}/player_api.php?username=${username}&password=${password}`).then(async(result)=>{
                try {
                    const { user_info }: AccountRequest = result.data;
                    if (user_info.auth == 1) {
                        await AsyncStorage.setItem('Session', encode(JSON.stringify({ username, password })));
                        return resolve({
                            username: user_info.username,
                            status: (user_info.status == 'Active'),
                            isTrial: (user_info.is_trial == '1'),
                            maxConnections: parseInt(user_info.max_connections),
                            expDate: (user_info.exp_date)? new Date((parseInt(user_info.exp_date) * 1000)): null,
                            createDate: new Date((parseInt(user_info.created_at) * 1000))
                        });
                    }
                    reject(ErrorSession);
                } catch {
                    reject(ErrorCode);
                }
            }).catch(()=>reject(ErrorConnection));
        });
    }
    verify(): Promise<AccountData> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('Session').then((data)=>{
                if (!data) return reject(ErrorVerifyLogin);
                const { username, password } = JSON.parse(decode(data));
                axios.get(`${this.urlBase}/player_api.php?username=${username}&password=${password}`).then(async(result)=>{
                    try {
                        const { user_info }: AccountRequest = result.data;
                        if (user_info.auth == 1) return resolve({
                            username: user_info.username,
                            status: (user_info.status == 'Active'),
                            isTrial: (user_info.is_trial == '1'),
                            maxConnections: parseInt(user_info.max_connections),
                            expDate: (user_info.exp_date)? new Date((parseInt(user_info.exp_date) * 1000)): null,
                            createDate: new Date((parseInt(user_info.created_at) * 1000))
                        });
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