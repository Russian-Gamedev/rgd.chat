import Sidebar from './(components)/Sidebar';
import './global.scss';

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <head />
      <body>
        <Sidebar />
        <main>{children}</main>
      </body>
    </html>
  );
}
