import Breadcrumbs from '@/components/Breadcrumbs';
import Text from '@/components/Text';
import { client } from '@/lib/api';
import style from './style.module.scss';

export default async function Page() {
  const patrons = await client.patrons();
  console.log(patrons);

  return (
    <>
      <Breadcrumbs
        path={[
          { title: 'Главная', href: '/' },
          { title: 'Патроны', href: '/patron' },
        ]}
      />
      <Text tertiary>Доска почёта</Text>
      <div className={style.cards}>
        {patrons.map((patron, i) => (
          <Card key={patron.user.id} {...patron} banner={i < 2} badge={i < 2 ? i : undefined} />
        ))}
      </div>
    </>
  );
}

type CardProps = {
  amount: number;
  user: {
    id: string;
    avatar: string;
    username: string;
    banner: string;
  };
  banner?: boolean;
  badge?: number | undefined;
};

function Card(props: CardProps) {
  return (
    <div className={style.card}>
      {props.banner ? (
        <img
          className={style.card__banner}
          src={props.user.banner}
          width={304}
          height={130}
          alt={props.user.username}
        />
      ) : null}
      <div>
        <img src={props.user.avatar} width={28} height={28} alt={props.user.username} />
        <Text>{props.user.username}</Text>
        <div>
          <Text>
            {props.amount.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}
          </Text>
        </div>
      </div>
    </div>
  );
}
