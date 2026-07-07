export default function Home() {
  return (
    <section className="container-page flex flex-1 flex-col justify-center py-24">
      <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
        Software Engineer
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        {"Hsin-Han (Evan) Wu"}
      </h1>
      <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed">
        I build reliable software and care about getting the details right. This
        site is being rebuilt with Next.js — projects coming soon.
      </p>
    </section>
  );
}
