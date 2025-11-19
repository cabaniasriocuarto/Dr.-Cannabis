// backend/dr-cannabis-backend.js
// Backend local para Dr. Cannabis -Fertilizer-IA-
// - Expone POST http://localhost:17850/api/dr-cannabis/query
// - Lee Prompt Maestro desde dr-cannabis-prompt.md
// - Llama a un modelo LLM local (por ejemplo Ollama) vía HTTP
// - Devuelve siempre { short, full }

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

// =========================
// CONFIGURACIÓN
// =========================
const PORT = process.env.DR_CANNABIS_PORT || 17850;
// URL del servidor LLM local (por ejemplo, Ollama)
const LLM_URL = process.env.DR_CANNABIS_LLM_URL || "http://localhost:11434/api/chat";
// Nombre del modelo local (por ejemplo: "llama3.1", "mistral", etc.)
const MODEL_NAME = process.env.DR_CANNABIS_MODEL || "llama3.1";

// Ruta de Prompt Maestro
const PROMPT_PATH = path.join(__dirname, "dr-cannabis-prompt.md");
let BASE_PROMPT = "";
try {
  BASE_PROMPT = fs.readFileSync(PROMPT_PATH, "utf8");
  console.log("[DrCannabis] Prompt Maestro cargado desde:", PROMPT_PATH);
} catch (err) {
  console.error("[DrCannabis] ERROR: no pude leer dr-cannabis-prompt.md. Verificá la ruta.");
}

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// =========================
// HELPERS
// =========================

function safeNumber(v) {
  if (typeof v === "number") return v;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Construye el system prompt combinando:
 * - Prompt Maestro base
 * - Contexto actual de la app Dr. Cannabis -Fertilizer-IA-
 * - Instrucción de formato de salida JSON { short, full }
 */
function buildSystemPrompt(appContext = {}) {
  const {
    stageKey,
    stageName,
    volume: volume_L,
    tolPct,
    waterEC,
    waterPH,
    targetPH,
    tdsScale,
    targets,
    currentPPM,
    derivedPPM,
    ecTotal,
    tdsMix,
    sector,
    sectors,
  } = appContext || {};

  const ctxLines = [];

  ctxLines.push("[CONTEXTO ACTUAL DE LA APLICACIÓN DR. CANNABIS -FERTILIZER-IA-]");

  if (stageName || stageKey) {
    ctxLines.push(
      `- Etapa fenológica actual: ${stageName || "(sin nombre)"} (clave interna: ${
        stageKey || "(sin clave)"
      })`
    );
  }

  if (safeNumber(volume_L) !== undefined) {
    ctxLines.push(`- Volumen efectivo de solución nutritiva: ${volume_L} L`);
  }

  if (safeNumber(waterEC) !== undefined) {
    ctxLines.push(`- EC del agua de partida: ${waterEC} mS/cm`);
  }

  if (safeNumber(waterPH) !== undefined) {
    ctxLines.push(`- pH del agua de partida: ${waterPH}`);
  }

  if (safeNumber(targetPH) !== undefined) {
    ctxLines.push(`- pH objetivo configurado: ${targetPH}`);
  }

  if (safeNumber(tdsScale) !== undefined) {
    ctxLines.push(`- Escala TDS del medidor: ${tdsScale} (NaCl/442/KCl)`);
  }

  if (safeNumber(tolPct) !== undefined) {
    ctxLines.push(`- Tolerancia configurada sobre el objetivo: ±${tolPct}%`);
  }

  if (safeNumber(ecTotal) !== undefined) {
    ctxLines.push(`- EC total estimada (agua + fertilizantes): ${ecTotal} mS/cm`);
  }

  if (safeNumber(tdsMix) !== undefined) {
    ctxLines.push(`- TDS estimado de la mezcla: ${Math.round(tdsMix)} ppm`);
  }

  if (targets && typeof targets === "object") {
    ctxLines.push("- Objetivos aproximados de nutrientes (ppm) por etapa actual:");
    ctxLines.push(JSON.stringify(targets));
  }

  if (currentPPM && typeof currentPPM === "object") {
    ctxLines.push("- PPM actuales aproximados de la mezcla (por cálculo de sales):");
    ctxLines.push(JSON.stringify(currentPPM));
  }

  if (derivedPPM && typeof derivedPPM === "object") {
    ctxLines.push("- PPM derivados / secundarios si aplica:");
    ctxLines.push(JSON.stringify(derivedPPM));
  }

  if (sector) {
    ctxLines.push(`- Sector seleccionado actualmente: ${sector}`);
  }

  if (Array.isArray(sectors) && sectors.length > 0) {
    ctxLines.push("- Sectores configurados (id, superficie, plantas):");
    ctxLines.push(JSON.stringify(sectors));
  }

  ctxLines.push("\n[INSTRUCCIONES DE FORMATO DE RESPUESTA]");
  ctxLines.push(
    `Siempre debés responder EXCLUSIVAMENTE en un JSON válido con la forma:
{
  "short": "respuesta corta en el mismo idioma que la pregunta, tono colega ingeniero agrónomo, sin listados eternos",
  "full":  "respuesta larga y técnica, más detallada, con explicación paso a paso y contexto agronómico +, si corresponde, explicación de cómo usar la app Dr. Cannabis -Fertilizer-IA-\n(cómo ajustar sales, PPM, EC, riegos y parámetros que esté viendo el usuario)."
}

- "short" debe ser una versión resumida y accionable (2–5 frases máximo), ideal para alguien que ya sabe de cultivo.
- "full" puede ser extensa y pedagógica, pero SIEMPRE debe ser texto plano, sin Markdown, y dentro del mismo JSON.
- No agregues comentarios fuera del JSON, ni texto antes o después.
- Si la pregunta es sobre la APP (pantallas, botones, campos), explicá con un tono de TUTOR paso a paso (clic por clic), SIEMPRE dentro de "full".
- Si la pregunta es agronómica (nutrición, plagas, indoor, invernaderos, exterior, clonación, cosecha, etc.), usá todo el Prompt Maestro de Dr. Cannabis para responder.
- Podés mezclar: por ejemplo, explicar agronómicamente y a la vez qué debe tocar el usuario en la app para lograrlo.`
  );

  return `${BASE_PROMPT}\n\n${ctxLines.join("\n")}`;
}

/**
 * Intenta parsear la salida del modelo como JSON { short, full }.
 * Si falla, devuelve un objeto a partir del texto bruto.
 */
function parseModelAnswer(raw) {
  if (!raw || typeof raw !== "string") {
    return {
      short: "El modelo no devolvió texto entendible.",
      full: "No se pudo interpretar la salida del modelo LLM local. Revisá logs del backend de Dr. Cannabis.",
    };
  }

  let trimmed = raw.trim();

  // Intento directo de JSON
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") {
      const short = String(parsed.short || "").trim();
      const full = String(parsed.full || "").trim() || short;
      if (short || full) {
        return { short: short || full.slice(0, 240), full };
      }
    }
  } catch (err) {
    // no pasa nada, probamos abajo
  }

  // Si viene texto normal, generamos short/full artificial
  if (trimmed.length === 0) {
    return {
      short: "El modelo respondió vacío.",
      full: "El modelo local devolvió una respuesta vacía o no interpretable. Revisá configuración del modelo.",
    };
  }

  if (trimmed.length > 3000) {
    trimmed = trimmed.slice(0, 3000) + "...";
  }

  return {
    short: trimmed.slice(0, 280),
    full: trimmed,
  };
}

