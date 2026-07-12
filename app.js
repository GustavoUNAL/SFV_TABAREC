const STORAGE_KEY = "tabarec_budget_app_v8";
const SECCIONES_OPERATIVAS = [
  "Conexion acometida principal",
  "Cuarto tecnico",
  "Techo solar",
];
const PROJECT_PDF_OVERRIDES = {
  "8kW": [
    { keys: ["módulo", "modulo", "longi"], qty: 13, price: 415000 },
    { keys: ["sun2000-8k"], qty: 1, price: 2900000 },
    { keys: ["cable solar", "6 mm"], qty: 60, price: 6367 },
    { keys: ["mc4"], qty: 2, price: 12500 },
    { keys: ["seccionador dc"], qty: 2, price: 88000 },
    { keys: ["dps dc"], qty: 1, price: 175000 },
    { keys: ["tablero", "dc"], qty: 1, price: 95000 },
    { keys: ["dps ac"], qty: 1, price: 68000 },
    { keys: ["tablero", "ac"], qty: 1, price: 110000 },
  ],
  "20kW": [
    { keys: ["módulo", "modulo", "longi"], qty: 38, price: 415000 },
    { keys: ["sun2000-10k"], qty: 2, price: 3213000 },
    { keys: ["cable solar", "6 mm"], qty: 144, price: 6367 },
    { keys: ["mc4"], qty: 4, price: 12000 },
    { keys: ["seccionador dc"], qty: 4, price: 88000 },
    { keys: ["dps dc"], qty: 2, price: 175000 },
    { keys: ["tablero", "dc"], qty: 1, price: 115000 },
    { keys: ["dps ac"], qty: 1, price: 68000 },
    { keys: ["tablero", "ac"], qty: 1, price: 185000 },
  ],
};

const state = loadState();
const ui = { editingInvoiceId: null };

