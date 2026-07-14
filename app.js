const STORAGE_KEY = "tabarec_budget_app_v9";
const UI_STORAGE_KEY = "tabarec_budget_ui_v1";
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

// Debe declararse antes de loadState(): applyComprasImport usa estos links al migrar.
const INVOICE_DRIVE_LINKS = {
  defa: "https://drive.google.com/file/d/1C90C9ooS0IO-1IebiyksTo1PMYT5X53J/view",
  casaDielectrica: "https://drive.google.com/file/d/1f9c-aZ18KPgx8eE6PR0wwxaWqKO6Sic5/view?usp=sharing",
  solucionesElectricas: "https://drive.google.com/file/d/1WT0s-kQ8EYK_H_RtFzNnC1E_AmbrT8tn/view?usp=sharing",
  devolucionConduleta: "https://drive.google.com/file/d/1jkqv28YnA8j8sZfMZSmMmeYtDFzyZwXq/view?usp=sharing",
  solarHub: "https://drive.google.com/file/d/1qMfd8ECGO22618ysa6eICzEoWR2MQT2d/view?usp=sharing",
};

const state = loadState();
const ui = {
  editingInvoiceId: null,
  activeTab: "home",
  activeBudgetPanel: "projected",
  ...loadUiState(),
};

const el = {
  tabHome: document.getElementById("tabHome"),
  tabBudget: document.getElementById("tabBudget"),
  tabAnalytics: document.getElementById("tabAnalytics"),
  viewHome: document.getElementById("viewHome"),
  viewBudget: document.getElementById("viewBudget"),
  viewAnalytics: document.getElementById("viewAnalytics"),
  homeSummary8: document.getElementById("homeSummary8"),
  homeSummary20: document.getElementById("homeSummary20"),
  homeGlobalKpis: document.getElementById("homeGlobalKpis"),
  homeAvance8: document.getElementById("homeAvance8"),
  homeAvance20: document.getElementById("homeAvance20"),
  homeBar8: document.getElementById("homeBar8"),
  homeBar20: document.getElementById("homeBar20"),
  homeSections8: document.getElementById("homeSections8"),
  homeSections20: document.getElementById("homeSections20"),
  homePending: document.getElementById("homePending"),
  themeToggle: document.getElementById("themeToggle"),
  themeSwitchLabel: document.getElementById("themeSwitchLabel"),
  projectFilter: document.getElementById("projectFilter"),
  searchInput: document.getElementById("searchInput"),
  statusFilter: document.getElementById("statusFilter"),
  sectionFilter: document.getElementById("sectionFilter"),
  panelProjectedBtn: document.getElementById("panelProjectedBtn"),
  panelPurchasesBtn: document.getElementById("panelPurchasesBtn"),
  panelCrossBtn: document.getElementById("panelCrossBtn"),
  panelInvoicesBtn: document.getElementById("panelInvoicesBtn"),
  panelProjected: document.getElementById("panelProjected"),
  panelPurchases: document.getElementById("panelPurchases"),
  panelCross: document.getElementById("panelCross"),
  panelInvoices: document.getElementById("panelInvoices"),
  itemsFilterMeta: document.getElementById("itemsFilterMeta"),
  purchasesMeta: document.getElementById("purchasesMeta"),
  consistencySummary: document.getElementById("consistencySummary"),
  budgetSummary: document.getElementById("budgetSummary"),
  kpis: document.getElementById("kpis"),
  projectChart: document.getElementById("projectChart"),
  trendChart: document.getElementById("trendChart"),
  sectionBars: document.getElementById("sectionBars"),
  pendingBody: document.getElementById("pendingBody"),
  aiuBody: document.getElementById("aiuBody"),
  projectedBody: document.getElementById("projectedBody"),
  purchasesBody: document.getElementById("purchasesBody"),
  crosscheckBody: document.getElementById("crosscheckBody"),
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
  invoiceFileLink: document.getElementById("invoiceFileLink"),
  itemDialog: document.getElementById("itemDialog"),
  confirmDialog: document.getElementById("confirmDialog"),
  confirmDialogTitle: document.getElementById("confirmDialogTitle"),
  confirmDialogMessage: document.getElementById("confirmDialogMessage"),
  confirmOkBtn: document.getElementById("confirmOkBtn"),
  invoiceGroupDialog: document.getElementById("invoiceGroupDialog"),
  closeInvoiceDetailBtn: document.getElementById("closeInvoiceDetailBtn"),
  invoiceDetailTitle: document.getElementById("invoiceDetailTitle"),
  invoiceDetailMeta: document.getElementById("invoiceDetailMeta"),
  invoiceDetailLinks: document.getElementById("invoiceDetailLinks"),
  invoiceDetailBody: document.getElementById("invoiceDetailBody"),
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

  const retireItems = new Set(COMPRAS_IMPORT.retireItemIds || []);
  const supersedeInvoices = new Set(COMPRAS_IMPORT.supersedeInvoiceIds || []);

  stateObj.items = (stateObj.items || []).filter((item) => !retireItems.has(item.id));
  stateObj.invoices = (stateObj.invoices || []).filter((inv) => !supersedeInvoices.has(inv.id));

  const existingIds = new Set(stateObj.items.map((x) => x.id));
  for (const raw of COMPRAS_IMPORT.newItems || []) {
    if (existingIds.has(raw.id)) {
      const item = stateObj.items.find((x) => x.id === raw.id);
      if (item) {
        item.cantidadProyectada = toNumber(raw.cantidadProyectada);
        item.precioPromedioInternet = toNumber(raw.precioPromedioInternet);
        item.notas = raw.notas || item.notas || "";
        item.seccionOperativa = raw.seccionOperativa || item.seccionOperativa;
        item.descripcion = raw.descripcion || item.descripcion;
      }
      continue;
    }
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
      fileLink: normalizeInvoiceFileLink(inv.fileLink || inferInvoiceFileLink(inv)),
      qty: toNumber(inv.qty),
      unitPrice: toNumber(inv.unitPrice),
      total: toNumber(inv.total ?? toNumber(inv.qty) * toNumber(inv.unitPrice)),
      itemId: inv.itemId,
      project: inv.project || item?.project || "",
      itemDescription: inv.itemDescription || item?.descripcion || "",
    });
    invIds.add(inv.id);
  }

  for (const inv of stateObj.invoices) {
    const item = stateObj.items.find((x) => x.id === inv.itemId);
    if (item && !inv.itemDescription) inv.itemDescription = item.descripcion;
    // Fuerza links de Google Drive (reemplaza rutas locales antiguas).
    inv.fileLink = normalizeInvoiceFileLink(inferInvoiceFileLink(inv) || inv.fileLink);
  }

  const lastPrice = {};
  for (const inv of stateObj.invoices) {
    lastPrice[inv.itemId] = toNumber(inv.unitPrice);
  }
  for (const item of stateObj.items) {
    if (lastPrice[item.id] !== undefined) item.precioReal = lastPrice[item.id];
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
      ? raw.invoices.map((inv) => ({
        ...inv,
        location: inv.location || "",
        fileLink: normalizeInvoiceFileLink(inv.fileLink || inferInvoiceFileLink(inv)),
      }))
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

function loadUiState() {
  try {
    const raw = JSON.parse(localStorage.getItem(UI_STORAGE_KEY) || "{}");
    const tabs = ["home", "budget", "analytics"];
    const panels = ["projected", "purchases", "cross", "invoices"];
    const activeTab = tabs.includes(raw.activeTab) ? raw.activeTab : "home";
    const activeBudgetPanel = panels.includes(raw.activeBudgetPanel) ? raw.activeBudgetPanel : "projected";
    return { activeTab, activeBudgetPanel };
  } catch (_error) {
    return { activeTab: "home", activeBudgetPanel: "projected" };
  }
}

function saveUiState() {
  localStorage.setItem(UI_STORAGE_KEY, JSON.stringify({
    activeTab: ui.activeTab,
    activeBudgetPanel: ui.activeBudgetPanel,
  }));
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

function inferInvoiceFileLink(inv) {
  const supplier = (inv?.supplier || "").trim().toLowerCase();
  const number = (inv?.number || "").trim().toLowerCase();
  const desc = `${inv?.itemDescription || ""} ${inv?.itemId || ""}`.toLowerCase();
  if (
    number.includes("paea15807") ||
    number.includes("15807") ||
    desc.includes("ajuste") && desc.includes("conduleta") ||
    desc.includes("devolucion") && desc.includes("conduleta")
  ) {
    return INVOICE_DRIVE_LINKS.devolucionConduleta;
  }
  if (supplier.includes("grupo defa") || number.includes("paea15795")) {
    return INVOICE_DRIVE_LINKS.defa;
  }
  if (supplier.includes("soluciones electricas") || number.includes("n3598")) {
    return INVOICE_DRIVE_LINKS.solucionesElectricas;
  }
  if (supplier.includes("casa dielectrica") || number.includes("fea5-32889")) {
    return INVOICE_DRIVE_LINKS.casaDielectrica;
  }
  if (
    supplier.includes("solar hub") ||
    number.includes("ctshcar260235") ||
    number.includes("credibanco")
  ) {
    return INVOICE_DRIVE_LINKS.solarHub;
  }
  return "";
}

function normalizeInvoiceFileLink(link) {
  if (!link) return "";
  const value = String(link).trim();
  if (!value) return "";
  const lower = value.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) return "";
  // Rutas locales antiguas -> Drive
  if (lower.includes("devoluci") && lower.includes("conduleta")) return INVOICE_DRIVE_LINKS.devolucionConduleta;
  if (lower.includes("defa")) return INVOICE_DRIVE_LINKS.defa;
  if (lower.includes("solucione") || lower.includes("soluciones")) return INVOICE_DRIVE_LINKS.solucionesElectricas;
  if (lower.includes("casa dielectrica") || lower.includes("dielectrica")) return INVOICE_DRIVE_LINKS.casaDielectrica;
  if (lower.includes("ctshcar") || lower.includes("solar hub") || lower.includes("tabares")) {
    return INVOICE_DRIVE_LINKS.solarHub;
  }
  return value;
}

function getInvoiceFileHref(link) {
  const normalized = normalizeInvoiceFileLink(link);
  if (!normalized) return "";
  if (/^(https?:\/\/|file:\/\/)/i.test(normalized)) return normalized;
  if (normalized.startsWith("/") || normalized.startsWith("./") || normalized.startsWith("../")) {
    return encodeURI(normalized);
  }
  return encodeURI(normalized);
}

function getFileLabel(link) {
  const href = getInvoiceFileHref(link);
  if (!href) return "";
  if (href.includes("1C90C9ooS0IO-1IebiyksTo1PMYT5X53J")) return "DEFA.pdf (Google Drive)";
  if (href.includes("1f9c-aZ18KPgx8eE6PR0wwxaWqKO6Sic5")) return "Casa dielectrica.pdf (Google Drive)";
  if (href.includes("1WT0s-kQ8EYK_H_RtFzNnC1E_AmbrT8tn")) return "Soluciones electricas.pdf (Google Drive)";
  if (href.includes("1jkqv28YnA8j8sZfMZSmMmeYtDFzyZwXq")) return "Devolucion conduleta.pdf (Google Drive)";
  if (href.includes("1qMfd8ECGO22618ysa6eICzEoWR2MQT2d")) return "Solar Hub CTSHCAR260235.pdf (Google Drive)";
  if (/drive\.google\.com/i.test(href)) return "Abrir en Google Drive";
  const clean = href.split("?")[0].split("#")[0];
  const parts = clean.split("/");
  return decodeURIComponent(parts[parts.length - 1] || href);
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

function getDataConsistencyReport() {
  const itemById = Object.fromEntries(state.items.map((item) => [item.id, item]));
  let orphanInvoices = 0;
  let projectMismatches = 0;
  for (const inv of state.invoices) {
    const item = itemById[inv.itemId];
    if (!item) {
      orphanInvoices += 1;
      continue;
    }
    if (inv.project && inv.project !== item.project) {
      projectMismatches += 1;
    }
  }

  const bySupplierDay = {};
  for (const inv of state.invoices) {
    const supplier = (inv.supplier || "").trim().toLowerCase();
    const date = inv.date || "";
    if (!supplier || !date) continue;
    const key = `${supplier}__${date}`;
    if (!bySupplierDay[key]) bySupplierDay[key] = new Set();
    bySupplierDay[key].add((inv.number || "").trim().toLowerCase() || "sin-numero");
  }
  // Solo cuenta repetida cuando hay mas de una compra distinta
  // (mismo proveedor + fecha, pero con diferente numero de factura/comprobante).
  const repeatedSupplierDay = Object.values(bySupplierDay).filter((set) => set.size > 1).length;

  const duplicatedInvoiceNumber = (() => {
    const map = {};
    for (const inv of state.invoices) {
      const n = (inv.number || "").trim().toLowerCase();
      if (!n) continue;
      map[n] = (map[n] || 0) + 1;
    }
    return Object.values(map).filter((n) => n > 1).length;
  })();

  const itemsWithoutSection = state.items.filter((item) => !SECCIONES_OPERATIVAS.includes(item.seccionOperativa)).length;
  const invoicesWithoutLocation = state.invoices.filter((inv) => !(inv.location || "").trim()).length;

  return {
    totalItems: state.items.length,
    totalInvoices: state.invoices.length,
    orphanInvoices,
    projectMismatches,
    repeatedSupplierDay,
    duplicatedInvoiceNumber,
    itemsWithoutSection,
    invoicesWithoutLocation,
  };
}

function renderBudgetSummary() {
  const filtered = getFilteredItems();
  const { total, byProject } = sumParts(filtered);
  const projectFilter = el.projectFilter.value;
  const projectLabel = projectFilter === "ALL" ? "Todo unificado" : projectFilter;
  const sections = getSelectedSections();
  const sectionLabel =
    sections.length === 0 || sections.length === SECCIONES_OPERATIVAS.length
      ? "Todas las secciones"
      : sections.join(" + ");

  const p8 = byProject["8kW"] || { estimado: 0, real: 0, pendiente: 0, items: 0 };
  const p20 = byProject["20kW"] || { estimado: 0, real: 0, pendiente: 0, items: 0 };
  const purchasedOnly = filtered.filter((item) => toNumber(item.cantidadComprada) > 0);
  const purchasedReal = purchasedOnly.reduce((acc, item) => acc + getTotals(item).real, 0);
  const purchasedProjected = purchasedOnly.reduce(
    (acc, item) => acc + toNumber(item.cantidadComprada) * toNumber(item.precioPromedioInternet),
    0
  );
  const purchasedAvgPrice = purchasedOnly.length > 0 ? purchasedReal / Math.max(1, purchasedOnly.reduce((acc, i) => acc + toNumber(i.cantidadComprada), 0)) : 0;
  const purchasedRate = total.items > 0 ? (purchasedOnly.length / total.items) * 100 : 0;
  const avanceGeneral = total.estimado > 0 ? (total.real / total.estimado) * 100 : 0;
  const comprados = filtered.filter((item) => getStatus(item) === "COMPLETO").length;
  const faltantes = filtered.filter((item) => getStatus(item) === "PENDIENTE").length;

  const crossStatus = (item) => {
    const qtyDiff = getDifference(item);
    const qtyReal = toNumber(item.cantidadComprada);
    const priceProjected = toNumber(item.precioPromedioInternet);
    const priceReal = toNumber(item.precioReal);
    if (qtyReal <= 0) return "none";
    if (Math.abs(qtyDiff) > 0.01) return "warn";
    if (priceReal <= 0 || priceProjected <= 0) return "warn";
    const variance = Math.abs(((priceReal - priceProjected) / priceProjected) * 100);
    return variance > 20 ? "warn" : "ok";
  };
  const crossOk = filtered.filter((item) => crossStatus(item) === "ok").length;
  const crossWarn = filtered.filter((item) => crossStatus(item) === "warn").length;
  const crossNone = filtered.filter((item) => crossStatus(item) === "none").length;
  const consistency = getDataConsistencyReport();

  let cards = [];
  if (ui.activeBudgetPanel === "purchases") {
    const compraVariance = purchasedProjected > 0 ? ((purchasedReal - purchasedProjected) / purchasedProjected) * 100 : 0;
    cards = [
      ["Compra acumulada", formatCurrency(purchasedReal), `${escapeHtml(projectLabel)} · ${purchasedOnly.length} items`],
      ["Ref. proyectada compra", formatCurrency(purchasedProjected), `${escapeHtml(sectionLabel)}`],
      ["Diferencia compra", formatCurrency(purchasedReal - purchasedProjected), `${compraVariance.toFixed(1)}% vs proyectado`],
      ["Cobertura compra", `${purchasedRate.toFixed(1)}%`, "Items comprados / filtrados"],
      ["Compra 8kW", formatCurrency(purchasedOnly.filter((i) => i.project === "8kW").reduce((a, i) => a + getTotals(i).real, 0)), "Solo compras"],
      ["Compra 20kW", formatCurrency(purchasedOnly.filter((i) => i.project === "20kW").reduce((a, i) => a + getTotals(i).real, 0)), "Solo compras"],
      ["Items con compra", String(purchasedOnly.length), `De ${total.items} filtrados`],
      ["Precio promedio real", formatCurrency(purchasedAvgPrice), "Unitario sobre cantidades compradas"],
    ];
  } else if (ui.activeBudgetPanel === "cross") {
    const crossRate = total.items > 0 ? (crossOk / total.items) * 100 : 0;
    cards = [
      ["Cruces OK", String(crossOk), `${crossRate.toFixed(1)}% del filtro`],
      ["Cruces por revisar", String(crossWarn), "Cantidad o precio"],
      ["Sin compra", String(crossNone), "Aun no cruza"],
      ["Pendiente estimado", formatCurrency(total.pendiente), `${escapeHtml(sectionLabel)}`],
      ["Proyectado 8kW", formatCurrency(p8.estimado), "Base de cruce"],
      ["Proyectado 20kW", formatCurrency(p20.estimado), "Base de cruce"],
      ["Real total", formatCurrency(total.real), "Compras acumuladas"],
      ["Avance real", `${avanceGeneral.toFixed(1)}%`, "Sobre proyectado filtrado"],
    ];
  } else if (ui.activeBudgetPanel === "invoices") {
    cards = [
      ["Facturas registradas", String(consistency.totalInvoices), "Total en el sistema"],
      ["Items con compra", String(purchasedOnly.length), "Con al menos una factura"],
      ["Repetidas proveedor-dia", String(consistency.repeatedSupplierDay), "Mismo proveedor mas de una vez al dia"],
      ["Numeros de factura duplicados", String(consistency.duplicatedInvoiceNumber), "Mismo numero en mas de un registro"],
      ["Facturas huerfanas", String(consistency.orphanInvoices), "Sin item relacionado"],
      ["Proyecto inconsistente", String(consistency.projectMismatches), "Proyecto factura vs item"],
      ["Sin lugar de compra", String(consistency.invoicesWithoutLocation), "Facturas incompletas"],
      ["Items sin seccion valida", String(consistency.itemsWithoutSection), "Revisar seccion operativa"],
    ];
  } else {
    cards = [
      ["Ref. total proyectado", formatCurrency(total.estimado), `${escapeHtml(projectLabel)} · ${total.items} items`],
      ["Comprado real", formatCurrency(total.real), `${escapeHtml(sectionLabel)}`],
      ["Pendiente", formatCurrency(total.pendiente), "Falta por comprar"],
      ["Avance (%)", `${avanceGeneral.toFixed(1)}%`, "Real vs proyectado"],
      ["Proyecto 8kW", formatCurrency(p8.estimado), `Real ${formatCurrency(p8.real)}`],
      ["Proyecto 20kW", formatCurrency(p20.estimado), `Real ${formatCurrency(p20.real)}`],
      ["Items comprados", String(comprados), "Estado completo"],
      ["Items faltantes", String(faltantes), "Pendiente de compra"],
    ];
  }

  el.budgetSummary.innerHTML = `<div class="kpi-row-8">${cards
    .map((card, index) => `
      <article class="kpi ${index === 0 ? "kpi-muted" : ""}">
        <div class="label">${card[0]}</div>
        <div class="value">${card[1]}</div>
        <div class="kpi-sub">${card[2]}</div>
      </article>`)
    .join("")}</div>`;
}

function renderHomeSummary() {
  if (!el.homeSummary8 || !el.homeSummary20) return;
  const all = sumParts(state.items);
  const p8 = all.byProject["8kW"] || { estimado: 0, real: 0, pendiente: 0, items: 0 };
  const p20 = all.byProject["20kW"] || { estimado: 0, real: 0, pendiente: 0, items: 0 };
  const a8 = p8.estimado > 0 ? (p8.real / p8.estimado) * 100 : 0;
  const a20 = p20.estimado > 0 ? (p20.real / p20.estimado) * 100 : 0;
  const totalEst = p8.estimado + p20.estimado;
  const totalReal = p8.real + p20.real;
  const totalPend = p8.pendiente + p20.pendiente;
  const avance = totalEst > 0 ? (totalReal / totalEst) * 100 : 0;
  const faltantes = state.items.filter((x) => getDifference(x) > 0).length;
  const facturas = state.invoices.length;

  if (el.homeGlobalKpis) {
    el.homeGlobalKpis.innerHTML = `
      <article class="home-metric"><span>Proyectado total</span><strong>${formatCurrency(totalEst)}</strong></article>
      <article class="home-metric"><span>Comprado real</span><strong>${formatCurrency(totalReal)}</strong></article>
      <article class="home-metric"><span>Pendiente</span><strong>${formatCurrency(totalPend)}</strong></article>
      <article class="home-metric"><span>Avance global</span><strong>${avance.toFixed(1)}%</strong></article>
      <article class="home-metric"><span>Items faltantes</span><strong>${faltantes}</strong></article>
      <article class="home-metric"><span>Facturas</span><strong>${facturas}</strong></article>
    `;
  }

  const metrics = (p) => `
    <div class="home-metric"><span>Proyectado</span><strong>${formatCurrency(p.estimado)}</strong></div>
    <div class="home-metric"><span>Comprado</span><strong>${formatCurrency(p.real)}</strong></div>
    <div class="home-metric"><span>Pendiente</span><strong>${formatCurrency(p.pendiente)}</strong></div>
    <div class="home-metric"><span>Items</span><strong>${p.items}</strong></div>
  `;
  el.homeSummary8.innerHTML = metrics(p8);
  el.homeSummary20.innerHTML = metrics(p20);

  if (el.homeAvance8) el.homeAvance8.textContent = `${a8.toFixed(1)}%`;
  if (el.homeAvance20) el.homeAvance20.textContent = `${a20.toFixed(1)}%`;
  if (el.homeBar8) el.homeBar8.style.width = `${Math.min(100, Math.max(0, a8))}%`;
  if (el.homeBar20) el.homeBar20.style.width = `${Math.min(100, Math.max(0, a20))}%`;

  const sectionRows = (project) =>
    SECCIONES_OPERATIVAS.map((sec) => {
      const part = all.byProjectSection?.[project]?.[sec] || { estimado: 0, real: 0, pendiente: 0, items: 0 };
      if (!part.items) return "";
      const pct = part.estimado > 0 ? (part.real / part.estimado) * 100 : 0;
      return `<div class="home-section-row"><span>${escapeHtml(sec)}</span><strong>${pct.toFixed(0)}% · Pend. ${formatCurrency(part.pendiente)}</strong></div>`;
    }).join("");

  if (el.homeSections8) el.homeSections8.innerHTML = sectionRows("8kW") || '<div class="home-pending-empty">Sin secciones con datos.</div>';
  if (el.homeSections20) el.homeSections20.innerHTML = sectionRows("20kW") || '<div class="home-pending-empty">Sin secciones con datos.</div>';

  if (el.homePending) {
    const pending = state.items
      .filter((item) => getDifference(item) > 0)
      .map((item) => ({
        item,
        faltante: getDifference(item),
        costo: getDifference(item) * toNumber(item.precioPromedioInternet),
      }))
      .sort((a, b) => b.costo - a.costo)
      .slice(0, 6);

    el.homePending.innerHTML = pending.length
      ? pending
          .map(
            ({ item, faltante, costo }) => `
        <div class="home-pending-item">
          ${badge(item.project)}
          <div class="meta">
            <strong>${escapeHtml(item.descripcion)}</strong>
            <small>${escapeHtml(item.seccionOperativa)} · Faltan ${faltante.toFixed(2)} ${escapeHtml(item.unidad)}</small>
          </div>
          <strong>${formatCurrency(costo)}</strong>
        </div>`
          )
          .join("")
      : '<div class="home-pending-empty">No hay pendientes criticos. Todo al dia.</div>';
  }
}

function renderConsistencySummary() {
  if (!el.consistencySummary) return;
  const c = getDataConsistencyReport();
  const totalCompradoFacturas = state.invoices.reduce((acc, inv) => acc + toNumber(inv.total), 0);
  el.consistencySummary.innerHTML = `
    <article class="kpi kpi-highlight"><div class="label">Total comprado (facturas)</div><div class="value">${formatCurrency(totalCompradoFacturas)}</div></article>
    <article class="kpi"><div class="label">Facturas</div><div class="value">${c.totalInvoices}</div></article>
    <article class="kpi"><div class="label">Items</div><div class="value">${c.totalItems}</div></article>
    <article class="kpi"><div class="label">Repetidas proveedor-dia</div><div class="value">${c.repeatedSupplierDay}</div></article>
    <article class="kpi"><div class="label">Inconsistencias</div><div class="value">${c.orphanInvoices + c.projectMismatches + c.duplicatedInvoiceNumber + c.itemsWithoutSection + c.invoicesWithoutLocation}</div></article>
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

  const sorted = filtered
    .slice()
    .sort((a, b) => {
      if (a.project !== b.project) return a.project.localeCompare(b.project);
      if (a.seccionOperativa !== b.seccionOperativa) return a.seccionOperativa.localeCompare(b.seccionOperativa);
      return a.descripcion.localeCompare(b.descripcion);
    });
  const latestInvoiceByItem = {};
  for (const inv of state.invoices) {
    const current = latestInvoiceByItem[inv.itemId];
    if (!current || (inv.date || "") > (current.date || "")) {
      latestInvoiceByItem[inv.itemId] = inv;
    }
  }

  const crossStatus = (item) => {
    const qtyDiff = getDifference(item);
    const qtyMatch = Math.abs(qtyDiff) < 0.01;
    const qtyReal = toNumber(item.cantidadComprada);
    const priceProjected = toNumber(item.precioPromedioInternet);
    const priceReal = toNumber(item.precioReal);
    const hasRealPrice = priceReal > 0;
    const priceVariance = hasRealPrice && priceProjected > 0
      ? ((priceReal - priceProjected) / priceProjected) * 100
      : 0;

    if (qtyReal <= 0) return { label: "SIN COMPRA", cls: "none" };
    if (!qtyMatch) return { label: "REV CANTIDAD", cls: "warn" };
    if (!hasRealPrice) return { label: "SIN PRECIO REAL", cls: "warn" };
    if (Math.abs(priceVariance) > 20) return { label: "REV PRECIO", cls: "warn" };
    return { label: "CRUZA OK", cls: "ok" };
  };

  const emptyHtml = (colspan, message) => `
      <tr>
        <td colspan="${colspan}" data-label="Sin resultados">
          <div class="empty-filter">${escapeHtml(message)}</div>
        </td>
      </tr>`;

  if (!filtered.length) {
    if (el.purchasesMeta) {
      el.purchasesMeta.innerHTML = "Items comprados: <strong>0</strong> · Total acumulado: <strong>$0</strong>";
    }
    if (el.projectedBody) {
      el.projectedBody.innerHTML = emptyHtml(8, "No hay items con este filtro.");
    }
    if (el.purchasesBody) {
      el.purchasesBody.innerHTML = emptyHtml(8, "No hay compras para este filtro.");
    }
    if (el.crosscheckBody) {
      el.crosscheckBody.innerHTML = emptyHtml(11, "No hay datos para cruzar con este filtro.");
    }
    if (el.itemsBody) {
      el.itemsBody.innerHTML = emptyHtml(10, "No hay items con este filtro.");
    }
    return;
  }

  if (el.projectedBody) {
    el.projectedBody.innerHTML = sorted
      .map((item) => {
        const totalProjected = toNumber(item.cantidadProyectada) * toNumber(item.precioPromedioInternet);
        return `
      <tr>
        <td data-label="Proyecto">${badge(item.project)}</td>
        <td data-label="Descripcion">
          <div class="item-title">${escapeHtml(item.descripcion)}</div>
          <div class="item-sub">${item.notas ? escapeHtml(item.notas) : "-"}</div>
        </td>
        <td data-label="Seccion operativa">${sectionSelectHtml(item)}</td>
        <td data-label="Unidad">${escapeHtml(item.unidad)}</td>
        <td data-label="Cant. proyectada">${toNumber(item.cantidadProyectada).toFixed(2)}</td>
        <td data-label="Precio proyectado">${formatCurrency(item.precioPromedioInternet)}</td>
        <td data-label="Total proyectado">${formatCurrency(totalProjected)}</td>
        <td data-label="Accion">
          <button type="button" class="ghost icon-btn" data-detail-id="${item.id}" title="Ver detalle">🔎 <span>Ver</span></button>
          <button type="button" class="danger ghost icon-btn" data-delete-id="${item.id}" title="Eliminar">🗑 <span>Del</span></button>
        </td>
      </tr>`;
      })
      .join("");
  }

  if (el.purchasesBody) {
    const purchasedOnly = sorted.filter((item) => toNumber(item.cantidadComprada) > 0);
    const totalPurchased = purchasedOnly.reduce((acc, item) => acc + getTotals(item).real, 0);
    if (el.purchasesMeta) {
      el.purchasesMeta.innerHTML = `Items comprados: <strong>${purchasedOnly.length}</strong> · Total acumulado: <strong>${formatCurrency(totalPurchased)}</strong>`;
    }
    if (!purchasedOnly.length) {
      el.purchasesBody.innerHTML = emptyHtml(8, "Aun no hay compras registradas para este filtro.");
    } else {
      el.purchasesBody.innerHTML = purchasedOnly
      .map((item) => {
        const totalReal = getTotals(item).real;
        const inv = latestInvoiceByItem[item.id];
        const lastPurchase = inv
          ? `${escapeHtml(inv.date || "-")} · ${escapeHtml(inv.supplier || "-")} · ${escapeHtml(inv.number || "-")}`
          : "Compra manual / sin factura";
        return `
      <tr>
        <td data-label="Proyecto">${badge(item.project)}</td>
        <td data-label="Descripcion">
          <div class="item-title">${escapeHtml(item.descripcion)}</div>
          <div class="item-sub">${escapeHtml(item.unidad)}</div>
        </td>
        <td data-label="Seccion operativa">${sectionSelectHtml(item)}</td>
        <td data-label="Cant. real">${toNumber(item.cantidadComprada).toFixed(2)}</td>
        <td data-label="Precio real">${formatCurrency(item.precioReal)}</td>
        <td data-label="Total comprado">${formatCurrency(totalReal)}</td>
        <td data-label="Ultima compra"><small>${lastPurchase}</small></td>
        <td data-label="Accion">
          <button type="button" class="ghost icon-btn" data-detail-id="${item.id}" title="Ver detalle">🔎 <span>Ver</span></button>
          <button type="button" class="danger ghost icon-btn" data-delete-id="${item.id}" title="Eliminar">🗑 <span>Del</span></button>
        </td>
      </tr>`;
      })
      .join("");
    }
  }

  if (el.crosscheckBody) {
    el.crosscheckBody.innerHTML = sorted
      .map((item) => {
        const diff = getDifference(item);
        const cross = crossStatus(item);
        return `
      <tr>
        <td data-label="Proyecto">${badge(item.project)}</td>
        <td data-label="Descripcion">${escapeHtml(item.descripcion)}</td>
        <td data-label="Seccion operativa">${sectionSelectHtml(item)}</td>
        <td data-label="Cant. proyectada">${toNumber(item.cantidadProyectada).toFixed(2)}</td>
        <td data-label="Cant. real">${toNumber(item.cantidadComprada).toFixed(2)}</td>
        <td data-label="Diferencia">${diff.toFixed(2)}</td>
        <td data-label="Precio proyectado">${formatCurrency(item.precioPromedioInternet)}</td>
        <td data-label="Precio real">${formatCurrency(item.precioReal)}</td>
        <td data-label="Costo faltante">${formatCurrency(Math.max(0, diff) * toNumber(item.precioPromedioInternet))}</td>
        <td data-label="Verificacion"><span class="crosscheck-chip ${cross.cls}">${cross.label}</span></td>
        <td data-label="Accion">
          <button type="button" class="ghost icon-btn" data-detail-id="${item.id}" title="Ver detalle">🔎 <span>Ver</span></button>
          <button type="button" class="danger ghost icon-btn" data-delete-id="${item.id}" title="Eliminar">🗑 <span>Del</span></button>
        </td>
      </tr>`;
      })
      .join("");
  }
}

function renderInvoiceItemOptions() {
  el.invoiceItem.innerHTML = state.items
    .filter((x) => x.project === el.invoiceProject.value)
    .sort((a, b) => a.descripcion.localeCompare(b.descripcion))
    .map((i) => `<option value="${i.id}">${escapeHtml(i.descripcion).slice(0, 95)}</option>`)
    .join("");
}

function buildInvoiceGroups(invoices) {
  const groups = {};
  for (const raw of invoices) {
    const inv = { ...raw };
    const supplier = (inv.supplier || "").trim().toLowerCase();
    const number = (inv.number || "").trim().toLowerCase();
    // Agrupa por factura real: no mezclar PAEA15795 con devolucion PAEA15807.
    if (supplier.includes("soluciones electricas")) {
      inv.date = "2026-07-10";
      if (!inv.number) inv.number = "N3598";
    }
    if (supplier.includes("grupo defa")) {
      inv.date = inv.date || "2026-07-09";
      if (
        number.includes("15807") ||
        (`${inv.itemDescription || ""} ${inv.itemId || ""}`.toLowerCase().includes("ajuste") &&
          `${inv.itemDescription || ""}`.toLowerCase().includes("conduleta"))
      ) {
        inv.number = "PAEA15807";
      } else if (!inv.number || number.includes("15795")) {
        inv.number = "PAEA15795";
      }
    }
    // Siempre preferir link de Drive actualizado.
    inv.fileLink = normalizeInvoiceFileLink(inv.fileLink || inferInvoiceFileLink(inv));
    const key = `${inv.date || ""}__${supplier}__${(inv.number || "").trim().toLowerCase()}`;
    if (!groups[key]) {
      groups[key] = {
        key,
        date: inv.date || "",
        number: inv.number || "",
        supplier: inv.supplier || "",
        location: inv.location || "",
        project: inv.project || "",
        ids: [],
        qty: 0,
        total: 0,
        itemDescriptions: new Set(),
        fileLinks: new Set(),
      };
    }
    const g = groups[key];
    g.ids.push(inv.id);
    g.qty += toNumber(inv.qty);
    g.total += toNumber(inv.total);
    g.itemDescriptions.add(inv.itemDescription || "");
    if (inv.fileLink) g.fileLinks.add(inv.fileLink);
    if (!g.project && inv.project) g.project = inv.project;
    if (!g.location && inv.location) g.location = inv.location;
  }
  return Object.values(groups)
    .map((g) => ({
      ...g,
      unitPrice: g.qty > 0 ? g.total / g.qty : 0,
      itemSummary:
        g.itemDescriptions.size <= 1
          ? [...g.itemDescriptions][0] || "-"
          : `${g.itemDescriptions.size} items en una factura`,
      hasFileLink: g.fileLinks.size > 0,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function renderInvoicesTable() {
  const grouped = buildInvoiceGroups(state.invoices);
  el.invoicesBody.innerHTML = grouped
    .map((inv) => `
      <tr>
        <td data-label="Fecha">${escapeHtml(inv.date)}</td>
        <td data-label="Factura">${escapeHtml(inv.number)}</td>
        <td data-label="Proveedor">${escapeHtml(inv.supplier)}</td>
        <td data-label="Lugar">${escapeHtml(inv.location || "-")}</td>
        <td data-label="Proyecto">${badge(inv.project)}</td>
        <td data-label="Item"><small>${escapeHtml(inv.itemSummary || "")}</small></td>
        <td data-label="Cant.">${toNumber(inv.qty).toFixed(2)}</td>
        <td data-label="P.U.">${formatCurrency(inv.unitPrice)}</td>
        <td data-label="Total">${formatCurrency(inv.total)}</td>
        <td data-label="Acciones">
          <button type="button" class="ghost icon-btn" data-view-invoice-group="${escapeHtml(inv.ids.join(","))}" title="Ver detalle">🔎 <span>Ver</span></button>
          ${
            inv.ids.length === 1
              ? `<button type="button" class="ghost icon-btn" data-edit-invoice-id="${inv.ids[0]}" title="Editar">✏️ <span>Editar</span></button>`
              : `<button type="button" class="ghost icon-btn" disabled title="Factura agrupada">📦 <span>Grupo</span></button>`
          }
          ${inv.hasFileLink ? `<button type="button" class="ghost icon-btn" data-open-invoice-group-link="${escapeHtml(inv.ids.join(","))}" title="Abrir PDF en Google Drive">📄 <span>PDF</span></button>` : ""}
          <button type="button" class="danger ghost icon-btn" data-delete-invoice-group="${escapeHtml(inv.ids.join(","))}" title="Eliminar">🗑 <span>Del</span></button>
        </td>
      </tr>`)
    .join("");
}

function openInvoiceGroupDetail(idsCsv) {
  if (!el.invoiceGroupDialog || !el.invoiceDetailBody) return;
  const ids = (idsCsv || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  if (!ids.length) return;
  const set = new Set(ids);
  const lines = state.invoices.filter((inv) => set.has(inv.id));
  if (!lines.length) return;
  lines.sort((a, b) => (a.itemDescription || "").localeCompare(b.itemDescription || ""));
  const total = lines.reduce((acc, inv) => acc + toNumber(inv.total), 0);
  const qty = lines.reduce((acc, inv) => acc + toNumber(inv.qty), 0);
  const base = lines[0];
  if (el.invoiceDetailTitle) {
    el.invoiceDetailTitle.textContent = `Detalle factura ${base.number || ""}`.trim();
  }
  if (el.invoiceDetailMeta) {
    el.invoiceDetailMeta.innerHTML = `${escapeHtml(base.date || "-")} · ${escapeHtml(base.supplier || "-")} · ${lines.length} renglones · Cantidad total ${qty.toFixed(2)} · Total ${formatCurrency(total)}`;
  }
  const linkMap = new Map();
  for (const line of lines) {
    const href = getInvoiceFileHref(line.fileLink);
    if (!href) continue;
    if (!linkMap.has(href)) {
      linkMap.set(href, getFileLabel(line.fileLink));
    }
  }
  if (el.invoiceDetailLinks) {
    if (linkMap.size === 0) {
      el.invoiceDetailLinks.innerHTML = '<div class="mini-note">Archivo digital: no registrado.</div>';
    } else {
      el.invoiceDetailLinks.innerHTML = [...linkMap.entries()]
        .map(([href, label]) => `<a class="file-link-chip" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">📄 ${escapeHtml(label || "Abrir archivo digital")}</a>`)
        .join("");
    }
  }
  el.invoiceDetailBody.innerHTML = lines
    .map(
      (inv) => `
      <tr>
        <td>${escapeHtml(inv.itemDescription || "-")}</td>
        <td>${toNumber(inv.qty).toFixed(2)}</td>
        <td>${formatCurrency(inv.unitPrice)}</td>
        <td>${formatCurrency(inv.total)}</td>
      </tr>`
    )
    .join("");
  el.invoiceGroupDialog.showModal();
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
  const isHome = target === "home";
  const isBudget = target === "budget";
  const isAnalytics = target === "analytics";
  ui.activeTab = target;
  el.tabHome?.classList.toggle("active", isHome);
  el.tabBudget.classList.toggle("active", isBudget);
  el.tabAnalytics.classList.toggle("active", isAnalytics);
  el.viewHome?.classList.toggle("active", isHome);
  el.viewBudget.classList.toggle("active", isBudget);
  el.viewAnalytics.classList.toggle("active", isAnalytics);
  if (isAnalytics) { syncCanvasDpi(); renderCharts(); }
  saveUiState();
}

