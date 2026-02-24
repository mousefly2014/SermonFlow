"use client";

import { useMemo, useState } from "react";

type Tone = "Encouraging" | "Teaching" | "Bold" | "Gentle";
type Length = "5" | "10" | "15";

type ScriptResult = {
  hook: string;
  scriptureContext: string;
  point1: { explanation: string; illustration: string };
  point2: { explanation: string; illustration: string };
  point3: { explanation: string; illustration: string };
  practicalApplication: string;
  closingPrayer: string;
  youtubeTitles: string[];
  seoKeywords: string[];
};

export function GeneratorForm() {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [scripture, setScripture] = useState("");
  const [videoLength, setVideoLength] = useState<Length>("10");
  const [tone, setTone] = useState<Tone>("Encouraging");
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [loading, setLoading] = useState(false);

  const canGenerate = useMemo(() => topic.trim().length > 0 && !loading, [topic, loading]);

  const handleMagicLink = async () => {
    setStatus("Sending magic link...");
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setStatus(data.message ?? "Check your email inbox.");
  };

  const handleGenerate = async () => {
    setLoading(true);
    setStatus("Generating your sermon script...");
    setResult(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, scripture, videoLength, tone })
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error ?? "Generation failed.");
      setLoading(false);
      return;
    }

    setResult(data.script as ScriptResult);
    setStatus("Script generated. Upgrade to Pro for more monthly credits.");
    setLoading(false);
  };

  const startCheckout = async () => {
    const res = await fetch("/api/create-checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">1) Email magic link login</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="rounded-lg bg-indigo-500 px-4 py-3 font-medium" onClick={handleMagicLink}>
            Send Magic Link
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">2) Generate sermon script</h2>
        <div className="mt-4 grid gap-4">
          <input
            className="rounded-lg border border-slate-700 bg-slate-950 p-3"
            placeholder="Topic: Finding peace in uncertainty"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <input
            className="rounded-lg border border-slate-700 bg-slate-950 p-3"
            placeholder="Scripture (optional): Philippians 4:6-7"
            value={scripture}
            onChange={(e) => setScripture(e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              className="rounded-lg border border-slate-700 bg-slate-950 p-3"
              value={videoLength}
              onChange={(e) => setVideoLength(e.target.value as Length)}
            >
              <option value="5">5 min</option>
              <option value="10">10 min</option>
              <option value="15">15 min</option>
            </select>
            <select
              className="rounded-lg border border-slate-700 bg-slate-950 p-3"
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
            >
              <option>Encouraging</option>
              <option>Teaching</option>
              <option>Bold</option>
              <option>Gentle</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-lg bg-emerald-500 px-4 py-3 font-medium disabled:opacity-50"
              disabled={!canGenerate}
              onClick={handleGenerate}
            >
              {loading ? "Generating..." : "Generate Script"}
            </button>
            <button className="rounded-lg border border-indigo-300 px-4 py-3 font-medium" onClick={startCheckout}>
              Upgrade to Pro
            </button>
          </div>
        </div>
        {status && <p className="mt-3 text-sm text-slate-300">{status}</p>}
      </section>

      {result && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Generated output</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
            <p><strong>Hook:</strong> {result.hook}</p>
            <p><strong>Scripture Context:</strong> {result.scriptureContext}</p>
            <p><strong>Point 1:</strong> {result.point1.explanation} | {result.point1.illustration}</p>
            <p><strong>Point 2:</strong> {result.point2.explanation} | {result.point2.illustration}</p>
            <p><strong>Point 3:</strong> {result.point3.explanation} | {result.point3.illustration}</p>
            <p><strong>Practical Application:</strong> {result.practicalApplication}</p>
            <p><strong>Closing Prayer:</strong> {result.closingPrayer}</p>
            <p><strong>YouTube Titles:</strong> {result.youtubeTitles.join(" | ")}</p>
            <p><strong>SEO Keywords:</strong> {result.seoKeywords.join(", ")}</p>
          </div>
        </section>
      )}
    </div>
  );
}
