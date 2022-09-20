import React, { Component } from "react";
import { Dimensions, EmitterSubscription, FlatList, ListRenderItemInfo, Platform, StyleSheet, View } from "react-native";
import { Appbar, List, Title } from "react-native-paper";
import CardItem from "../Components/Elements/CardItem";
import { getChannels } from "../Scripts/ApiWisp";
import { CategoriesGroups, Channels } from "../Scripts/ApiWisp/Types";

type IProps = {
    active: number;
    list: Channels[];
    openMediaPlayer: (source: string, title: string)=>any;
};
type IState = {
    datas: CategoriesGroups[];
    numColumns: number;
    mountForTv: boolean;
};

const isTV = Platform.isTV;

export default class Categories extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            datas: getChannels.getGroups2(props.list),
            numColumns: 3,
            mountForTv: true
        };
        this._renderItem = this._renderItem.bind(this);
        this._renderItemMobile = this._renderItemMobile.bind(this);
        this._renderItemTv = this._renderItemTv.bind(this);
        this._renderItemCard = this._renderItemCard.bind(this);
        this.loadSize = this.loadSize.bind(this);
    }
    private eventDimensions: EmitterSubscription | null = null;
    componentDidMount(): void {
        this.eventDimensions = Dimensions.addEventListener('change', this.loadSize);
        this.loadSize();
    }
    componentWillUnmount(): void {
        this.eventDimensions?.remove();
    }
    componentDidUpdate(_prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
        const active = this.props.active == 1 /* Key */;
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

    _renderItemCard({ item }: ListRenderItemInfo<Channels>) {
        return(<CardItem
            key={item.id}
            title={item.title}
            source={item.image}
            numColumns={this.state.numColumns}
            isLoading={false}
            customWidth={(isTV)? (this.getWidth() / this.state.numColumns): undefined}
            onPress={()=>this.props.openMediaPlayer(item.source, item.title)}
        />);
    }

    _getItemLayout(_data: Channels[] | null | undefined, index: number) {
        return {
            length: 200,
            offset: 200 * index,
            index
        };
    }
    _renderItemMobile({ item }: ListRenderItemInfo<CategoriesGroups>) {
        const length = item.channels.length;
        return(<List.Accordion id={item.id} key={item.id} title={`${item.title} (${length} ${(length == 1)? 'canal': 'canales'})`}>
            <FlatList
                key={`flatlist-columns-${item.id}-${this.state.numColumns}`}
                data={item.channels}
                extraData={item}
                style={styles.listMobile}
                numColumns={this.state.numColumns}
                getItemLayout={this._getItemLayout}
                renderItem={this._renderItemCard}
            />
        </List.Accordion>);
    }
    _renderItemTv({ item }: ListRenderItemInfo<CategoriesGroups>) {
        return(<View style={styles.itemTvContent} focusable={false}>
            <Title style={styles.itemTvTitle}>{item.title}</Title>
            <FlatList
                data={item.channels}
                extraData={item}
                horizontal={true}
                style={styles.itemTvList}
                renderItem={this._renderItemCard}
            />
        </View>);
    }

    _renderItem(info: ListRenderItemInfo<CategoriesGroups>) {
        return (!isTV)? this._renderItemMobile(info): this._renderItemTv(info);
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1 }}>
            {(!isTV)&&<Appbar.Header>
                <Appbar.Content title={'Categorias'} />
            </Appbar.Header>}
            {(this.state.mountForTv)&&<View style={styles.content2}>
                <List.AccordionGroup>
                    <FlatList
                        data={this.state.datas}
                        extraData={this.state}
                        renderItem={this._renderItem}
                        contentContainerStyle={styles.listContentUniversal}
                    />
                </List.AccordionGroup>
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
    listContentUniversal: {
        paddingBottom: 8
    },
    listMobile: {
        marginLeft: 8,
        marginRight: 8,
        paddingBottom: 8
    },
    itemTvContent: {
        flexDirection: 'column',
        height: 248,
        width: '100%'
    },
    itemTvTitle: {
        height: 24,
        marginLeft: 8
    },
    itemTvList: {
        height: 200,
        paddingLeft: 4,
        width: '100%'
    }
});