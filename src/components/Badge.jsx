export function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default:
      'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
    muted:
      'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700',
    chapter:
      'bg-emerald-500 text-white border border-transparent font-mono font-bold',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium
        ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
