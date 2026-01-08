====================================================
FERTICALC CANNABIS – BASE DE CONOCIMIENTO (vFinal)
====================================================

ÍNDICE
0. Cómo funciona la app (visión usuario)
   0.1 Qué hace la app por vos
   0.2 Flujo típico de uso
   0.3 Qué datos pide y qué devuelve

1. Fundamentos de PPM y EC
   1.1 Qué es PPM
   1.2 Qué es EC y relación con PPM
   1.3 Rangos de EC típicos por intensidad

2. Cálculo de dosis usando % de nutrientes en las sales
   2.1 Idea general
   2.2 Fórmula práctica
   2.3 Ejemplo con nitrato de calcio
   2.4 Sales con varios nutrientes
   2.5 Etiquetas en óxidos (P₂O₅, K₂O, CaO, MgO) y corrección

3. Construcción de recetas de fertirriego en la app

4. Fases del cannabis (fotoperiódicas y automáticas)
   4.1 Seedling / plántula
   4.2 Vegetativo
   4.3 Floración T1, T2, T3
   4.4 Flush / lavado
   4.5 Particularidades de las plantas automáticas

5. Sistemas de cultivo y riego
   5.1 Tierra / mezclas orgánicas
   5.2 Coco
   5.3 Hidroponía

6. Ambiente de cultivo
   6.1 Indoor
   6.2 Invernadero
   6.3 Exterior

7. Técnicas de cultivo, propagación y cosecha
   7.1 SCROG
   7.2 SOG
   7.3 LST y podas (apical, FIM, lollipop, defoliación)
   7.4 Clonación
   7.5 Cosecha y post-cosecha

8. Diagnóstico nutricional (carencias, excesos y pH)
   8.1 Carencias más frecuentes + soluciones
   8.2 Excesos / toxicidades + soluciones
   8.3 Problemas de pH y bloqueos + soluciones

9. Plagas y enfermedades (con soporte de imágenes)
   9.1 Plagas típicas en cannabis + soluciones
   9.2 Hongos típicos + soluciones
   9.3 Otros daños visibles
   9.4 Cómo usar imágenes de referencia en la app

10. Estrés abiótico y problemas de manejo
   10.1 Exceso de agua (sobre-riego)
   10.2 Falta de agua (sub-riego)
   10.3 Estrés por calor
   10.4 Estrés por frío
   10.5 Estrés por luz
   10.6 Estrés por viento, trasplante y podas

11. Toolboxes de la app
   11.1 VPD / Humidity Calculator
   11.2 CFM Calculator / Ventilación
   11.3 Luz verde (Green Light)
   11.4 Harvest Timer
   11.5 Soil Mix Calculator
   11.6 Feeding Calculator
   11.7 Yield Estimator
   11.8 pH Tracker

12. Integración con datos del backend (contexto JSON)

13. Límites, seguridad y legalidad

14. Plantilla de respuesta corta del bot

15. Guías prácticas de cultivo
   15.1 Cómo arrancar indoor (paso a paso)
   15.2 Cómo arrancar en exterior (huerta, patio, terraza)
   15.3 Cómo arrancar en campo / parcelas grandes

16. Guía de solución rápida por síntoma (vista cliente)

17. Objetivos de PPM por fase fenológica (desde BD)

18. Botones y secciones de la app (ayuda contextual)


----------------------------------------------------
0. CÓMO FUNCIONA LA APP (VISIÓN USUARIO)
----------------------------------------------------

0.1 Qué hace la app por vos

La app está pensada para que puedas:

- Cargar tu cultivo: indoor, exterior, invernadero o campo.
- Definir fase de la planta (plántula, vegetativo, floración, etc.).
- Trabajar con objetivos reales de PPM por elemento (N, P, K, Ca, Mg, S, micros) sacados de la BD (derivados de tu Excel).
- Definir el volumen de tu tanque y qué sales/fertilizantes tenés.
- Dejar que la app calcule automáticamente cuántos gramos de cada sal van en el tanque.
- Consultarle al bot dudas sobre:
  - Recetas, PPM, EC, pH.
  - Plagas, hongos, problemas de hojas.
  - Estrés por calor, riego, luz, etc.
  - Diferencias entre indoor, exterior y campo.

0.2 Flujo típico de uso

1) Configurás tu cultivo:
   - Nombre del cultivo (ej. “Indoor Invierno Autos”).
   - Tipo de planta (foto / auto, si la app lo maneja).
   - Sistema de cultivo: tierra, coco, hidro, exterior/campo.
   - Número de plantas, tamaño de macetas o superficie.

2) La app busca en la BD los **PPM objetivo** para esa fase y tipo de planta (desde tu Excel).

3) Indicás:
   - Volumen de tanque (por ejemplo 40 L, 60 L, 100 L).
   - Qué sales/fertilizantes usás (nitrato de calcio, MKP, sulfato de magnesio, etc.).

4) La app:
   - Convierte PPM objetivo → gramos de nutriente → gramos de cada sal (usando % reales).
   - Estima EC final de la solución.
   - Compara con EC objetivo.

5) El bot:
   - Explica si la receta es suave, media o fuerte.
   - Recomienda ajustes finos (subir/bajar EC, tocar un poco Ca/Mg, etc.).
   - Te ayuda a interpretar lecturas de EC/pH de riego y drenaje.

0.3 Qué datos pide y qué devuelve

La app puede pedir:

- Fase fenológica, tipo de planta (foto/auto).
- Sistema de cultivo.
- Lecturas: EC/pH de riego y drenaje, temperatura, HR, etc.
- Inventario de fertilizantes (nombre, % de N, P, K, Ca, Mg, S, micros).
- Volumen de tanque.

La app puede devolver al bot:

- Objetivos de PPM por elemento.
- EC objetivo.
- PPM/EC medidos en riego y drenaje.
- Gramaje de cada sal por L o por tanque.
- Resultados de VPD, CFM recomendado, etc.

El bot usa todo eso para explicar y aconsejar, pero no altera la BD.

----------------------------------------------------
1. FUNDAMENTOS DE PPM Y EC
----------------------------------------------------

