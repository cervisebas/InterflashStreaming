import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, PixelRatio, Platform, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import CustomModal from '../Components/CustomModal';
import { Theme } from '../Scripts/Theme';
import Logo from "../Assets/logo.webp";
import LinearGradient from 'react-native-linear-gradient';
import { getForPercent } from '../Scripts/Utils';

type IProps = {};
type IState = {
    visible: boolean;
    showActivity: boolean;
    showMessage: boolean;
    message: string;
};

const isTV = Platform.isTV;

export default class ScreenLoading extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: true,
            showActivity: true,
            showMessage: false,
            message: ''
        };
    }
    open(messageInitial?: string | undefined) {
        this.setState({
            visible: true,
            showMessage: !!messageInitial,
            message: (messageInitial)? messageInitial: ''
        });
    }
    close() {
        this.setState({ visible: false });
    }
    setMessage(message: string, hideActivity?: boolean) {
        this.setState({ showMessage: true, message, showActivity: !hideActivity });
    }
    render(): React.ReactNode {
        const marginBottom = (isTV)? 50: getForPercent(Dimensions.get('window').height, 10);
        return(<CustomModal visible={this.state.visible} animationIn={'fadeIn'} animationOutTiming={600} animationOut={'fadeOut'} style={styles.background}>
            <PaperProvider theme={Theme}>
                <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(63, 112, 162, 1)']} style={styles.gradient}>
                    <FastImage
                        source={Logo}
                        style={styles.logo}
                    />
                    <View style={[styles.containLoading, { marginBottom }]}>
                        {(this.state.showActivity)&&<ActivityIndicator size={PixelRatio.getPixelSizeForLayoutSize(30)} animating={true} color={'#EEEEEE'} />}
                        {(this.state.showMessage)&&<Text style={styles.message}>{this.state.message}</Text>}
                    </View>
                </LinearGradient>
            </PaperProvider>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#000000'
    },
    logo: {
        width: 173.11,
        height: 250,
        marginTop: -100
    },
    gradient: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2
    },
    /*imageBackground: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center'
    },*/
    containLoading: {
        position: 'absolute',
        bottom: 0,
        //marginBottom: (isTV)? 50: 100,
        width: '100%',
        alignItems: 'center'
    },
    message: {
        marginTop: 11,
        fontSize: 18,
        width: '90%',
        textAlign: 'center'
    }
});