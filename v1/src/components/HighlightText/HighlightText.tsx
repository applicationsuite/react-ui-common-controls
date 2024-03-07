import React from 'react';
import { createUseStyles } from 'react-jss';
import { mergeClassNames } from '../../utilities/mergeClassNames';
import { highlightedTextStyles } from './HighlightedText.styles';

const useStyles = createUseStyles(highlightedTextStyles);

export interface HighlightTextProps {
  text?: string;
  textToBeHighlighted?: string;
  highLightTextClass?: string;
}

export const HighlightText = (props: HighlightTextProps) => {
  let text = props.text || '';
  let textToBeHighlighted = props.textToBeHighlighted || '';

  const classes = useStyles();
  let parts: any[] = [];
  try {
    parts = text.split(new RegExp(`(${textToBeHighlighted})`, 'gi'));
  } catch (e: any) {
    parts = [text];
  }
  return (
    <>
      {parts.map((part, i) => {
        return (
          <span
            key={i}
            className={
              part.toLowerCase() === textToBeHighlighted!.toLowerCase()
                ? mergeClassNames([classes.highlightedText, props.highLightTextClass])
                : ''
            }
          >
            {part}
          </span>
        );
      })}
    </>
  );
};
