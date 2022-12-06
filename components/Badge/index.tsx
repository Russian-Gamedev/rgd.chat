import style from './style.module.scss';

type BadgeProps = {
  children: React.ReactNode;
};

export default function Badge(props: BadgeProps) {
  return <div className={style.badge}>{props.children}</div>;
}
