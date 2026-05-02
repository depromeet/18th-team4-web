import Link from 'next/link';
import { PATH_NAME } from '@/constants';
import { Header } from '@/components';
import { MainBody } from './Body';

export default function MainContainer() {
  return (
    <>
      <Header variant="home" />
      <MainBody />

      <section className="px-6 pb-10">
        <Link href={PATH_NAME.register.list()}>
          <button className="w-full h-14 bg-gray-900 text-primary-white rounded-full body2-bold tracking-wide hover:bg-gray-800 transition-colors">
            책 등록하기
          </button>
        </Link>
      </section>
    </>
  );
}