1.1 Qué es PPM

- PPM (partes por millón) en soluciones de riego se usa básicamente como **mg de nutriente por litro (mg/L)**.
- 1 ppm = 1 mg/L.
- Ejemplo: 120 ppm de N = 120 mg de N por cada litro de solución.

Cuando la app habla de “N_ppm = 120”, significa que el objetivo son 120 mg de N por cada litro de agua del tanque.

1.2 Qué es EC y relación con PPM

- EC (conductividad eléctrica) mide cuánta sal total hay en el agua.
- No muestra qué sal es, solo cuántos iones en total hay.
- Se mide en mS/cm (milisiemens por centímetro).
- Más sales → EC más alta → solución más concentrada.

La app usa:

- PPM por elemento para ajustar la receta fina.
- EC objetivo y real para controlar que la solución no quede ni demasiado suave ni demasiado fuerte.

1.3 Rangos de EC típicos por intensidad (orientativos)

(La BD debe tener sus propios rangos; esto es para explicación general):

- 0,4–0,6 mS/cm → muy suave (plántulas, clones, autos muy pequeñas).
- 0,8–1,2 mS/cm → suave/medio (vegetativo liviano, pre-flora).
- 1,2–1,8 mS/cm → medio/alto (plantas grandes, floración bien establecida).
- >2,0 mS/cm → fuerte (solo plantas muy sanas y adaptadas).

----------------------------------------------------
2. CÁLCULO DE DOSIS USANDO % DE NUTRIENTES EN LAS SALES
----------------------------------------------------

2.1 Idea general

La app NO recalcula la molécula química desde cero en cada pregunta.  
En su lugar, usa una tabla con:

- % de N, P, K, Ca, Mg, S y micros por cada sal/fertilizante.
- Esos % ya vienen corregidos si el fabricante declaraba óxidos (P₂O₅, K₂O, etc.).

A partir de ese % se obtiene la fracción de nutriente por gramo:

- Ejemplo: 12% N → 0,12 g de N por cada 1 g de sal.

2.2 Fórmula práctica

Para pasar de PPM a gramos de sal:

1) Calcular cuántos gramos de nutriente se necesitan en el tanque:

- PPM deseados × Volumen(L) = mg de nutriente.
- mg / 1000 = g de nutriente.

2) Calcular gramos de sal:

- fraccion_nutriente = (% nutriente) / 100.
- gramos_de_sal = gramos_de_nutriente_deseados / fraccion_nutriente.

2.3 Ejemplo con nitrato de calcio

Objetivo: 120 ppm de N en 10 L, usando nitrato de calcio.

1) Nutriente:

- 120 ppm = 120 mg/L.
- 120 mg/L × 10 L = 1200 mg de N.
- 1200 mg = 1,2 g de N.

2) Sal:

- La BD tiene cargado que ese nitrato de calcio tiene, por ejemplo, 12% de N.
- 12% N = fracción 0,12.
- gramos de sal = 1,2 g / 0,12 = 10 g de nitrato de calcio.

Ese 12% viene de la molécula completa Ca(NO₃)₂, pero el cálculo químico se hace una sola vez (en tu Excel/BD).

2.4 Sales con varios nutrientes

Si una sal aporta varios elementos (por ejemplo, nitrato de calcio aporta N y Ca, MKP aporta P y K):

- La app calcula:
  - g_N = g_sal × %N (en fracción).
  - g_Ca = g_sal × %Ca.
  - g_P = g_sal × %P.
  - g_K = g_sal × %K.
- Luego, cada g se transforma en PPM según volumen del tanque.

2.5 Etiquetas en óxidos y corrección

Muchas etiquetas declaran:

- Fósforo como P₂O₅.
- Potasio como K₂O.
- Calcio como CaO.
- Magnesio como MgO.

La app convierte esos óxidos en elementos puros usando factores fijos que están en la BD, derivados de tu Excel.

Ejemplo:

- P = P₂O₅ × factor_P.
- K = K₂O × factor_K.
- etc.

La corrección se hace una vez al cargar el producto en la BD, y a partir de ahí la app trabaja siempre en P, K, Ca, Mg reales.

----------------------------------------------------
3. CONSTRUCCIÓN DE RECETAS DE FERTIRRIEGO EN LA APP
----------------------------------------------------

Esquema simplificado:

1) Para cada fase (seedling, vegetativo, flor_T1/T2/T3, flush) y tipo de planta (foto/auto) la BD tiene **objetivos de PPM por elemento**.

2) El usuario selecciona:

   - Fase fenológica actual.
   - Tipo de planta (foto/auto).
   - Sistema de cultivo (tierra/coco/hidro).
   - Volumen de tanque (L).
   - Sales/fertilizantes disponibles.

3) La app:

   - Convierte PPM objetivo → g de cada nutriente → g de cada sal disponible, respetando:
     - Lógica agronómica (N alto en veg, K alto en flora, etc.).
     - No sobrepasar fácilmente EC objetivo.
   - Calcula EC estimada de la solución final.

4) La app envía al bot:

   - Objetivos PPM.
   - EC objetivo.
   - Gramaje de cada sal por L o por tanque.
   - Lecturas reales (si el usuario las cargó).

5) El bot:

   - Explica si la receta está suave, en rango o fuerte.
   - Sugiere ajustes graduales (no cambios bruscos).
   - Puede proponer subir/bajar tal sal en X g por tanque para llegar al nuevo PPM objetivo.

----------------------------------------------------
4. FASES DEL CANNABIS (FOTOPERIÓDICAS Y AUTOMÁTICAS)
----------------------------------------------------

4.1 Seedling / plántula

- Raíces muy delicadas.
- PPM y EC muy bajos.
- Prioridad: no quemar, no encharcar.

4.2 Vegetativo

- Aumenta N y Ca/Mg.
- K sube pero moderado.
- PPM y EC medios, según tamaño y sistema.
- Objetivo: mucho verde y estructura fuerte.

4.3 Floración T1, T2, T3

- T1 (inicio / stretch):
  - Baja algo N.
  - Suben P y K.
