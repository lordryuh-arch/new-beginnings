import { MessageSquare, Share2, Bookmark } from "lucide-react";
import { EMOTES, MON_BY_ID, RARITY_STYLE, type Post } from "@/lib/safirity/data";
import { cn } from "@/lib/utils";

type Props = {
  post: Post;
  myEmotes: string[];
  onEmote: (postId: string, emoteId: string) => void;
};

export function FeedPost({ post, myEmotes, onEmote }: Props) {
  const mon = post.monId ? MON_BY_ID[post.monId] : null;
  const rarity = mon ? RARITY_STYLE[mon.rarity] : null;

  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
      {post.badge && (
        <span className="absolute right-0 top-0 rounded-bl-xl border-b border-l border-amber-300/25 bg-amber-300/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300">
          {post.badge}
        </span>
      )}

      <header className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-xs font-bold">
            {post.trainer.slice(0, 1)}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{post.trainer}</span>
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">
              Nv {post.level}
            </span>
          </div>
          <span className="text-xs text-slate-500">{post.time}</span>
        </div>
      </header>

      <p className="mb-4 text-[15px] leading-relaxed text-slate-200">{post.content}</p>

      {mon && (
        <div
          className={cn(
            "relative mb-4 flex items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br p-6",
            rarity?.ring,
            rarity?.glow,
          )}
        >
          <img
            src={mon.sprite}
            alt={mon.name}
            className="h-32 w-32 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]"
            style={{ imageRendering: "pixelated" }}
            loading="lazy"
          />
          <span className="absolute bottom-2 left-3 text-[10px] font-black uppercase tracking-widest text-white/70">
            {mon.name} · {rarity?.label}
          </span>
        </div>
      )}

      {/* Emotes de pokémon */}
      <div className="flex flex-wrap items-center gap-2">
        {EMOTES.map((emote) => {
          const count = post.emotes[emote.id] ?? 0;
          const mine = myEmotes.includes(emote.id);
          return (
            <button
              key={emote.id}
              type="button"
              onClick={() => onEmote(post.id, emote.id)}
              title={emote.label}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-bold transition-all active:scale-95",
                mine
                  ? "border-purple-400/60 bg-purple-500/20 text-purple-200"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-slate-200",
              )}
            >
              <img
                src={emote.sprite}
                alt={emote.label}
                className="h-5 w-5 object-contain"
                style={{ imageRendering: "pixelated" }}
                loading="lazy"
              />
              {count > 0 && <span>{count}</span>}
            </button>
          );
        })}
      </div>

      <footer className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-slate-400">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-xs font-bold">
            <MessageSquare size={16} /> {post.comments}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold">
            <Share2 size={16} /> Compartilhar
          </span>
        </div>
        <Bookmark size={16} />
      </footer>
    </article>
  );
}
