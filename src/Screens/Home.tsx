import React, { Component } from "react";
import { Dimensions, EmitterSubscription, FlatList, ListRenderItemInfo, Platform, StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import CardItem from "../Components/Elements/CardItem";
import { Channels } from "../Scripts/ApiWisp/Types";

type IProps = {
    active: number;
    list: Channels[];
    openMediaPlayer: (source: string, title: string, index: number)=>any;
};
type IState = {
    numColumns: number;
    mountForTv: boolean;
};

const isTV = Platform.isTV;

export default class Home extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            numColumns: 3,
            mountForTv: true
        };
        this.loadSize = this.loadSize.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }
    private event: EmitterSubscription | null = null;
    private eventDimensions: EmitterSubscription | null = null;
    componentDidMount(): void {
        this.eventDimensions = Dimensions.addEventListener('change', this.loadSize);
        this.loadSize();
    }
    componentWillUnmount(): void {
        this.event?.remove();
        this.eventDimensions?.remove();
    }
    componentDidUpdate(): void {
        const active = this.props.active == 0 /* Key */;
        if (isTV)
            if (this.state.mountForTv !== active)
                this.setState({ mountForTv: active });
    }
    getWidth() {
        const screen_width = Dimensions.get('screen').width;
        if (isTV) {
            const per30 = (30 * screen_width) / 100;
            const int1 = (per30 < 240)? 240: per30;
            const int2 = (int1 > 300)? 300: per30;
            return screen_width - int2;
        }
        return screen_width;
    }
    loadSize() {
        const width = this.getWidth();
        var numColumns: number = 1;
        var _continue: boolean = true;
        var _divider: number = 2;
        while (_continue) {
            if ((width / _divider) >= 133) {
                numColumns++;
                _divider++;
            } else {
                _continue = false;
                this.setState({ numColumns });
            }
        }
    }
    _renderItem({ item, index }: ListRenderItemInfo<Channels>) {
        return(<CardItem
            key={item.id}
            title={item.title}
            source={item.image}
            numColumns={this.state.numColumns}
            isLoading={false}
            onPress={()=>this.props.openMediaPlayer(item.source, item.title, index)}
        />);
    }
    _getItemLayout(_data: Channels[] | null | undefined, index: number) {
        return {
            length: 200,
            offset: 200 * index,
            index
        };
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1 }} focusable={false}>
            {(!isTV)&&<Appbar.Header>
                <Appbar.Content title={'Lista de canales'} />
            </Appbar.Header>}
            {(this.state.mountForTv)&&<View style={styles.content2}>
                <FlatList
                    key={`flatlist-columns-${this.state.numColumns}`}
                    data={this.props.list}
                    extraData={this.props}
                    contentContainerStyle={styles.listContain}
                    numColumns={this.state.numColumns}
                    getItemLayout={this._getItemLayout}
                    renderItem={this._renderItem}
                />
            </View>}
        </View>);
    }
}

const styles = StyleSheet.create({
    content2: {
        flex: 2,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    listContain: {
        paddingLeft: 4,
        paddingRight: 8,
        paddingBottom: 8
    }
});