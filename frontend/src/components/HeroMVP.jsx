import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroMVP({ onOpenCreate, onOpenDemo, onTryDemo }) {
  return (
    <section className="min-h-screen flex flex-col justify-center py-12 px-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative">
      <div className="absolute top-8 left-12">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>Plan Pilot</h1>
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-24">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            Stop typing chaos into group chat — <span className="text-emerald-400">plan like a pro.</span>
          </h1>

          <p className="mt-5 text-lg text-slate-300 max-w-xl">
            We do the boring breakdowns: you get a ready-to-run plan and fewer panicked messages.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenCreate}
              aria-label="Make My Plan"
              className="px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg hover:scale-[1.03] transform transition"
            >
              Make My Plan
            </button>

            <button
              onClick={onOpenDemo}
              aria-label="See 30 second demo"
              className="px-4 py-3 rounded-lg border border-slate-600 text-slate-100 hover:bg-slate-800"
            >
              See 30s Demo
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-400">Free to try — create a plan in under 60 seconds.</p>

          <div className="mt-6">
            <button onClick={onTryDemo} className="text-sm text-slate-200 underline">Try a demo plan</button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="w-[360px] h-[260px] bg-slate-800 rounded-2xl p-3 shadow-2xl flex items-center justify-center">
            <img
              src="/assets/demo-mockup.gif"
              alt="Animated demo showing: paste event brief, tasks generated, and user marking tasks complete."
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
        <div className="absolute bottom-8 left-12">
         <Link to="/todo" className="text-slate-300 hover:text-white">
          To-Do List
        </Link>
      </div>
    </section>
  );
}
