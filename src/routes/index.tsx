import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Bell, Coins, Home, Search, Sparkles, Sprout, User, Users } from "lucide-react";
import { CLUBS, EMOTES, MON_BY_ID, MONS, type Post } from "@/lib/safirity/data";
import {
  loadState,
  plotPending,
  ratePerHour,
  saveState,
  totalPending,
  grantXp,
  type SafirityState,
} from "@/lib/safirity/store";
import { PokemonLand } from "@/components/community/PokemonLand";
import { FeedPost } from "@/components/community/FeedPost";
import { CollectibleCard } from "@/components/community/CollectibleCard";
import { TrainerBook } from "@/components/community/TrainerBook";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Safirity — Comunidade Pokémon com Land Idle" },
      {
        name: "description",
        content:
          "Safirity é a plataforma social de treinadores: feed com emotes de pokémon, land estilo GameBoy e farm idle de moedas.",
      },
      { property: "og:title", content: "Safirity — Comunidade Pokémon com Land Idle" },
      {
        property: "og:description",
        content: "Feed social, emotes de pokémon, land pixel-art e farm idle em uma só plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SafirityApp,
});

type Tab = "feed" | "land" | "colecao" | "perfil";

function SafirityApp() {
  const [state, setState] = useState<SafirityState | null>(null);
  const [tab, setTab] = useState<Tab>("feed");
  const [selectedMonId, setSelectedMonId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [draft, setDraft] = useState("");

  // hidratação: só lê localStorage no cliente
  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const pending = useMemo(() => (state ? totalPending(state.plots, now) : 0), [state, now]);
  const rate = useMemo(() => (state ? ratePerHour(state.plots) : 0), [state]);
  const ownedMons = useMemo(() => (state ? MONS.filter((m) => state.owned.includes(m.id)) : []), [state]);

  const harvestAll = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const ts = Date.now();
      const gain = totalPending(prev.plots, ts);
      if (gain <= 0) return prev;
      const next = grantXp(
        { ...prev, coins: prev.coins + gain, plots: prev.plots.map((p) => ({ ...p, since: ts })) },
        Math.max(1, Math.floor(gain / 10)),
      );
      toast.success(`+${gain} moedas colhidas na land!`);
      return next;
    });
  }, []);

  const plant = useCallback(
    (index: number) => {
      if (!selectedMonId) {
        toast.info("Escolha um pokémon abaixo da land primeiro.");
        return;
      }
      setState((prev) =>
        prev
          ? {
              ...prev,
              plots: prev.plots.map((p, i) => (i === index ? { ...p, monId: selectedMonId, since: Date.now() } : p)),
            }
          : prev,
      );
      toast.success(`${MON_BY_ID[selectedMonId].name} entrou no terreno ${index + 1}!`);
    },
    [selectedMonId],
  );

  const clearPlot = useCallback((index: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const ts = Date.now();
      const gain = plotPending(prev.plots, index, ts);
      return {
        ...prev,
        coins: prev.coins + gain,
        plots: prev.plots.map((p, i) => (i === index ? { ...p, monId: null, since: ts } : p)),
      };
    });
  }, []);

  const adopt = useCallback((monId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const mon = MON_BY_ID[monId];
      if (prev.owned.includes(monId) || prev.coins < mon.cost) return prev;
      toast.success(`${mon.name} adotado! Coloque na land para farmar.`);
      return grantXp({ ...prev, coins: prev.coins - mon.cost, owned: [...prev.owned, monId] }, 40);
    });
  }, []);

  const react = useCallback((postId: string, emoteId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const mine = prev.myEmotes[postId] ?? [];
      const has = mine.includes(emoteId);
      return {
        ...prev,
        posts: prev.posts.map((p) =>
          p.id === postId
            ? { ...p, emotes: { ...p.emotes, [emoteId]: Math.max(0, (p.emotes[emoteId] ?? 0) + (has ? -1 : 1)) } }
            : p,
        ),
        myEmotes: {
          ...prev.myEmotes,
          [postId]: has ? mine.filter((e) => e !== emoteId) : [...mine, emoteId],
        },
      };
    });
  }, []);

  const publish = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setState((prev) => {
      if (!prev) return prev;
      const post: Post = {
        id: `me-${Date.now()}`,
        trainer: prev.trainer,
        level: prev.level,
        time: "agora",
        content: text,
        monId: prev.plots.find((p) => p.monId)?.monId ?? prev.owned[0],
        emotes: {},
        comments: 0,
      };
      return grantXp({ ...prev, posts: [post, ...prev.posts] }, 25);
    });
    setDraft("");
    toast.success("Publicado no feed da comunidade!");
  }, [draft]);

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0510] font-mono text-xs uppercase tracking-widest text-purple-300">
        Carregando Safirity...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0510] text-slate-100 selection:bg-purple-500/30">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-purple-900/25 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-900/25 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 flex-col border-r border-white/5 p-6 md:flex">
          <h1 className="mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-2xl font-black tracking-tighter text-transparent">
            SAFIRITY
          </h1>
          <nav className="flex-1 space-y-1">
            <NavItem icon={<Home size={20} />} label="Feed" active={tab === "feed"} onClick={() => setTab("feed")} />
            <NavItem icon={<Sprout size={20} />} label="Land" active={tab === "land"} onClick={() => setTab("land")} />
            <NavItem
              icon={<Sparkles size={20} />}
              label="Coleção"
              active={tab === "colecao"}
              onClick={() => setTab("colecao")}
            />
            <NavItem icon={<User size={20} />} label="Perfil" active={tab === "perfil"} onClick={() => setTab("perfil")} />
          </nav>
          <div className="mt-auto rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-300">
              <Coins size={14} /> {state.coins.toLocaleString("pt-BR")}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-amber-200/60">{Math.round(rate)} moedas/hora</p>
          </div>
        </aside>

        {/* Conteúdo */}
        <main className="min-w-0 flex-1 border-r border-white/5">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[#0a0510]/85 px-5 py-4 backdrop-blur-xl">
            <h2 className="text-lg font-bold capitalize">{tabTitle(tab)}</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={harvestAll}
                className="flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-amber-300 transition-colors hover:bg-amber-300/20"
              >
                <Coins size={14} /> {pending}
              </button>
              <Bell size={18} className="text-slate-400" />
            </div>
          </header>

          <div className="space-y-6 p-4 pb-28 md:pb-6">
            {tab === "feed" && (
              <>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    placeholder="Conte sua conquista na land..."
                    className="w-full resize-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1">
                      {EMOTES.map((e) => (
                        <img
                          key={e.id}
                          src={e.sprite}
                          alt={e.label}
                          className="h-6 w-6 object-contain opacity-70"
                          style={{ imageRendering: "pixelated" }}
                          loading="lazy"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={publish}
                      disabled={!draft.trim()}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-[11px] font-black uppercase tracking-widest disabled:opacity-40"
                    >
                      Publicar
                    </button>
                  </div>
                </div>

                {state.posts.map((post) => (
                  <FeedPost key={post.id} post={post} myEmotes={state.myEmotes[post.id] ?? []} onEmote={react} />
                ))}
              </>
            )}

            {tab === "land" && (
              <>
                <PokemonLand
                  plots={state.plots}
                  now={now}
                  ownedMons={ownedMons}
                  selectedMonId={selectedMonId}
                  onSelectMon={setSelectedMonId}
                  onPlant={plant}
                  onClearPlot={clearPlot}
                  onHarvestAll={harvestAll}
                  pending={pending}
                />
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
                  <h3 className="mb-2 text-xs font-black uppercase tracking-widest text-purple-300">Como farmar</h3>
                  <ul className="list-inside list-disc space-y-1 text-slate-400">
                    <li>Escolha um pokémon e clique num terreno para plantar.</li>
                    <li>Vizinhos do mesmo tipo geram +25% de bônus cada.</li>
                    <li>A produção acumula offline até 8 horas.</li>
                    <li>Colha para ganhar moedas e XP de treinador.</li>
                  </ul>
                </div>
              </>
            )}

            {tab === "colecao" && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {MONS.map((mon) => (
                  <CollectibleCard
                    key={mon.id}
                    mon={mon}
                    owned={state.owned.includes(mon.id)}
                    canAfford={state.coins >= mon.cost}
                    onAdopt={adopt}
                  />
                ))}
              </div>
            )}

            {tab === "perfil" && (
              <>
                <TrainerBook state={state} rate={rate} />
                <div className="grid grid-cols-3 gap-3">
                  {ownedMons.map((mon) => (
                    <div
                      key={mon.id}
                      className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      <img
                        src={mon.sprite}
                        alt={mon.name}
                        className="h-16 w-16 object-contain"
                        style={{ imageRendering: "pixelated" }}
                        loading="lazy"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{mon.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>

        {/* Widgets */}
        <aside className="sticky top-0 hidden h-screen w-72 space-y-5 overflow-y-auto p-6 lg:flex lg:flex-col">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Clubes em destaque</h3>
            <div className="space-y-3">
              {CLUBS.map((club) => (
                <div key={club.name} className="flex items-center gap-3">
                  <span className={cn("h-2 w-2 rounded-full", club.color.replace("text-", "bg-"))} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-200">{club.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">{club.members} membros</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <Users size={12} /> Treinadores online
            </h3>
            <div className="flex flex-wrap gap-2">
              {MONS.slice(0, 6).map((mon) => (
                <img
                  key={mon.id}
                  src={mon.sprite}
                  alt={mon.name}
                  className="h-9 w-9 rounded-full border border-white/10 bg-slate-900 object-contain p-1"
                  style={{ imageRendering: "pixelated" }}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <Search size={12} /> Buscar
            </h3>
            <input
              placeholder="Treinadores, clubes, dicas"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs outline-none placeholder:text-slate-600"
            />
          </div>
        </aside>

        {/* Nav mobile */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/5 bg-[#0a0510]/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <MobileItem icon={<Home size={22} />} active={tab === "feed"} onClick={() => setTab("feed")} />
          <MobileItem icon={<Sprout size={22} />} active={tab === "land"} onClick={() => setTab("land")} />
          <MobileItem icon={<Sparkles size={22} />} active={tab === "colecao"} onClick={() => setTab("colecao")} />
          <MobileItem icon={<User size={22} />} active={tab === "perfil"} onClick={() => setTab("perfil")} />
        </nav>
      </div>
    </div>
  );
}

function tabTitle(tab: Tab) {
  return tab === "feed" ? "Feed social" : tab === "land" ? "Minha land" : tab === "colecao" ? "Coleção" : "Perfil";
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all",
        active ? "border border-white/5 bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
      )}
    >
      <span className={active ? "text-purple-400" : ""}>{icon}</span>
      {label}
    </button>
  );
}

function MobileItem({ icon, active, onClick }: { icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("p-2 transition-all", active ? "scale-110 text-purple-400" : "text-slate-500")}
    >
      {icon}
    </button>
  );
}
