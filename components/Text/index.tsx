import React from 'react';
import { classNames } from '@/lib/tools';
import style from './style.module.scss';

type TextOwnProps<E extends React.ElementType = React.ElementType> = {
  children: React.ReactNode;
  as?: E;
  color?: 'primary' | 'default';
  tertiary?: boolean;
  className?: string;
};

type TextProps<E extends React.ElementType> = TextOwnProps<E> &
  Omit<React.ComponentProps<E>, keyof TextOwnProps>;

const defaultElement = 'span';

export default function Text<E extends React.ElementType = typeof defaultElement>(
  props: TextProps<E>,
) {
  const { as, color, tertiary, className, ...otherProps } = props;

  const TagName = as || defaultElement;

  const css = {
    color: color && `var(--color-${color})`,
  };

  const cn = [style[`text__${TagName}`], className];

  if (tertiary) {
    cn.push(style.text__tertiary);
  }

  return (
    <TagName className={cn.join(' ')} style={css} {...otherProps}>
      {props.children}
    </TagName>
  );
}
