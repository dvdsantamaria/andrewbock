export default function TopStrokes() {
  return (
    <div className="col-span-12">
      <div className="relative h-[3px] grid grid-cols-12 gap-x-4">
        {/* 2 columnas a la izquierda */}
        <div className="col-start-1  col-span-2  bg-[var(--accent)] h-full" />
        {/* tramo central largo */}
        <div className="col-start-3  col-span-4  bg-[var(--accent)] h-full" />
        {/* tramo corto antes del margen derecho */}
        <div className="col-start-5 col-span-6 bg-[var(--accent)] h-full" />

        <div className="col-start-7 col-span-8 bg-[var(--accent)] h-full" />

        <div className="absolute right-0 top-0 w-[7px] h-full bg-[var(--accent)]" />
      </div>
    </div>
  );
}
