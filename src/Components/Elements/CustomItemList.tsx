import React, { PureComponent } from "react";
import { Platform, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import { Channels } from "../../Scripts/ApiWisp/Types";

type IProps = {
    data: Channels;
    index: number;
    isPlaying: boolean;
    onPress?: (source: string, title: string, index: number)=>any;
};
type IState = {};

const isTV = Platform.isTV;

export default class CustomItemList extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
        this._onPress = this._onPress.bind(this);
    }
    _onPress() {
        if (!this.props.isPlaying && this.props.onPress)
            this.props.onPress(this.props.data.source, this.props.data.title, this.props.index);
    }
    render(): React.ReactNode {
        return(<List.Item
            title={this.props.data.title}
            titleStyle={(this.props.isPlaying)? styles.selectedText: undefined}
            left={(props)=><List.Icon
                {...props}
                color={(this.props.isPlaying)? 'red': undefined}
                icon={(this.props.isPlaying)? 'television': 'play'}
            />}
            style={styles.item}
            rippleColor={(isTV)? 'rgba(50, 89, 129, 1)': undefined}
            onPress={this._onPress}
        />);
    }
}

const styles = StyleSheet.create({
    selectedText: {
        color: '#FF0000'
    },
    item: {
        height: 56
    }
});