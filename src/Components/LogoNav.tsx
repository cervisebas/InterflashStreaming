import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import LogoNavImage from "../Assets/logo-nav.webp";

export default React.memo(function LogoNav(_props: any) {
    const pWidth = 876;
    const pHeight = 400;
    const [height, setHeight] = useState(0);

    function _onLayout({ nativeEvent: { layout: { width } } }: LayoutChangeEvent) {
        let scale = (width * 1)/pWidth;
        setHeight(pHeight * scale);
    }

    return(<FastImage
        source={LogoNavImage}
        onLayout={_onLayout}
        resizeMode={'contain'}
        style={[styles.image, { height }]}
    />);
});

const styles = StyleSheet.create({
    image: {
        marginTop: 24,
        marginBottom: 8,
        marginLeft: '15%',
        marginRight: '15%',
        width: '70%'
    }
});