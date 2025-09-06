type Props = { count?: number }

export default function SkeletonCards({ count = 6 }: Props) {
  return (
    <div className="p-6">
      <div className="h-6 w-44 bg-gray-200 rounded mb-4 animate-pulse" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-2xl p-5 border">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-100 rounded mt-2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

