import React from 'react';

export function CameraCardSkeleton() {
  return (
    <div className="card">
      <div className="aspect-[4/3] shimmer-bg" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 shimmer-bg rounded" />
        <div className="h-5 w-3/4 shimmer-bg rounded" />
        <div className="h-3 w-1/2 shimmer-bg rounded" />
        <div className="flex justify-between items-center pt-3 border-t border-obsidian-700">
          <div className="h-6 w-20 shimmer-bg rounded" />
          <div className="h-9 w-20 shimmer-bg rounded" />
        </div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-obsidian-700 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-obsidian-500 text-sm font-mono tracking-widest">LOADING</p>
      </div>
    </div>
  );
}