const el = {
  tabBudget: document.getElementById("tabBudget"),
  tabAnalytics: document.getElementById("tabAnalytics"),
  viewBudget: document.getElementById("viewBudget"),
  viewAnalytics: document.getElementById("viewAnalytics"),
  projectFilter: document.getElementById("projectFilter"),
  searchInput: document.getElementById("searchInput"),
  statusFilter: document.getElementById("statusFilter"),
  sectionFilter: document.getElementById("sectionFilter"),
  budgetSummary: document.getElementById("budgetSummary"),
  kpis: document.getElementById("kpis"),
  projectChart: document.getElementById("projectChart"),
  trendChart: document.getElementById("trendChart"),
  sectionBars: document.getElementById("sectionBars"),
  pendingBody: document.getElementById("pendingBody"),
  aiuBody: document.getElementById("aiuBody"),
  itemsBody: document.getElementById("itemsBody"),
  addItemBtn: document.getElementById("addItemBtn"),
  invoiceForm: document.getElementById("invoiceForm"),
  invoiceProject: document.getElementById("invoiceProject"),
  invoiceItem: document.getElementById("invoiceItem"),
  invoicesBody: document.getElementById("invoicesBody"),
  clearInvoicesBtn: document.getElementById("clearInvoicesBtn"),
  saveInvoiceBtn: document.getElementById("saveInvoiceBtn"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  importJsonInput: document.getElementById("importJsonInput"),
  resetDataBtn: document.getElementById("resetDataBtn"),
  exportInvoicesCsvBtn: document.getElementById("exportInvoicesCsvBtn"),
  invoiceDate: document.getElementById("invoiceDate"),
  invoiceNumber: document.getElementById("invoiceNumber"),
  invoiceSupplier: document.getElementById("invoiceSupplier"),
  invoiceLocation: document.getElementById("invoiceLocation"),
  invoiceQty: document.getElementById("invoiceQty"),
  invoiceUnitPrice: document.getElementById("invoiceUnitPrice"),
  itemDialog: document.getElementById("itemDialog"),
  closeItemDialogBtn: document.getElementById("closeItemDialogBtn"),
  saveItemDetailBtn: document.getElementById("saveItemDetailBtn"),
  detailItemId: document.getElementById("detailItemId"),
  detailProject: document.getElementById("detailProject"),
  detailSectionOperativa: document.getElementById("detailSectionOperativa"),
  detailItemNumber: document.getElementById("detailItemNumber"),
  detailUnidad: document.getElementById("detailUnidad"),
  detailDescripcion: document.getElementById("detailDescripcion"),
  detailCantidadProyectada: document.getElementById("detailCantidadProyectada"),
  detailCantidadComprada: document.getElementById("detailCantidadComprada"),
  detailPrecioPromedioInternet: document.getElementById("detailPrecioPromedioInternet"),
  detailPrecioReal: document.getElementById("detailPrecioReal"),
  detailNotas: document.getElementById("detailNotas"),
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getFreshDefaultState();
  return normalizeState(JSON.parse(raw));
}

function getFreshDefaultState() {
  const items = structuredClone(SEED_DATA.items).map((item) => ({
    ...applyPdfOverrides({
      ...item,
      seccionOperativa: inferSeccionOperativa(item),
      cantidadCompradaManual: 0,
      cantidadComprada: 0,
      precioPromedioInternet: estimatePriceInternet(item.descripcion, item.unidad),
      precioReal: 0,
    }),
  }));
  return { items, aiu: structuredClone(SEED_DATA.aiu), invoices: [] };
}

function normalizeState(raw) {
  const base = getFreshDefaultState();
  const items = Array.isArray(raw.items) ? raw.items : base.items;
  return {
    items: items.map((item) => ({
      ...applyPdfOverrides({
        ...item,
        seccionOperativa: item.seccionOperativa || inferSeccionOperativa(item),
        cantidadCompradaManual: toNumber(item.cantidadCompradaManual ?? 0),
        cantidadComprada: 0,
        precioPromedioInternet:
          item.precioPromedioInternet !== undefined
            ? toNumber(item.precioPromedioInternet)
            : estimatePriceInternet(item.descripcion, item.unidad),
        precioReal: toNumber(item.precioReal || 0),
      }),
    })),
    aiu: Array.isArray(raw.aiu) ? raw.aiu : base.aiu,
    invoices: Array.isArray(raw.invoices)
      ? raw.invoices.map((inv) => ({ ...inv, location: inv.location || "" }))
      : [],
  };
}

function inferSeccionOperativa(item) {
  const text = `${item.section || ""} ${item.descripcion || ""}`.toLowerCase();
  if (text.includes("medidor") || text.includes("acometida") || text.includes("alimentador combinado") || text.includes("awg 2")) return "Conexion acometida principal";
  if (text.includes("modulo") || text.includes("panel") || text.includes("riel") || text.includes("clamp") || text.includes("cubierta")) return "Techo solar";
  return "Cuarto tecnico";
}

function estimatePriceInternet(desc, unidad) {
  const text = (desc || "").toLowerCase();
  const u = (unidad || "").toLowerCase();
  const rules = [
    { k: ["módulo", "modulo", "longi", "650"], v: 415000 },
    { k: ["sun2000-8k"], v: 2900000 },
    { k: ["sun2000-10k"], v: 3213000 },
    { k: ["inversor"], v: 3100000 },
    { k: ["cable solar", "pv1"], v: 6400 },
    { k: ["awg 2"], v: 29000 },
    { k: ["awg 6"], v: 12000 },
    { k: ["awg 8"], v: 6500 },
    { k: ["mc4"], v: 12500 },
    { k: ["dps"], v: 88000 },
    { k: ["tablero"], v: 280000 },
    { k: ["interruptor"], v: 125000 },
    { k: ["tubería emt 1", "tuberia emt 1"], v: 9600 },
    { k: ["tubería imc", "tuberia imc"], v: 26000 },
    { k: ["accesorios emt"], v: 360000 },
    { k: ["accesorios imc"], v: 320000 },
    { k: ["bandeja portacables"], v: 105000 },
    { k: ["caja de paso"], v: 92000 },
    { k: ["riel estructural"], v: 62000 },
    { k: ["l-hanger"], v: 4200 },
    { k: ["eclamp"], v: 2900 },
    { k: ["mclamp"], v: 2900 },
    { k: ["ground clamp"], v: 3200 },
    { k: ["marquilla", "rotulado"], v: 120000 },
    { k: ["cinta aislante", "terminales"], v: 140000 },
    { k: ["señalización", "senalizacion"], v: 95000 },
    { k: ["fusible"], v: 52000 },
  ];
  for (const r of rules) {
    if (r.k.some((k) => text.includes(k))) return r.v;
  }
  if (u === "ml") return 7600;
  if (u === "global") return 260000;
  return 70000;
}

function applyPdfOverrides(item) {
  const list = PROJECT_PDF_OVERRIDES[item.project] || [];
  const text = (item.descripcion || "").toLowerCase();
  const hit = list.find((rule) => rule.keys.every((k) => text.includes(k)));
  if (!hit) return item;
  return {
    ...item,
    cantidadProyectada: hit.qty,
    precioPromedioInternet: hit.price,
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatCurrency(v) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(toNumber(v));
}

function escapeHtml(v) {
  return String(v || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function badge(project) {
  return `<span class="project-badge ${project === "8kW" ? "p8" : "p20"}">${project}</span>`;
}

function recalcCompradas() {
  const byItem = {};
  for (const inv of state.invoices) {
    byItem[inv.itemId] = (byItem[inv.itemId] || 0) + toNumber(inv.qty);
  }
  for (const item of state.items) {
    item.cantidadComprada = toNumber(item.cantidadCompradaManual) + (byItem[item.id] || 0);
  }
}

function getDifference(item) {
  return toNumber(item.cantidadProyectada) - toNumber(item.cantidadComprada);
}

function getStatus(item) {
  const d = getDifference(item);
  if (d > 0) return "PENDIENTE";
  if (d < 0) return "EXCESO";
  return "COMPLETO";
}

function statusChip(status) {
  const labels = { PENDIENTE: "Falta comprar", COMPLETO: "Comprado", EXCESO: "Sobrecomprado" };
  return `<span class="status-chip ${status.toLowerCase()}">${labels[status]}</span>`;
}

function getTotals(item) {
  const estimado = toNumber(item.cantidadProyectada) * toNumber(item.precioPromedioInternet);
  const real = toNumber(item.cantidadComprada) * toNumber(item.precioReal);
  return { estimado, real };
}

function getAiuFactor() {
  return state.aiu.reduce((acc, row) => acc + toNumber(row.porcentaje), 0) / 100;
}

function getFilteredItems() {
  const project = el.projectFilter.value;
  const status = el.statusFilter.value;
  const section = el.sectionFilter.value;
  const search = el.searchInput.value.trim().toLowerCase();
  return state.items.filter((item) => {
    if (project !== "ALL" && item.project !== project) return false;
    if (status !== "ALL" && getStatus(item) !== status) return false;
    if (section !== "ALL" && item.seccionOperativa !== section) return false;
    if (!search) return true;
    const text = `${item.descripcion} ${item.seccionOperativa} ${item.unidad} ${item.notas || ""}`.toLowerCase();
    return text.includes(search);
  });
}

function getAnalytics(items) {
  let materialEstimado = 0;
  let materialReal = 0;
  let faltantes = 0;
  let comprados = 0;
  let pendiente = 0;
  for (const item of items) {
    const totals = getTotals(item);
    materialEstimado += totals.estimado;
    materialReal += totals.real;
    const st = getStatus(item);
    if (st === "PENDIENTE") faltantes += 1;
    if (st === "COMPLETO") comprados += 1;
    if (getDifference(item) > 0) pendiente += getDifference(item) * toNumber(item.precioPromedioInternet);
  }
  const aiu = getAiuFactor();
  const totalProyectado = materialEstimado * (1 + aiu);
  const totalComprado = materialReal * (1 + aiu);
  return { materialEstimado, materialReal, totalProyectado, totalComprado, faltantes, comprados, pendiente, avance: totalProyectado > 0 ? (totalComprado / totalProyectado) * 100 : 0 };
}

function getProjectTotals(project) {
  const items = state.items.filter((x) => x.project === project);
  let comprar = 0;
  let comprado = 0;
  let faltantes = 0;
  for (const item of items) {
    const diff = getDifference(item);
    comprar += Math.max(0, diff) * toNumber(item.precioPromedioInternet);
    comprado += toNumber(item.cantidadComprada) * toNumber(item.precioReal);
    if (diff > 0) faltantes += 1;
  }
  return { comprar, comprado, faltantes };
}

function renderBudgetSummary() {
  const p8 = getProjectTotals("8kW");
  const p20 = getProjectTotals("20kW");
  const totalComprado = p8.comprado + p20.comprado;
  const totalComprar = p8.comprar + p20.comprar;
  const totalFaltantes = p8.faltantes + p20.faltantes;
  const avance = totalComprado + totalComprar > 0 ? (totalComprado / (totalComprado + totalComprar)) * 100 : 0;

  el.budgetSummary.innerHTML = `
    <article class="kpi"><div class="label">Total por comprar 8kW</div><div class="value">${formatCurrency(p8.comprar)}</div></article>
    <article class="kpi"><div class="label">Total por comprar 20kW</div><div class="value">${formatCurrency(p20.comprar)}</div></article>
    <article class="kpi"><div class="label">Comprado proyecto 8kW</div><div class="value">${formatCurrency(p8.comprado)}</div></article>
    <article class="kpi"><div class="label">Comprado proyecto 20kW</div><div class="value">${formatCurrency(p20.comprado)}</div></article>
    <article class="kpi"><div class="label">Total compras general</div><div class="value">${formatCurrency(totalComprado)}</div></article>
    <article class="kpi"><div class="label">Total pendiente general</div><div class="value">${formatCurrency(totalComprar)}</div></article>
    <article class="kpi"><div class="label">Items faltantes</div><div class="value">${totalFaltantes}</div></article>
    <article class="kpi"><div class="label">Avance compras</div><div class="value">${avance.toFixed(1)}%</div></article>
  `;
}

function renderKpis() {
  const k = getAnalytics(getFilteredItems());
  el.kpis.innerHTML = `
    <article class="kpi"><div class="label">Total proyectado (promedio internet)</div><div class="value">${formatCurrency(k.totalProyectado)}</div></article>
    <article class="kpi"><div class="label">Total comprado (real)</div><div class="value">${formatCurrency(k.totalComprado)}</div></article>
    <article class="kpi"><div class="label">Pendiente por comprar</div><div class="value">${formatCurrency(k.pendiente)}</div></article>
    <article class="kpi"><div class="label">Avance real</div><div class="value">${k.avance.toFixed(1)}%</div></article>
    <article class="kpi"><div class="label">Items comprados</div><div class="value">${k.comprados}</div></article>
    <article class="kpi"><div class="label">Items faltantes</div><div class="value">${k.faltantes}</div></article>
    <article class="kpi"><div class="label">Material promedio internet</div><div class="value">${formatCurrency(k.materialEstimado)}</div></article>
    <article class="kpi"><div class="label">Material real</div><div class="value">${formatCurrency(k.materialReal)}</div></article>
  `;
}

function renderAiuTable() {
  el.aiuBody.innerHTML = state.aiu
    .map((row) => `<tr><td data-label="Concepto AIU">${escapeHtml(row.name)}</td><td data-label="% sobre materiales"><input class="inline-input" type="number" step="0.1" min="0" data-aiu-name="${escapeHtml(row.name)}" value="${toNumber(row.porcentaje)}"></td></tr>`)
    .join("");
}

function renderItemsTable() {
  el.itemsBody.innerHTML = getFilteredItems()
    .sort((a, b) => {
      if (a.project !== b.project) return a.project.localeCompare(b.project);
      if (a.seccionOperativa !== b.seccionOperativa) return a.seccionOperativa.localeCompare(b.seccionOperativa);
      return a.descripcion.localeCompare(b.descripcion);
    })
    .map((item) => {
      const st = getStatus(item);
      const totals = getTotals(item);
      return `
      <tr>
        <td data-label="Proyecto">${badge(item.project)}</td>
        <td data-label="Descripcion">
          <div class="item-title">${escapeHtml(item.descripcion)}</div>
          <div class="item-sub">${escapeHtml(item.unidad)}${item.notas ? ` • ${escapeHtml(item.notas)}` : ""}</div>
        </td>
        <td data-label="Seccion operativa">${escapeHtml(item.seccionOperativa)}</td>
        <td data-label="Cant. proyectada">${toNumber(item.cantidadProyectada).toFixed(2)}</td>
        <td data-label="Precio proyectado">${formatCurrency(item.precioPromedioInternet)}</td>
        <td data-label="Cant. real">${toNumber(item.cantidadComprada).toFixed(2)}</td>
        <td data-label="Precio real">${formatCurrency(item.precioReal)}</td>
        <td data-label="Estado">${statusChip(st)}</td>
        <td data-label="Costo faltante">${formatCurrency(Math.max(0, getDifference(item)) * toNumber(item.precioPromedioInternet))}</td>
        <td data-label="Acciones">
          <button type="button" class="ghost" data-detail-id="${item.id}">Ver detalle</button>
          <button type="button" class="danger ghost" data-delete-id="${item.id}">Eliminar</button>
        </td>
      </tr>`;
    })
    .join("");
}

function renderInvoiceItemOptions() {
  el.invoiceItem.innerHTML = state.items
    .filter((x) => x.project === el.invoiceProject.value)
    .sort((a, b) => a.descripcion.localeCompare(b.descripcion))
    .map((i) => `<option value="${i.id}">${escapeHtml(i.descripcion).slice(0, 95)}</option>`)
    .join("");
}

function renderInvoicesTable() {
  el.invoicesBody.innerHTML = [...state.invoices]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((inv) => `
      <tr>
        <td data-label="Fecha">${escapeHtml(inv.date)}</td>
        <td data-label="Factura">${escapeHtml(inv.number)}</td>
        <td data-label="Proveedor">${escapeHtml(inv.supplier)}</td>
        <td data-label="Donde se compro">${escapeHtml(inv.location || "-")}</td>
        <td data-label="Proyecto">${badge(inv.project)}</td>
        <td data-label="Item"><small>${escapeHtml(inv.itemDescription || "")}</small></td>
        <td data-label="Cantidad">${toNumber(inv.qty).toFixed(2)}</td>
        <td data-label="Precio unitario">${formatCurrency(inv.unitPrice)}</td>
        <td data-label="Total">${formatCurrency(inv.total)}</td>
        <td data-label="Acciones">
          <button type="button" class="ghost" data-edit-invoice-id="${inv.id}">Editar</button>
          <button type="button" class="danger ghost" data-delete-invoice-id="${inv.id}">Eliminar</button>
        </td>
      </tr>`)
    .join("");
}

function renderPendingTable() {
  el.pendingBody.innerHTML = getFilteredItems()
    .filter((item) => getDifference(item) > 0)
    .map((item) => ({ item, faltante: getDifference(item), costo: getDifference(item) * toNumber(item.precioPromedioInternet) }))
    .sort((a, b) => b.costo - a.costo)
    .slice(0, 10)
    .map(({ item, faltante, costo }) => `
      <tr>
        <td data-label="Proyecto">${badge(item.project)}</td>
        <td data-label="Item">${escapeHtml(item.descripcion)}</td>
        <td data-label="Descripcion"><small>${escapeHtml(item.descripcion)}</small></td>
        <td data-label="Faltante">${faltante.toFixed(2)} ${escapeHtml(item.unidad)}</td>
        <td data-label="Costo faltante">${formatCurrency(costo)}</td>
      </tr>`)
    .join("");
}

function renderSectionBars() {
  const grouped = {};
  for (const item of getFilteredItems()) {
    grouped[item.seccionOperativa] = (grouped[item.seccionOperativa] || 0) + getTotals(item).real;
  }
  const pairs = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...pairs.map((x) => x[1]));
  el.sectionBars.innerHTML = pairs
    .map(([sec, val]) => `
      <div class="bar-row">
        <span>${escapeHtml(sec)}</span>
        <div class="bar"><span style="width:${(val / max) * 100}%"></span></div>
        <strong>${formatCurrency(val)}</strong>
      </div>`)
    .join("");
}

function drawBarChart(canvas, labels, projected, purchased) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  const left = 55, right = 20, top = 15, bottom = 40;
  const plotW = w - left - right, plotH = h - top - bottom;
  const maxVal = Math.max(1, ...projected, ...purchased);
  const groupW = plotW / labels.length, barW = Math.min(32, groupW * 0.3);
  ctx.strokeStyle = "#d6e1ef";
  for (let i = 0; i <= 4; i += 1) {
    const y = top + (plotH / 4) * i;
    ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + plotW, y); ctx.stroke();
  }
  labels.forEach((label, i) => {
    const x = left + groupW * i + groupW / 2;
    const ph = (projected[i] / maxVal) * plotH;
    const ch = (purchased[i] / maxVal) * plotH;
    ctx.fillStyle = "#a6c8e6"; ctx.fillRect(x - barW - 2, top + plotH - ph, barW, ph);
    ctx.fillStyle = "#0f4c81"; ctx.fillRect(x + 2, top + plotH - ch, barW, ch);
    ctx.fillStyle = "#475467"; ctx.font = "12px Arial"; ctx.textAlign = "center"; ctx.fillText(label, x, h - 14);
  });
}

function drawLineChart(canvas, labels, values) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  const left = 45, right = 20, top = 15, bottom = 38;
  const plotW = w - left - right, plotH = h - top - bottom;
  const maxVal = Math.max(1, ...values);
  ctx.strokeStyle = "#d6e1ef";
  for (let i = 0; i <= 4; i += 1) {
    const y = top + (plotH / 4) * i;
    ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + plotW, y); ctx.stroke();
  }
  if (values.length === 0) return;
  ctx.strokeStyle = "#0f4c81"; ctx.lineWidth = 2; ctx.beginPath();
  values.forEach((v, i) => {
    const x = left + (plotW / Math.max(1, values.length - 1)) * i;
    const y = top + plotH - (v / maxVal) * plotH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  values.forEach((v, i) => {
    const x = left + (plotW / Math.max(1, values.length - 1)) * i;
    const y = top + plotH - (v / maxVal) * plotH;
    ctx.fillStyle = "#0f4c81"; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#475467"; ctx.font = "11px Arial"; ctx.textAlign = "center"; ctx.fillText(labels[i], x, h - 12);
  });
}

function syncCanvasDpi() {
  for (const canvas of [el.projectChart, el.trendChart]) {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
    canvas.height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
    canvas.getContext("2d").setTransform(1, 0, 0, 1, 0, 0);
  }
}

function renderCharts() {
  const projects = ["8kW", "20kW"];
  const projected = projects.map((p) => getAnalytics(state.items.filter((x) => x.project === p)).totalProyectado);
  const purchased = projects.map((p) => getAnalytics(state.items.filter((x) => x.project === p)).totalComprado);
  drawBarChart(el.projectChart, projects, projected, purchased);

  const grouped = {};
  for (const inv of state.invoices) {
    const month = (inv.date || "").slice(0, 7);
    if (!month) continue;
    grouped[month] = (grouped[month] || 0) + toNumber(inv.total);
  }
  const months = Object.keys(grouped).sort();
  drawLineChart(el.trendChart, months.map((m) => m.slice(5)), months.map((m) => grouped[m]));
}

function setTab(target) {
  const isBudget = target === "budget";
  el.tabBudget.classList.toggle("active", isBudget);
  el.tabAnalytics.classList.toggle("active", !isBudget);
  el.viewBudget.classList.toggle("active", isBudget);
  el.viewAnalytics.classList.toggle("active", !isBudget);
  if (!isBudget) { syncCanvasDpi(); renderCharts(); }
}

function openItemDialog(itemId) {
  const item = state.items.find((x) => x.id === itemId);
  if (!item) return;
  el.detailItemId.value = item.id;
  el.detailProject.value = item.project;
  el.detailSectionOperativa.value = item.seccionOperativa;
  el.detailItemNumber.value = "";
  el.detailUnidad.value = item.unidad;
  el.detailDescripcion.value = item.descripcion;
  el.detailCantidadProyectada.value = toNumber(item.cantidadProyectada);
  el.detailCantidadComprada.value = toNumber(item.cantidadCompradaManual);
  el.detailPrecioPromedioInternet.value = toNumber(item.precioPromedioInternet);
  el.detailPrecioReal.value = toNumber(item.precioReal);
  el.detailNotas.value = item.notas || "";
  el.itemDialog.showModal();
}

function saveItemDialog() {
  const item = state.items.find((x) => x.id === el.detailItemId.value);
  if (!item) return;
  item.project = el.detailProject.value;
  item.seccionOperativa = el.detailSectionOperativa.value;
  item.unidad = el.detailUnidad.value.trim();
  item.descripcion = el.detailDescripcion.value.trim();
  item.cantidadProyectada = toNumber(el.detailCantidadProyectada.value);
  item.cantidadCompradaManual = toNumber(el.detailCantidadComprada.value);
  item.precioPromedioInternet = toNumber(el.detailPrecioPromedioInternet.value);
  item.precioReal = toNumber(el.detailPrecioReal.value);
  item.notas = el.detailNotas.value.trim();
  el.itemDialog.close();
  rerender();
}

function rerender() {
  recalcCompradas();
  renderBudgetSummary();
  renderKpis();
  renderAiuTable();
  renderItemsTable();
  renderInvoiceItemOptions();
  renderInvoicesTable();
  renderPendingTable();
  renderSectionBars();
  if (el.viewAnalytics.classList.contains("active")) { syncCanvasDpi(); renderCharts(); }
  saveState();
}

function resetInvoiceForm() {
  ui.editingInvoiceId = null;
  el.saveInvoiceBtn.textContent = "Registrar factura";
  el.invoiceForm.reset();
  el.invoiceProject.value = "8kW";
  renderInvoiceItemOptions();
}

function collectInvoiceFormData() {
  const item = state.items.find((x) => x.id === el.invoiceItem.value);
  const payload = {
    id: ui.editingInvoiceId || crypto.randomUUID(),
    date: el.invoiceDate.value,
    number: el.invoiceNumber.value.trim(),
    supplier: el.invoiceSupplier.value.trim(),
    location: el.invoiceLocation.value.trim(),
    qty: toNumber(el.invoiceQty.value),
    unitPrice: toNumber(el.invoiceUnitPrice.value),
    itemId: el.invoiceItem.value,
    project: item?.project || "",
    itemDescription: item?.descripcion || "",
  };
  payload.total = payload.qty * payload.unitPrice;
  if (!item || !payload.date || !payload.number || !payload.supplier || !payload.location || payload.qty <= 0) return null;
  return payload;
}

function exportJsonBackup() {
  const payload = { exportedAt: new Date().toISOString(), data: state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tabarec-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportInvoicesCsv() {
  const rows = [["fecha","factura","proveedor","donde_se_compro","proyecto","descripcion","cantidad","precioUnitario","total"]];
  for (const inv of state.invoices) {
    rows.push([inv.date, inv.number, inv.supplier, inv.location || "", inv.project, inv.itemDescription, inv.qty, inv.unitPrice, inv.total]);
  }
  const csv = rows.map((line) => line.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tabarec-facturas-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function setupEvents() {
  el.tabBudget.addEventListener("click", () => setTab("budget"));
  el.tabAnalytics.addEventListener("click", () => setTab("analytics"));

  for (const c of [el.projectFilter, el.searchInput, el.statusFilter, el.sectionFilter]) {
    c.addEventListener("input", rerender);
  }

  el.aiuBody.addEventListener("change", (event) => {
    const input = event.target.closest("[data-aiu-name]");
    if (!input) return;
    const row = state.aiu.find((x) => x.name === input.getAttribute("data-aiu-name"));
    if (!row) return;
    row.porcentaje = Math.max(0, toNumber(input.value));
    rerender();
  });

  el.itemsBody.addEventListener("click", (event) => {
    const detail = event.target.closest("[data-detail-id]");
    if (detail) { openItemDialog(detail.getAttribute("data-detail-id")); return; }
    const del = event.target.closest("[data-delete-id]");
    if (!del) return;
    if (!window.confirm("Deseas eliminar este item?")) return;
    const id = del.getAttribute("data-delete-id");
    state.items = state.items.filter((x) => x.id !== id);
    state.invoices = state.invoices.filter((x) => x.itemId !== id);
    rerender();
  });

  el.addItemBtn.addEventListener("click", () => {
    const project = window.prompt("Proyecto para el nuevo item: 8kW o 20kW", "8kW");
    if (!project || !["8kW", "20kW"].includes(project)) return;
    state.items.push({
      id: `${project}-${Date.now()}`,
      project,
      seccionOperativa: "Cuarto tecnico",
      descripcion: "Nuevo material",
      unidad: "und",
      cantidadProyectada: 0,
      cantidadCompradaManual: 0,
      cantidadComprada: 0,
      precioPromedioInternet: 100000,
      precioReal: 0,
      notas: "",
    });
    rerender();
  });

  el.invoiceProject.addEventListener("change", renderInvoiceItemOptions);

  el.invoiceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const payload = collectInvoiceFormData();
    if (!payload) return;
    if (ui.editingInvoiceId) {
      const idx = state.invoices.findIndex((x) => x.id === ui.editingInvoiceId);
      if (idx >= 0) state.invoices[idx] = payload;
    } else {
      state.invoices.push(payload);
    }
    resetInvoiceForm();
    rerender();
  });

  el.invoicesBody.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-invoice-id]");
    if (edit) {
      const inv = state.invoices.find((x) => x.id === edit.getAttribute("data-edit-invoice-id"));
      if (!inv) return;
      ui.editingInvoiceId = inv.id;
      el.saveInvoiceBtn.textContent = "Guardar cambios";
      el.invoiceDate.value = inv.date;
      el.invoiceNumber.value = inv.number;
      el.invoiceSupplier.value = inv.supplier;
      el.invoiceLocation.value = inv.location || "";
      el.invoiceProject.value = inv.project;
      renderInvoiceItemOptions();
      el.invoiceItem.value = inv.itemId;
      el.invoiceQty.value = inv.qty;
      el.invoiceUnitPrice.value = inv.unitPrice;
      return;
    }
    const del = event.target.closest("[data-delete-invoice-id]");
    if (!del) return;
    if (!window.confirm("Deseas eliminar esta factura?")) return;
    state.invoices = state.invoices.filter((x) => x.id !== del.getAttribute("data-delete-invoice-id"));
    rerender();
  });

  el.clearInvoicesBtn.addEventListener("click", () => {
    if (!window.confirm("Esto borrara todas las facturas registradas. Continuar?")) return;
    state.invoices = [];
    resetInvoiceForm();
    rerender();
  });

  el.exportJsonBtn.addEventListener("click", exportJsonBackup);
  el.exportInvoicesCsvBtn.addEventListener("click", exportInvoicesCsv);

  el.importJsonInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported = normalizeState(parsed.data || parsed);
      state.items = imported.items;
      state.aiu = imported.aiu;
      state.invoices = imported.invoices;
      resetInvoiceForm();
      rerender();
      window.alert("Respaldo importado correctamente.");
    } catch (_error) {
      window.alert("No se pudo importar el respaldo.");
    } finally {
      el.importJsonInput.value = "";
    }
  });

  el.resetDataBtn.addEventListener("click", () => {
    if (!window.confirm("Se restauraran los datos iniciales. Continuar?")) return;
    const defaults = getFreshDefaultState();
    state.items = defaults.items;
    state.aiu = defaults.aiu;
    state.invoices = defaults.invoices;
    resetInvoiceForm();
    rerender();
  });

  el.closeItemDialogBtn.addEventListener("click", () => el.itemDialog.close());
  el.saveItemDetailBtn.addEventListener("click", saveItemDialog);

  window.addEventListener("resize", () => {
    if (el.viewAnalytics.classList.contains("active")) {
      syncCanvasDpi();
      renderCharts();
    }
  });
}

setupEvents();
setTab("budget");
resetInvoiceForm();
rerender();
