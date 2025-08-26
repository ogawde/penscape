export const Quote = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-slate-50">
      {/* soft blobs in the background – similar vibe to Magic UI / Cult-UI hero blocks */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative flex h-full items-center justify-center px-8">
        <div className="max-w-xl animate-in fade-in-0 slide-in-from-right-8 duration-700">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80 mb-4">
            Crafted for builders with taste
          </p>

          <div className="group rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/90 px-8 py-10 shadow-[0_22px_60px_rgba(15,23,42,0.85)] transition-all duration-500 hover:border-emerald-400/50 hover:shadow-[0_28px_80px_rgba(16,185,129,0.65)]">
            <div className="text-3xl font-semibold leading-snug sm:text-4xl">
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-100 to-amber-200 bg-clip-text text-transparent">
                Become a person with taste,
              </span>
              <br />
              <span className="text-slate-100">
                one who knows how to craft products people actually love.
              </span>
            </div>

            <div className="mt-6 space-y-1">
              <div className="text-lg font-semibold text-slate-100">
                H. Singh
              </div>
              <div className="text-sm font-medium text-slate-400/90">
                Founder · 100xDevs
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
