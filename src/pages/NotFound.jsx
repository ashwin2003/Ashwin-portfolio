export function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-emerald-500 dark:text-emerald-400 text-xs uppercase tracking-[0.2em] mb-4">
          404
        </p>
        <h1 className="text-6xl sm:text-8xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
          Lost in<br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            the stack
          </span>
        </h1>
        <p className="text-slate-500 dark:text-zinc-500 mb-10 max-w-xs mx-auto text-sm leading-relaxed">
          This page doesn&apos;t exist. Maybe it was never shipped.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
        >
          ← Back to home
        </a>
      </div>
    </div>
  )
}
