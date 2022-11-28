import React, { createRef, PureComponent } from "react";
import { FlatList, ListRenderItemInfo, StatusBar, StyleSheet, View } from "react-native";
import { Divider, overlay } from "react-native-paper";
import CustomModal from "./Components/CustomModal";
import { Channels } from "./Scripts/ApiWisp/Types";
import { Theme } from "./Scripts/Theme";
import DeviceInfo from "react-native-device-info";
import CustomItemList from "./Components/Elements/CustomItemList";

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
        this._renderItem = this._renderItem.bind(this);
        this.goFocus = this.goFocus.bind(this);
        this.selectChannel = this.selectChannel.bind(this);
    }
    private FlatListRef = createRef<FlatList<Channels>>();

    componentDidMount(): void {
        console.log(this.props.channels);
        if (DeviceInfo.hasNotch()) this.setState({
            paddingLeft: ((StatusBar.currentHeight)? StatusBar.currentHeight: 0)
        });
    }
    selectChannel(source: string, title: string, index: number) {
        this.props.changeChannel(source, title, index);
        this.close();
    }

    // Flatlist
    _renderItem({ item, index }: ListRenderItemInfo<Channels>) {
        return(<CustomItemList
            key={`item-list-channels-${item.id}`}
            index={index}
            data={item}
            isPlaying={this.props.indexCurrent == index}
            onPress={this.selectChannel}
        />);
    }
    _ItemSeparatorComponent() {
        return(<Divider />);
    }
    _getItemLayout(_data: Channels[] | null | undefined, index: number) {
        return {
            length: 56,
            offset: 56 * index,
            index
        };
    }

    goFocus() {
        var index = 0;
        this.props.channels.forEach((_value, i)=>((i == this.props.indexCurrent)&&(index = i)));
        this.FlatListRef.current?.scrollToIndex({
            animated: true,
            index
        });
    }

    // Controller
    open() {
        this.setState({
            visible: true,
            paddingLeft: ((StatusBar.currentHeight)? StatusBar.currentHeight: 0)
        });
    }
    close() {
        this.setState({
            visible: false
        });
    }

    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} statusBarTranslucent={true} onRequestClose={this.close} onShow={this.goFocus} animationIn={'slideInLeft'} animationOut={'slideOutLeft'}>
            <View style={[styles.content, { paddingLeft: this.state.paddingLeft }]}>
                <FlatList
                    ref={this.FlatListRef}
                    data={this.props.channels}
                    extraData={this.props}
                    renderItem={this._renderItem}
                    getItemLayout={this._getItemLayout}
                    maxToRenderPerBatch={30}
                    ItemSeparatorComponent={this._ItemSeparatorComponent}
                />
            </View>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    content: {
        width: '35%',
        height: '100%',
        backgroundColor: overlay(2, Theme.colors.background),
        shadowColor: "#FFFFFF",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    item: {
        height: 56
    }
});