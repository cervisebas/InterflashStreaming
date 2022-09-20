import React, { createRef, PureComponent } from "react";
import { Platform, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text, TouchableRipple } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ImageLazyLoad from "../ImageLazyLoad";

type IProps = {
    source: string;
    title: string;
    isLoading: boolean;
    numColumns: number;
    customWidth?: number;
    onPress?: ()=>any;
};
type IState = {};

const isTV = Platform.isTV;

export default class CardItem extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={[styles.view, { width: (this.props.customWidth !== undefined)? this.props.customWidth: `${100/this.props.numColumns}%` }]}>
            <CustomTouchable disable={this.props.isLoading} onPress={(this.props.onPress)? this.props.onPress: undefined}>
                {(this.props.isLoading)? <SkeletonPlaceholder backgroundColor={'#E0E0E0'} highlightColor={'#d5d5d5'}>
                    <SkeletonPlaceholder.Item borderRadius={11} overflow={"hidden"} width={'100%'} height={'100%'} />
                </SkeletonPlaceholder>:
                <View style={styles.allContent}>
                    <ImageLazyLoad
                        size={'100%'}
                        styleImage={styles.styleImage}
                        style={styles.styleLazy}
                        source={{ uri: this.props.source }}
                        resizeMode={'contain'}
                    />
                    <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, .7)']} style={styles.gradient}>
                        <Text style={styles.styleText} numberOfLines={2}>{this.props.title}</Text>
                    </LinearGradient>
                </View>}
            </CustomTouchable>
        </View>);
    }
}

type IProps2 = {
    children: React.ReactNode;
    disable: boolean;
    onPress?: ()=>any;
};
type IState2 = {
    borderWidth: number | undefined;
    borderColor: string | undefined;
};
class CustomTouchable extends PureComponent<IProps2, IState2> {
    constructor(props: IProps2) {
        super(props);
        this.state = {
            borderWidth: 0,
            borderColor: '#325981'
        };
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._onPress = this._onPress.bind(this);
    }
    _onFocus() {
        if (isTV) this.setState({ borderWidth: 3 });
    }
    _onBlur() {
        if (isTV) this.setState({ borderWidth: 0 });
    }
    _onPress() {
        if (isTV) {
            this.setState({ borderWidth: 3, borderColor: '#FF0000' });
            setTimeout(()=>this.setState({ borderWidth: 3, borderColor: '#325981' }), 600);
        }
        (this.props.onPress)&&this.props.onPress();
    }
    render(): React.ReactNode {
        if (isTV) return(<View style={[this.state, styles.content, { overflow: 'hidden' }]}>
            <TouchableRipple
                style={styles.contentTv}
                disabled={this.props.disable}
                borderless={Platform.Version > 23}
                rippleColor={'#325981'}
                onFocus={this._onFocus}
                onBlur={this._onBlur}
                onPress={this._onPress}>
                    {this.props.children}
            </TouchableRipple>
        </View>);
        return(<TouchableRipple style={styles.content} disabled={this.props.disable} borderless={Platform.Version > 23} rippleColor={'rgba(0, 0, 0, .32)'} onPress={this.props.onPress}>{this.props.children}</TouchableRipple>);
    }
}

const styles = StyleSheet.create({
    view: {
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 8,
        overflow: 'hidden'
    },
    content: {
        width: '100%',
        height: 200,
        borderRadius: 11,
        position: 'relative',
        backgroundColor: '#FFFFFF'
    },
    contentTv: {
        width: '100%',
        height: '100%'
    },
    styleImage: {
        width: '60%',
        height: '60%' 
    },
    styleLazy: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    allContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    styleText: {
        fontWeight: 'bold',
        fontSize: 17,
        width: '100%',
        paddingLeft: 4,
        paddingRight: 4,
        textAlign: 'center',
        marginBottom: 8
    }
});