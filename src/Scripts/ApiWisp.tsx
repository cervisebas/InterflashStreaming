import AccountSystem from "./ApiWisp/Account";
import GetChannels from "./ApiWisp/GetChannels";
import Ping from "./Ping";

//const IPAddress: string = "http://181.10.118.117:25461";
//const IPAddress: string = "http://10.12.1.238:25461";
var IPAddress: string = "http://181.10.118.117:25461";

const getChannels = new GetChannels(IPAddress);
const AccountAPI = new AccountSystem(IPAddress);

async function CheckPingIP() {
    const isLocal = await CheckIP('10.12.1.238');
    if (isLocal) return IPAddress = "http://10.12.1.238:25461";
    IPAddress = "http://181.10.118.117:25461";
}
async function CheckIP(ip: string): Promise<boolean> {
    try {
        await Ping.start(ip, { timeout: 1000 });
        return true;
    } catch {
        return false;
    }
}

export {
    IPAddress,
    CheckPingIP,
    getChannels,
    AccountAPI
};