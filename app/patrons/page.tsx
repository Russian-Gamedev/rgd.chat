import Breadcrumbs from '@/components/Breadcrumbs';
import Text from '@/components/Text';

export default function Page() {
  return (
    <>
      <Breadcrumbs
        path={[
          { title: 'Главная', href: '/' },
          { title: 'Патроны', href: '/patron' },
        ]}
      />
      <Text>Patrons</Text>
    </>
  );
}
