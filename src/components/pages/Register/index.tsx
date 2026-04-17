"use client";

import { useState } from "react";

export default function RegisterContainer() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center">
      <div className="w-full max-w-sm bg-zinc-50 flex flex-col min-h-screen">
        <header className="px-5 pt-14 pb-4">
          <button className="text-zinc-600 text-lg mb-5">‹</button>
          <h1 className="text-xl font-bold text-zinc-900">책 추가하기</h1>
        </header>

        <div className="px-5 mb-6">
          <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-xl px-4 py-3">
            <input
              type="text"
              placeholder="어떤 책을 완독하고 싶나요?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none bg-transparent"
            />
            <button className="text-zinc-400">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-10">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c4c4cc"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <p className="text-sm text-zinc-400">읽고 싶은 책을 검색해보세요</p>
        </div>

        {/* 다음 버튼 */}
        <section className="px-5 pb-10">
          <button
            disabled
            className="w-full h-14 bg-zinc-200 text-zinc-400 rounded-2xl text-sm font-semibold cursor-not-allowed"
          >
            다음
          </button>
        </section>
      </div>
    </div>
  );
}
