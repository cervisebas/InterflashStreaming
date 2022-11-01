import React, { createRef, PureComponent } from "react";
import ListChannels from "./ListChannels";
import MediaPlayer from "./Pages/MediaPlayer";
import ScreenLoading from "./Screens/ScreenLoading";
import Session from "./Screens/Session";
import { Channels } from "./Scripts/ApiWisp/Types";

type IProps = {
    indexPlayer: number;
    channels: Channels[];
    changeChannel: (num: 1 | -1)=>any;
    opeMediaPlayer: (source: string, title: string, index: number)=>any;
};
type IState = {};

export default class Extends extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.openListChannels = this.openListChannels.bind(this);
    }
    // Ref's Components
    public refMediaPlayer = createRef<MediaPlayer>();
    public refScreenLoading = createRef<ScreenLoading>();
    public refSession = createRef<Session>();
    public refListChannels = createRef<ListChannels>();

    openMediaPlayer(source: string, title: string) {
        this.refMediaPlayer.current?.open(source, `Estas viendo: ${title}`);
    }
    openListChannels() {
        this.refListChannels.current?.open();
    }
    // Screen Loading
    showScreenLoading(messageInitial?: string) {
        this.refScreenLoading.current?.open(messageInitial);
    }
    updateScreenLoading(message: string, hideLoading?: boolean) {
        this.refScreenLoading.current?.setMessage(message);
    }
    closeScreenLoading() {
        this.refScreenLoading.current?.close();
    }

    render(): React.ReactNode {
        return(<>
            <MediaPlayer
                ref={this.refMediaPlayer}
                index={this.props.indexPlayer}
                lenghtChannels={this.props.channels.length}
                nextChannel={()=>this.props.changeChannel(1)}
                previousChannel={()=>this.props.changeChannel(-1)}
                openListChannels={this.openListChannels}
            />
            <ListChannels
                ref={this.refListChannels}
                channels={this.props.channels}
                changeChannel={this.props.opeMediaPlayer}
            />
            <ScreenLoading ref={this.refScreenLoading} />
            <Session ref={this.refSession} />
        </>);
    }
}