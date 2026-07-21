// Shape every per-category seed data file must export. Keeping this
// separate (rather than reusing the Prisma types directly) means the data
// files stay plain, readable TS objects with no Prisma imports.

export type SeedDifficulty = "EASY" | "MEDIUM" | "HARD";
export type SeedContentType = "TEXT" | "CODE" | "BOTH";

export interface SeedAnswer {
  contentType: SeedContentType;
  // Required when contentType is "TEXT" or "BOTH".
  textContent?: string;
  // Required when contentType is "CODE" or "BOTH".
  codeContent?: string;
  // Required when codeContent is present, e.g. "python", "sql", "typescript",
  // "javascript", "tsx", "jsx".
  codeLanguage?: string;
}

export interface SeedQuestion {
  title: string;
  prompt: string;
  difficulty: SeedDifficulty;
  tags: string[];
  // Usually exactly one canonical answer.
  answers: SeedAnswer[];
}

export interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  icon: string;
  questions: SeedQuestion[];
}
