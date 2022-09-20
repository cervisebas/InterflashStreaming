import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import { Snackbar, Text } from "react-native-paper";
import { Theme } from "../Scripts/Theme";

type IProps = {};
type IState = {
    visible: boolean;
    message: string;
};

export default class CustomSnackbar extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            message: ''
        };
        this.close = this.close.bind(this);
    }
    close() {
        this.setState({ visible: false });
    }
    open(message: string) {
        this.setState({
            visible: true,
            message
        });
    }
    render(): React.ReactNode {
        return(<Snackbar
            visible={this.state.visible}
            duration={3000}
            onDismiss={this.close}
            style={styles.background}
            action={{
                label: 'OCULTAR',
                color: '#FFFFFF',
                textColor: '#FFFFFF',
                onPress: this.close
            }}
        >
            <Text>{this.state.message}</Text>
        </Snackbar>);
    }
}
const styles = StyleSheet.create({
    background: {
        backgroundColor: Theme.colors.elevation.level2
    }
});