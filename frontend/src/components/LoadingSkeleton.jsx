export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse mt-8">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
