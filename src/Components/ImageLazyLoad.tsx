import React, { PureComponent } from "react";
import { ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import FastImage, { ImageStyle, ResizeMode } from "react-native-fast-image";
import RNFS from "react-native-fs";

type IProps = {
    source: {
        uri: string;
    };
    style?: StyleProp<ViewStyle>;
    styleImage?: StyleProp<ImageStyle>;
    circle?: boolean;
    size?: number | string;
    resizeMode?: ResizeMode | undefined; 
    onLoad?: ()=>any;
};
type IState = {
    isLoading: boolean;
    source: ImageSourcePropType | undefined;
};

export default class ImageLazyLoad extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: true,
            source: undefined
        };
    }
    private _isMount: boolean = false;
    componentDidMount() {
        this._isMount = true;
        var fileName = this.props.source.uri.split('/').pop();
        if (this.props.source.uri.length == 0) return setTimeout(()=>(this._isMount)&&this.setState({ source: require('../Assets/default-image.png'), isLoading: false }), 500);
        RNFS.exists(`${RNFS.CachesDirectoryPath}/${fileName}`).then((val)=>{
            if (val) return (this._isMount)&&this.setState({ source: { uri: `file://${RNFS.CachesDirectoryPath}/${fileName}` }, isLoading: false });
            RNFS.downloadFile({ fromUrl: this.props.source.uri, toFile: `${RNFS.CachesDirectoryPath}/${fileName}` }).promise
                .then(()=>(this._isMount)&&this.setState({ source: { uri: `file://${RNFS.CachesDirectoryPath}/${fileName}` }, isLoading: false }))
                .catch(()=>(this._isMount)&&this.setState({ source: require('../Assets/default-image.png'), isLoading: false }));
        })
        .catch(()=>(this._isMount)&&this.setState({ source: require('../Assets/default-image.png'), isLoading: false }));
    }
    componentWillUnmount(): void {
        this._isMount = false;
    }
    render(): React.ReactNode {
        return(<View style={[styles.view, { width: this.props.size, height: this.props.size }, this.props.style, (this.props.circle)&&styles.circle]}>
            {(this.state.isLoading)?<SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={'100%'} height={'100%'} />
            </SkeletonPlaceholder>:
            <FastImage
                source={this.state.source! as any}
                style={[{ width: '100%', height: '100%' }, this.props.styleImage]}
                resizeMode={this.props.resizeMode}
                onLoad={this.props.onLoad}
                onError={this.props.onLoad}
            />}
        </View>);
    }
}

const styles = StyleSheet.create({
    view: {
        position: 'relative',
        overflow: 'hidden'
    },
    circle: {
        shadowColor: "#000",
        shadowOffset:{
            width: 0,
            height: 1
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: 1000000,
        overflow: 'hidden'
    }
});