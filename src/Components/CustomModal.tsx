import React, { Component } from "react";
import { Dimensions, EmitterSubscription, Platform, ScaledSize, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Modal from "react-native-modal";

type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends React.Component<infer TProps, any> ? TProps : TComponentOrTProps;
type EventSize = {
    window: ScaledSize;
    screen: ScaledSize;
};
type IProps = {
    visible: boolean;
    onShow?: ()=>any;
    onClose?: ()=>any;
    animationIn?: ExtractProps<Modal>['animationIn'];
    animationOut?: ExtractProps<Modal>['animationOut'];
    onRequestClose?: ()=>any;
    animationInTiming?: number;
    animationOutTiming?: number;
    transparent?: boolean;
    style?: StyleProp<ViewStyle>;
    statusBarTranslucent?: boolean;
    alwaysBackdrop?: boolean;
    coverScreen?: boolean;
    children?: React.ReactNode;
};
type IState = {
    width: number;
    height: number;
};

const isTV = Platform.isTV;

export default class CustomModal extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            width: 1,
            height: 1
        };
        this._setSize = this._setSize.bind(this);
        this.onShow = this.onShow.bind(this);
        this.onRequestClose = this.onRequestClose.bind(this);
        this.onClose = this.onClose.bind(this);
    }
    private _isMount: boolean = false;
    private eventSize: EmitterSubscription | null = null;
    componentDidMount(): void {
        this._isMount = true;
        const { width, height } = Dimensions.get('screen');
        //const height = DeviceDimensions.get('REAL_WINDOW_HEIGHT');
        this.eventSize = Dimensions.addEventListener('change', this._setSize);
        this.setState({ width, height });
    }
    _setSize({ window: { width, height } }: EventSize) {
        this.setState({ width, height });
    }
    componentWillUnmount(): void {
        this._isMount = false;
        this.eventSize?.remove();
    }
    onShow() {
        if (this.props.onShow && this._isMount) this.props.onShow();
    }
    onRequestClose() {
        if (this.props.onRequestClose && this._isMount) this.props.onRequestClose();
    }
    onClose() {
        if (this.props.onClose && this._isMount) this.props.onClose();
    }
    render(): React.ReactNode {
        return(<Modal
            isVisible={this.props.visible}
            animationIn={(this.props.animationIn)? this.props.animationIn: 'fadeInUp'}
            animationInTiming={(!this.props.animationInTiming)? 250: this.props.animationInTiming}
            animationOut={(this.props.animationOut)? this.props.animationOut: 'fadeOutDown'}
            animationOutTiming={(!this.props.animationOutTiming)? 250: this.props.animationOutTiming}
            backdropOpacity={(this.props.transparent)? (!this.props.alwaysBackdrop)? 0: undefined: undefined}
            onBackButtonPress={this.onRequestClose}
            onBackdropPress={this.onRequestClose}
            onModalWillShow={this.onShow}
            onModalHide={this.onClose}
            useNativeDriver={true}
            focusable={(isTV)? true: undefined}
            //hasBackdrop={this.props.coverScreen}
            coverScreen={this.props.coverScreen}
            //focusable={false}
            deviceWidth={this.state.width}
            deviceHeight={this.state.height}
            hardwareAccelerated={true}
            statusBarTranslucent={(this.props.statusBarTranslucent)? this.props.statusBarTranslucent: undefined}
            style={[this.props.style, styles.modal]}>
            {this.props.children}
        </Modal>);
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0
    }
});