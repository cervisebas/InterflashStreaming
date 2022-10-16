import React, { Component, createRef, PureComponent } from "react";
import { ImageBackground, Keyboard, StyleProp, TouchableWithoutFeedback, View, ViewStyle, TextInput as NativeTextInput, StyleSheet, DeviceEventEmitter } from "react-native";
import { Text, TextInput, Button, ProgressBar } from "react-native-paper";
import CustomModal from "../Components/CustomModal";
import CustomSnackbar from "../Components/CustomSnackbar";
import { AccountAPI } from "../Scripts/ApiWisp";
import { Theme } from "../Scripts/Theme";

type IProps = {};
type IState = {
    // Form
    formUserName: string;
    formPassword: string;
    // Errors
    formErrorUserName: boolean;
    formErrorPassword: boolean;
    // Interface
    visible: boolean;
    isLoading: boolean;
    // TextInput
    iconTextInputPassword: string;
    showIconTextInputPassword: boolean;
    stateTextInputPassword: boolean;
};

export default class Session extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            // Forms
            formUserName: '',
            formPassword: '',
            // Errors
            formErrorUserName: false,
            formErrorPassword: false,
            // Interface
            visible: false,
            isLoading: false,
            // TextInput
            iconTextInputPassword: 'eye-outline',
            showIconTextInputPassword: false,
            stateTextInputPassword: true
        };
        this.logInNow = this.logInNow.bind(this);
        this.onClose = this.onClose.bind(this);
        this.goFocus = this.goFocus.bind(this);
        this.close = this.close.bind(this);
    }
    private input1 = createRef<NativeTextInput>();
    private input2 = createRef<NativeTextInput>();
    private refCustomSnackbar = createRef<CustomSnackbar>();
    logInNow() {
        if (!this.verifyInputs()) return;
        this.setState({ isLoading: true }, ()=>
            AccountAPI.login(this.state.formUserName, this.state.formPassword)
                .then(()=>setTimeout(()=>{
                    DeviceEventEmitter.emit('ReInitApp');
                    setTimeout(()=>this.setState({
                        visible: false,
                        isLoading: false
                    }), 10);
                }, 2000))
                .catch((value)=>{
                    this.setState({ isLoading: false });
                    this.refCustomSnackbar.current?.open(value.cause);
                })
        );
    }
    verifyInputs(): boolean {
        var errors: number = 0;
        if (this.state.formUserName.length < 6) {
            errors += 1;
            this.setState({ formErrorUserName: true });
            this.input1.current?.focus();
        }
        if (this.state.formPassword.length < 8) {
            errors += 1;
            this.setState({ formErrorPassword: true });
            (errors == 1)&&this.input2.current?.focus();
        }
        if (errors !== 0) this.refCustomSnackbar.current?.open('Revise los datos ingresados.');
        return errors == 0;
    }
    onClose() {
        this.setState({
            // Forms
            formUserName: '',
            formPassword: '',
            // Errors
            formErrorUserName: false,
            formErrorPassword: false,
            // Interface
            isLoading: false,
            // TextInput
            iconTextInputPassword: 'eye-outline',
            showIconTextInputPassword: false,
            stateTextInputPassword: true
        });
    }
    goFocus() {
        this.input1.current?.focus();
    }

    // Controller
    open() {
        this.setState({ visible: true });
    }
    close() {
        this.setState({ visible: false });
    }

    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} onClose={this.onClose} animationInTiming={0} animationOutTiming={0} animationIn={'fadeIn'} animationOut={'fadeOut'}>
            <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ImageBackground source={require('../Assets/background-loading.webp')} resizeMode="cover" style={styles.backgroundImage}>
                        {(this.state.isLoading)&&<ProgressBar indeterminate style={styles.progressBar} color={'#FFFFFF'} />}
                        <View style={styles.content1}>
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <CustomTitle />
                                <View style={styles.content3} onLayout={this.goFocus}>
                                    <TextInput
                                        label={'Nombre de usuario'}
                                        mode={'flat'}
                                        autoCapitalize={'none'}
                                        secureTextEntry={false}
                                        keyboardType={'email-address'}
                                        autoComplete={'off'}
                                        autoCorrect={false}
                                        textContentType={'username'}
                                        blurOnSubmit={false}
                                        value={this.state.formUserName}
                                        error={this.state.formErrorUserName}
                                        disabled={this.state.isLoading}
                                        render={(props)=><NativeTextInput {...props} ref={this.input1} />}
                                        onChangeText={(text)=>this.setState({ formUserName: text, formErrorUserName: false })}
                                        returnKeyType={'next'}
                                        onSubmitEditing={()=>this.input2.current?.focus()}
                                    />
                                    <TextInput
                                        label={'Contraseña'}
                                        mode={'flat'}
                                        autoCapitalize={'none'}
                                        secureTextEntry={this.state.stateTextInputPassword}
                                        autoComplete={'off'}
                                        autoCorrect={false}
                                        textContentType={'password'}
                                        style={{ marginTop: 8 }}
                                        value={this.state.formPassword}
                                        error={this.state.formErrorPassword}
                                        disabled={this.state.isLoading}
                                        render={(props)=><NativeTextInput {...props} ref={this.input2} />}
                                        onChangeText={(text)=>this.setState({ formPassword: text, formErrorPassword: false })}
                                        returnKeyType={'send'}
                                        onSubmitEditing={this.logInNow}
                                        onFocus={()=>this.setState({ showIconTextInputPassword: true })}
                                        onBlur={()=>this.setState({ showIconTextInputPassword: false, stateTextInputPassword: true, iconTextInputPassword: 'eye-outline' })}
                                        right={(this.state.showIconTextInputPassword)&&<TextInput.Icon
                                            icon={this.state.iconTextInputPassword}
                                            onPress={()=>{
                                                var state: boolean = this.state.stateTextInputPassword;
                                                this.setState({
                                                    stateTextInputPassword: !state,
                                                    iconTextInputPassword: (state)? 'eye-off-outline': 'eye-outline'
                                                });
                                            }}
                                        />}
                                    />
                                    <View style={{ width: '100%', alignItems: 'center', marginTop: 16 }}>
                                        <Button
                                            mode={'contained'}
                                            onPress={this.logInNow}
                                            style={{ width: '50%' }}
                                            disabled={this.state.isLoading}
                                        >Iniciar sesión</Button>
                                    </View>
                                </View>
                            </View>
                        </View>
                        
                    </ImageBackground>
                </TouchableWithoutFeedback>
                <CustomSnackbar ref={this.refCustomSnackbar} />
            </View>
        </CustomModal>);
    }
}

type IProps2 = { style?: StyleProp<ViewStyle>; };
class CustomTitle extends PureComponent<IProps2> {
    constructor(props: IProps2) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={[styles.titleContain, this.props.style]}>
            <Text style={styles.titleText}>{` Interflash\nTV `}</Text>
        </View>);
    }
}

const styles = StyleSheet.create({
    titleContain: {
        alignItems: 'center',
        marginBottom: 24
    },
    titleText: {
        fontSize: 24,
        color: Theme.colors.primary,
        fontFamily: 'Sofachrome',
        textShadowColor: '#000000',
        textShadowOffset: {
            width: -2,
            height: -2
        },
        textShadowRadius: 1,
        textAlign: 'center'
    },
    progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
    },
    backgroundImage: {
        flex: 2,
        backgroundColor: Theme.colors.background,
        position: 'relative'
    },
    content1: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content3: {
        marginTop: 16,
        width: '90%',
        maxWidth: 600
    }
});