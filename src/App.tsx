import React, { Component, createRef } from "react";
import { DeviceEventEmitter, EmitterSubscription, HWEvent, Platform, StatusBar, TVEventHandler, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { Theme } from "./Scripts/Theme";
import SystemNavigationBar from "react-native-system-navigation-bar";
import Orientation from "react-native-orientation-locker";
import Extends from "./Extend";
import { AccountAPI, CheckPingIP, getChannels } from "./Scripts/ApiWisp";
//import RNBootSplash from "react-native-bootsplash";
import 'react-native/tvos-types.d';
import Navigation from "./Navigation";
import { Channels } from "./Scripts/ApiWisp/Types";

type IProps = {};
type IState = {
    indexPlayer: number;
    channels: Channels[];
};


export default class App extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            indexPlayer: -1,
            channels: []
        };
        this.initApp = this.initApp.bind(this);
        this._openMediaPlayer = this._openMediaPlayer.bind(this);
        this._changeChannel = this._changeChannel.bind(this);
        this._eventsTV = this._eventsTV.bind(this);
    }
    private eventInit: EmitterSubscription | undefined = undefined;
    private TVEvents = new TVEventHandler();
    // Ref's Components
    private refExtend = createRef<Extends>();

    componentDidMount(): void {
        this.initApp();
        this.TVEvents.enable(this, this._eventsTV);
        this.eventInit = DeviceEventEmitter.addListener('ReInitApp', this.initApp);
        SystemNavigationBar.setNavigationColor('#325981', 'light', 'navigation');
        if (!Platform.isTV) Orientation.lockToPortrait();
        console.log(`IsTV: ${Platform.isTV}`);
    }
    componentWillUnmount(): void {
        this.eventInit?.remove();
        this.TVEvents.disable();
    }
    _eventsTV(_component: this, data: HWEvent) {
        if (data.eventKeyAction == -1) return;
        if (this.refExtend.current?.refMediaPlayer.current?.state.visible) {
            if (data.eventType == 'menu') return this.refExtend.current?.openListChannels();
            this.refExtend.current?.refMediaPlayer.current?._showControls();
        }
    }
    async initApp() {
        this.refExtend.current?.showScreenLoading('Iniciando...');
        await this.wait(1000);
        //await RNBootSplash.hide({ fade: true });
        await this.wait(4000);
        this.refExtend.current?.updateScreenLoading('Localizando el servidor...');
        await CheckPingIP();
        await this.wait(800);
        this.refExtend.current?.updateScreenLoading('Verificando inicio de sesión...');
        try {
            await AccountAPI.verify();
            await this.wait(500);
            await this.donwloadChannels();
            await this.wait(500);
        } catch (error: any) {
            await this.wait(1000);
            if (error.relogin) setTimeout(()=>{
                this.refExtend.current?.refSession.current?.open();
                this.refExtend.current?.closeScreenLoading();
            }, 1200);
            return this.refExtend.current?.updateScreenLoading(error.cause, error.showLoading);
        }
        this.refExtend.current?.closeScreenLoading();
    }
    wait(time: number) {
        return new Promise((resolve: (v?: any)=>any)=>setTimeout(resolve, time));
    }
    async donwloadChannels() {
        try {
            const showProgress = (per: number)=>this.refExtend.current?.updateScreenLoading(`Descargando: ${per}%`);
            const { username, password } = await AccountAPI.getData();
            const channels = await getChannels.getAll(username, password, showProgress);
            this.setState({ channels });
            this.refExtend.current?.updateScreenLoading(`¡Descarga completa!`);
            return true;
        } catch (error) {
            throw error;
        }
    }
    _openMediaPlayer(source: string, title: string, index: number) {
        this.setState({ indexPlayer: index });
        this.refExtend.current?.openMediaPlayer(source, title);
    }
    _changeChannel(num: 1 | -1) {
        const index: number = this.state.indexPlayer + (num);
        const { source, title } = this.state.channels[index];
        this._openMediaPlayer(source, title, index);
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1 }}>
            <StatusBar backgroundColor={'#325981'} barStyle={'light-content'} />
            <PaperProvider theme={Theme}>
                <Navigation channels={this.state.channels} opeMediaPlayer={this._openMediaPlayer} />
                <Extends
                    ref={this.refExtend}
                    indexPlayer={this.state.indexPlayer}
                    channels={this.state.channels}
                    changeChannel={this._changeChannel}
                    opeMediaPlayer={this._openMediaPlayer}
                />
            </PaperProvider>
        </View>);
    }
}