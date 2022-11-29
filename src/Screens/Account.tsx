import React, { Component, createRef } from "react";
import { DeviceEventEmitter, Platform, ScrollView, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Appbar, Button, Divider, List, Text } from "react-native-paper";
import { AccountData } from "../Scripts/ApiWisp/Types";
import AccountImage from "../Assets/account.webp";
import AlertLogOut, { RefAlertLogOut } from "../Components/AlertLogOut";
import moment from "moment";
import LoadingComponent from "../Components/LoadingComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { waitTo } from "../Scripts/Utils";

type IProps = {
    userData: AccountData;
};
type IState = {};

const isTV = Platform.isTV;

export default class Account extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.logOutNow = this.logOutNow.bind(this);
    }
    private refAlertLogOut = createRef<RefAlertLogOut>();
    private refLoadingComponent = createRef<LoadingComponent>();

    logOut() {
        if (!isTV) return this.refAlertLogOut.current?.open();
        this.logOutNow();
    }
    async logOutNow() {
        this.refLoadingComponent.current?.open('Cerrando sesión...');
        await AsyncStorage.removeItem('Session');
        await waitTo(1000);
        this.refLoadingComponent.current?.open('Reiniciando la aplicación...');
        await waitTo(1000);
        DeviceEventEmitter.emit('ReInitApp');
        await waitTo(300);
        DeviceEventEmitter.emit('reIntegrateNavigation');
        this.refLoadingComponent.current?.close();
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1 }}>
            {(!isTV)&&<Appbar.Header>
                <Appbar.Content title={'Cuenta'} />
            </Appbar.Header>}
            <ScrollView style={{ flex: 2 }} contentContainerStyle={{ paddingBottom: 16 }}>
                <View style={styles.accountContent}>
                    <FastImage
                        source={AccountImage}
                        style={styles.accountImage}
                    />
                    <Text style={styles.accountText}>{this.props.userData.username}</Text>
                </View>
                <Divider />
                <List.Item
                    disabled
                    left={(props)=><List.Icon {...props} icon={'calendar-clock-outline'} />}
                    title={'Fecha de creación'}
                    description={moment(this.props.userData.createDate).format('DD/MM/YYYY')}
                />
                <Divider />
                <List.Item
                    disabled
                    left={(props)=><List.Icon {...props} icon={'calendar-check-outline'} />}
                    title={'Fecha de vencimiento'}
                    description={(this.props.userData.expDate)?
                        moment(this.props.userData.expDate).format('DD/MM/YYYY'):
                        'Nunca'
                    }
                />
                <Divider />
                <List.Item
                    disabled
                    left={(props)=><List.Icon {...props} icon={'devices'} />}
                    title={'Máximas conexiones'}
                    description={`${this.props.userData.maxConnections} ${(this.props.userData.maxConnections !== 1)? 'dispositivos': 'dispositivo'}`}
                />
                <Divider />
                <List.Item
                    disabled
                    left={(props)=><List.Icon {...props} icon={'account-circle-outline'} />}
                    title={'Tipo de usuario'}
                    description={(this.props.userData.isTrial)? 'Invitado': 'Cliente'}
                />
                <Divider />
                <List.Item
                    disabled
                    left={(props)=><List.Icon {...props} icon={'account-check-outline'} />}
                    title={'Estado de la cuenta'}
                    description={(this.props.userData.status)? 'Activa': 'Inactiva'}
                />
                <View style={styles.button}>
                    <Button
                        mode={'contained'}
                        focusable={true}
                        style={{ width: '80%' }}
                        onPress={this.logOut}
                    >Cerrar sesión</Button>
                </View>
            </ScrollView>
            <AlertLogOut ref={this.refAlertLogOut} onAccept={this.logOutNow} />
            <LoadingComponent ref={this.refLoadingComponent} />
        </View>);
    }
}

const styles = StyleSheet.create({
    accountContent: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        paddingLeft: 16,
        flexDirection: 'row'
    },
    accountImage: {
        width: 70,
        height: 70
    },
    accountText: {
        fontSize: 26,
        marginLeft: 16
    },
    button: {
        width: '100%',
        paddingTop: 16,
        alignItems: 'center'
    }
});