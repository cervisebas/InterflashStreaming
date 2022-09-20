import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";

type IProps = {};
type IState = {};

export default class Account extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    componentDidMount(): void {
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.Content title={'Cuenta'} />
            </Appbar.Header>
            <View style={{ flex: 2 }}>
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({});