- T2 (floración media):
  - N bajo-moderado.
  - K alto, P medio-alto.
  - Ca/Mg estables y suficientes.
- T3 (final / maduración):
  - N muy bajo.
  - Se puede bajar EC global.
  - Enfoque en maduración, densidad y resina.

Los PPM concretos por elemento para cada T1/T2/T3 vienen desde la BD.

4.4 Flush / lavado

- Últimos días antes de la cosecha (según cada cultivador).
- Opciones:
  - Solo agua ajustada de pH.
  - Soluciones muy suaves.
- Objetivo: arrastrar sales acumuladas del sustrato y “limpiar” el sistema radicular.

4.5 Particularidades de las plantas automáticas

- Ciclo de vida más corto.
- Vegetativo muy breve.
- No perdonan excesos de fertilización tanto como una fotoperiódica.

Reglas generales para autos:

- Usar siempre la parte baja de los rangos de EC/PPM al inicio.
- Subir de a poco solo si la planta lo pide (hojas sanas, buen crecimiento).
- La BD puede tener PPM específicos para autos o factores de ajuste (por ejemplo 0,6–0,8 de la dosis de una foto). El bot sólo los explica.

----------------------------------------------------
5. SISTEMAS DE CULTIVO Y RIEGO
----------------------------------------------------

5.1 Tierra / mezclas orgánicas

- Mayor buffer de nutrientes.
- Fertilizaciones:
  - Menos concentradas o menos frecuentes, según mezcla.
- Riego:
  - Regar cuando el sustrato se seca parcialmente.
  - Evitar barro (exceso) y polvo (falta).

5.2 Coco

- Sustrato inerte o casi inerte.
- Nutrientes vienen casi totalmente del riego.
- Recomendación:
  - Fertilizar en cada riego con todos los macro + Ca/Mg.
  - pH de solución aprox. 5,8–6,2.
  - Riegos frecuentes con buen drenaje para lavar sales sobrantes.

5.3 Hidroponía

- Toda la nutrición viene de la solución.
- Requiere control fino de pH, EC y temperatura.
- Oxigenación constante (aireadores, bombas).
- Los errores se ven rápido:
  - Mejor partir con EC moderada y subir despacio.

----------------------------------------------------
6. AMBIENTE DE CULTIVO
----------------------------------------------------

6.1 Indoor

- Luz:
  - Tipos: LED, HPS, MH, CMH, etc.
  - Fotoperiodos:
    - 18/6 para vegetativo (fotos).
    - 12/12 para floración (fotos).
    - 18/6 o 20/4 para autos todo el ciclo.
  - Distancia a la planta según tipo y potencia de la lámpara.

- Temperatura:
  - Día: aprox. 24–28 °C.
  - Noche: aprox. 18–22 °C.
  - Evitar picos extremos.

- Humedad relativa:
  - Plántula: 65–70 % aprox.
  - Vegetativo: 50–65 %.
  - Floración: 40–50 % (más baja al final para evitar hongos).

- Ventilación:
  - Extractor con filtro de carbón (sacar aire caliente y olor).
  - Entradas de aire pasivas o forzadas.
  - Ventiladores internos para mover el aire.
  - Instalación eléctrica segura.

6.2 Invernadero

- Depende fuertemente del clima local.
- Manejo:
  - Ventilación y sombreo para evitar exceso de calor.
  - Posible calefacción en épocas frías.
  - Cuidado con condensación y humedad elevada.

6.3 Exterior

- Factores:
  - Sol directo, lluvias, vientos, heladas, granizo.
- Manejo:
  - Elegir genética adecuada al clima.
  - Proteger de viento fuerte y granizo (mallas, estructuras).
  - Cuidar el drenaje y la calidad del suelo.

----------------------------------------------------
7. TÉCNICAS DE CULTIVO, PROPAGACIÓN Y COSECHA
----------------------------------------------------

7.1 SCROG

- Malla horizontal sobre la planta.
- Se doblan y distribuyen las ramas para formar una “alfombra” uniforme.
- Mejora aprovechamiento de luz y aumenta número de flores en la zona óptima.

7.2 SOG

- Muchas plantas pequeñas, poca vegetación.
- Se entra rápido en floración.
- Pensado para maximizar producción por m² con plantas pequeñas.

7.3 LST y podas

- LST:
  - Doblar y atar ramas suavemente, sin romper.
  - Abrir la planta y mejorar penetración de luz.

- Poda apical (topping):
  - Corte de la punta principal para que salgan dos o más puntas nuevas.

- FIM:
  - Corte parcial de la punta para multiplicar las ramas.

- Lollipop:
  - Limpieza de la parte baja de la planta, quitando ramas débiles que no recibirán buena luz.

- Defoliación selectiva:
  - Retirar algunas hojas grandes que bloquean mucha luz.
  - Sin exagerar para no frenar el crecimiento.

7.4 Clonación

Pasos básicos:

- Elegir planta madre sana.
- Cortar esquejes con tijeras limpias.
- Usar hormona de enraizamiento (opcional pero útil).
- Alto nivel de humedad (propagador, domo, nebulización suave).
- Luz suave, sin calor excesivo.
- Aclimatar gradualmente antes de pasarlos a luz fuerte y fertirriego completo.

7.5 Cosecha y post-cosecha

- Cosecha:
  - Basada en tricomas (claros → lechosos → ámbar).
  - Pistilos, densidad de cogollos y aspecto general.

- Post-cosecha:
  - Flush previo según preferencia.
  - Corte y manicurado.
  - Secado controlado (oscuro, ventilado, temp y HR moderadas).
  - Curado en frascos, abriendo periódicamente para renovar aire.

----------------------------------------------------
8. DIAGNÓSTICO NUTRICIONAL (CARENCIA, EXCESO Y PH)
----------------------------------------------------

8.1 Carencias más frecuentes + soluciones

Nitrógeno (N) – carencia

- Síntomas:
  - Amarilleo comenzando por hojas viejas.
  - Planta pálida, crecimiento lento.