// =========================
// RUTA PRINCIPAL DEL BOT
// =========================

app.post("/api/dr-cannabis/query", async (req, res) => {
  const { message, context } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "Falta 'message' en el body. Debe ser texto.",
    });
  }

  const systemPrompt = buildSystemPrompt(context || {});

  // Construimos payload para el servidor LLM local (ej: Ollama)
  const payload = {
    model: MODEL_NAME,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    stream: false,
  };

  try {
    const response = await fetch(LLM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[DrCannabis] Error HTTP desde LLM local:", response.status, text);
      return res.status(500).json({
        error: `Error HTTP ${response.status} al llamar al modelo local.`,
        details: text.slice(0, 500),
      });
    }

    const data = await response.json();

    // Formato típico de Ollama /api/chat: { message: { content: "..." }, ... }
    const rawAnswer =
      data?.message?.content || data?.choices?.[0]?.message?.content || "";

    const parsed = parseModelAnswer(rawAnswer);

    return res.json({
      short: parsed.short,
      full: parsed.full,
    });
  } catch (err) {
    console.error("[DrCannabis] Error al llamar al LLM local:", err);
    return res.status(500).json({
      error: "No se pudo conectar con el modelo LLM local.",
      details: String(err?.message || err || "desconocido"),
    });
  }
});

// =========================
// HEALTHCHECK SENCILLO
// =========================

app.get("/api/dr-cannabis/health", (req, res) => {
  res.json({
    ok: true,
    model: MODEL_NAME,
    llm_url: LLM_URL,
    prompt_loaded: !!BASE_PROMPT,
  });
});

// =========================
// ARRANQUE DEL SERVIDOR
// =========================

app.listen(PORT, () => {
  console.log(`Dr. Cannabis backend escuchando en http://localhost:${PORT}`);
  console.log(`Usando modelo local: ${MODEL_NAME}`);
  console.log(`LLM_URL: ${LLM_URL}`);
});
