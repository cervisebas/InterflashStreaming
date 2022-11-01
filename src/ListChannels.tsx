import React, { PureComponent } from "react";
import { Dimensions, FlatList, ListRenderItemInfo, StatusBar, StyleSheet, View } from "react-native";
import { Divider, List, overlay } from "react-native-paper";
import CustomModal from "./Components/CustomModal";
import { Channels } from "./Scripts/ApiWisp/Types";
import { Theme } from "./Scripts/Theme";
import DeviceInfo from "react-native-device-info";

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
    }

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
        return(<List.Item
            title={item.title}
            titleStyle={(this.props.indexCurrent == index)? { color: 'red' }: undefined}
            left={(props)=><List.Icon
                {...props}
                color={(this.props.indexCurrent == index)? 'red': undefined}
                icon={(this.props.indexCurrent == index)? 'television': 'play'}
            />}
            style={styles.item}
            onPress={()=>(this.props.indexCurrent !== index)&&this.selectChannel(item.source, item.title, index)}
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
        return(<CustomModal visible={this.state.visible} statusBarTranslucent={true} onRequestClose={this.close} animationIn={'slideInLeft'} animationOut={'slideOutLeft'}>
            <View style={[styles.content, { paddingLeft: this.state.paddingLeft }]}>
                <FlatList
                    data={this.props.channels}
                    extraData={this.props}
                    renderItem={this._renderItem}
                    getItemLayout={this._getItemLayout}
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