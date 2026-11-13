import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between h-36">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <div className="space-y-2 mt-4">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 6 }) {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className={`h-4 ${i === 0 ? 'w-16' : i === 1 ? 'w-48' : 'w-24'}`} />
        </td>
      ))}
    </tr>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="space-y-1.5 pt-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