function setBudgetPanel(target, options = {}) {
  const { ensureBudgetView = true } = options;
  // Si el usuario navega desde analitica, cambia automaticamente a gestion.
  if (ensureBudgetView && !el.viewBudget.classList.contains("active")) {
    setTab("budget");
  }
  ui.activeBudgetPanel = target;
  const projected = target === "projected";
  const purchases = target === "purchases";
  const cross = target === "cross";
  const invoices = target === "invoices";
  el.panelProjectedBtn?.classList.toggle("active", projected);
  el.panelPurchasesBtn?.classList.toggle("active", purchases);
  el.panelCrossBtn?.classList.toggle("active", cross);
  el.panelInvoicesBtn?.classList.toggle("active", invoices);
  el.panelProjected?.classList.toggle("active", projected);
  el.panelPurchases?.classList.toggle("active", purchases);
  el.panelCross?.classList.toggle("active", cross);
  el.panelInvoices?.classList.toggle("active", invoices);
  renderBudgetSummary();
  saveUiState();
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
  renderHomeSummary();
  renderBudgetSummary();
  renderConsistencySummary();
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
    fileLink: normalizeInvoiceFileLink(el.invoiceFileLink?.value || ""),
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
  const rows = [["fecha","factura","proveedor","donde_se_compro","archivo_digital","proyecto","descripcion","cantidad","precioUnitario","total"]];
  for (const inv of state.invoices) {
    rows.push([inv.date, inv.number, inv.supplier, inv.location || "", inv.fileLink || "", inv.project, inv.itemDescription, inv.qty, inv.unitPrice, inv.total]);
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
  el.tabHome?.addEventListener("click", () => setTab("home"));
  el.tabBudget.addEventListener("click", () => setTab("budget"));
  el.tabAnalytics.addEventListener("click", () => setTab("analytics"));
  el.panelProjectedBtn?.addEventListener("click", () => setBudgetPanel("projected"));
  el.panelPurchasesBtn?.addEventListener("click", () => setBudgetPanel("purchases"));
  el.panelCrossBtn?.addEventListener("click", () => setBudgetPanel("cross"));
  el.panelInvoicesBtn?.addEventListener("click", () => setBudgetPanel("invoices"));

  document.addEventListener("click", (event) => {
    const goto = event.target.closest("[data-home-goto]");
    if (!goto) return;
    const target = goto.getAttribute("data-home-goto");
    const project = goto.getAttribute("data-home-project");
    if (project && el.projectFilter) {
      el.projectFilter.value = project;
    }
    if (target === "invoices") {
      setTab("budget");
      setBudgetPanel("invoices");
    } else if (target === "budget") {
      setTab("budget");
      setBudgetPanel("projected");
    } else if (target === "analytics") {
      setTab("analytics");
    }
    rerender();
  });

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

  const itemTableBodies = [el.projectedBody, el.purchasesBody, el.crosscheckBody, el.itemsBody].filter(Boolean);
  for (const body of itemTableBodies) {
    body.addEventListener("change", (event) => {
      const sectionSelect = event.target.closest("[data-section-id]");
      if (!sectionSelect) return;
      const item = state.items.find((x) => x.id === sectionSelect.getAttribute("data-section-id"));
      if (!item) return;
      const next = sectionSelect.value;
      if (!SECCIONES_OPERATIVAS.includes(next)) return;
      item.seccionOperativa = next;
      rerender();
    });

    body.addEventListener("click", async (event) => {
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
  }

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
    const view = event.target.closest("[data-view-invoice-group]");
    if (view) {
      openInvoiceGroupDetail(view.getAttribute("data-view-invoice-group"));
      return;
    }
    const openFile = event.target.closest("[data-open-invoice-group-link]");
    if (openFile) {
      const ids = (openFile.getAttribute("data-open-invoice-group-link") || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      const set = new Set(ids);
      const lines = state.invoices.filter((x) => set.has(x.id));
      // Preferir link Drive; si hay varios (DEFA + devolucion), abrir el de la factura del grupo.
      const withLink = lines.find((x) => getInvoiceFileHref(x.fileLink || inferInvoiceFileLink(x)));
      const href = getInvoiceFileHref(withLink?.fileLink || inferInvoiceFileLink(withLink) || "");
      if (!href) {
        window.alert("Esta factura no tiene PDF en Google Drive.");
        return;
      }
      const opened = window.open(href, "_blank", "noopener,noreferrer");
      if (!opened) {
        window.alert("El navegador bloqueo la ventana. Permite popups o abre el link desde Ver.");
      }
      return;
    }
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
      if (el.invoiceFileLink) el.invoiceFileLink.value = inv.fileLink || "";
      return;
    }
    const delGroup = event.target.closest("[data-delete-invoice-group]");
    if (!delGroup) return;
    const ok = await askConfirm({
      title: "Eliminar factura",
      message: "Deseas eliminar esta factura (o grupo de factura)?",
      confirmLabel: "Eliminar",
    });
    if (!ok) return;
    const ids = (delGroup.getAttribute("data-delete-invoice-group") || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const set = new Set(ids);
    state.invoices = state.invoices.filter((x) => !set.has(x.id));
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
  el.closeInvoiceDetailBtn?.addEventListener("click", () => el.invoiceGroupDialog?.close());
  el.saveItemDetailBtn.addEventListener("click", saveItemDialog);

  window.addEventListener("resize", () => {
    if (el.viewAnalytics.classList.contains("active")) {
      syncCanvasDpi();
      renderCharts();
    }
  });
}

setupEvents();
initTheme();
setTab(ui.activeTab);
setBudgetPanel(ui.activeBudgetPanel, { ensureBudgetView: false });
resetInvoiceForm();
rerender();

function initTheme() {
  const THEME_KEY = "tabarec_theme_v1";
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved === "dark" || saved === "light" ? saved : prefersDark ? "dark" : "light";
  applyTheme(theme);
  if (!el.themeToggle) return;
  el.themeToggle.checked = theme === "dark";
  el.themeToggle.addEventListener("change", () => {
    const next = el.themeToggle.checked ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  if (el.themeToggle) el.themeToggle.checked = dark;
  if (el.themeSwitchLabel) el.themeSwitchLabel.textContent = dark ? "Oscuro" : "Claro";
}
