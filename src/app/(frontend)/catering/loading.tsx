export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white dark:bg-[#042430]">
      <div className="relative flex flex-col items-center">
        {/* Spinner elegante (Socado style: Terra y Azul) */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-black/10 border-t-[#b45b38] dark:border-white/10 dark:border-t-[#b45b38]" />
        <p className="mt-6 font-outfit text-sm lowercase tracking-widest text-[#063547] dark:text-[#f2eae6]">
          Preparando tu experiencia...
        </p>
      </div>
    </div>
  );
}
