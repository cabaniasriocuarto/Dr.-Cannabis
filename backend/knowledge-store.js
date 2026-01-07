import crypto from "crypto";
import path from "path";
import Database from "better-sqlite3";

const DEFAULT_STOPWORDS = new Set([
  "a",
  "al",
  "algo",
  "algunas",
  "algunos",
  "ante",
  "antes",
  "como",
  "con",
  "contra",
  "cual",
  "cuando",
  "de",
  "del",
  "desde",
  "donde",
  "dos",
  "el",
  "ella",
  "ellas",
  "ellos",
  "en",
  "era",
  "erais",
  "eran",
  "eras",
  "eres",
  "es",
  "esa",
  "esas",
  "ese",
  "eso",
  "esos",
  "esta",
  "estaba",
  "estaban",
  "estado",
  "estais",
  "estamos",
  "estan",
  "estar",
  "estas",
  "este",
  "esto",
  "estos",
  "estoy",
  "fin",
  "fue",
  "fueron",
  "fui",
  "fuimos",
  "ha",
  "hace",
  "haces",
  "haciendo",
  "han",
  "hasta",
  "hay",
  "la",
  "las",
  "le",
  "les",
  "lo",
  "los",
  "me",
  "mi",
  "mis",
  "mucho",
  "muy",
  "no",
  "nos",
  "nosotros",
  "o",
  "os",
  "otra",
  "otro",
  "para",
  "pero",
  "poco",
  "por",
  "porque",
  "que",
  "se",
  "sea",
  "ser",
  "si",
  "sin",
  "sobre",
  "son",
  "su",
  "sus",
  "tambien",
  "tan",
  "te",
  "tengo",
  "ti",
  "tiene",
  "tienen",
  "todo",
  "tu",
  "tus",
  "un",
  "una",
  "uno",
  "unos",
  "vos",
  "y",
  "ya"
]);

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function normalizeToken(token) {
  return token
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function tokenize(text) {
  if (!text) return [];
  return text
    .split(/\s+/g)
    .map(normalizeToken)
    .filter((token) => token && !DEFAULT_STOPWORDS.has(token));
}

function chunkPrompt(promptText, maxChunkChars = 900) {
  const lines = (promptText || "").split(/\r?\n/);
  const sections = [];
  let currentTitle = "Introducción";
  let buffer = [];

  const flushBuffer = () => {
    if (!buffer.length) return;
    const content = buffer.join("\n").trim();
    if (!content) {
      buffer = [];
      return;
    }
    if (content.length <= maxChunkChars) {
      sections.push({ title: currentTitle, content });
      buffer = [];
      return;
    }

    const paragraphs = content.split(/\n{2,}/g);
    let chunk = "";
    paragraphs.forEach((paragraph) => {
      const next = chunk ? `${chunk}\n\n${paragraph}` : paragraph;
      if (next.length > maxChunkChars && chunk) {
        sections.push({ title: currentTitle, content: chunk.trim() });
        chunk = paragraph;
      } else {
        chunk = next;
      }
    });
    if (chunk.trim()) {
      sections.push({ title: currentTitle, content: chunk.trim() });
    }
    buffer = [];
  };

  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushBuffer();
      currentTitle = headingMatch[2].trim();
      return;
    }
    buffer.push(line);
  });
  flushBuffer();

  return sections.filter((section) => section.content.trim().length > 0);
}

function buildIndex(entries) {
  const docTermCounts = [];
  const df = new Map();

  entries.forEach((entry) => {
    const tokens = tokenize(`${entry.title} ${entry.content}`);
    const termCounts = new Map();
    tokens.forEach((token) => {
      termCounts.set(token, (termCounts.get(token) || 0) + 1);
    });
    termCounts.forEach((_count, term) => {
      df.set(term, (df.get(term) || 0) + 1);
    });
    docTermCounts.push(termCounts);
  });

  const docCount = entries.length || 1;
  const idf = new Map();
  df.forEach((count, term) => {
    idf.set(term, Math.log((docCount + 1) / (count + 1)) + 1);
  });

  const vectors = docTermCounts.map((termCounts) => {
    const vector = new Map();
    termCounts.forEach((count, term) => {
      const weight = (count / termCounts.size) * (idf.get(term) || 0);
      vector.set(term, weight);
    });
    return vector;
  });

  return { idf, vectors };
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;
  a.forEach((value, key) => {
    aNorm += value * value;
    if (b.has(key)) {
      dot += value * (b.get(key) || 0);
    }
  });
  b.forEach((value) => {
    bNorm += value * value;
  });
  if (!aNorm || !bNorm) return 0;
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
}

function buildQueryVector(query, idf) {
  const tokens = tokenize(query);
  const counts = new Map();
  tokens.forEach((token) => {
    counts.set(token, (counts.get(token) || 0) + 1);
  });
  const vector = new Map();
  counts.forEach((count, term) => {
    const weight = (count / counts.size) * (idf.get(term) || 0);
    if (weight > 0) {
      vector.set(term, weight);
    }
  });
  return vector;
}

export function createKnowledgeStore({
  dbPath,
  promptText,
  maxChunkChars = 900
}) {
  const resolvedPath = dbPath || path.join(process.cwd(), "dr-cannabis.db");
  const db = new Database(resolvedPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS knowledge (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      source TEXT NOT NULL,
      token_count INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  const promptHash = sha256(promptText || "");
  const storedHash = db
    .prepare("SELECT value FROM meta WHERE key = ?")
    .get("prompt_hash");

  if (!storedHash || storedHash.value !== promptHash) {
    const chunks = chunkPrompt(promptText || "", maxChunkChars);
    const insert = db.prepare(
      "INSERT INTO knowledge (title, content, source, token_count) VALUES (?, ?, ?, ?)"
    );
    const remove = db.prepare("DELETE FROM knowledge");
    const setMeta = db.prepare(
      "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)"
    );

    const transaction = db.transaction(() => {
      remove.run();
      chunks.forEach((chunk) => {
        insert.run(
          chunk.title,
          chunk.content,
          "prompt",
          tokenize(chunk.content).length
        );
      });
      setMeta.run("prompt_hash", promptHash);
      setMeta.run("knowledge_updated", new Date().toISOString());
    });

    transaction();
  }

  const rows = db
    .prepare("SELECT id, title, content, source FROM knowledge")
    .all();

  const { idf, vectors } = buildIndex(rows);

  return {
    dbPath: resolvedPath,
    entryCount: rows.length,
    search(query, { limit = 4, minScore = 0.08, maxChars = 1800 } = {}) {
      if (!query || !rows.length) return "";
      const queryVector = buildQueryVector(query, idf);
      if (!queryVector.size) return "";

      const scored = rows
        .map((row, index) => ({
          row,
          score: cosineSimilarity(queryVector, vectors[index])
        }))
        .filter((item) => item.score >= minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      let assembled = "";
      for (const item of scored) {
        const block = `### ${item.row.title}\n${item.row.content}`.trim();
        if ((assembled + "\n\n" + block).trim().length > maxChars) {
          break;
        }
        assembled = assembled ? `${assembled}\n\n${block}` : block;
      }
      return assembled.trim();
    }
  };
}
