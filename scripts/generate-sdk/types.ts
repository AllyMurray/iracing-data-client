/** ---- Input types (from your index JSON) ---- */
export type ParamType = "string" | "number" | "boolean" | "numbers";
export type ParamDef = { type: ParamType; required?: boolean; note?: string };
export type Endpoint = { link: string; parameters?: Record<string, ParamDef> };
export type Section = Record<string, Endpoint | Record<string, Endpoint>>;
export type Root = Record<string, Section>;

/** ---- Flattened endpoint type ---- */
export type Flat = {
  section: string;
  name: string;         // "league.get"
  method: string;       // "league_get"
  url: string;
  params: Record<string, ParamDef>;
  samplePath?: string;
  responseType?: string; // Generated response type name
};

export function isEndpoint(x: any): x is Endpoint {
  return x && typeof x === "object" && typeof x.link === "string";
}