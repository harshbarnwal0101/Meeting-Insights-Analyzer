import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-indigo-50 via-white to-white text-gray-900">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative w-full max-w-6xl px-6 pt-24 pb-12 text-center">
        <span className="inline-block rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
          AI Insights for Every Conversation
        </span>
        <h1 className="mt-5 text-5xl md:text-6xl font-extrabold tracking-tight">
          Turn transcripts into actionable <span className="text-indigo-600">analytics</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Analyze meetings with Google Gemini and visualize performance trends. Spot strengths, uncover gaps, and boost outcomes.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-900 font-semibold shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            See Features
          </a>
        </div>
      </section>

      {/* Trust / Headline strip */}
      <section className="relative w-full max-w-6xl px-6 pb-4 text-center">
        <h2 className="text-sm uppercase tracking-widest text-gray-500">Smart. Fast. Insightful.</h2>
      </section>

      {/* Features */}
      <section id="features" className="relative w-full max-w-6xl px-6 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Everything you need to understand your meetings</h2>
        <p className="mt-2 text-center text-gray-600">From upload to insights in minutes—no setup headaches.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Upload & Analyze"
            desc="Paste or upload transcripts and let Gemini score pitch, conversion, rapport, objections, and closing—plus an overall rating."
            icon={
              <svg className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4A1 1 0 1 1 8.707 10.293L11 12.586V4a1 1 0 0 1 1-1z"/><path d="M5 20a2 2 0 0 1-2-2V9a1 1 0 1 1 2 0v9h14V9a1 1 0 1 1 2 0v9a2 2 0 0 1-2 2H5z"/></svg>
            }
          />
          <FeatureCard
            title="Visualize Trends"
            desc="See radar comparisons, overall trend lines, and property breakdowns—instantly highlight what’s working."
            icon={
              <svg className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M4 19a1 1 0 0 1 0-2h2.586l3.707-3.707a1 1 0 0 1 1.414 0L14 14.586l4.293-4.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0L11 15.414l-3.293 3.293A1 1 0 0 1 7 19H4z"/></svg>
            }
          />
          <FeatureCard
            title="Chat with Analytics"
            desc="Ask questions about the current analytics and get concise, grounded answers from Gemini."
            icon={
              <svg className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
            }
          />
        </div>
      </section>

      {/* Secondary section */}
      <section className="relative w-full max-w-6xl px-6 py-12">
        <div className="rounded-2xl border border-indigo-100 bg-white/70 p-8 text-center shadow-sm">
          <h3 className="text-2xl font-bold">Ready to turn conversations into results?</h3>
          <p className="mt-2 text-gray-600">Start analyzing your next meeting now and see where to improve.</p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative w-full max-w-6xl px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center">What users are saying</h2>
        <p className="mt-2 text-center text-gray-600">Mock reviews to showcase product value.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Testimonial
            quote="The radar chart made it obvious where our pitch fell short. We improved by 18 points the next week."
            name="Aarav Patel"
            title="Sales Lead, NovaTech"
            avatarColor="bg-indigo-100 text-indigo-700"
          />
          <Testimonial
            quote="Finally, a way to quantify rapport and objections. Our coaching sessions are now data-driven."
            name="Sara Wang"
            title="Enablement Manager, Cloud.io"
            avatarColor="bg-purple-100 text-purple-700"
          />
          <Testimonial
            quote="The chat answers are grounded in the numbers—no fluff. Super helpful before client follow-ups."
            name="Liam Smith"
            title="AM, BrightWorks"
            avatarColor="bg-emerald-100 text-emerald-700"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="relative w-full max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat number="+35%" label="Avg. faster insights" />
          <Stat number="92%" label="Users see clearer trends" />
          <Stat number=">10k" label="Transcripts analyzed" />
          <Stat number="4.8★" label="User satisfaction" />
        </div>
      </section>

      {/* FAQ */}
      <section className="relative w-full max-w-6xl px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Frequently asked questions</h2>
        <div className="mt-8 max-w-3xl mx-auto space-y-4">
          <FAQ q="How do I upload transcripts?" a="Open the dashboard and click New Meeting. Paste your transcript or upload a text file, then click Analyze." />
          <FAQ q="Which metrics are scored?" a="Pitch, Conversion, Rapport, Objection Handling, Closing, and an Overall score." />
          <FAQ q="Can I chat about the analytics?" a="Yes. On a meeting page with analytics, use the chat area to ask Gemini about trends and improvements." />
          <FAQ q="Is my data secure?" a="Transcripts are stored in your MongoDB. Provide the GEMINI_API_KEY to enable analysis; rotate keys as needed." />
        </div>
      </section>

      <footer className="w-full max-w-6xl px-6 pb-10 text-center text-xs text-gray-500">
        <div> {new Date().getFullYear()} Meeting Analyzer • Built with Next.js + Gemini</div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
      <div className="mt-3 text-sm text-indigo-600 opacity-0 transition group-hover:opacity-100">Learn more →</div>
    </div>
  );
}

function Testimonial({ quote, name, title, avatarColor }: { quote: string; name: string; title: string; avatarColor: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-gray-700">“{quote}”</p>
      <div className="mt-4 flex items-center gap-3">
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${avatarColor} font-semibold`}>{name.charAt(0)}</div>
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{title}</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-3xl font-extrabold text-indigo-600">{number}</div>
      <div className="mt-1 text-sm text-gray-600">{label}</div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">{q}</h3>
          <span className="text-indigo-600 group-open:rotate-180 transition">⌄</span>
        </div>
      </summary>
      <p className="mt-3 text-sm text-gray-600">{a}</p>
    </details>
  );
}
