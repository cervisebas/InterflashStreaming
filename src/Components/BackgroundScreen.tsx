import React, { PureComponent } from "react";
import { Keyboard, Platform, Pressable, TouchableWithoutFeedback } from "react-native";

const isTV = Platform.isTV;

type IProps = {
    onActive: ()=>any;
};
type IState = {};

export default class BackgroundScreen extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        if (isTV) return(<Pressable
            style={{ flex: 1 }}
            focusable={true}
            onPress={this.props.onActive}
        >{this.props.children}</Pressable>);
        return(<TouchableWithoutFeedback onPress={Keyboard.dismiss}>{this.props.children}</TouchableWithoutFeedback>);
    }
}