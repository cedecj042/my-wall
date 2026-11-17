"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

type Post = { id: string; body: string; created_at: string };
const MAX_LENGTH = 280;

function formatDate(value: string) {
  const date = new Date(value);
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric" }).format(date);
}

export function Wall() {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    const { data, error: loadError } = await supabase.from("posts").select("id, body, created_at").order("created_at", { ascending: false });
    if (loadError) setError("We couldn’t load the wall. Please try again.");
    else { setPosts((data ?? []) as Post[]); setError(null); }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => void loadPosts(), 0);
    const channel = supabase.channel("public-posts").on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
      const post = payload.new as Post;
      setPosts((current) => current.some((item) => item.id === post.id) ? current : [post, ...current]);
    }).subscribe();
    return () => {
      window.clearTimeout(loadTimer);
      void supabase.removeChannel(channel);
    };
  }, [loadPosts, supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = message.trim();
    if (!body || body.length > MAX_LENGTH || isSharing) return;
    setIsSharing(true); setError(null);
    const { data, error: insertError } = await supabase.from("posts").insert({ body }).select("id, body, created_at").single();
    if (insertError) setError("Your post wasn’t shared. Please try again.");
    else if (data) {
      const post = data as Post;
      setPosts((current) => current.some((item) => item.id === post.id) ? current : [post, ...current]);
      setMessage("");
    }
    setIsSharing(false);
  }

  const remaining = MAX_LENGTH - message.length;
  return (
    <section aria-label="Wall posts" className="min-w-0">
      <form onSubmit={handleSubmit} className="overflow-hidden rounded-md border border-[#b8c3d1] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.07)]">
        <div className="flex items-center gap-2 border-b border-[#b8c3d1] bg-[#4c6da8] px-4 py-2.5 text-sm font-bold text-white"><PencilIcon />Write something...</div>
        <div className="p-4">
          <label htmlFor="wall-message" className="sr-only">Write a post</label>
          <textarea id="wall-message" value={message} maxLength={MAX_LENGTH} rows={4} placeholder="What's on your mind?" onChange={(event) => setMessage(event.target.value)} className="w-full resize-none rounded-sm border border-[#b8c3d1] bg-white px-3.5 py-3 text-[15px] leading-6 text-[#253247] outline-none placeholder:text-[#929aa6] focus:border-[#5b77a5] focus:ring-2 focus:ring-[#d7e1f0]" />
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className={`text-xs tabular-nums ${remaining <= 20 ? "font-semibold text-[#b64949]" : "text-[#858e9b]"}`} aria-live="polite">{remaining} characters left</span>
            <button type="submit" disabled={!message.trim() || isSharing} className="min-w-20 rounded-sm border border-[#29487d] bg-[#4267a9] px-5 py-2 text-sm font-bold text-white shadow-[inset_0_1px_rgb(255_255_255/0.16)] transition hover:bg-[#365899] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4267a9] disabled:cursor-not-allowed disabled:border-[#aab1bc] disabled:bg-[#c9ced6]">{isSharing ? "Sharing…" : "Share"}</button>
          </div>
        </div>
      </form>

      {error && <div role="alert" className="mt-4 flex items-center justify-between gap-3 rounded-md border border-[#e0b9b9] bg-[#fff5f5] px-4 py-3 text-sm text-[#8c3434]"><span>{error}</span><button type="button" onClick={() => void loadPosts()} className="shrink-0 font-bold underline underline-offset-2">Retry</button></div>}

      <div className="mb-3 mt-6 flex items-center justify-between">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#536174]">Recent posts</h2>
        {!isLoading && <span className="text-xs text-[#8a94a2]">{posts.length} {posts.length === 1 ? "post" : "posts"}</span>}
      </div>
      <div className="space-y-3">
        {isLoading ? <LoadingPosts /> : posts.length === 0 ? <EmptyState /> : posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </section>
  );
}

function PostCard({ post }: { post: Post }) {
  return <article className="rounded-md border border-[#d0d7e0] bg-white p-4 shadow-[0_1px_2px_rgb(0_0_0/0.045)] sm:p-5"><div className="flex gap-3.5"><div className="grid size-10 shrink-0 place-items-center rounded bg-[#dce6f4] text-sm font-bold text-[#3b5998] ring-1 ring-[#c3cede]">CW</div><div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-2"><h3 className="text-sm font-bold text-[#3b5998]">Cedric</h3><time dateTime={post.created_at} className="text-xs text-[#8993a1]">{formatDate(post.created_at)}</time></div><p className="mt-1.5 whitespace-pre-wrap break-words text-[15px] leading-6 text-[#273244]">{post.body}</p></div></div></article>;
}

function LoadingPosts() {
  return <div aria-label="Loading posts" className="space-y-3">{[0, 1].map((item) => <div key={item} className="animate-pulse rounded-md border border-[#d8dee7] bg-white p-5"><div className="flex gap-3.5"><div className="size-10 rounded bg-[#e6eaf0]" /><div className="flex-1 pt-1"><div className="h-3 w-28 rounded bg-[#e2e7ee]" /><div className="mt-3 h-3 w-full rounded bg-[#edf0f4]" /><div className="mt-2 h-3 w-2/3 rounded bg-[#edf0f4]" /></div></div></div>)}</div>;
}

function EmptyState() {
  return <div className="rounded-md border border-dashed border-[#c7d0dc] bg-white/70 px-6 py-12 text-center"><div className="mx-auto mb-3 grid size-11 place-items-center rounded-full bg-[#e5ebf4] text-[#526f9e]"><MessageIcon /></div><p className="font-semibold text-[#34445a]">The wall is quiet</p><p className="mt-1 text-sm text-[#7b8695]">Be the first to leave a message.</p></div>;
}

function PencilIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 fill-current"><path d="M14.7 2.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-9.8 9.8-4.1.9.9-4.1 10-9.6Zm-9 10.4-.3 1.4 1.4-.3 8.8-8.8-1.1-1.1-8.8 8.8Z" /></svg>; }
function MessageIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 fill-current"><path d="M3 3h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H8l-4.4 3.3A1 1 0 0 1 2 16.5V4a1 1 0 0 1 1-1Zm2 4v1h10V7H5Zm0 3v1h7v-1H5Z" /></svg>; }
