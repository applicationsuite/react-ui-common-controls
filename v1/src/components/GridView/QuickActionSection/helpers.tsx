import React from 'react';
import { IconButton } from '@fluentui/react/lib/Button';
import {
  GridViewActionBarItems,
  IQuickActionSectionItem,
  QuickActionSectionAlignment
} from '../GridView.models';
import { applySorting } from '../../../utilities';
import { SORT_TYPE } from '../../../constants';
import { IIconProps } from '@fluentui/react/lib/Icon';

const moreIcon: IIconProps = { iconName: 'more' };

const noop = () => null;

const RIGHT_UPFRONT_ACTION_ITEMS = [GridViewActionBarItems.SearchBox];

function onlyUnique(value: any, index: number, self: any[]) {
  return self.indexOf(value) === index;
}

export const getQuickActionBarItems = (
  quickActionSectionItems: IQuickActionSectionItem[] = [],
  params: any = {}
) => {
  const { applicableItems = [], actionBarAvailableItems = {}, containerSize } = params;
  let actionBarLeftItems = quickActionSectionItems.filter(
    (item) => item.alignment === QuickActionSectionAlignment.Left
  );
  actionBarLeftItems = applySorting(
    actionBarLeftItems,
    'order',
    SORT_TYPE.ASC
  ) as IQuickActionSectionItem[];

  let actionBarRightItems = quickActionSectionItems.filter(
    (item) => item.alignment === QuickActionSectionAlignment.Right
  );
  actionBarRightItems = applySorting(
    actionBarRightItems,
    'order',
    SORT_TYPE.ASC
  ) as IQuickActionSectionItem[];

  actionBarLeftItems.forEach((item) => {
    if (!item.onRender) {
      item.onRender = actionBarAvailableItems[item.type as GridViewActionBarItems];
    }
  });

  actionBarRightItems.forEach((item) => {
    if (!item.onRender) {
      item.onRender = actionBarAvailableItems[item.type as GridViewActionBarItems];
    }
  });

  const filteredApplicabledItems = applicableItems.filter(
    (i: any) => !quickActionSectionItems.find((item) => item.type === i)
  );
  filteredApplicabledItems.forEach((item: any, index: number) => {
    actionBarRightItems.push({
      key: (new Date().getUTCMilliseconds() + index).toString(),
      alignment: QuickActionSectionAlignment.Right,
      type: item,
      onRender: actionBarAvailableItems[item as GridViewActionBarItems]
    });
  });

  let upfrontItemsKey: GridViewActionBarItems[] = [
    GridViewActionBarItems.FilterButton,
    GridViewActionBarItems.SearchBox
  ];
  let compactView = containerSize && containerSize.width < 600;

  if (compactView) {
    const allActionItems: IQuickActionSectionItem[] = [
      ...actionBarLeftItems,
      ...actionBarRightItems
    ];
    let upfrontItems = allActionItems.filter((item) => upfrontItemsKey.includes(item.type));

    let remainingItems = allActionItems.filter((item) => !upfrontItemsKey.includes(item.type));

    const moreActionIconButton = remainingItems.length
      ? getMoreActionItemButton(remainingItems)
      : undefined;

    let rightSectionItems: IQuickActionSectionItem[] = [
      ...upfrontItems,
      ...(moreActionIconButton ? [moreActionIconButton] : [])
    ] as IQuickActionSectionItem[];

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

const getMoreActionItemButton = (moreItems: IQuickActionSectionItem[]) => {
  const menuItems = moreItems.map((item, index) => {
    return {
      key: `menuItem_${index}`,
      onRender: item.onRender
    };
  });
  const moreIconButton = () => (
    <IconButton
      menuProps={{ items: menuItems }}
      iconProps={moreIcon}
      onRenderMenuIcon={noop}
      title="More Actions"
      ariaLabel="More Actions"
    />
  );

  const moreActionItem: IQuickActionSectionItem = {
    key: new Date().getUTCMilliseconds().toString(),
    alignment: QuickActionSectionAlignment.Right,
    type: GridViewActionBarItems.Custom,
    onRender: moreIconButton
  };
  return moreActionItem;
};
