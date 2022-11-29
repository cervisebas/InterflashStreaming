import React, { memo, useImperativeHandle } from "react";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

type IProps = {
    onAccept: ()=>void;
};
export type RefAlertLogOut = {
    close: ()=>void;
    open: ()=>void;
};

export default memo(React.forwardRef(function AlertLogOut(props: IProps, ref: React.Ref<RefAlertLogOut>) {
    const [visible, setVisible] = React.useState(false);

    function close() {
        setVisible(false);
    }
    function open() {
        setVisible(true);
    }
    function onAccept() {
        close();
        props.onAccept();
    }
    useImperativeHandle(ref, ()=>({ close, open }));

    return(<Portal>
        <Dialog visible={visible} onDismiss={close}>
            <Dialog.Title>Alerta</Dialog.Title>
            <Dialog.Content>
                <Paragraph>{"¿Estas a punto de cerrar sesión, estas seguro de realizar esta acción?\nPara volver a iniciar tu cuenta actual se requerirán las credenciales de ingreso."}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={close}>Cancelar</Button>
                <Button onPress={onAccept}>Aceptar</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>);
}));