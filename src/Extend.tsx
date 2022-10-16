import React, { createRef, PureComponent } from "react";
import MediaPlayer from "./Pages/MediaPlayer";
import ScreenLoading from "./Screens/ScreenLoading";
import Session from "./Screens/Session";

type IProps = {
    indexPlayer: number;
    lenghtChannels: number;
    changeChannel: (num: 1 | -1)=>any;
};
type IState = {};

export default class Extends extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    // Ref's Components
    public refMediaPlayer = createRef<MediaPlayer>();
    public refScreenLoading = createRef<ScreenLoading>();
    public refSession = createRef<Session>();

    openMediaPlayer(source: string, title: string) {
        this.refMediaPlayer.current?.open(source, `Estas viendo: ${title}`);
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
                lenghtChannels={this.props.lenghtChannels}
                nextChannel={()=>this.props.changeChannel(1)}
                previousChannel={()=>this.props.changeChannel(-1)}
            />
            <ScreenLoading ref={this.refScreenLoading} />
            <Session ref={this.refSession} />
        </>);
    }
}