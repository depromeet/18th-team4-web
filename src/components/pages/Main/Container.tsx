import Link from 'next/link';
import { ArrowIcon } from '@/components/common';
import { PATH_NAME } from '@/constants';
import { MainBody } from './Body';

export default function MainContainer() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-sm bg-primary-base flex flex-col min-h-screen">
        <MainBody />

        <section className="px-6 pb-10">
          <Link href={PATH_NAME.register.list()}>
            <button className="w-full h-14 bg-gray-900 text-primary-white rounded-full body2-bold tracking-wide hover:bg-gray-800 transition-colors">
              책 등록하기
              <ArrowIcon className="fill-gray-500 size-10 rotate-180" />
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
