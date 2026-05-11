export function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium
        bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300
        border border-violet-200 dark:border-violet-500/20
        ${className}`}
    >
      {children}
    </span>
  )
}