- Soluciones:
  - Verificar si estás en una fase donde todavía se necesita N (vegetativo o inicio de floración).
  - Aumentar ligeramente la dosis de fuentes de N (según la receta de la app).
  - Mantener pH en rango para asegurar absorción.
  - Observar hojas nuevas: deberían salir más verdes.

Fósforo (P) – carencia

- Síntomas:
  - Hojas viejas oscuras, a veces moradas.
  - Posible tallo o pecíolos morados (depende genética).
  - Menor vigor y retraso en floración.
- Soluciones:
  - Revisar pH (pH fuera de rango puede bloquear P).
  - Subir un poco las fuentes de P (por ejemplo MKP u otra según inventario).
  - Mantener EC general en rango (no sirve subir P si ya estás pasadísimo de EC).

Potasio (K) – carencia

- Síntomas:
  - Bordes de hojas viejas amarillos, que luego se queman.
  - Tallos débiles, mayor sensibilidad a estrés.
- Soluciones:
  - Incrementar la dosis de fertilizantes ricos en K según receta de floración.
  - Revisar equilibrio con Ca y Mg para evitar bloqueos.
  - Revisar pH.

Calcio (Ca) – carencia

- Síntomas:
  - Hojas nuevas deformadas, con puntitos marrones.
  - Brotes débiles, tallos frágiles.
- Soluciones:
  - Subir aportes de Ca (nitrato de calcio u otra fuente disponible).
  - Asegurar que haya suficiente Ca/Mg en aguas muy blandas.
  - Mantener pH en rango.

Magnesio (Mg) – carencia

- Síntomas:
  - Amarilleo entre venas en hojas viejas (venas verdes, fondo amarillo).
  - Manchas marrones en casos avanzados.
- Soluciones:
  - Agregar fuente de Mg (sulfato de magnesio u otra).
  - Revisar que no haya exceso de K o Ca que bloquee Mg.
  - Ajustar pH.

Hierro (Fe) – carencia

- Síntomas:
  - Hojas nuevas muy claras/amarillas con venas verdes.
- Soluciones:
  - Revisar pH (suele ser pH alto en la raíz).
  - Bajar pH de riego a rango adecuado.
  - Usar suplemento de Fe quelatado si es necesario, sin abusar.

8.2 Excesos / toxicidades + soluciones

Exceso de N

- Síntomas:
  - Hojas verde muy oscuro.
  - Forma de “garra” hacia abajo.
  - Tallos blandos, planta “sobrealimentada”.
- Soluciones:
  - Reducir dosis de productos ricos en N, sobre todo en floración.
  - Si EC de drenaje está muy alta, realizar un riego de lavado con solución suave o agua ajustada de pH.
  - Volver luego a una receta más ligera.

Exceso general de sales (EC alta)

- Síntomas:
  - Puntas de hojas quemadas.
  - EC de drenaje mucho más alta que la EC de riego.
  - Crecimiento frenado, planta rígida.
- Soluciones:
  - Hacer uno o varios riegos con buen drenaje (flush moderado).
  - Bajar la EC objetivo en la app.
  - Espaciar algo la fertilización si la receta era muy agresiva.

8.3 Problemas de pH y bloqueos + soluciones

- pH fuera de rango puede bloquear nutrientes aunque la receta sea buena.

Soluciones generales:

1) Medir pH de riego y drenaje.
2) Comparar con rangos:
   - Tierra/orgánico: aprox. 6,0–7,0.
   - Coco/hidro: aprox. 5,5–6,5.
3) Si está fuera:
   - Ajustar pH de riego de a poco, riego a riego.
   - Evitar cambios extremos bruscos.
4) Mantener pH estable durante varios riegos y observar respuesta:
   - Si la planta mejora, era un problema de pH y no de receta.

----------------------------------------------------
9. PLAGAS Y ENFERMEDADES (CON SOPORTE DE IMÁGENES)
----------------------------------------------------

9.1 Plagas típicas en cannabis + soluciones

Araña roja (ácaros)

- Síntomas:
  - Puntitos claros en hojas (moteado).
  - Telarañas finas en envés y entre ramas.
- Soluciones:
  - Subir un poco HR y bajar calor extremo.
  - Lavar hojas (si la fase lo permite).
  - Usar jabón potásico y/o aceite de neem en vegetativo.
  - Implementar control biológico (depredadores) cuando sea posible.
  - Limpiar ropa/herramientas, cuarentena de plantas nuevas.

Trips

- Síntomas:
  - Manchas plateadas/brillosas en hojas.
  - Puntitos negros (excrementos).
- Soluciones:
  - Trampas adhesivas.
  - Pulverizaciones suaves con productos biológicos en vegetativo.
  - Buena higiene del área de cultivo.

Pulgones

- Síntomas:
  - Grupos de insectos blandos en brotes tiernos.
  - Hojas pegajosas (melaza).
- Soluciones:
  - Lavado con agua y jabón potásico.
  - Control de hormigas (suelen “pastorear” pulgones).
  - Quitar brotes muy atacados.

Mosca blanca

- Síntomas:
  - Mosquitas blancas que vuelan al mover la planta.
  - Hojas amarilleando.
- Soluciones:
  - Trampas amarillas.
  - Tratamientos foliares suaves en vegetativo.
  - Aumentar circulación de aire.

Mosca del sustrato (fungus gnats)

- Síntomas:
  - Mosquitas negras cerca del sustrato.
  - Problemas de raíces en infestaciones fuertes.
- Soluciones:
  - Dejar secar más la capa superior.
  - Mejorar drenaje.
  - Trampas adhesivas a nivel del sustrato.

Hormigas

- Síntomas:
  - Hormigas subiendo y bajando por la planta.
- Soluciones:
  - Cebos y barreras físicas fuera del armario.
  - Evitar insecticidas tóxicos dentro del cultivo.

Orugas y masticadores

- Síntomas:
  - Hojas comidas con agujeros.
  - Restos de excrementos.
- Soluciones:
  - Retirar orugas manualmente.
  - Usar productos biológicos aptos en etapas tempranas.
  - Vigilar que no quede material dañado dentro de los cogollos.

9.2 Hongos típicos + soluciones

Oídio

- Síntomas:
  - Polvo blanco en hojas y tallos.
