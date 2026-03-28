"use client";
import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white/80"></div>
            </div>
            <span className="text-sm tracking-widest uppercase text-white/80">
              HumanWrite
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <button className="hover:text-white transition-colors">
              Product
            </button>
            <button className="hover:text-white transition-colors">
              Pricing
            </button>
            <button className="hover:text-white transition-colors">Blog</button>
          </nav>
          <button className="rounded-full bg-white/90 text-black text-sm font-medium px-4 py-2 hover:bg-white transition-colors">
            Get started
          </button>
        </div>
      </header>

      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://firebasestorage.googleapis.com/v0/b/krishimandi-6ff93.firebasestorage.app/o/Still_Camera_Moving_Air_Video.mp4?alt=media&token=0c8731ee-5209-4d33-b615-3f336cf58cb0"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Write like a human.
            <br />
            Be found automatically.
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/70">
            A SaaS platform that turns authentic human writing into content
            people trust and search engines reward.
          </p>

          <div className="mt-10 flex items-center justify-center">
            <div className="w-full max-w-xl flex items-center gap-3 rounded-full border border-white/25 bg-white/10 backdrop-blur-xl px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              <span className="text-sm text-white/60 flex-1 text-left">
                Try “how to sound human, not AI”
              </span>
              <button className="w-9 h-9 rounded-full bg-white/90 text-black text-sm font-semibold flex items-center justify-center">
                ↑
              </button>
            </div>
          </div>

          <div className="mt-8 text-sm text-white/60">
            Create content that sounds human — and shows up on ChatGPT.
          </div>
        </div>
      </section>

      <section className="bg-black py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Get found.
            <br />
            Automatically.
          </h2>
          <p className="mt-6 text-white/60 text-base md:text-lg">
            Create content that answers real customer questions and ranks with
            human-first clarity.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
