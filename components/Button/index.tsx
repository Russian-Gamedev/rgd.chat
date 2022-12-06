import React from 'react';
import { classNames } from '@/lib/tools';
import style from './style.module.scss';

type ButtonOwnProps<E extends React.ElementType = React.ElementType> = {
  children: React.ReactNode;
  as?: E;
  color?: 'primary' | 'default';
};

type ButtonProps<E extends React.ElementType> = ButtonOwnProps<E> &
  Omit<React.ComponentProps<E>, keyof ButtonOwnProps>;

const defaultElement = 'button';

export default function Button<E extends React.ElementType = typeof defaultElement>(
  props: ButtonProps<E>,
) {
  const { as, color, ...otherProps } = props;

  const TagName = as || defaultElement;

  const css = {
    backgroundColor: color && `var(--color-${color})`,
  };

  return (
    <TagName
      className={classNames(style.button, style['button__' + TagName])}
      style={css}
      {...otherProps}
    >
      {props.children}
    </TagName>
  );
}
