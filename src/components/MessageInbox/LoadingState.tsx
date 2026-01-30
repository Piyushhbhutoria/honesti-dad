const LoadingState = () => {
  return (
    <section className="py-20 page-gradient relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-info/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center">
          <div className="glass-card p-8 max-w-sm mx-auto shadow-glass">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/70 font-medium">Loading your messages...</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoadingState;
