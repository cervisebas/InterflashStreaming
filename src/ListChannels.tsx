import React, { createRef, PureComponent } from "react";
import { FlatList, ListRenderItemInfo, StatusBar, StyleSheet, View } from "react-native";
import { Divider, overlay } from "react-native-paper";
import CustomModal from "./Components/CustomModal";
import { Channels } from "./Scripts/ApiWisp/Types";
import { Theme } from "./Scripts/Theme";
import DeviceInfo from "react-native-device-info";
import CustomItemList from "./Components/Elements/CustomItemList";
import ListChannelsComponent, { RefListChannelsComponent } from "./ListChannelsComponent";

type IProps = {
    channels: Channels[];
    indexCurrent: number;
    changeChannel: (source: string, title: string, index: number)=>any;
};
type IState = {
    visible: boolean;
    paddingLeft: number;
};

export default class ListChannels extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            paddingLeft: 0
        };
        this.close = this.close.bind(this);
        this.goFocus = this.goFocus.bind(this);
        this.selectChannel = this.selectChannel.bind(this);
    }
    private refListChannelsComponent = createRef<RefListChannelsComponent>();

    componentDidMount(): void {
        if (DeviceInfo.hasNotch()) this.setState({
            paddingLeft: ((StatusBar.currentHeight)? StatusBar.currentHeight: 0)
        });
    }
    selectChannel(source: string, title: string, index: number) {
        this.props.changeChannel(source, title, index);
        this.close();
    }

    goFocus() {
        this.refListChannelsComponent.current?.goFocus();
    }

    // Controller
    open() {
        let setState: any = { visible: true };
        if (DeviceInfo.hasNotch()) setState['paddingLeft'] = ((StatusBar.currentHeight)? StatusBar.currentHeight: 0);
        this.setState(setState);
    }
    close() {
        this.setState({
            visible: false
        });
    }

    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} statusBarTranslucent={true} onRequestClose={this.close} onShow={this.goFocus} animationIn={'slideInLeft'} animationOut={'slideOutLeft'}>
            <View style={[styles.content, { paddingLeft: this.state.paddingLeft }]}>
                <ListChannelsComponent
                    ref={this.refListChannelsComponent}
                    channels={this.props.channels}
                    indexCurrent={this.props.indexCurrent}
                    selectChannel={this.selectChannel}
                />
            </View>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    content: {
        width: '35%',
        height: '100%',
        minWidth: 240,
        backgroundColor: overlay(2, Theme.colors.background),
        shadowColor: "#FFFFFF",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
});