- Soluciones:
  - Mejorar ventilación y bajar algo la HR.
  - Retirar hojas muy afectadas.
  - Aplicar productos suaves en vegetativo.
  - En floración avanzada, priorizar contención y descarte de focos grandes.

Botrytis (moho gris de cogollos)

- Síntomas:
  - Cogollos marrones por dentro, blandos o secos.
  - Moho gris visible.
- Soluciones:
  - Cortar y descartar todo lo afectado (no consumir).
  - Bajar HR y mejorar ventilación.
  - Evitar mojar flores con riegos o pulverizaciones.

Enfermedades de raíz por exceso de agua

- Síntomas:
  - Planta decaída.
  - Sustrato con mal olor, raíces marrones.
- Soluciones:
  - Dejar secar el sustrato.
  - Mejorar drenaje.
  - Eventualmente trasplantar a sustrato más aireado.

9.3 Otros daños visibles

- Golpes, roturas, daños mecánicos.
- Daños de mascotas, caracoles, babosas.
- El bot debe intentar distinguir estos daños de plagas/hongos verdaderos.

9.4 Cómo usar imágenes de referencia en la app

Cada problema puede tener asociadas fotos:

- tipoProblema (carencia_N, oidio, araña_roja, etc.).
- partePlanta (hoja_abanico, flor, tallo, raíz).
- etapa (seedling, vegetativo, flora_T1/T2/T3).
- sistema (tierra, coco, hidro, exterior).

El bot puede invitar a comparar:

“Lo que contás se parece a oídio. Compará con las fotos de oídio del módulo de enfermedades para confirmar.”

----------------------------------------------------
10. ESTRÉS ABIÓTICO Y PROBLEMAS DE MANEJO
----------------------------------------------------

10.1 Exceso de agua (sobre-riego)

- Síntomas:
  - Hojas caídas pero pesadas.
  - Sustrato siempre muy húmedo.
- Soluciones:
  - Dejar secar sustrato antes del próximo riego.
  - Mejorar drenaje, agregar aireación (perlita, etc.).
  - Ajustar volumen/frecuencia de riego.

10.2 Falta de agua (sub-riego)

- Síntomas:
  - Hojas caídas y secas.
  - Maceta muy liviana.
- Soluciones:
  - Regar en profundidad hasta que haya drenaje.
  - Mantener un patrón más estable: no dejar que siempre llegue al extremo de marchitarse.

10.3 Estrés por calor

- Síntomas:
  - Bordes de hojas hacia arriba.
  - Puntas secas, hojas quemadas cerca de la lámpara.
- Soluciones:
  - Bajar temperatura (más extracción, aire más fresco).
  - Alejar la lámpara o bajar su potencia.
  - Subir algo la HR si está muy baja.

10.4 Estrés por frío

- Síntomas:
  - Crecimiento lento, hojas caídas.
  - Tonos morados en algunas genéticas.
- Soluciones:
  - Evitar corrientes de aire frío directo.
  - Aportar calor suave en noches muy frías.
  - No regar con agua helada.

10.5 Estrés por luz

Falta de luz:

- Síntomas:
  - Plantas alargadas, entrenudos largos.
  - Hojas pequeñas.
- Soluciones:
  - Acercar la lámpara (sin quemar).
  - Usar una luz adecuada al tamaño del espacio.

Exceso de luz / light burn:

- Síntomas:
  - Hojas superiores blanqueadas o amarillas.
  - Puntas quemadas cerca del foco.
- Soluciones:
  - Subir la lámpara.
  - Bajar intensidad si es regulable.
  - Mejorar ventilación entre luz y copa.

10.6 Estrés por viento, trasplante y podas

- Trasplante:
  - La planta puede frenarse algunos días.
  - Evitar sumar más estrés (podas fuertes, cambios bruscos de EC) justo en ese momento.

- Podas fuertes:
  - Conviene hacerlas cuando la planta está sana.
  - No combinar con otros factores de estrés.

- Viento:
  - Ventiladores directos y muy fuertes pueden dañar hojas.
  - Mejor flujo de aire suave y oscilante.

----------------------------------------------------
11. TOOLBOXES DE LA APP
----------------------------------------------------

11.1 VPD / Humidity Calculator

- Calcula déficit de presión de vapor con temp de aire, HR y temp de hoja.
- Rangos orientativos:
  - Seedling: ~0,4–0,8 kPa.
  - Vegetativo: ~0,8–1,2 kPa.
  - Floración temprana: ~1,0–1,5 kPa.
  - Floración avanzada: ~1,2–1,8 kPa.
- El bot explica:
  - VPD bajo = aire muy húmedo → riesgo de hongos.
  - VPD alto = aire muy seco → planta transpira de más.

11.2 CFM Calculator / Ventilación

- Calcula caudal de aire necesario según:
  - Volumen del cuarto.
  - Minutos por recambio.
  - Pérdidas por filtro, ductos, etc.
- El bot indica:
  - Si el extractor actual queda corto, justo o sobrado.
  - Si conviene cambiar extractor, reducir ductos, etc.

11.3 Luz verde (Green Light)

- Recuerda que la luz verde suave en el periodo de oscuridad afecta poco el fotoperiodo.
- Aun así:
  - Usar intensidad mínima.
  - Evitar exposiciones largas.

11.4 Harvest Timer

- Cuenta regresiva a cosecha según:
  - Fecha de paso a 12/12.
  - Semanas de floración típicas de la genética.
- El bot aclara que:
  - Es orientativo.
  - La decisión final depende de tricomas, pistilos y aspecto general.

11.5 Soil Mix Calculator

- Diseña mezclas de sustrato.
- Elementos:
  - Base (turba, coco, tierra).
  - Aireación (perlita, vermiculita, piedra pómez).
  - Materia orgánica (compost, humus, guanos, enmiendas).
- El bot:
  - Propone proporciones tipo 1/3 base, 1/3 aireación, 1/3 compost como ejemplo.
  - Aclara que debe adaptarse a clima y estilo de riego.

11.6 Feeding Calculator

- Combina:
  - Recetas base.
  - Objetivos PPM y EC por fase.
