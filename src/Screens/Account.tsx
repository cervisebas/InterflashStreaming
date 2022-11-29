import React, { Component } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Appbar, Button, Divider, List, Text } from "react-native-paper";
import { AccountData } from "../Scripts/ApiWisp/Types";
import AccountImage from "../Assets/account.webp";
import moment from "moment";

type IProps = {
    userData: AccountData;
};
type IState = {};

const isTV = Platform.isTV;

export default class Account extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    componentDidMount(): void {
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1 }}>
            {(!isTV)&&<Appbar.Header>
                <Appbar.Content title={'Cuenta'} />
            </Appbar.Header>}
            <ScrollView style={{ flex: 2 }}>
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
                        onPress={()=>console.log('Click!')}
                    >Cerrar sesión</Button>
                </View>
            </ScrollView>
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