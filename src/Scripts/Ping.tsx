import { NativeModules } from 'react-native';

const { RNReactNativePing } = NativeModules;
export default class Ping {
  static async start(ipAddress: string, option: { timeout: number; }) {
    return await RNReactNativePing.start(ipAddress, option);
  }
  static async getTrafficStats() {
    return await RNReactNativePing.getTrafficStats();
  }
}