- El bot:
  - Indica si el plan es suave, medio o agresivo.
  - Recomienda cambios graduales.

11.7 Yield Estimator

- Calcula rendimiento estimado según:
  - m², potencia de luz, número de plantas, técnica (SCROG/SOG).
- El bot:
  - Recuerda que es solo orientación.
  - Explica factores que pueden subir o bajar el resultado.

11.8 pH Tracker

- Guarda historial de pH de riego y drenaje.
- El bot:
  - Señala tendencias: siempre alto, siempre bajo, muy inestable.
  - Sugiere cómo estabilizar el pH en un rango sano.

----------------------------------------------------
12. INTEGRACIÓN CON DATOS DEL BACKEND (CONTEXTO JSON)
----------------------------------------------------

La app puede pasar al bot un contexto con:

- Idioma.
- Datos del cultivo actual.
- Objetivos PPM y EC.
- Lecturas reales de EC/pH, temperatura, HR.
- Inventario de sales y su % de nutrientes.
- Últimas fórmulas usadas (g/L).
- Resultados de módulos toolbox (VPD, CFM, etc.).

Reglas:

- El bot usa esos datos como **verdad principal**.
- Si falta algo clave, puede pedirlo (ej.: “¿sabés la EC del drenaje?”).
- El bot no modifica la BD; solo aconseja.

Si no hay contexto estructurado:

- Trabaja sólo con lo que diga el usuario.
- Pide 1–2 datos clave si son necesarios (fase, sistema, EC/pH actual).
- Mantiene respuestas cortas y accionables.

----------------------------------------------------
13. LÍMITES, SEGURIDAD Y LEGALIDAD
----------------------------------------------------

- El bot se centra en cultivo y agronomía.
- No da consejos médicos ni de consumo.
- Las leyes sobre cannabis varían según país/región:
  - El bot puede sugerir consultar la normativa local.
- En fitosanitarios:
  - Usar nombres genéricos (jabón potásico, neem, BT, etc.).
  - No recomendar marcas comerciales.
  - Respetar siempre la normativa local y la seguridad del usuario.

----------------------------------------------------
14. PLANTILLA DE RESPUESTA CORTA DEL BOT
----------------------------------------------------

Formato típico:

1) Diagnóstico / idea principal (1 frase)
2) Qué hacer ahora (2–4 viñetas con acciones concretas)
3) Seguimiento (1 frase: qué observar y en cuánto tiempo)
4) Opción técnica extendida (ofrecer versión más larga si el usuario quiere)

Ejemplo:

- Diagnóstico:
  - “Por lo que contás, parece un exceso de sales y algo de estrés por calor.”
- Qué hacer ahora:
  - Bajar EC de la solución a X.
  - Hacer un riego con buen drenaje.
  - Mejorar ventilación y bajar unos grados la temperatura.
- Seguimiento:
  - “En 3–5 días deberías ver si las hojas nuevas salen más sanas.”
- Opción técnica:
  - “Si querés, te explico los PPM exactos que estás usando y cómo los calcula la app.”

----------------------------------------------------
15. GUÍAS PRÁCTICAS DE CULTIVO
----------------------------------------------------

15.1 Cómo arrancar indoor (paso a paso)

1) Elegir espacio y equipo básico:
   - Armario/cuarto, luz, extractor, ventiladores, filtro de carbón, temporizadores.
2) Preparar sustrato y macetas.
3) Germinar y pasar a maceta pequeña.
4) Riegos suaves, sin encharcar.
5) Subir fertilización de a poco según fase y PPM objetivo de la app.
6) Entrenar la planta si se desea (LST, SCROG).
7) Pasar a floración (12/12) en fotoperiódicas cuando el tamaño sea adecuado.
8) Controlar temperatura, HR, plagas y hongos.

15.2 Cómo arrancar en exterior (huerta, patio, terraza)

1) Elegir lugar con varias horas de sol directo.
2) Mejorar suelo con materia orgánica o usar macetas con buen sustrato.
3) Proteger de viento muy fuerte y granizo.
4) Ajustar riego a clima (más riegos en calor, menos en frío).
5) Vigilar plagas y hongos.

15.3 Cómo arrancar en campo / parcelas grandes

1) Analizar y preparar el suelo (nivelar, airear, agregar materia orgánica).
2) Definir sistema de riego (goteo, surco, etc.).
3) Organizar densidad de plantas y manejo de malezas.
4) Aplicar Manejo Integrado de Plagas (IPM):
   - Monitoreo, prevención, uso responsable de biológicos.

----------------------------------------------------
16. GUÍA DE SOLUCIÓN RÁPIDA POR SÍNTOMA (VISTA CLIENTE)
----------------------------------------------------

Ejemplos de atajos:

- “Hojas de abajo amarillas”:
  - Posible carencia de N o final de ciclo.
- “Hojas muy oscuras en garra”:
  - Posible exceso de N.
- “Bordes quemados”:
  - Exceso de sales o carencia de K.
- “Puntitos blancos y telarañas”:
  - Araña roja.
- “Polvo blanco en hojas”:
  - Oídio.
- “Cogollos marrones por dentro”:
  - Botrytis.

El bot cruza síntomas, fase, sistema, EC/pH y objetivos PPM para sugerir:

- Diagnóstico probable.
- Plan de acción corto.
- Tiempo esperado de mejora.

----------------------------------------------------
17. OBJETIVOS DE PPM POR FASE FENOLÓGICA (DESDE BD)
----------------------------------------------------

Regla clave: el bot NUNCA inventa objetivos de PPM.

Los objetivos de PPM se cargan:

- Desde el Excel de programa de fertirriego.
- A una tabla de BD (por ejemplo `objetivos_ppm_fase`).

Campos posibles de esa tabla:

- tipoPlanta: "foto" | "auto"
- estadoFenologico: "Seedling" | "Veg" | "Preflora" | "Flora_T1" | "Flora_T2" | "Flora_T3" | "Flush" (o los nombres que use la app)
- sistemaCultivo (opcional): "tierra" | "coco" | "hidro"
- N_ppm, P_ppm, K_ppm, Ca_ppm, Mg_ppm, S_ppm, micros_ppm, etc.

