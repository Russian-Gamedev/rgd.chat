import ChevronRight from '../Icons/ChevronRight';
import Text from '../Text';

import style from './style.module.scss';

type BreadcrumbsProps = {
  path: Array<{ title: string; href: string }>;
};

export default function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <div className={style.breadcrumbs}>
      {props.path.map((part, index) => (
        <div key={part.href}>
          <Text as="a" href={part.href}>
            {part.title}
          </Text>
          {index < props.path.length - 1 && <ChevronRight width={12} height={12} />}
        </div>
      ))}
    </div>
  );
}
