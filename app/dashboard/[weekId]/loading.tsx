export default function WeekDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-40 shimmer rounded-lg" />
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 shimmer rounded" />
            <div className="h-4 w-32 shimmer rounded" />
          </div>
          <div className="h-8 w-24 shimmer rounded" />
        </div>
        <div className="h-3 w-full shimmer rounded-full" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-28 shimmer rounded" />
          <div className="h-14 shimmer rounded-xl" />
          <div className="h-14 shimmer rounded-xl" />
        </div>
      ))}
    </div>
  );
}
