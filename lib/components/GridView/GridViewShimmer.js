import { jsx as _jsx } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { gridViewStyles } from './GridView.styles';
import { Shimmer, ShimmerElementType } from '@fluentui/react/lib/Shimmer';
const useStyles = createUseStyles(gridViewStyles);
export const GridViewShimmer = () => {
    const classes = useStyles();
    const items = [];
    items.push(_jsx(Shimmer, { className: "shimmerClass", shimmerColors: {
            shimmerWave: 'lightgrey'
        }, shimmerElements: [
            {
                height: 25,
                type: ShimmerElementType.line,
                width: '98%'
            },
            {
                height: 25,
                type: ShimmerElementType.gap,
                width: '2%'
            }
        ], width: "100%" }, 0));
    for (let i = 0; i < 15; i++) {
        items.push(_jsx(Shimmer, { className: "shimmerClass", shimmerColors: {
                shimmerWave: 'lightgrey'
            }, shimmerElements: [
                {
                    height: 25,
                    type: ShimmerElementType.circle,
                    width: '5%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '10%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '10%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '10%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '10%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '10%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '10%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '10%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '10%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                }
            ], width: "100%" }, i + 1));
    }
    items.push(_jsx(Shimmer, { className: "shimmerClass", shimmerColors: {
            shimmerWave: 'lightgrey'
        }, shimmerElements: [
            {
                height: 25,
                type: ShimmerElementType.line,
                width: '17%'
            },
            {
                height: 25,
                type: ShimmerElementType.gap,
                width: '67%'
            },
            {
                height: 25,
                type: ShimmerElementType.line,
                width: '14%'
            },
            {
                height: 25,
                type: ShimmerElementType.gap,
                width: '2%'
            }
        ], width: "100%" }, 20));
    return _jsx("div", Object.assign({ className: classes.loadingSection }, { children: items }), void 0);
};
