import { store, subscribe, activateTool, resetTool, restartGame } from "../state/store.js";
import { cutWire, mendWire } from "../concepts/wires.js";
import { afterAnyAction } from "../sync/engine.js";
import { ensureToasts, toast } from "./toast.js";
import { createBombSVG } from "./svg.js";
import { renderToolbar } from "./toolbar.js";

export function mountApp(root){
  ensureToasts();

  root.innerHTML = `
    <div class="container">
      <div class="header">
        <div>
          <h1>Bomb Defuser Lab</h1>
          <small>Versão com SVG - Interativo!</small>
        </div>
        <span class="badge">Vite + Vanilla JS</span>
      </div>

      <div class="main-content">
        <div id="visualization"></div>
        <div id="status"></div>
        <div id="log"></div>
      </div>
    </div>
  `;

  const vizContainer = root.querySelector("#visualization");
  const statusContainer = root.querySelector("#status");
  const logContainer = root.querySelector("#log");

  function render(){
    const s = structuredClone(store);
    
    vizContainer.innerHTML = renderVisualization(s);
    statusContainer.innerHTML = renderStatusPanel(s);
    logContainer.innerHTML = renderLogPanel(s);
    
    // Atualizar classe CSS do SVG para cursor
    const svg = vizContainer.querySelector("#bomb-svg");
    if (svg) {
      svg.classList.remove("tool-cut", "tool-mend");
      if (s.ui.activeTool === "cut") {
        svg.classList.add("tool-cut");
      } else if (s.ui.activeTool === "mend") {
        svg.classList.add("tool-mend");
      }
    }
  }

  // Usar event delegation no root para evitar múltiplos listeners
  root.addEventListener("click", (e) => {
    const s = store;

    // Clique em círculo de fio ou hitbox (linha clicável)
    const wireCircle = e.target.closest(".wire-circle");
    const wireHitbox = e.target.closest(".wire-hitbox");
    
    if (wireCircle || wireHitbox) {
      const element = wireCircle || wireHitbox;
      
      if (s.bomb.status !== "ARMED") {
        toast("⚠️", "A bomba não está armada");
        return;
      }

      if (!s.ui.activeTool) {
        toast("⚠️", "Selecione uma ferramenta primeiro");
        return;
      }

      const wireId = element.getAttribute("data-wire-id");
      const indexAttr = element.getAttribute("data-index");
      const selectedTool = s.ui.activeTool;
      
      // ⚠️ BUG intencional: Inverte a ação da ferramenta
      // Se o usuário seleciona "cut", na verdade vai "mend" (e vice-versa)
      const actualAction = selectedTool === "cut" ? "mend" : "cut";
      
      // BUG: usar índice e aplicar no próximo fio (deslocamento)
      let index = Number.parseInt(indexAttr ?? "-1", 10);
      if (Number.isNaN(index) || index < 0) {
        // fallback para compatibilidade
        index = getWireIndex(wireId);
      }
      const wrongIndex = (index + 1) % s.wires.length;

      if (actualAction === "cut") {
        cutWire(wrongIndex);
      } else if (actualAction === "mend") {
        mendWire(wrongIndex);
      }

      afterAnyAction();
      const displayedAction = selectedTool === "cut" ? "Cortado" : "Reparado";
      const actualActionDisplay = actualAction === "cut" ? "✂️" : "🔧";
      toast("✨", `${actualActionDisplay} ${displayedAction} (realmente): ${wireId}`);
      return;
    }
    // Clique em botão de ferramenta
    if (e.target.closest(".tool")) {
      const btn = e.target.closest(".tool");

      if (s.bomb.status !== "ARMED") {
        toast("⚠️", "A bomba não está armada");
        return;
      }

      const toolType = btn.getAttribute("data-tool");
      const isActive = s.ui.activeTool === toolType;

      if (isActive) {
        resetTool();
        toast("ℹ️", "Ferramenta desativada");
      } else {
        activateTool(toolType);
        toast("✨", `Ferramenta ativada: ${toolType}`);
      }
      return;
    }

    // Clique em botão de restart
    if (e.target.closest(".restart-btn")) {
      restartGame();
      toast("🔄", "Jogo reiniciado!");
      return;
    }
  });

  render();
  const unsub = subscribe(render);
  return () => unsub();
}

function getWireIndex(wireId) {
  const index = store.wires.findIndex(w => w.id === wireId);
  if (index === -1) throw new Error(`Wire ${wireId} not found`);
  return index;
}

function renderVisualization(s) {
  const bombSvg = createBombSVG(s.wires, s.bomb.status);
  const toolbar = renderToolbar(s.ui.activeTool);
  const statusBadge = s.bomb.status === "DEFUSED" 
    ? '<span class="badge" style="background: rgba(0,255,100,.2);">DESARMADA!</span>'
    : s.bomb.status === "EXPLODED"
    ? '<span class="badge" style="background: rgba(255,50,50,.2);">EXPLODIU!</span>'
    : '<span class="badge" style="background: rgba(100,200,255,.2);">ARMADA</span>';
  
  return `
    <div class="panel visualization-panel">
      <div class="head">
        <div>
          <div style="font-weight:700;">Simulador</div>
          <small>Desarme a bomba corretamente</small>
        </div>
        ${statusBadge}
      </div>
      <div class="body">
        ${bombSvg}
        ${toolbar}
      </div>
    </div>
  `;
}

function renderStatusPanel(s) {
  const progress = `${s.bomb.actions}/3`;
  const statusColor = s.bomb.status === "DEFUSED" 
    ? "rgba(0,255,100,.16)"
    : s.bomb.status === "EXPLODED" 
    ? "rgba(255,50,50,.16)"
    : "rgba(100,200,255,.16)";

  return `
    <div class="panel" style="margin-top: 14px;">
      <div class="head">
        <div>
          <div style="font-weight:700;">Status</div>
          <small>Progresso da defusão</small>
        </div>
      </div>
      <div class="body">
        <div class="kv">
          <div>Estado da bomba</div>
          <div style="background: ${statusColor}; padding: 4px 8px; border-radius: 6px;">
            <b>${s.bomb.status}</b>
          </div>
        </div>
        <div class="kv" style="margin-top: 8px;">
          <div>Ações realizadas</div>
          <div><b>${progress}</b></div>
        </div>
      </div>
    </div>
  `;
}

function renderLogPanel(s){
  const rows = s.events.slice(0, 18).map(ev => `
    <div class="item">
      <div class="row">
        <div style="font-weight:700;">${escapeHtml(ev.type)}</div>
        <small>${new Date(ev.at).toLocaleTimeString()}</small>
      </div>
      <small>${escapeHtml(JSON.stringify(ev.payload))}</small>
    </div>
  `).join("");

  return `
    <div class="panel">
      <div class="head">
        <div>
          <div style="font-weight:700;">Log</div>
          <small>Trilha auditável</small>
        </div>
        <span class="badge">${s.events.length} eventos</span>
      </div>
      <div class="body">
        ${rows ? `<div class="list">${rows}</div>` : `<small>Sem eventos ainda.</small>`}
      </div>
    </div>
  `;
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
