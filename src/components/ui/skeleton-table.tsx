import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton() {
  return (
    <div className="w-full space-y-5 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex gap-4 items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border">
        <div className="bg-gray-100 p-4">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-200 bg-white">
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="p-4">
              <div className="grid grid-cols-6 gap-4">
                {[...Array(6)].map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
