import React, { PureComponent, useEffect } from "react";
import { ActivityIndicator, Dimensions, EmitterSubscription, PixelRatio, Platform, Pressable, StyleProp, StyleSheet, ToastAndroid, TVEventHandler, View, ViewStyle } from "react-native";
import FullScreenChz from "react-native-fullscreen-chz";
import Orientation from "react-native-orientation-locker";
import { IconButton, Text } from "react-native-paper";
import PipHandler from "react-native-pip-android";
import ReAnimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Video, { OnBufferData } from "react-native-video";
import CustomModal from "../Components/CustomModal";
import { Theme } from "../Scripts/Theme";

type IProps = {};
type IState = {
    // Datas
    visible: boolean;
    source: string;
    title: string;
    // Interfaz
    paused: boolean;
    isLoading: 'flex' | 'none';
    showController: number;
    width: number;
    isPipEnable: boolean;
};

const isTV = Platform.isTV;
const animationIn = (isTV)? "zoomIn": "fadeIn";
const animationOut = (isTV)? "zoomOut": "fadeOut";
const animationInTiming = (isTV)? 500: 250;
const animationOutTiming = (isTV)? 500: 250;

export default class MediaPlayer extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            source: '',
            title: '',
            paused: true,
            isLoading: 'none',
            showController: 0,
            width: Dimensions.get('window').width - 20,
            isPipEnable: false
        };
        this.close = this.close.bind(this);
        this.onClose = this.onClose.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.setControls = this.setControls.bind(this);
        this._showControls = this._showControls.bind(this);
        this.goClose = this.goClose.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onError = this._onError.bind(this);
    }
    private timeout: number = 0;
    private TVEvents = new TVEventHandler();
    private eventDimensions: EmitterSubscription | undefined = undefined;
    private eventPip: EmitterSubscription | undefined = undefined;
    componentDidMount(): void {
        this.TVEvents.enable(this, this._showControls);
        this.eventDimensions = Dimensions.addEventListener('change', ({ window: { width } })=>this.setState({ width: width - 20 }));
        this.eventPip = PipHandler.onPipModeChanged((isEnable)=>this.setState({ isPipEnable: !!isEnable, showController: 0 }));
    }
    componentWillUnmount(): void {
        this.eventDimensions?.remove();
        this.eventPip?.remove();
        this.TVEvents.disable();
    }
    close() {
        this.setState({
            visible: false,
            source: '',
            paused: true,
            isLoading: 'none',
            showController: 0
        });
    }
    open(source: string, title: string) {
        this.setState({
            visible: true,
            source,
            title,
            paused: false,
            isLoading: 'flex'
        });
        if (!isTV) {
            FullScreenChz.enable();
            Orientation.lockToLandscape();
        }
        this.setControls();
    }
    onClose() {
        if (!isTV) {
            FullScreenChz.disable();
            Orientation.lockToPortrait();
        }
    }
    showLoading({ isBuffering }: OnBufferData) {
        this.setState({ isLoading: (isBuffering)? 'flex': 'none' });
    }
    setControls(hide?: boolean) {
        if (this.state.isPipEnable) return;
        if (hide == true) return this.setState({ showController: 0 });
        this.setState({ showController: 1 });
        this.timeout = setTimeout(()=>this.setControls(true), 3500);
    }
    _showControls() {
        if (this.state.showController == 1) {
            this.setControls(true);
            return clearTimeout(this.timeout);
        }
        this.setControls();
    }
    _goPictureInPicture() {
        PipHandler.enterPipMode();
    }
    _onEnd() {
        ToastAndroid.show('Se perdió la conexión, restableciendo...', ToastAndroid.LONG);
    }
    _onError() {
        ToastAndroid.show('Ocurrió un error durante la reproducción.', ToastAndroid.LONG);
        this.close();
    }
    goClose() {
        if (isTV) return (this.state.showController == 1)? this.close(): this._showControls();
        this.close();
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} onClose={this.onClose} onRequestClose={this.goClose} animationIn={animationIn} animationOut={animationOut} animationInTiming={animationInTiming} animationOutTiming={animationOutTiming} statusBarTranslucent={true}>
            <Pressable style={styles.contain} onPress={this._showControls} focusable={!isTV}>
                <View style={styles.videoContain} focusable={false}>
                    <Video
                        source={{
                            uri: this.state.source,
                            //type: 'mpegts'
                        }}
                        style={styles.video}
                        paused={this.state.paused}
                        repeat={true}
                        playInBackground={false}
                        playWhenInactive={false}
                        resizeMode={'contain'}
                        preventsDisplaySleepDuringVideoPlayback={true}
                        onBuffer={this.showLoading}
                        onError={this._onError}
                        onEnd={this._onEnd}
                        bufferConfig={{
                            minBufferMs: 15000,
                            maxBufferMs: 120000,
                            bufferForPlaybackMs: 2500,
                            bufferForPlaybackAfterRebufferMs: 5000
                        }}
                    />
                    <View style={[styles.loading, { display: this.state.isLoading }]}>
                        <ActivityIndicator size={PixelRatio.roundToNearestPixel(64)} color={Theme.colors.primary} />
                    </View>
                    <ViewControls style={styles.viewController} opacity={this.state.showController}>
                        <View style={[styles.header, { width: this.state.width }]}>
                            {/*<IconButton
                                icon={'arrow-left'}
                                size={28}
                                onPress={this.goClose}
                            />*/}
                            <BackButton onPress={this.goClose} />
                            <Text style={styles.title}>{this.state.title}</Text>
                            {(!isTV)&&<IconButton icon={'picture-in-picture-bottom-right'} style={styles.pip_button} size={28} onPress={this._goPictureInPicture} />}
                        </View>
                    </ViewControls>
                </View>
            </Pressable>
        </CustomModal>);
    }
}

const ViewControls = (props: { opacity: number; style: StyleProp<ViewStyle>; children?: React.ReactNode; })=>{
    const heightImage = useSharedValue(props.opacity);
    const styles = useAnimatedStyle(()=>({ opacity: withTiming(heightImage.value, { duration: 250 }) }));
    useEffect(()=>{ heightImage.value = props.opacity; }, [props.opacity]);
    return(<ReAnimated.View style={[props.style, styles]}>{props.children}</ReAnimated.View>);
};

type IProps2 = {
    onPress: ()=>any;
};
type IState2 = {
    onFocus: boolean;
};
class BackButton extends PureComponent<IProps2, IState2> {
    constructor(props: IProps2) {
        super(props);
        this.state = {
            onFocus: false
        };
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
    }
    _onFocus() {
        this.setState({ onFocus: true });
        console.log('Focus');
    }
    _onBlur() {
        this.setState({ onFocus: false });
        console.log('Blur');
    }
    render(): React.ReactNode {
        return((!isTV)? <IconButton
            icon={'arrow-left'}
            size={28}
            onPress={this.props.onPress}
        />: <IconButton
            icon={'arrow-left'}
            size={28}
            onPress={this.props.onPress}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            style={(this.state.onFocus)&&{
                borderWidth: 4,
                borderColor: '#FFFFFF'
            }}
        />);
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#000000',
        position: 'relative'
    },
    videoContain: {
        width: '100%',
        height: '100%'
    },
    video: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1
    },
    loading: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 2,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewController: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 3,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        marginTop: 12,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 8
    },
    pip_button: {
        position: 'absolute',
        right: 0,
        marginRight: 12,
        marginTop: 24
    }
});