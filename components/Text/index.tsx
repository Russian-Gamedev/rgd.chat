import React from 'react';
import { classNames } from '@/lib/tools';
import style from './style.module.scss';

type TextOwnProps<E extends React.ElementType = React.ElementType> = {
  children: React.ReactNode;
  as?: E;
};

type TextProps<E extends React.ElementType> = TextOwnProps<E> &
  Omit<React.ComponentProps<E>, keyof TextOwnProps>;

const defaultElement = 'span';

export default function Text<E extends React.ElementType = typeof defaultElement>(
  props: TextProps<E>,
) {
  const { as, ...otherProps } = props;

  const TagName = as || defaultElement;

  return (
    <TagName className={classNames(style.text, style['text__' + TagName])} {...otherProps}>
      {props.children}
    </TagName>
  );
}
