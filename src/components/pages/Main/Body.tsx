export const MainBody = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center pt-20 pb-12 px-6 text-center">
        <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-3">Readum</h1>
        <p className="text-sm text-zinc-500 leading-relaxed">
          사유하는 독서가인
          <br />
          당신을 위해.
        </p>
      </section>

      {/* 피처 1 */}
      <section className="px-6 mb-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-inc-600 text-center leading-relaxed mb-6">
            모호한 생각이
            <br />
            명확한 기록이 될 때까지,
            <br />
            나만을 위한 AI 챗봇
          </p>
          <div className="flex items-end gap-4 justify-center">
            {/* 폰 목업 */}
            <div className="w-24 h-40 rounded-2xl border-2 border-zinc-300 bg-zinc-50 flex-shrink-0" />
            {/* AI 캐릭터 */}
            <div className="flex flex-col items-center mb-2">
              <div className="w-14 h-14 rounded-full bg-zinc-200 border-2 border-zinc-300 flex items-center justify-center text-2xl mb-1">
                🤖
              </div>
              {/* 물결 */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-1.5 rounded-full bg-zinc-300"
                    style={{ opacity: 0.4 + i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 피처 2 */}
      <section className="px-6 mb-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-zinc-600 text-center leading-relaxed mb-6">
            대화만 나눠도
            <br />
            깔끔하게 정리되는 생각과 감상
          </p>
          <div className="flex items-end gap-4 justify-center">
            {/* 노트 아이콘 */}
            <div className="flex flex-col gap-1 mb-2">
              <div className="w-14 h-10 bg-zinc-100 rounded-lg border border-zinc-200 flex flex-col justify-center px-2 gap-1">
                <div className="h-0.5 bg-zinc-400 rounded" />
                <div className="h-0.5 bg-zinc-400 rounded w-3/4" />
                <div className="h-0.5 bg-zinc-400 rounded w-1/2" />
              </div>
              <span className="text-lg text-right">✏️</span>
            </div>
            {/* 폰 목업 */}
            <div className="w-24 h-40 rounded-2xl border-2 border-zinc-300 bg-zinc-50 flex-shrink-0" />
          </div>
        </div>
      </section>

      {/* 스페이서 */}
      <div className="flex-1" />
    </>
  );
};
