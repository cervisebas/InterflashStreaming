import React, { PureComponent } from "react";
import { Platform, Route, StyleSheet, View } from "react-native";
import { BottomNavigation } from "react-native-paper";
import TabNavTv from "./Components/TabNavTv";
import Account from "./Screens/Account";
import Categories from "./Screens/Categories";
import Home from "./Screens/Home";
import { AccountData, Channels } from "./Scripts/ApiWisp/Types";

type IProps = {
    channels: Channels[];
    userData: AccountData;
    opeMediaPlayer: (source: string, title: string, index: number)=>any;
};
type IState = {
    index: number;
};

const isTV = Platform.isTV;// || DeviceInfo.isTablet();

export default class Navigation extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            index: 0
        };
        this._onIndexChange = this._onIndexChange.bind(this);
        this._renderScene = this._renderScene.bind(this);
    }
    private routers = [
        { key: 'home', title: (isTV)? 'Lista de canales': 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
        { key: 'category', title: 'Categorías', focusedIcon: 'shape', unfocusedIcon: 'shape-outline' },
        //{ key: 'search', title: 'Buscar', focusedIcon: 'magnify', unfocusedIcon: 'magnify' },
        { key: 'account', title: 'Cuenta', focusedIcon: 'account', unfocusedIcon: 'account-outline' }
    ];
    _onIndexChange(index: number) {
        this.setState({ index });
    }
    _renderScene({ route }: { route: Route; jumpTo: (key: string) => void; }) {
        switch (route.key) {
          case 'home':
            return <Home list={this.props.channels} active={this.state.index} openMediaPlayer={this.props.opeMediaPlayer} />;
          case 'category':
            return <Categories list={this.props.channels} active={this.state.index} openMediaPlayer={this.props.opeMediaPlayer} />;
          case 'account':
            return <Account userData={this.props.userData} />;
        }
    }
    render(): React.ReactNode {
        return(<View style={(isTV)? styles.tv: styles.mobile}>
            {(isTV)&&<TabNavTv
                index={this.state.index}
                routes={this.routers}
                onChange={this._onIndexChange}
            />}
            <BottomNavigation
                navigationState={{
                    index: this.state.index,
                    routes: this.routers
                }}
                keyboardHidesNavigationBar={true}
                sceneAnimationEnabled={true}
                sceneAnimationType={(isTV)? 'opacity': 'shifting'}
                onIndexChange={this._onIndexChange}
                renderScene={this._renderScene}
                barStyle={{ display: (isTV)? 'none': undefined }}
            />
        </View>);
    }
}

const styles = StyleSheet.create({
    mobile: {
        flex: 1,
        flexDirection: 'column'
    },
    tv: {
        flex: 1,
        flexDirection: 'row'
    }
});