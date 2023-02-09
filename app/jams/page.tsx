import Breadcrumbs from '@/components/Breadcrumbs';
import Text from '@/components/Text';

export default function Page() {
  return (
    <>
      <Breadcrumbs
        path={[
          { title: 'Главная', href: '/' },
          { title: 'Джемы', href: '/jams' },
        ]}
      />
      <Text>Какие Джемы?</Text>
    </>
  );
}
