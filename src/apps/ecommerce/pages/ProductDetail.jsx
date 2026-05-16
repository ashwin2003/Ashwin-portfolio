import { useParams } from 'react-router-dom'

export function ProductDetail() {
  const { id } = useParams()
  return (
    <main className="section-container py-20">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Product #{id}</h1>
      <p className="mt-3 text-slate-500 dark:text-zinc-400">Product detail — coming soon.</p>
    </main>
  )
}
