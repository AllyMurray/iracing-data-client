import { z } from "zod-mini";

/** Lightweight client with presigned-link following and caching */
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface IRacingClientOptions {
  headers?: Record<string, string>; // e.g. Cookie for iRacing
  fetchFn?: FetchLike;              // uses global fetch by default
}

type ExpiringLink = { link: string; expires?: string };
type CacheEntry = { data: unknown; expiresAt: number };

export class IRacingClient {
  private fetchFn: FetchLike;
  private headers?: Record<string, string>;
  private expiringCache = new Map<string, CacheEntry>();

  constructor(opts: IRacingClientOptions = {}) {
    this.fetchFn = opts.fetchFn ?? (globalThis as any).fetch;
    if (!this.fetchFn) throw new Error("No fetch available. Pass fetchFn in IRacingClientOptions.");
    this.headers = opts.headers;
  }

  private toQuery(params: Record<string, any>) {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(params || {})) {
      if (v == null) continue;
      if (Array.isArray(v)) usp.set(k, v.join(","));
      else if (typeof v === "boolean") usp.set(k, v ? "true" : "false");
      else usp.set(k, String(v));
    }
    const s = usp.toString();
    return s ? "?" + s : "";
  }

  async get<T = unknown>(url: string, params?: Record<string, any>): Promise<T> {
    // Convert camelCase params back to snake_case for the API
    const apiParams = this.mapParamsToApi(params);
    const q = this.toQuery(apiParams || {});
    const res = await this.fetchFn(url + q, { headers: this.headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json() as Promise<T>;
    return res.text() as unknown as T;
  }
  
  private mapParamsToApi(params?: Record<string, any>): Record<string, any> | undefined {
    if (!params) return undefined;
    const mapped: Record<string, any> = {};
    for (const [key, value] of Object.entries(params)) {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/[A-Z]/g, m => "_" + m.toLowerCase());
      mapped[snakeKey] = value;
    }
    return mapped;
  }

  private async getExpiring<T = unknown>(url: string, params?: Record<string, any>): Promise<T> {
    const apiParams = this.mapParamsToApi(params);
    const cacheKey = url + this.toQuery(apiParams || {});
    const cached = this.expiringCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data as T;
    }

    const linkData = await this.get<ExpiringLink>(url, params);
    if (!linkData?.link) throw new Error("No presigned link received");

    const data = await this.get<T>(linkData.link);
    
    if (linkData.expires) {
      const exp = new Date(linkData.expires).getTime() - 60_000;
      this.expiringCache.set(cacheKey, { data, expiresAt: exp });
    }
    
    return data;
  }
}
