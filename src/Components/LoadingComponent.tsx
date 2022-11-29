import React, { PureComponent } from "react";
import LoadingController from "./loading/loading-controller";
import { Theme } from "../Scripts/Theme";

type IProps = {};
type IState = {
    visible: boolean;
    text: string;
};

export default class LoadingComponent extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            text: 'Cargando...'
        };
    }
    private isMount: boolean = false;
    componentDidMount(): void {
        this.isMount = true;
    }
    componentWillUnmount(): void {
        this.isMount = false;
    }
    open(text: string) {
        (this.isMount)&&this.setState({ visible: true, text });
    }
    update(text: string) {
        (this.isMount)&&this.setState({ text });
    }
    updateAsync(text: string): Promise<void> {
        return new Promise((resolve)=>{
            if (this.isMount)
                this.setState({ text }, resolve);
            else
                resolve();
        });
    }
    close() {
        (this.isMount)&&this.setState({ visible: false });
    }
    render(): React.ReactNode {
        return(<LoadingController
            visible={this.state.visible}
            loadingText={this.state.text}
            backgroundColor={Theme.colors.surface}
            colorText={'#FFFFFF'}
            indicatorColor={'#FFFFFF'}
        />);
    }
}