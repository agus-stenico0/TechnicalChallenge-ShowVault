import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useShows, type Show } from "../hooks/useShows";

export const BrowsePage = () => {

    function stripHtml(html: string | null): string {
        if (!html) return "";
        return html.replace(/<[^>]+>/g, "");
    }

    function ShowCard({ show }: { show: Show }) {
        const rating = show.rating.average;

        return (
            <article className="flex gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                {show.image ? (
                    <img
                        src={show.image.medium}
                        alt={show.name}
                        className="w-14 h-20 object-cover rounded-lg shrink-0"
                    />
                ) : (
                    <div className="w-14 h-20 rounded-lg shrink-0 bg-white/10 flex items-center justify-center text-2xl">
                        📺
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                    <h2 className="text-sm font-medium text-white leading-snug">
                        {show.name}
                    </h2>
                    {rating !== null && (
                        <span className="text-xs text-yellow-400 shrink-0">
                            ★ {rating.toFixed(1)}
                        </span>
                    )}
                </div>

                {show.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {show.genres.map((g) => (
                            <span
                                key={g}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 border border-white/10"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                )}

                {show.summary && (
                    <p className="mt-1.5 text-xs text-white/50 leading-relaxed line-clamp-2">
                        {stripHtml(show.summary)}
                    </p>
                )}
            </div>
            </article>
        )
    }

    function SkeletonCard({ opacity }: { opacity: number }) {
        return (
            <div
                className="h-24 rounded-xl border border-white/10 bg-white/5 animate-pulse"
                style={{ opacity }}
            />
        )
    }

    const [searchParams, setSearchParams] = useSearchParams()

    // Leer la URL como fuente de verdad
    const inputValue = searchParams.get("q") ?? "";
    const activeGenre = searchParams.get("genre") ?? "";

    // Debounce del query antes de pasarlo al hook (evita un request por tecla)
    const debouncedSearch = useDebounce(inputValue, 350);

    const asyncState = useShows({ search: debouncedSearch });

    // Derivar géneros únicos de los shows cargados (solo cuando cambian los datos)
    const genres = useMemo<string[]>(() => {
        if (asyncState.status !== "success") return [];
        const set = new Set<string>();
        for (const show of asyncState.data) {
        for (const g of show.genres) set.add(g);
        }
        return Array.from(set).sort();
    }, [asyncState]);

    
    const shows = useMemo<Show[]>(() => {
        if (asyncState.status !== "success") return [];
        if (!activeGenre) return asyncState.data;
        return asyncState.data.filter((s) => s.genres.includes(activeGenre));
    }, [asyncState, activeGenre]);

    
    function setParam(key: string, value: string) {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (value) next.set(key, value);
                else next.delete(key);
                return next;
            },
            { replace: true }
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="max-w-2xl mx-auto px-4 py-10">

                {/* ── Header ── */}
                <h1 className="text-2xl font-medium tracking-tight mb-6">Shows</h1>

                {/* ── Buscador ── */}
                <div className="relative mb-4">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-sm">
                        🔍
                    </span>
                    <input
                        type="search"
                        placeholder="Breaking Bad, Westworld…"
                        value={inputValue}
                        onChange={(e) => setParam("q", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder:text-white/30 text-white focus:outline-none focus:border-white/30 transition-colors"
                    />
                        {/* Indicador de debounce pendiente */}
                        {inputValue !== debouncedSearch && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                        )}
                </div>

                {/* ── Chips de género (solo cuando hay datos) ── */}
                {genres.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-6">
                        <button
                            onClick={() => setParam("genre", "")}
                            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                                !activeGenre
                                ? "bg-white text-neutral-900 border-white"
                                : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
                            }`}
                        >
                            Todo
                        </button>
                        {genres.map((g) => (
                            <button
                                key={g}
                                onClick={() => setParam("genre", g === activeGenre ? "" : g)}
                                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                                g === activeGenre
                                    ? "bg-white text-neutral-900 border-white"
                                    : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Estados ── */}
                {asyncState.status === "loading" && (
                    <div className="flex flex-col gap-2.5" aria-busy="true">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <SkeletonCard key={i} opacity={1 - i * 0.1} />
                        ))}
                    </div>
                )}

                {asyncState.status === "error" && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                        Error: {asyncState.error.message}
                    </p>
                )}

                {asyncState.status === "success" && shows.length === 0 && (
                    <div className="text-center py-20 text-white/30">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="text-sm">
                            {inputValue
                                ? `Sin resultados para "${inputValue}"`
                                : "No hay shows disponibles"}
                        </p>
                    </div>
                )}

                {asyncState.status === "success" && shows.length > 0 && (
                    <>
                        <p className="text-xs text-white/30 mb-3">
                            {shows.length} {shows.length === 1 ? "resultado" : "resultados"}
                            {activeGenre && (
                                <span> · <span className="text-white/50">{activeGenre}</span></span>
                            )}
                        </p>
                        <div className="flex flex-col gap-2.5">
                            {shows.map((show) => (
                                <ShowCard key={show.id} show={show} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
