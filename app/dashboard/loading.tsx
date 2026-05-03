export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 shimmer rounded-lg" />
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex gap-3">
          <div className="h-9 w-32 shimmer rounded-lg" />
          <div className="h-9 w-32 shimmer rounded-lg" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border py-4 last:border-0">
            <div className="h-4 w-10 shimmer rounded" />
            <div className="h-4 w-48 shimmer rounded" />
            <div className="h-6 w-20 shimmer rounded-full" />
            <div className="ml-auto h-4 w-14 shimmer rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
