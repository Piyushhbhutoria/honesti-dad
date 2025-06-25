
const LoadingState = () => {
  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A1E4B6] mx-auto"></div>
          <p className="mt-4 text-[#666666]">Loading...</p>
        </div>
      </div>
    </section>
  );
};

export default LoadingState;
