import Skeleton from "react-loading-skeleton"

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <Skeleton height={40} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card">
          <Skeleton height={20} className="mb-4" />
          <Skeleton height={60} className="mb-4" />
          <Skeleton height={40} />
        </div>
      ))}
    </div>
  )
}

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="card text-center">
          <Skeleton circle height={80} width={80} className="mx-auto mb-4" />
          <Skeleton height={20} />
        </div>
      ))}
    </div>
  )
}
