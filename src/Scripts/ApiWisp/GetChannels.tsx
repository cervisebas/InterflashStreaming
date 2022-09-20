import axios from "axios";
import { parse } from "iptv-playlist-parser";
import { any } from "prop-types";
import { ErrorCode, ErrorConnection } from "./Responses";
import { CategoriesGroups, Channels } from "./Types";

export default class GetChannels {
    constructor(url: string) {
        this.urlBase = url;
    }
    private urlBase: string = "";
    private getImageSource(url: string) {
        if (!this.isIP(url)) return url;
        const host = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
        const newHost = `${this.urlBase.replace(':25461', '')}/`;
        return url.replace(host![0], newHost);
    }
    private isIP(address: string): boolean {
        const reg = RegExp('^http[s]?:\/\/((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])');
        return !!reg.test(address);
    }
    getAll(username: string, password: string, progress?: (now: number)=>any): Promise<Channels[]> {
        return new Promise((resolve, reject)=>{
            const onDownloadProgress = (event: any)=>{
                if (progress) {
                    const total = parseFloat(event.currentTarget.responseHeaders['Content-Length']);
                    const current = event.currentTarget.response.length;
                    const percentCompleted = Math.floor(current / total * 100);
                    progress(percentCompleted);
                }
            };
            axios.get(`${this.urlBase}/get.php?username=${username}&password=${password}&type=m3u_plus&output=ts`,  { onDownloadProgress: onDownloadProgress }).then((result)=>{
                try {
                    const data = parse(result.data);
                    const all: Channels[] = data.items.map((item)=>({
                        id: item.name.toLowerCase(),
                        title: item.name,
                        image: (item.tvg.logo.length !== 0)? this.getImageSource(item.tvg.logo): '',
                        source: item.url,
                        category: item.group.title,
                        number: item.url.slice((item.url.lastIndexOf('/') + 1), item.url.length)
                    }));
                    resolve(all);
                } catch {
                    reject(ErrorCode);
                }
            }).catch(()=>reject(ErrorConnection));
        });
    }
    getGroups(username: string, password: string): Promise<CategoriesGroups[]> {
        return new Promise((resolve, reject)=>{
            axios.get(`${this.urlBase}/get.php?username=${username}&password=${password}&type=m3u_plus&output=ts`).then((result)=>{
                try {
                    const data = parse(result.data);
                    const groups: CategoriesGroups[] = [];
                    const all: Channels[] = data.items.map((item)=>({
                        id: item.name.toLowerCase(),
                        title: item.name,
                        image: (item.tvg.logo.length !== 0)? this.getImageSource(item.tvg.logo): '',
                        source: item.url,
                        category: item.group.title,
                        number: item.url.slice((item.url.lastIndexOf('/') + 1), item.url.length)
                    }));
                    for (let channel of all) {
                        const find = groups.findIndex((v)=>v.title == channel.category);
                        if (find == -1) groups.push({
                            id: `channel-${channel.category.toLowerCase().replace(/\ /gi, '-')}`,
                            title: channel.category,
                            channels: [channel]
                        }); else groups[find].channels.push(channel);
                    }
                    resolve(groups);
                } catch {
                    reject(ErrorCode);
                }
            }).catch(()=>reject(ErrorConnection));
        });
    }
    getGroups2(list: Channels[]): CategoriesGroups[] {
        var groups: CategoriesGroups[] = [];
        for (let channel of list) {
            const find = groups.findIndex((v)=>v.title == channel.category);
            if (find == -1) groups.push({
                id: `channel-${channel.category.toLowerCase().replace(/\ /gi, '-')}`,
                title: channel.category,
                channels: [channel]
            }); else groups[find].channels.push(channel);
        }
        return groups;
    }
}