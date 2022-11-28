import React, { createRef, PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import Drawer from "../CustomDrawer";

type CustomRoutes = {
    key: string;
    title: string;
    focusedIcon: string;
    unfocusedIcon: string;
};

type IProps = {
    index: number;
    data: CustomRoutes;
    active: boolean;
    onPress: (index: number)=>any;
};
type IState = {};

export default class ItemDrawerNavTV extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this._onPress = this._onPress.bind(this);
    }
    private refDrawer = createRef<View>();
    componentDidMount(): void {
        if (this.props.index == 0)
            setTimeout(()=>this.refDrawer.current?.focus(), 1000);
    }
    _onPress() {
        this.props.onPress(this.props.index);
    }
    render(): React.ReactNode {
        return(<Drawer.Item
            style={styles.drawer}
            active={this.props.active}
            icon={(this.props.active)? this.props.data.focusedIcon: this.props.data.unfocusedIcon}
            label={this.props.data.title}
            onPress={this._onPress}
        />);
    }
}

const styles = StyleSheet.create({
    drawer: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 10
    }
});