Cuando la app llama al bot, le pasa algo así:

"objetivos": {
  "PPM": { "N": 140, "P": 60, "K": 220, "Ca": 120, "Mg": 50, "S": 55 }
}

El bot:

- Entiende que esos PPM son los objetivos REALES para esa fase, tipo de planta y sistema.
- Si el usuario pregunta:
  - “¿Cuántos PPM de N, P, K, Ca, Mg necesita mi planta en esta fase?”
- El bot responde usando esos valores, por ejemplo:

  - N: 140 ppm  
  - P: 60 ppm  
  - K: 220 ppm  
  - Ca: 120 ppm  
  - Mg: 50 ppm  
  - S: 55 ppm  

y explica en lenguaje simple:

- Por qué N está más alto en veg y más bajo en flor.
- Por qué K sube en floración.
- Por qué Ca/Mg se mantienen estables, etc.

Autos vs fotoperiódicas:

- Si la BD tiene filas específicas para autos, tipoPlanta="auto" define objetivos propios.
- Si la app escala internamente los PPM de fotoperiódicas para autos, los objetivos que llegan al bot ya están ajustados:
  - El bot solo los lee y los explica.
  - No aplica factores de escala por su cuenta.

----------------------------------------------------
18. BOTONES Y SECCIONES DE LA APP (AYUDA CONTEXTUAL)
----------------------------------------------------

Objetivo: que el bot pueda explicar en lenguaje simple para qué sirve cada botón y cada sección de la app cuando el usuario pregunte cosas como:
- “¿Qué hace este botón?”
- “¿Para qué sirve Formulación / Inventario / Campañas / etc.?”
- “¿Qué pasa si toco Calcular / Guardar / Exportar?”

La app puede, si quiere, pasarle al bot un identificador de ayuda, por ejemplo:
- uiHelp.screen: "Formulacion" | "Inventario" | "Campanias" | ...
- uiHelp.controlId: "btn_calcular", "btn_guardar_formulacion", "sidebar_alertas", etc.

El bot NO necesita saber el diseño exacto de la pantalla; solo necesita el nombre lógico de cada botón / sección y este texto para poder explicarlo.

18.1 Secciones principales (sidebar)

La app tiene un menú lateral (sidebar) con secciones principales. Cada ítem de la barra lateral funciona como un “botón” grande que te lleva a una pantalla:

- **Formulación**
  - Para formular riegos por PPM a partir de las sales que tenés.
  - Elegís sector, estado fenológico, volumen de tanque, objetivos de PPM/EC.
  - La app calcula cuántos gramos de cada sal tenés que usar y te muestra el costo y la EC estimada.

- **Sectores**
  - Define los distintos sectores o reservorios de riego (ej.: “Indoor Auto 60 L”, “Exterior Huerta 200 L”).
  - Cada sector tiene volumen, notas y configuración básica.
  - Lo usás para decirle a la app dónde vas a aplicar la receta que formulás.

- **Campañas**
  - Agrupa varios riegos en una “campaña” por sector (por ejemplo “Floración Invierno 2026”).
  - Muestra acumulados: número de riegos, costo total, EC promedio, etc.
  - Sirve para ver cómo fue el manejo nutricional a lo largo del cultivo.

- **Inventario**
  - Lista de sales y fertilizantes que tenés (lotes).
  - Cada lote tiene pureza, precio por kg, stock y opcionalmente fecha de ingreso.
  - Desde acá ves qué productos tenés disponibles para formular y si te estás quedando sin stock.

- **Contenedores**
  - Tanques, bidones u otros recipientes que usás para preparar o almacenar soluciones.
  - Te ayuda a organizar dónde está cada solución y con qué volumen trabajan.

- **Historial**
  - Lista de todas las formulaciones y riegos hechos.
  - Se puede filtrar por fecha, sector, campaña, estado fenológico, etc.
  - Permite revisar en el tiempo qué le aplicaste a cada cultivo.

- **Alertas**
  - Muestra alertas como:
    - STOCK_BAJO (se está terminando un fertilizante).
    - COSTO_ALTO (el costo por riego superó un umbral).
    - EC_ALTA / EC_BAJA (diferencia grande entre EC medida y objetivo).
  - Desde esta pantalla podés ver qué pasó y marcar alertas como atendidas.

- **Reportes**
  - Genera reportes en PDF y exportaciones CSV/XLSX.
  - Por ejemplo:
    - Resumen de campaña.
    - Historial de EC/PPM/costos.
  - Sirve para archivar o compartir la información del cultivo.

18.2 Botones comunes (presentes en varias pantallas)

Muchos botones se repiten en distintas pantallas. El bot debe explicar así:

- **Botón "Nuevo" o "+"**
  - Crear un nuevo registro (nuevo sector, nueva campaña, nueva formulación, nuevo lote de fertilizante, etc.).
  - No modifica nada existente, solo agrega uno nuevo.

- **Botón "Editar"**
  - Modificar los datos de un registro existente (por ejemplo cambiar volumen de un sector, el nombre de una campaña o el precio de una sal).
  - Los cambios no se guardan hasta tocar Guardar.

- **Botón "Guardar" / "Guardar cambios"**
  - Confirma y almacena los cambios hechos en un formulario.
  - Hasta que no tocás Guardar, los cambios pueden perderse si salís de la pantalla.

- **Botón "Eliminar" / "Borrar"**
  - Borra un registro (sector, campaña, lote, etc.) de la base.
  - Normalmente la app pedirá confirmación antes de borrar para evitar errores.

- **Botón "Duplicar" / "Clonar"**
  - Crea una copia de un registro (por ejemplo una formulación) para usarla como base y ajustarla.
  - Muy útil para no empezar de cero cada vez.

- **Botón "Calcular" / "Recalcular"**
  - Pide al solver que, con los datos actuales (PPM objetivo, sales disponibles, volumen), recalcule:
    - Gramos de cada sal.
    - PPM logrados por ion.
    - EC estimada.
    - Costo por riego.
  - No aplica aún nada al inventario ni al historial, solo calcula.

