export function waitTo(time: number): Promise<void> {
    return new Promise((resolve)=>setTimeout(resolve, time));
}
export function getForPercent(max: number, per: number): number {
    return (per * max)/100;
}