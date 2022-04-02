import React from 'react';
import { createUseStyles } from 'react-jss';
import { gridViewStyles } from './GridView.styles';
import { Shimmer, ShimmerElementType } from '@fluentui/react/lib/Shimmer';

const useStyles = createUseStyles(gridViewStyles);

export const GridViewShimmer = () => {
  const classes = useStyles();
  const items = [];
  items.push(
    <Shimmer
      key={0}
      className="shimmerClass"
      shimmerColors={{
        shimmerWave: 'lightgrey'
      }}
      shimmerElements={[
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
      ]}
      width="100%"
    />
  );
  for (let i = 0; i < 15; i++) {
    items.push(
      <Shimmer
        key={i + 1}
        className="shimmerClass"
        shimmerColors={{
          shimmerWave: 'lightgrey'
        }}
        shimmerElements={[
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
        ]}
        width="100%"
      />
    );
  }
  items.push(
    <Shimmer
      key={20}
      className="shimmerClass"
      shimmerColors={{
        shimmerWave: 'lightgrey'
      }}
      shimmerElements={[
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
      ]}
      width="100%"
    />
  );

  return <div className={classes.loadingSection}>{items}</div>;
};