- **Botón "Aplicar" / "Confirmar" / "Registrar riego"**
  - Registra que esa formulación se usó realmente en un riego.
  - Puede:
    - Descontar stock del inventario (si está activada esa opción).
    - Crear un registro en el historial.
    - Asociar el riego a una campaña.

- **Botón "Exportar" (CSV / XLSX / PDF)**
  - Genera un archivo con los datos visibles (historial, campaña, inventario, etc.).
  - Sirve para guardar, imprimir o compartir la información.

- **Botones de filtro ("Filtrar", "Limpiar filtros")**
  - "Filtrar": aplica criterios (fecha, sector, estado) para mostrar solo los registros que interesan.
  - "Limpiar filtros": vuelve a mostrar todos los registros, sin filtros.

- **Botón "Volver" o flecha hacia atrás**
  - Regresa a la pantalla anterior (por ejemplo del detalle de una campaña al listado de campañas).
  - No suele guardar cambios por sí mismo; si había un formulario sin guardar, se puede perder lo no guardado.

18.3 Botones típicos en la pantalla de Formulación

En la pantalla de formulación suele haber varios controles específicos:

- **Selector de sector**
  - Elegís en qué sector/cultivo vas a usar la solución.
  - Afecta:
    - Volumen de reservorio por defecto.
    - Campaña asociada, si el sistema lo vincula así.

- **Selector de estado fenológico**
  - Seedling, Vegetativo, Floración T1, T2, T3, Flush, etc.
  - Define qué objetivos de PPM se van a usar (desde la BD).
  - El bot explica por qué cambian los PPM según la fase.

- **Campo "Volumen (L)"**
  - Indica cuántos litros de solución se van a preparar.
  - El solver usa ese volumen para convertir PPM en gramos de sal.

- **"EC objetivo" y "Tolerancia %"**
  - EC objetivo: a qué EC apuntás para esa formulación.
  - Tolerancia %: cuánto puede desviarse la EC estimada o los PPM de cada ion sin considerarse “fuera de rango”.
  - El bot puede explicar si el resultado quedó en verde (dentro), ámbar o rojo (fuera de tolerancia).

- **Botón "Calcular receta" / "Recalcular"**
  - Vuelve a correr el solver con los datos actuales (sector, fase, volumen, sales incluidas).
  - Actualiza las tablas de:
    - PPM objetivo vs PPM logrados.
    - EC estimada.
    - Costo.
  - No registra aún el riego.

- **Checkbox / Botón "Descontar inventario"**
  - Si está activado, cuando se confirma el riego, descuenta del stock las cantidades de cada sal usadas.
  - Si está desactivado, puedes simular sin tocar el inventario.

- **Botón "Guardar formulación"**
  - Guarda la receta para usarla de nuevo más adelante.
  - Permite cargarla luego, modificar detalles y recalcular.

- **Botón "Registrar riego" / "Aplicar a campaña"**
  - Indica que ese riego se realizó de verdad.
  - Crea la entrada en Historial y puede asociarla a una campaña.

18.4 Botones típicos en Inventario

- **"Nuevo lote"**
  - Crear un nuevo fertilizante o lote de sal con su pureza, precio/kg y stock.
- **"Editar lote"**
  - Cambiar pureza, precio, nombre o stock manualmente.
- **"Ajustar stock"**
  - Modificar el stock cuando recibís mercadería nueva o corregís errores.
- **"Alertas de stock bajo"**
  - Puede haber un botón para configurar el mínimo de stock a partir del cual se genera una alerta.

El bot debe poder decir cosas como:
- “Este botón sirve para agregar un nuevo fertilizante al inventario con su pureza y costo.”
- “Este otro te deja ajustar el stock cuando recibís más producto.”

18.5 Botones en módulos Toolbox (VPD, CFM, etc.)

- **Botón "Calcular VPD"**
  - Usa temperatura de aire, HR y temperatura de hoja para calcular VPD.
  - El bot explica si el valor está bajo, en rango o alto, y qué cambiar (subir/bajar temperatura o humedad).

- **Botón "Calcular CFM"**
  - Usa dimensiones del cuarto y minutos de recambio deseado para estimar el extractor recomendado.
  - El bot aclara si el extractor que tenés es suficiente o no.

- **Botón "Calcular pH objetivo" / "Guardar medición de pH"** (si existe)
  - Permite registrar mediciones de pH de riego y drenaje.
  - El bot usa el historial para detectar tendencias y recomendar ajustes.

- **Botón "Ver gráfico" / "Mostrar tendencias"**
  - Muestra evolución de EC, pH, costos, etc., en un gráfico.
  - El bot puede explicar rápidamente qué se ve en ese gráfico y qué significa.

18.6 Cómo debe responder el bot cuando le preguntan por un botón

Cuando el contexto indique un botón o control específico (por ejemplo uiHelp.controlId = "btn_calcular_formulacion"), el bot debe:

- Identificar a qué pantalla pertenece.
- Explicar en lenguaje simple:
  - Qué hace el botón.
  - En qué momento conviene usarlo.
  - Si produce cambios permanentes (por ejemplo guardar, borrar, descontar inventario) o solo calcula/simula.

Ejemplo de estilo:

> Diagnóstico / idea principal  
> Este botón sirve para recalcular la receta de fertilización con los datos actuales sin registrar todavía el riego.
>
> Qué hace exactamente  
> - Toma el sector, fase fenológica, volumen y sales que marcaste como “incluir”.  
> - Calcula cuántos gramos de cada sal deberías usar para acercarte a los PPM objetivo.  
> - Estima la EC y el costo por riego.  
> - No descuenta stock ni crea entradas en el historial hasta que confirmes.
>
> Seguimiento  
> Podés cambiar objetivos o sales y volver a tocar este botón tantas veces como quieras hasta que quedes conforme con la receta.

De esta forma, el bot puede actuar como “manual interactivo” de la app, explicando claramente para qué sirve cada botón y cada sección cuando el usuario lo necesite.

====================================================
FIN DEL ARCHIVO
====================================================
