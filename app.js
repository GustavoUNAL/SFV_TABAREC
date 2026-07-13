const STORAGE_KEY = "tabarec_budget_app_v9";
const SECCIONES_OPERATIVAS = [
  "Conexion acometida principal",
  "Cuarto tecnico",
  "Techo solar",
];
const PROJECT_PDF_OVERRIDES = {
  "8kW": [
    { keys: ["longi"], qty: 12, price: 415000 },
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
    { keys: ["longi"], qty: 39, price: 415000 },
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
  itemsFilterMeta: document.getElementById("itemsFilterMeta"),
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
  confirmDialog: document.getElementById("confirmDialog"),
  confirmDialogTitle: document.getElementById("confirmDialogTitle"),
  confirmDialogMessage: document.getElementById("confirmDialogMessage"),
  confirmOkBtn: document.getElementById("confirmOkBtn"),
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

function askConfirm({
  title = "Confirmar eliminacion",
  message = "Deseas eliminar este elemento?",
  confirmLabel = "Eliminar",
} = {}) {
  return new Promise((resolve) => {
    el.confirmDialogTitle.textContent = title;
    el.confirmDialogMessage.textContent = message;
    el.confirmOkBtn.textContent = confirmLabel;

    const onClose = () => {
      el.confirmDialog.removeEventListener("close", onClose);
      resolve(el.confirmDialog.returnValue === "confirm");
    };

    el.confirmDialog.addEventListener("close", onClose);
    el.confirmDialog.showModal();
  });
}

function applyComprasImport(stateObj) {
  if (typeof COMPRAS_IMPORT === "undefined") return stateObj;
  if (stateObj._importedComprasVersion === COMPRAS_IMPORT.version) return stateObj;

  const existingIds = new Set(stateObj.items.map((x) => x.id));
  for (const raw of COMPRAS_IMPORT.newItems || []) {
    if (existingIds.has(raw.id)) continue;
    stateObj.items.push({
      id: raw.id,
      project: raw.project,
      section: raw.section || "",
      seccionOperativa: raw.seccionOperativa || inferSeccionOperativa(raw),
      descripcion: raw.descripcion,
      unidad: raw.unidad || "und",
      cantidadProyectada: toNumber(raw.cantidadProyectada),
      cantidadCompradaManual: 0,
      cantidadComprada: 0,
      precioPromedioInternet: toNumber(raw.precioPromedioInternet),
      precioReal: 0,
      notas: raw.notas || "",
    });
    existingIds.add(raw.id);
  }

  const invIds = new Set((stateObj.invoices || []).map((x) => x.id));
  for (const inv of COMPRAS_IMPORT.invoices || []) {
    if (invIds.has(inv.id)) continue;
    const item = stateObj.items.find((x) => x.id === inv.itemId);
    stateObj.invoices.push({
      id: inv.id,
      date: inv.date,
      number: inv.number,
      supplier: inv.supplier,
      location: inv.location || "",
      qty: toNumber(inv.qty),
      unitPrice: toNumber(inv.unitPrice),
      total: toNumber(inv.total ?? toNumber(inv.qty) * toNumber(inv.unitPrice)),
      itemId: inv.itemId,
      project: inv.project || item?.project || "",
      itemDescription: inv.itemDescription || item?.descripcion || "",
    });
    invIds.add(inv.id);
  }

  // Precio real = ultimo precio unitario facturado por item
  const lastPrice = {};
  for (const inv of stateObj.invoices) {
    lastPrice[inv.itemId] = toNumber(inv.unitPrice);
  }
  for (const item of stateObj.items) {
    if (lastPrice[item.id] !== undefined) {
      item.precioReal = lastPrice[item.id];
    }
  }

  stateObj._importedComprasVersion = COMPRAS_IMPORT.version;
  stateObj._comprasNotes = COMPRAS_IMPORT.notes || [];
  return stateObj;
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return applyComprasImport(getFreshDefaultState());
  return applyComprasImport(normalizeState(JSON.parse(raw)));
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
  return {
    items,
    aiu: structuredClone(SEED_DATA.aiu),
    invoices: [],
    _migratedAcCablesToAcometida: true,
    _migratedModulos12_39: true,
    _importedComprasVersion: null,
  };
}

function isSolarModule(item) {
  const text = (item.descripcion || "").toLowerCase();
  return text.includes("longi") || ((text.includes("módulo") || text.includes("modulo")) && text.includes("fotovoltaico"));
}

function normalizeState(raw) {
  const base = getFreshDefaultState();
  const items = Array.isArray(raw.items) ? raw.items : base.items;
  const alreadyMigratedAc = raw._migratedAcCablesToAcometida === true;
  const alreadyMigratedModulos = raw._migratedModulos12_39 === true;
  return {
    items: items.map((item) => {
      // No reaplicar PDF overrides: preserva cantidades/precios editados por el usuario.
      const normalized = {
        ...item,
        seccionOperativa: item.seccionOperativa || inferSeccionOperativa(item),
        cantidadProyectada: toNumber(item.cantidadProyectada),
        cantidadCompradaManual: toNumber(item.cantidadCompradaManual ?? 0),
        cantidadComprada: 0,
        precioPromedioInternet:
          item.precioPromedioInternet !== undefined
            ? toNumber(item.precioPromedioInternet)
            : estimatePriceInternet(item.descripcion, item.unidad),
        precioReal: toNumber(item.precioReal || 0),
      };
      if (!alreadyMigratedAc && isAcCable(normalized)) {
        normalized.seccionOperativa = "Conexion acometida principal";
      }
      if (!alreadyMigratedModulos && isSolarModule(normalized)) {
        if (normalized.project === "8kW") normalized.cantidadProyectada = 12;
        if (normalized.project === "20kW") normalized.cantidadProyectada = 39;
      }
      return normalized;
    }),
    aiu: Array.isArray(raw.aiu) ? raw.aiu : base.aiu,
    invoices: Array.isArray(raw.invoices)
      ? raw.invoices.map((inv) => ({ ...inv, location: inv.location || "" }))
      : [],
    _migratedAcCablesToAcometida: true,
    _migratedModulos12_39: true,
    _importedComprasVersion: raw._importedComprasVersion || null,
    _comprasNotes: raw._comprasNotes || [],
  };
}

function isAcCable(item) {
  const section = (item.section || "").toLowerCase();
  const desc = (item.descripcion || "").toLowerCase();
  if (!section.includes("circuito ac")) return false;
  return (
    desc.includes("conductor") ||
    desc.includes("cable") ||
    desc.includes("awg") ||
    desc.includes("thhn") ||
    desc.includes("thwn") ||
    desc.includes("hffrls") ||
    /#\s*\d+/.test(desc)
  );
}

function inferSeccionOperativa(item) {
  const section = (item.section || "").toLowerCase();
  const desc = (item.descripcion || "").toLowerCase();
  const text = `${section} ${desc}`;
  if (
    text.includes("medidor") ||
    text.includes("acometida") ||
    text.includes("alimentador combinado") ||
    isAcCable(item)
  ) {
    return "Conexion acometida principal";
  }
  if (text.includes("modulo") || text.includes("panel") || text.includes("riel") || text.includes("clamp") || text.includes("cubierta")) {
    return "Techo solar";
  }
  return "Cuarto tecnico";
}

function sectionSelectHtml(item) {
  return `
    <select class="inline-input section-select" data-section-id="${item.id}" title="Cambiar seccion">
      ${SECCIONES_OPERATIVAS.map(
        (sec) =>
          `<option value="${escapeHtml(sec)}" ${
            sec === item.seccionOperativa ? "selected" : ""
          }>${escapeHtml(sec)}</option>`
      ).join("")}
    </select>`;
}

function estimatePriceInternet(desc, unidad) {
  const text = (desc || "").toLowerCase();
  const u = (unidad || "").toLowerCase();
  const rules = [
    { any: ["sun2000-8k"], v: 2900000 },
    { any: ["sun2000-10k"], v: 3213000 },
    { any: ["mclamp"], v: 2800 },
    { any: ["eclamp"], v: 2800 },
    { any: ["ground clamp"], v: 3000 },
    { any: ["l-hanger"], v: 3900 },
    { any: ["riel estructural"], v: 42000 },
    { all: ["longi", "650"], v: 415000 },
    { any: ["cable solar", "pv1"], v: 6200 },
    { any: ["awg 2"], v: 26000 },
    { any: ["awg 6"], v: 10000 },
    { any: ["awg 8"], v: 5200 },
    { any: ["mc4"], v: 11500 },
    { any: ["dps"], v: 78000 },
    { any: ["tablero"], v: 220000 },
    { any: ["interruptor"], v: 98000 },
    { any: ["tubería emt 1", "tuberia emt 1"], v: 9200 },
    { any: ["tubería imc", "tuberia imc"], v: 22000 },
    { any: ["accesorios emt"], v: 260000 },
    { any: ["accesorios imc"], v: 240000 },
    { any: ["bandeja portacables"], v: 98000 },
    { any: ["caja de paso"], v: 84000 },
    { any: ["marquilla", "rotulado"], v: 90000 },
    { any: ["cinta aislante", "terminales"], v: 115000 },
    { any: ["señalización", "senalizacion"], v: 78000 },
    { any: ["fusible"], v: 48000 },
    { any: ["inversor"], v: 2600000 },
  ];
  for (const r of rules) {
    if (r.all && r.all.every((k) => text.includes(k))) return r.v;
    if (r.any && r.any.some((k) => text.includes(k))) return r.v;
  }
  if (u === "ml") return 5800;
  if (u === "global") return 190000;
  return 30000;
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
  const labels = {
    PENDIENTE: { full: "Falta comprar", short: "F.C." },
    COMPLETO: { full: "Comprado", short: "OK" },
    EXCESO: { full: "Sobrecomprado", short: "EX" },
  };
  const current = labels[status] || { full: status, short: status };
  return `<span class="status-chip ${status.toLowerCase()}"><span class="full">${current.full}</span><span class="short">${current.short}</span></span>`;
}

function getTotals(item) {
  const estimado = toNumber(item.cantidadProyectada) * toNumber(item.precioPromedioInternet);
  const unitReal = toNumber(item.precioReal) || toNumber(item.precioPromedioInternet);
  const real = toNumber(item.cantidadComprada) * unitReal;
  return { estimado, real };
}

function getAiuFactor() {
  return state.aiu.reduce((acc, row) => acc + toNumber(row.porcentaje), 0) / 100;
}

function getSelectedSections() {
  if (!el.sectionFilter) return [];
  return [...el.sectionFilter.querySelectorAll('input[type="checkbox"]:checked')].map((box) => box.value);
}

function getFilteredItems() {
  const project = el.projectFilter.value;
  const status = el.statusFilter.value;
  const sections = getSelectedSections();
  const search = el.searchInput.value.trim().toLowerCase();
  // Sin secciones marcadas => tabla vacia (filtro activo).
  // Con secciones marcadas => solo esas.
  return state.items.filter((item) => {
    if (project !== "ALL" && item.project !== project) return false;
    if (status !== "ALL" && getStatus(item) !== status) return false;
    if (!sections.includes(item.seccionOperativa)) return false;
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
    comprado += getTotals(item).real;
    if (diff > 0) faltantes += 1;
  }
  return { comprar, comprado, faltantes };
}

function sumParts(items) {
  const empty = () => ({ estimado: 0, real: 0, pendiente: 0, items: 0 });
  const bySection = Object.fromEntries(SECCIONES_OPERATIVAS.map((s) => [s, empty()]));
  const byProject = { "8kW": empty(), "20kW": empty() };
  const byProjectSection = {
    "8kW": Object.fromEntries(SECCIONES_OPERATIVAS.map((s) => [s, empty()])),
    "20kW": Object.fromEntries(SECCIONES_OPERATIVAS.map((s) => [s, empty()])),
  };
  const total = empty();

  for (const item of items) {
    const totals = getTotals(item);
    const pendiente = Math.max(0, getDifference(item)) * toNumber(item.precioPromedioInternet);
    const bump = (bucket) => {
      bucket.estimado += totals.estimado;
      bucket.real += totals.real;
      bucket.pendiente += pendiente;
      bucket.items += 1;
    };
    bump(total);
    if (!bySection[item.seccionOperativa]) bySection[item.seccionOperativa] = empty();
    bump(bySection[item.seccionOperativa]);
    if (byProject[item.project]) bump(byProject[item.project]);
    if (byProjectSection[item.project]) {
      if (!byProjectSection[item.project][item.seccionOperativa]) {
        byProjectSection[item.project][item.seccionOperativa] = empty();
      }
      bump(byProjectSection[item.project][item.seccionOperativa]);
    }
  }
  return { total, bySection, byProject, byProjectSection };
}

function kpiPartCard(label, part, extraClass = "") {
  return `
    <article class="kpi kpi-part ${extraClass}">
      <div class="label">${escapeHtml(label)}</div>
      <div class="value">${formatCurrency(part.estimado)}</div>
      <div class="kpi-sub">Real ${formatCurrency(part.real)} · Pend. ${formatCurrency(part.pendiente)}</div>
    </article>`;
}

function renderBudgetSummary() {
  const filtered = getFilteredItems();
  const { total, bySection, byProject, byProjectSection } = sumParts(filtered);
  const projectFilter = el.projectFilter.value;
  const projectLabel = projectFilter === "ALL" ? "Todo unificado" : projectFilter;
  const sections = getSelectedSections();
  const sectionLabel =
    sections.length === 0 || sections.length === SECCIONES_OPERATIVAS.length
      ? "Todas las secciones"
      : sections.join(" + ");

  const projectsToShow = projectFilter === "ALL" ? ["8kW", "20kW"] : [projectFilter];

  const projectBlocks = projectsToShow
    .filter((p) => (byProject[p]?.items || 0) > 0)
    .map((p) => {
      const part = byProject[p];
      const sectionCards = SECCIONES_OPERATIVAS.filter(
        (sec) => (byProjectSection[p]?.[sec]?.items || 0) > 0
      )
        .map((sec) => kpiPartCard(`${sec}`, byProjectSection[p][sec], "kpi-section"))
        .join("");

      return `
        <div class="kpi-project-block">
          ${kpiPartCard(`Proyecto ${p}`, part, "kpi-project")}
          <div class="kpi-section-grid">${sectionCards}</div>
        </div>`;
    })
    .join("");

  // Totales por seccion (solo utiles en vista unificada)
  const sectionTotals =
    projectFilter === "ALL"
      ? SECCIONES_OPERATIVAS.filter((sec) => (bySection[sec]?.items || 0) > 0)
          .map((sec) => kpiPartCard(`${sec} (ambos proyectos)`, bySection[sec], "kpi-section-total"))
          .join("")
      : "";

  el.budgetSummary.innerHTML = `
    <article class="kpi kpi-highlight">
      <div class="label">Suma filtrada · ${escapeHtml(projectLabel)}</div>
      <div class="value">${formatCurrency(total.estimado)}</div>
      <div class="kpi-sub">${escapeHtml(sectionLabel)} · ${total.items} items · Real ${formatCurrency(total.real)} · Pend. ${formatCurrency(total.pendiente)}</div>
    </article>
    ${projectBlocks}
    ${sectionTotals ? `<div class="kpi-section-totals">${sectionTotals}</div>` : ""}
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
  const filtered = getFilteredItems();
  const project = el.projectFilter.value;
  const sections = getSelectedSections();
  const projectLabel = project === "ALL" ? "todos los proyectos" : project;
  const sectionLabel =
    sections.length === 0
      ? "ninguna seccion"
      : sections.length === SECCIONES_OPERATIVAS.length
        ? "todas las secciones"
        : sections.join(", ");

  if (el.itemsFilterMeta) {
    el.itemsFilterMeta.innerHTML = `Mostrando <strong>${filtered.length}</strong> de <strong>${state.items.length}</strong> items · ${escapeHtml(projectLabel)} · ${escapeHtml(sectionLabel)}`;
  }

  if (!filtered.length) {
    el.itemsBody.innerHTML = `
      <tr>
        <td colspan="10" data-label="Sin resultados">
          <div class="empty-filter">No hay items con este filtro. Marca al menos una seccion o cambia el proyecto.</div>
        </td>
      </tr>`;
    return;
  }

  el.itemsBody.innerHTML = filtered
    .sort((a, b) => {
      if (a.project !== b.project) return a.project.localeCompare(b.project);
      if (a.seccionOperativa !== b.seccionOperativa) return a.seccionOperativa.localeCompare(b.seccionOperativa);
      return a.descripcion.localeCompare(b.descripcion);
    })
    .map((item) => {
      const st = getStatus(item);
      return `
      <tr>
        <td data-label="Proyecto">${badge(item.project)}</td>
        <td data-label="Descripcion">
          <div class="item-title">${escapeHtml(item.descripcion)}</div>
          <div class="item-sub">${escapeHtml(item.unidad)}${item.notas ? ` • ${escapeHtml(item.notas)}` : ""}</div>
        </td>
        <td data-label="Sec.">${sectionSelectHtml(item)}</td>
        <td data-label="C.P.">${toNumber(item.cantidadProyectada).toFixed(2)}</td>
        <td data-label="P.P.">${formatCurrency(item.precioPromedioInternet)}</td>
        <td data-label="C.R.">${toNumber(item.cantidadComprada).toFixed(2)}</td>
        <td data-label="P.R.">${formatCurrency(item.precioReal)}</td>
        <td data-label="Est.">${statusChip(st)}</td>
        <td data-label="C.F.">${formatCurrency(Math.max(0, getDifference(item)) * toNumber(item.precioPromedioInternet))}</td>
        <td data-label="Acc.">
          <button type="button" class="ghost icon-btn" data-detail-id="${item.id}" title="Ver detalle">🔎 <span>Ver</span></button>
          <button type="button" class="danger ghost icon-btn" data-delete-id="${item.id}" title="Eliminar">🗑 <span>Del</span></button>
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
        <td data-label="Lugar">${escapeHtml(inv.location || "-")}</td>
        <td data-label="Proyecto">${badge(inv.project)}</td>
        <td data-label="Item"><small>${escapeHtml(inv.itemDescription || "")}</small></td>
        <td data-label="Cant.">${toNumber(inv.qty).toFixed(2)}</td>
        <td data-label="P.U.">${formatCurrency(inv.unitPrice)}</td>
        <td data-label="Total">${formatCurrency(inv.total)}</td>
        <td data-label="Acciones">
          <button type="button" class="ghost icon-btn" data-edit-invoice-id="${inv.id}" title="Editar">✏️ <span>Editar</span></button>
          <button type="button" class="danger ghost icon-btn" data-delete-invoice-id="${inv.id}" title="Eliminar">🗑 <span>Del</span></button>
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

  for (const c of [el.projectFilter, el.searchInput, el.statusFilter]) {
    c.addEventListener("input", rerender);
    c.addEventListener("change", rerender);
  }
  el.sectionFilter.addEventListener("change", rerender);
  el.sectionFilter.addEventListener("click", (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
      // Asegura que la tabla se actualice junto con el resumen.
      queueMicrotask(rerender);
    }
  });

  el.aiuBody.addEventListener("change", (event) => {
    const input = event.target.closest("[data-aiu-name]");
    if (!input) return;
    const row = state.aiu.find((x) => x.name === input.getAttribute("data-aiu-name"));
    if (!row) return;
    row.porcentaje = Math.max(0, toNumber(input.value));
    rerender();
  });

  el.itemsBody.addEventListener("change", (event) => {
    const sectionSelect = event.target.closest("[data-section-id]");
    if (!sectionSelect) return;
    const item = state.items.find((x) => x.id === sectionSelect.getAttribute("data-section-id"));
    if (!item) return;
    const next = sectionSelect.value;
    if (!SECCIONES_OPERATIVAS.includes(next)) return;
    item.seccionOperativa = next;
    rerender();
  });

  el.itemsBody.addEventListener("click", async (event) => {
    const detail = event.target.closest("[data-detail-id]");
    if (detail) { openItemDialog(detail.getAttribute("data-detail-id")); return; }
    const del = event.target.closest("[data-delete-id]");
    if (!del) return;
    const ok = await askConfirm({
      title: "Eliminar item",
      message: "Deseas eliminar este item? Tambien se eliminaran las facturas asociadas.",
      confirmLabel: "Eliminar",
    });
    if (!ok) return;
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

  el.invoicesBody.addEventListener("click", async (event) => {
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
    const ok = await askConfirm({
      title: "Eliminar factura",
      message: "Deseas eliminar esta factura?",
      confirmLabel: "Eliminar",
    });
    if (!ok) return;
    state.invoices = state.invoices.filter((x) => x.id !== del.getAttribute("data-delete-invoice-id"));
    rerender();
  });

  el.clearInvoicesBtn.addEventListener("click", async () => {
    const ok = await askConfirm({
      title: "Borrar facturas",
      message: "Esto borrara todas las facturas registradas. Continuar?",
      confirmLabel: "Borrar todas",
    });
    if (!ok) return;
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

  el.resetDataBtn.addEventListener("click", async () => {
    const ok = await askConfirm({
      title: "Reiniciar datos",
      message: "Se restauraran los datos iniciales e importaran de nuevo las compras de las fotos. Continuar?",
      confirmLabel: "Reiniciar",
    });
    if (!ok) return;
    const defaults = applyComprasImport(getFreshDefaultState());
    state.items = defaults.items;
    state.aiu = defaults.aiu;
    state.invoices = defaults.invoices;
    state._importedComprasVersion = defaults._importedComprasVersion;
    state._comprasNotes = defaults._comprasNotes;
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
