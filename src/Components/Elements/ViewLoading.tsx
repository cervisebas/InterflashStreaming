import React, { PureComponent } from "react";
import { ActivityIndicator, PixelRatio, Platform, StyleSheet, View } from "react-native";
import { Theme } from "../../Scripts/Theme";

type IProps = {};
type IState = {};

const isTV = Platform.isTV;

export default class ViewLoading extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <ActivityIndicator
                animating={true}
                color={Theme.colors.primary}
                size={(isTV)? PixelRatio.getPixelSizeForLayoutSize(56): PixelRatio.getPixelSizeForLayoutSize(34)}
            />
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});