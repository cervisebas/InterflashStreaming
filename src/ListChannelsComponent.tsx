import React, { createRef, memo } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import { Divider } from "react-native-paper";
import CustomItemList from "./Components/Elements/CustomItemList";
import { Channels } from "./Scripts/ApiWisp/Types";

type IProps = {
    channels: Channels[];
    indexCurrent: number;
    selectChannel: (source: string, title: string, index: number)=>any;
};
export type RefListChannelsComponent = {
    goFocus: ()=>void;
};

export default memo(React.forwardRef(function ListChannelsComponent(props: IProps, ref: React.Ref<RefListChannelsComponent>) {
    const refFlatList = createRef<FlatList<Channels>>();

    function goFocus() {
        refFlatList.current?.scrollToIndex({
            animated: true,
            index: props.indexCurrent,
            viewPosition: 0
        });
    }

    function _renderItem({ item, index }: ListRenderItemInfo<Channels>) {
        return(<CustomItemList
            key={`item-list-channels-${item.id}`}
            index={index}
            data={item}
            isPlaying={props.indexCurrent == index}
            onPress={props.selectChannel}
        />);
    }
    function _ItemSeparatorComponent() {
        return(<Divider />);
    }
    function _getItemLayout(_data: Channels[] | null | undefined, index: number) {
        return {
            length: 56,
            offset: 56 * index,
            index
        };
    }

    React.useImperativeHandle(ref, ()=>({ goFocus }));

    return(<FlatList
        ref={refFlatList}
        data={props.channels}
        extraData={props}
        renderItem={_renderItem}
        getItemLayout={_getItemLayout}
        ItemSeparatorComponent={_ItemSeparatorComponent}
    />);
}));