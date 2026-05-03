import { Header } from '@/components';
import { HEADER_VARIANT } from '@/components';
import MainFooter from './Footer';

export default function MainContainer() {
  return (
    <>
      <Header variant={HEADER_VARIANT.HOME} />
      <MainFooter />
    </>
  );
}
