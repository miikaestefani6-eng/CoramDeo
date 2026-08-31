export function CoramLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C4A47C]/30 bg-[#C4A47C]/10 text-[#C4A47C]">
        <span className="text-xl" aria-hidden="true">✦</span>
      </div>
      {!compact && (
        <div>
          <div className="font-serif text-lg font-bold tracking-wide text-white">Coram Deo</div>
          <div className="text-[10px] text-white/55">Aprendizagem cristã e discipulado</div>
        </div>
      )}
    </div>
  );
}
