'use client';

import { usePathname } from 'next/navigation';

import Link from 'next/link';
import style from './style.module.scss';
import RGDIcon from '@/components/Icons/RGD';
import JamIcon from '@/components/Icons/Jam';
import CrownIcon from '@/components/Icons/Crown';
import Text from '@/components/Text';

const items = [
  {
    title: 'Джемы',
    link: '/jams',
    icon: JamIcon,
  },
  {
    title: 'Патроны',
    link: '/patrons',
    icon: CrownIcon,
  },
];

export default function Sidebar() {
  return (
    <aside className={style.sidebar}>
      <Link href="/" className={style.sidebar__logotype}>
        <RGDIcon />
      </Link>
      <nav role="menu" className={style.sidebar__menu}>
        {items.map((item) => (
          <Item key={item.link} item={item} />
        ))}
      </nav>
    </aside>
  );
}

function Item({ item }: { item: typeof items[0] }) {
  const pathname = usePathname();

  const isActive = pathname?.startsWith(item.link);

  return (
    <Text as="a" href={item.link} role="menuitem" style={{ color: isActive ? '#fff' : undefined }}>
      {<item.icon />}
      {item.title}
    </Text>
  );
}
