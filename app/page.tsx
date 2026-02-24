import { GeneratorForm } from "@/components/GeneratorForm";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <header className="mb-10 space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">SermonFlow</p>
        <h1 className="text-4xl font-bold">AI-powered YouTube sermon script builder</h1>
        <p className="text-slate-300">
          Web MVP for Christian creators: email magic-link auth, one-click script generation, and Stripe Pro upgrade.
        </p>
      </header>
      <GeneratorForm />
    </main>
  );
}
