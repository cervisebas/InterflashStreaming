import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../Scripts/Theme";

type IProps = {
    title: string;
    onReload?: ()=>any;
};
type IState = {};

export default class CustomAlertError extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={styles.errorContent}>
            <Icon name={'account-alert-outline'} size={64} />
            <Title style={styles.errorTitle}>{this.props.title}</Title>
            {(this.props.onReload)&&<IconButton
                icon={'reload'}
                size={26}
                iconColor={Theme.colors.primary}
                onPress={this.props.onReload}
            />}
        </View>);
    }
}

const styles = StyleSheet.create({
    errorContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    errorTitle: {
        marginTop: 14,
        marginBottom: 0
    }
});