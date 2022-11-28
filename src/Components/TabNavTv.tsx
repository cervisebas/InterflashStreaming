import Color from "color";
import React, { PureComponent } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Theme } from "../Scripts/Theme";
import ItemDrawerNavTV from "./Elements/ItemDrawerNavTV";
import LogoNav from "./LogoNav";

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
        return(<ItemDrawerNavTV
            key={values.key}
            index={index}
            data={values}
            active={active}
            onPress={this.props.onChange}
        />);
    }
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <LogoNav />
            <ScrollView style={styles.scrollView}>
                {this.props.routes.map(this._renderItems)}
            </ScrollView>
            <View style={styles.brandContent}>
                <Text style={[styles.textSubBrand, { color: Color('#FFFFFF').alpha(0.54).rgb().string() }]}>from</Text>
                <Text style={styles.textBrand}>SCAPPS</Text>
            </View>
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
    textSubBrand: {
        fontWeight: 'normal',
        fontSize: 15
    },
    textBrand: {
        color: '#FF2E2E',
        fontSize: 20,
        fontFamily: 'Organetto-Bold'
    },
    brandContent: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    }
});