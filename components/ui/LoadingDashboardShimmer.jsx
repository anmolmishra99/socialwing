import React from 'react';

const LoadingDashboardShimmer = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* === Sidebar Shimmer === */}
      <aside className="w-64 bg-gradient-to-b from-[#1D3781] to-[#0F1E54] text-white p-6 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="h-8 w-32 bg-blue-300/40 rounded animate-pulse mb-8"></div>

          {/* Nav Items */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-10 rounded-md ${
                  i === 0
                    ? 'bg-orange-400/70 animate-pulse'
                    : 'bg-white/10 animate-pulse'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6">
          <div className="h-4 w-36 bg-white/20 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-44 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="h-10 w-full bg-red-500/80 rounded animate-pulse"></div>
        </div>
      </aside>

      {/* === Main Content === */}
      <main className="flex-1 p-8">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Project Overview Card */}
        <div className="bg-blue-100 rounded-xl p-6 mb-8">
          <div className="h-6 w-72 bg-blue-300 rounded animate-pulse mb-3"></div>
          <div className="h-4 w-96 bg-blue-200 rounded animate-pulse"></div>
        </div>

        {/* Project Selection Row */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between flex-wrap gap-4">
            <div className="h-10 w-72 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-blue-200 rounded animate-pulse mt-6"></div>
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {['gray', 'orange', 'green', 'purple'].map((color, i) => (
            <div
              key={i}
              className={`rounded-xl shadow-sm border p-6 ${
                color === 'gray'
                  ? 'bg-gray-50 border-gray-200'
                  : color === 'orange'
                  ? 'bg-orange-50 border-orange-100'
                  : color === 'green'
                  ? 'bg-green-50 border-green-100'
                  : 'bg-purple-50 border-purple-100'
              }`}
            >
              <div
                className={`h-4 w-40 rounded animate-pulse ${
                  color === 'gray'
                    ? 'bg-gray-200'
                    : color === 'orange'
                    ? 'bg-orange-200'
                    : color === 'green'
                    ? 'bg-green-200'
                    : 'bg-purple-200'
                } mb-4`}
              ></div>
              <div
                className={`h-8 w-20 rounded animate-pulse ${
                  color === 'gray'
                    ? 'bg-gray-200'
                    : color === 'orange'
                    ? 'bg-orange-200'
                    : color === 'green'
                    ? 'bg-green-200'
                    : 'bg-purple-200'
                } mb-2`}
              ></div>
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Land Records Table Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </main>

      {/* Pulse Animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingDashboardShimmer;
