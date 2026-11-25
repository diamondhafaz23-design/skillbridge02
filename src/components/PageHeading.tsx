export function PageHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="bg-hero text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl opacity-80">{text}</p>
      </div>
    </section>
  );
}
