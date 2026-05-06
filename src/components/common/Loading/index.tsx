export const Loading = () => {
  return (
    <section
      className="w-full h-full flex items-center justify-center"
      aria-busy="true"
      aria-label="로딩 중"
    >
      <div className="loading-wave" role="presentation">
        <span className="loading-wave__dot" />
        <span className="loading-wave__dot" />
        <span className="loading-wave__dot" />
      </div>
    </section>
  );
};
