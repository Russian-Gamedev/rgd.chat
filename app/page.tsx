import Badge from '@/components/Badge';
import Breadcrumbs from '@/components/Breadcrumbs';
import Button from '@/components/Button';
import ColorfulJam from '@/components/Icons/ColorfulJam';
import ExternalLink from '@/components/Icons/ExternalLink';
import VKIcon from '@/components/Icons/VK';
import YouTubeIcon from '@/components/Icons/YouTube';
import Text from '@/components/Text';
import React from 'react';

import style from './style.module.scss';

const cards = [
  {
    icon: <YouTubeIcon />,
    title: 'YouTube',
    description: 'Записи подведения итогов джемов',
    link: 'https://www.youtube.com/channel/UCZq4wK7UprpSiJRQLIjtbqw',
  },
  {
    icon: <ColorfulJam />,
    title: 'Последний джем',
    description: '35 игр, 5 часов прохождения',
    link: 'https://youtu.be/bDBhfamPtvo',
  },
  {
    icon: <VKIcon />,
    title: 'ВКонтакте',
    description: 'Сообщество по Game Maker',
    link: 'https://vk.com/game_maker',
  },
];

export default function Page() {
  const [members, online] = [2437, 561];

  return (
    <>
      <Breadcrumbs path={[{ title: 'Главная', href: '/' }]} />
      <Text as="h1">Russian Gamedev — Discord сообщество</Text>
      <Text as="p">
        Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих игр и идей,
        найдёте отличных напарников которые не бросят под самый релиз, и живой войс где мы регулярно
        срём новых участников и играем в игры.
      </Text>
      <div className={style.badges}>
        <Badge>
          <Text>участников: </Text>
          <Text color="primary">{members.toLocaleString('ru-RU')}</Text>
        </Badge>
        <Badge>
          <Text>онлайн: </Text>
          <Text color="primary">{online.toLocaleString('ru-RU')}</Text>
        </Badge>
      </div>
      <Button color="primary" as="a" rel="external" href="https://discord.gg/EKUg5VhCVW">
        <Text>Присоединиться</Text>
        <ExternalLink />
      </Button>
      <Text as="h3" tertiary>
        Полезные ссылки
      </Text>
      <div className={style.cards}>
        {cards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </div>
    </>
  );
}

function Card(props: { icon: React.ReactNode; title: string; description: string; link: string }) {
  return (
    <a className={style.card} href={props.link}>
      <div>{props.icon}</div>
      <Text as="h4" className={style.card__title}>
        {props.title}
      </Text>
      <Text as="p" className={style.card__description}>
        {props.description}
      </Text>
    </a>
  );
}
