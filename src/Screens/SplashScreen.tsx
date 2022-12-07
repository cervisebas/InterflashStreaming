import React, { createRef, memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomModal from "../Components/CustomModal";
import Logo from "../Assets/logo.webp";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { Text } from "react-native-paper";
import { waitTo } from "../Scripts/Utils";
import TextAnimationShake from "../Components/TextAnimationShake";
import RNSplashScreen from "react-native-splash-screen";

type IProps = {
    onInit: ()=>any;
};
type IRef = {};

export default memo(React.forwardRef(function SplashScreen(props: IProps, ref: React.Ref<IRef>) {
    const [visible, setVisible] = useState(true);
    const refTextAnimationShake = createRef<TextAnimationShake>();
    const duration = 500;

    const logoX = useSharedValue(0);
    const logoRX = useSharedValue('0deg');
    const logoS = useSharedValue(1);
    const textO = useSharedValue(0);
    const HCBrand = useSharedValue('0%');
    const RCBrand = useSharedValue(200);
    const OTBrand = useSharedValue(0);

    const styleAnimationLogo = useAnimatedStyle(()=>({
        transform: [
            { rotateY: withTiming(logoRX.value, { duration }) },
            { translateX: withTiming(logoX.value, { duration }) },
            { scale: withTiming(logoS.value, { duration }) }
        ]
    }));
    const styleAnimationText = useAnimatedStyle(()=>({ opacity: withDelay((duration - 100), withTiming(textO.value, { duration })) }));
    const styleAnimationBrand = useAnimatedStyle(()=>({
        height: withTiming(HCBrand.value, { duration: 400 }),
        borderTopRightRadius: withTiming(RCBrand.value, { duration: 600 }),
        borderTopLeftRadius: withTiming(RCBrand.value, { duration: 600 })
    }));
    const animatedText2Styles = useAnimatedStyle(()=>({ opacity: withTiming(OTBrand.value, { duration: 250 }) }));

    async function startAnimation() {
        RNSplashScreen.hide();
        await waitTo(2000);
        // 500ms
        logoX.value = -90;
        logoRX.value = '360deg';
        logoS.value = 1.25;
        textO.value = 1;
        
        await waitTo(2000);
        
        // ##### BRAND #####
        // 400ms
        HCBrand.value = '100%';
        RCBrand.value = 0;
        await waitTo(600);
        // 500ms
        OTBrand.value = 1;
        refTextAnimationShake.current?.start();

        await waitTo(2000);
        setVisible(false);
        props.onInit();
    }

    /*useEffect(()=>{
        logoX.value = 0;
        logoRX.value = '0deg';
        logoS.value = 1;
        textO.value = 0;
        HCBrand.value = '0%';
        RCBrand.value = 100;
        OTBrand.value = 0;
        setTimeout(startAnimation, 3000);
    }, []);*/


    return(<CustomModal visible={visible} animationInTiming={0} animationOut={'fadeOut'} animationOutTiming={1000}>
        <View style={styles.content}>
            <Animated.Image
                source={Logo}
                resizeMode={'contain'}
                resizeMethod={'auto'}
                onLoad={startAnimation}
                style={[styles.logo, styleAnimationLogo]}
            />
            <Animated.View style={[styles.viewText, styleAnimationText]}>
                <Text style={styles.text}>{"Interflash\n"}<Text style={styles.subtext}>TV</Text></Text>
            </Animated.View>
            <Animated.View style={[styles.contentBrand, styleAnimationBrand]}>
                <TextAnimationShake
                    ref={refTextAnimationShake}
                    value={'</> SCDEV'}
                    style={[styles.textBrand, animatedText2Styles]}
                    styleText={[styles.textBrand2]}
                />
            </Animated.View>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    logo: {
        width: 100,
        height: 144.42,
        transform: [
            { rotateY: '0deg' },
            { translateX: -90 },
            { scale: 1.25 }
        ]
    },
    viewText: {
        position: 'absolute',
        width: 160
    },
    text: {
        color: '#000000',
        fontSize: 36,
        textAlign: 'center',
        fontWeight: '600',
        transform: [{
            translateX: 70
        }]
    },
    subtext: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 46
    },
    contentBrand: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '50%',
        backgroundColor: '#ff5722',
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textBrand: {
        position: 'absolute',
        color: '#FF2E2E',
        fontSize: 36,
        fontFamily: 'Organetto-Bold'
    },
    textBrand2: {
        color: '#FFFFFF',
        fontSize: 36,
        fontFamily: 'Organetto-Bold'
    }
});