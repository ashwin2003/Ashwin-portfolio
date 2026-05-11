const variants = {
  primary:
    'bg-violet-600 hover:bg-violet-700 text-white glow-violet hover:glow-violet-lg border border-transparent',
  outline:
    'border border-violet-500 text-violet-400 hover:bg-violet-500/10 dark:hover:bg-violet-500/10',
  ghost:
    'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 border border-transparent',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({ children, as: Tag = 'button', variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <Tag
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
        focus:ring-offset-slate-50 dark:focus:ring-offset-zinc-950
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </Tag>
  )
}
