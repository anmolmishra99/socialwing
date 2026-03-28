// components/AuthShimmer.jsx
import React from "react";

const AuthShimmer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background shimmer gradient */}
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_60%)]" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 md:px-12 gap-10">
        {/* Left shimmer section */}
        <div className="flex-1 w-full max-w-xl space-y-6 text-white">
          <div className="h-8 w-48 bg-white/10 rounded-lg mb-2 animate-pulse"></div>
          <div className="h-5 w-72 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-4 w-64 bg-white/10 rounded-lg animate-pulse"></div>

          {/* Feature shimmer cards */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            {Array(4)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl h-32 bg-gradient-to-br from-white/10 to-white/5 
                             backdrop-blur-xl border border-white/10 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0)_100%)] 
                                  animate-shimmer"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Right shimmer section (form placeholder) */}
        <div className="flex-1 max-w-md  w-full">
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            {/* Shimmer gradient */}
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0)_100%)] animate-shimmer" />

            <div className="space-y-5 h-[500px] relative z-10">
              <br />
              <br />
              <br />
              <br />
              <div className="h-6 w-32 bg-white/20 rounded-lg animate-pulse"></div>
              <div className="h-10 w-full bg-white/10 rounded-lg animate-pulse"></div>
              <div className="h-10 w-full bg-white/10 rounded-lg animate-pulse"></div>
              <div className="h-10 w-full bg-white/10 rounded-lg animate-pulse"></div>
              <br />
              <br />
              <br />
              <br />
              <div className="h-12 w-full bg-orange-500/40 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle top blur */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/10 to-transparent blur-2xl" />
    </div>
  );
};

export default AuthShimmer;

/* Tailwind custom animation (add to globals.css):
---------------------------------------------------
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}
---------------------------------------------------
*/
