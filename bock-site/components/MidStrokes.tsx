export default function TopStrokes() {
  return (
    <div className="col-span-12">
      <div className="relative h-[3px] grid grid-cols-12 gap-x-4">
        {/* MOBILE: solo dos bloques de 6 columnas */}
        <div className="block md:hidden col-span-6 bg-[var(--accent)] h-full" />
        <div className="block md:hidden col-span-6 bg-[var(--accent)] h-full" />

        {/* DESKTOP: strokes separados */}
        <div className="hidden md:block md:col-start-1  md:col-span-2 bg-[var(--accent)] h-full" />
        <div className="hidden md:block md:col-start-3  md:col-span-2 bg-[var(--accent)] h-full" />
        <div className="hidden md:block md:col-start-5  md:col-span-2 bg-[var(--accent)] h-full" />
        <div className="hidden md:block md:col-start-7  md:col-span-2 bg-[var(--accent)] h-full" />

        {/* Siempre visible (opcional ocultar en mobile si querés) */}
        <div className="absolute right-0 top-0 w-[7px] h-full bg-[var(--accent)]" />
      </div>
    </div>
  );
}
