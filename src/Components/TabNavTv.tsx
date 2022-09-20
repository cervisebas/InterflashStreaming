import React, { PureComponent } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Theme } from "../Scripts/Theme";
import Drawer from "./CustomDrawer";

type CustomRoutes = {
    key: string;
    title: string;
    focusedIcon: string;
    unfocusedIcon: string;
};

type IProps = {
    index: number;
    routes: CustomRoutes[];
    onChange: (index: number)=>any;
};
type IState = {};

export default class TabNavTv extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this._renderItems = this._renderItems.bind(this);
    }
    _renderItems(values: CustomRoutes, index: number) {
        const active = index == this.props.index;
        return(<Drawer.Item
            key={values.key}
            style={styles.drawer}
            active={active}
            icon={(active)? values.focusedIcon: values.unfocusedIcon}
            label={values.title}
            onPress={()=>this.props.onChange(index)}
        />);
    }
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <ScrollView style={styles.scrollView}>
                {this.props.routes.map(this._renderItems)}
            </ScrollView>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        position: 'relative',
        maxWidth: 300,
        minWidth: 240,
        width: '30%',
        height: '100%',
        backgroundColor: Theme.colors.elevation.level3,
        shadowColor: "#FFFFFF",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    scrollView: {
        flex: 2,
        flexDirection: 'column'
    },
    drawer: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 10
    }
});