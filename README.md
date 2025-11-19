# Dr. Cannabis - Fertilizer IA

Este repositorio contiene dos piezas independientes:

1. **Frontend estático** (`index.html` + `assets/`) pensado para publicarse en GitHub Pages o abrirlo de forma local en cualquier navegador.
2. **Backend local** (`backend/`) que levanta un microservicio HTTP para hablar con tu modelo/LLM offline (ej.: Ollama).

## Cómo usarlo

### Frontend (GitHub Pages o local)
- Para GitHub Pages solo hace falta que la rama principal tenga este `index.html` en la raíz. GitHub lo sirve automáticamente en `https://<usuario>.github.io/Dr.-Cannabis/`.
- Para ejecutarlo en local abre el archivo `index.html` directamente en el navegador o con algún servidor estático (ej.: `npx serve`).
- Si tu backend no corre en el mismo origen puedes definir `window.DR_CANNABIS_API_BASE`, `window.DR_CANNABIS_QUERY_URL` o `window.DR_CANNABIS_HEALTH_URL` desde la consola antes de inicializar el bot para apuntar al endpoint correcto.

### Backend
```bash
npm install   # no instala dependencias externas, pero asegura package-lock
npm start     # o node backend/dr-cannabis-backend.js
```
Variables de entorno útiles:
- `DR_CANNABIS_PORT` → puerto HTTP (default 17850)
- `DR_CANNABIS_LLM_URL` → URL del chat del modelo (ej.: `http://localhost:11434/api/chat`)
- `DR_CANNABIS_MODEL` → nombre del modelo cargado en el servidor LLM
- `DR_CANNABIS_LLM_TIMEOUT` → timeout en ms (default 60000)

Completa/ajusta el prompt en `backend/dr-cannabis-prompt.md` para que el asistente responda con tu personalidad y conocimientos.

## Estructura
```
backend/
  dr-cannabis-backend.js
  dr-cannabis-prompt.md
assets/
  Logo.png / Logo2.png / ... (recursos gráficos)
index.html
README.md
package.json
```
