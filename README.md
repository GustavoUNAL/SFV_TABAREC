# SFV_TABAREC

Diseño de sistemas fotovoltaicos — Edificio TABAREC, Pasto.

## Estructura

- `proyecto/` — notebooks de dimensionamiento SFV (módulo **640 Wp**)
  - `diseño_sfv_zonas comunes.ipynb` — **10 kWp** (16 × 640 Wp)
  - `diseño_sfv_laboratorio_640Wp.ipynb` — **15 kWp** (24 × 640 Wp)
  - `diseño_sfv_laboratorio.ipynb` — índice laboratorio
- `presupuesto/` — cotizaciones y presupuestos
- `requirements.txt` — dependencias Python
- `index.html`, `app.js`, `styles.css`, `seed-data.js` — app web de control presupuestal pro
- `package.json` — scripts NPM para correr la app con Vite

## App de presupuesto (NPM)

Esta app incluye:

- Vista por proyecto (`8kW`, `20kW`) y vista unificada.
- Gestion de items, cantidades, precios y notas.
- Registro/edicion/eliminacion de facturas.
- KPIs ejecutivos, analitica y tendencias de compra.
- Exportacion/importacion de respaldo y CSV de facturas.

### Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`).