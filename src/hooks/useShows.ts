import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Show {
  id: number
  name: string
  genres: string[]
  rating: { average: number | null }
  image: { medium: string; original: string } | null
  summary: string | null
  status: string
  premiered: string | null
  network: { name: string } | null
}

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error }

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShows({ search }: { search: string }): AsyncState<Show[]> {
  const [state, setState] = useState<AsyncState<Show[]>>({ status: "idle" })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const fetchShows = async () => {
      setState({ status: "loading" })

        try {
            const url = search.trim()
            ? `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(search)}`
            : `https://api.tvmaze.com/shows?page=0`

            const res = await fetch(url, { signal })

            if (!res.ok) {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`)
            }

            const json = await res.json()

            // El endpoint de búsqueda devuelve { score, show }[]
            // El endpoint de listado devuelve Show[]
            const shows: Show[] = search.trim()
            ? json.map((entry: { score: number; show: Show }) => entry.show)
            : json

            setState({ status: "success", data: shows })
        } catch (err) {
            // El AbortError no es un error real — el usuario simplemente escribió más
            if ((err as Error).name === "AbortError") return

            setState({ status: "error", error: err as Error })
        }
    }

    fetchShows()

    return () => {
      controller.abort()
    }
  }, [search])

  return state
}