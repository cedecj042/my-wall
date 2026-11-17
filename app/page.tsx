import { Wall } from "@/components/wall";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#eef2f7] text-[#1c1e21]">
      <header className="border-b border-[#29487d] bg-[#3b5998] shadow-sm">
        <div className="mx-auto flex h-14 max-w-[1040px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5 text-white">
            <div className="grid size-8 place-items-center rounded bg-white text-[25px] font-black leading-none text-[#3b5998]">f</div>
            <span className="text-xl font-bold tracking-[-0.03em]">my wall</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
            <span className="hidden sm:inline">Home</span><span className="hidden h-4 w-px bg-white/25 sm:block" /><span>Profile</span>
          </div>
        </div>
      </header>

      <section className="border-b border-[#c8d0dc] bg-white">
        <div className="mx-auto flex max-w-[1040px] items-end gap-4 px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid size-16 place-items-center rounded bg-[#dce6f4] text-xl font-bold text-[#3b5998] ring-1 ring-[#c3cede]">CW</div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-[-0.025em] text-[#1d2a3a] sm:text-3xl">Cedric&apos;s Wall</h1>
            <p className="mt-1 text-sm text-[#657081]">A little corner of the internet.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1040px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:py-8">
        <aside className="hidden lg:block">
          <div className="overflow-hidden rounded-md border border-[#cfd6df] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
            <h2 className="border-b border-[#cfd6df] bg-[#f5f7fa] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#526174]">About</h2>
            <div className="space-y-3 p-4 text-sm leading-5 text-[#586477]">
              <p>Building things for the web and sharing notes along the way.</p>
              <div className="border-t border-[#e5e9ef] pt-3 text-xs">
                <p className="font-semibold text-[#32445e]">Public wall</p>
                <p className="mt-0.5 text-[#7a8494]">Everyone can read and post.</p>
              </div>
            </div>
          </div>
        </aside>
        <Wall />
      </div>

      <footer className="mx-auto max-w-[1040px] px-4 pb-8 text-center text-xs text-[#8993a1] sm:px-6">My Wall · Built with Next.js and Supabase</footer>
    </main>
  );
}
