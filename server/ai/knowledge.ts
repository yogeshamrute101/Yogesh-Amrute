export type AlphabetLetter =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M"
  | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

export type RepresentationKind =
  | "word"
  | "number"
  | "symbol"
  | "code"
  | "meaning"
  | "energy"
  | "data"
  | "other";

export interface InformationItem {
  id: string;
  value: string;
  kind: RepresentationKind;
  letter?: AlphabetLetter;
  source?: string;
  createdAt: string;
}

export interface Bond {
  id: string;
  from: string;
  to: string;
  relation: string;
  createdAt: string;
}

export interface Bundle {
  id: string;
  members: string[];
  letter?: AlphabetLetter;
  createdAt: string;
}

export interface TraceRecord {
  id: string;
  itemId: string;
  action: "created" | "bonded" | "bundled" | "converted" | "aggregated";
  timestamp: string;
  details?: string;
}

/**
 * 0 represents the complete space/container of the system.
 *
 * The space is continuously expandable, so its current representation
 * is never treated as permanently complete.
 */
export interface ZeroSpace {
  id: "0";
  items: string[];
  bundles: string[];
  bonds: string[];
  trace: string[];
}

export const ZERO_SPACE_ID = "0";

export const ALPHABET: readonly AlphabetLetter[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createZeroSpace(): ZeroSpace {
  return {
    id: ZERO_SPACE_ID,
    items: [],
    bundles: [],
    bonds: [],
    trace: [],
  };
}
