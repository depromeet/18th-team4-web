import Link from "next/link";
import { MainBody } from "./Body";
import { PATH_NAME } from "@/constants";

export default function MainContainer() {
  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center">
      <div className="w-full max-w-sm bg-zinc-50 flex flex-col min-h-screen">
        <MainBody />

        <section className="px-6 pb-10">
          <Link href={PATH_NAME.register.list()}>
            <button className="w-full h-14 bg-zinc-900 text-white rounded-full text-sm font-semibold tracking-wide hover:bg-zinc-700 transition-colors">
              30초 만에 시작하기
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
