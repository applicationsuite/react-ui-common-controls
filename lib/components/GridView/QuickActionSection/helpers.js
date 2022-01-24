import { jsx as _jsx } from "react/jsx-runtime";
import { IconButton } from '@fluentui/react/lib/Button';
import { GridViewActionBarItems, QucickActionSectionAlignment } from '../GridView.models';
import { SORT_TYPE, applySorting } from '../../../';
const moreIcon = { iconName: 'more' };
const noop = () => null;
const RIGHT_UPFRONT_ACTION_ITEMS = [GridViewActionBarItems.SearchBox];
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
export const getQuickActionBarItems = (quickActionSectionItems = [], params = {}) => {
    const { applicableItems = [], actionBarAvailableItems = {}, containerSize } = params;
    let actionBarLeftItems = quickActionSectionItems.filter((item) => item.alignment === QucickActionSectionAlignment.Left);
    actionBarLeftItems = applySorting(actionBarLeftItems, 'order', SORT_TYPE.ASC);
    let actionBarRightItems = quickActionSectionItems.filter((item) => item.alignment === QucickActionSectionAlignment.Right);
    actionBarRightItems = applySorting(actionBarRightItems, 'order', SORT_TYPE.ASC);
    actionBarLeftItems.forEach((item) => {
        if (!item.onRender) {
            item.onRender = actionBarAvailableItems[item.type];
        }
    });
    actionBarRightItems.forEach((item) => {
        if (!item.onRender) {
            item.onRender = actionBarAvailableItems[item.type];
        }
    });
    const filteredApplicabledItems = applicableItems.filter((i) => !quickActionSectionItems.find((item) => item.type === i));
    filteredApplicabledItems.forEach((item, index) => {
        actionBarRightItems.push({
            key: (new Date().getUTCMilliseconds() + index).toString(),
            alignment: QucickActionSectionAlignment.Right,
            type: item,
            onRender: actionBarAvailableItems[item]
        });
    });
    let upfrontItemsKey = [
        GridViewActionBarItems.FilterButton,
        GridViewActionBarItems.SearchBox
    ];
    let compactView = containerSize && containerSize.width < 600;
    if (compactView) {
        const allActionItems = [
            ...actionBarLeftItems,
            ...actionBarRightItems
        ];
        let upfrontItems = allActionItems.filter((item) => upfrontItemsKey.includes(item.type));
        let remainingItems = allActionItems.filter((item) => !upfrontItemsKey.includes(item.type));
        const moreActionIconButton = remainingItems.length
            ? getMoreActionItemButton(remainingItems)
            : undefined;
        let rightSectionItems = [
            ...upfrontItems,
            ...(moreActionIconButton ? [moreActionIconButton] : [])
        ];
        return {
            actionBarLeftItems: [],
            actionBarRightItems: rightSectionItems
        };
    }
    return {
        actionBarLeftItems: actionBarLeftItems,
        actionBarRightItems: actionBarRightItems
    };
};
const getMoreActionItemButton = (moreItems) => {
    const menuItems = moreItems.map((item, index) => {
        return {
            key: `menuItem_${index}`,
            onRender: item.onRender
        };
    });
    const moreIconButton = () => (_jsx(IconButton, { menuProps: { items: menuItems }, iconProps: moreIcon, onRenderMenuIcon: noop, title: "More Actions", ariaLabel: "More Actions" }, void 0));
    const moreActionItem = {
        key: new Date().getUTCMilliseconds().toString(),
        alignment: QucickActionSectionAlignment.Right,
        type: GridViewActionBarItems.Custom,
        onRender: moreIconButton
    };
    return moreActionItem;
};
