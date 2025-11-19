// backend/dr-cannabis-backend.js
// Backend local para Dr. Cannabis -Fertilizer-IA-
// - Expone un endpoint HTTP para que el frontend (index.html) pregunte al bot.
// - Inyecta el Prompt Maestro y el contexto de la app (PPM, EC, etapa, etc.).
// - Espera que el modelo local devuelva { short, full } o, si devuelve texto plano,
//   genera un short automático y usa el texto completo como full.

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------
// Configuración básica
// ------------------------

const PORT = process.env.DR_CANNABIS_PORT || 17850;

// URL del modelo LLM local (por ejemplo, Ollama u otro servidor offline)
// Ejemplo para Ollama:  http://localhost:11434/api/chat
const LLM_URL = process.env.DR_CANNABIS_LLM_URL || "http://localhost:11434/api/chat";
const LLM_MODEL = process.env.DR_CANNABIS_MODEL || "llama3.1";

// Ruta al Prompt Maestro en un archivo .md
// (Copiá todo tu prompt de Dr. Cannabis en este archivo)
const PROMPT_PATH = path.join(__dirname, "dr-cannabis-prompt.md");

let promptMaestro = "";
try {
  promptMaestro = fs.readFileSync(PROMPT_PATH, "utf8");
  console.log("[DrCannabis] Prompt Maestro cargado desde:", PROMPT_PATH);
} catch (err) {
  console.error("[DrCannabis] No se pudo leer dr-cannabis-prompt.md. Asegúrate de crearlo.");
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ------------------------
// Función auxiliar: armar prompt para el LLM
// ------------------------

function buildSystemPrompt() {
  return `Eres \"Dr. Cannabis\", asistente agronómico y manual interactivo de la app \"Dr. Cannabis -Fertilizer-IA-\".

A continuación tienes tu Prompt Maestro completo. Respeta estrictamente su rol, estilo, tono, formación en nutrición de cannabis, riego, plagas, enfermedades, indoor, exterior, invernaderos, clonación, postcosecha y manejo integrado. También recuerda que eres un manual interactivo de la aplicación (explicas paso a paso cómo usar la app cuando te preguntan sobre la interfaz).

------------- PROMPT MAESTRO -------------
${promptMaestro}
------------- FIN PROMPT MAESTRO -------------

Reglas adicionales IMPORTANTES:
- Siempre responde en español por defecto.
- Cuando el usuario haga una pregunta, debes devolver SIEMPRE un JSON con este formato EXACTO (sin texto adicional):
  {
    "short": "respuesta corta, estilo ingeniero colega, resumen práctico y directo",
    "full": "respuesta larga, explicando el porqué, los pasos y detalles técnicos"
  }
- "short" debe ser clara y accionable en 2 a 5 frases.
- "full" debe profundizar: detalla el razonamiento agronómico, cálculos, alternativas, advertencias, y si es sobre la app, explica paso a paso qué hacer dentro de \"Dr. Cannabis -Fertilizer-IA-\" (pantallas, campos, botones, etc.).
- SIEMPRE que el contexto incluya datos de la app (PPM, EC, etapa, sustrato, etc.), úsalos para personalizar las recomendaciones.
- NO salgas del formato JSON ni agregues saludos fuera de las cadenas de texto.
`;
}

function buildUserPrompt(message, context) {
  const safeContext = context || {};

  return {
    role: "user",
    content: `Consulta del usuario: ${message}

Contexto de la app Dr. Cannabis -Fertilizer-IA- (si hay datos):
${JSON.stringify(safeContext, null, 2)}

Usa este contexto para ajustar tus recomendaciones: etapa fenológica, PPM objetivo vs actuales, EC, TDS, tipo de sustrato, sector de riego, volumen de tanque, etc.

Recuerda RESPONDER EXCLUSIVAMENTE en formato JSON con las claves "short" y "full".
`
  };
}

// ------------------------
// Llamada al modelo local (ej. Ollama)
// ------------------------

async function callLocalLLM(systemPrompt, userMessageObj) {
  // Ejemplo de payload para Ollama /api/chat
  const body = {
    model: LLM_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      userMessageObj
    ],
    stream: false
  };

  const res = await fetch(LLM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`LLM respondio con status ${res.status}`);
  }

  const data = await res.json();

  // Formato típico de Ollama: { message: { role: 'assistant', content: '...' }, ... }
  const content = data?.message?.content || "";
  return content;
}

// ------------------------
// Utilidad: intentar parsear JSON del modelo
// ------------------------

function extractJsonAnswer(rawText) {
  if (!rawText) return null;

  // Intentar parsear directamente
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && typeof parsed === "object" && parsed.short && parsed.full) {
      return {
        short: String(parsed.short),
        full: String(parsed.full)
      };
    }
  } catch (_) {
    // no es JSON directo, intentamos extraer bloque JSON del texto
  }

  // Buscar bloque entre llaves { ... }
  const start = rawText.indexOf("{");
  const end = rawText.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const maybeJson = rawText.slice(start, end + 1);
    try {
      const parsed2 = JSON.parse(maybeJson);
      if (parsed2 && typeof parsed2 === "object" && parsed2.short && parsed2.full) {
        return {
          short: String(parsed2.short),
          full: String(parsed2.full)
        };
      }
    } catch (_) {
      // no se pudo parsear
    }
  }

  return null;
}

// ------------------------
// Endpoint principal del bot
// ------------------------

app.post("/api/dr-cannabis/query", async (req, res) => {
  try {
    const { message, context } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Falta 'message' en el cuerpo del request" });
    }

    const systemPrompt = buildSystemPrompt();
    const userPromptObj = buildUserPrompt(message, context);

    const rawText = await callLocalLLM(systemPrompt, userPromptObj);

    let answer = extractJsonAnswer(rawText);

    // Si el modelo no respetó el formato JSON, construimos uno básico
    if (!answer) {
      const text = (rawText || "Respuesta generada por Dr. Cannabis.").trim();
      const short = text.length > 320 ? text.slice(0, 320) + "..." : text;
      answer = {
        short,
        full: text
      };
    }

    return res.json(answer);
  } catch (err) {
    console.error("[DrCannabis] Error en /api/dr-cannabis/query:", err);
    return res.status(500).json({
      error: "Error interno en Dr. Cannabis backend",
      details: String(err.message || err)
    });
  }
});

// Endpoint simple de healthcheck
app.get("/api/dr-cannabis/health", (req, res) => {
  res.json({ status: "ok", model: LLM_MODEL, llmUrl: LLM_URL });
});

app.listen(PORT, () => {
  console.log(`🚀 Dr. Cannabis backend escuchando en http://localhost:${PORT}`);
  console.log(`   Usando modelo local: ${LLM_MODEL} en ${LLM_URL}`);
});
