const listeners = new Set();

export const store = {
  bomb: { status: "ARMED", actions: 0 },
  wires: [
    { id: "blue",   label: "Azul",     isCut: true  },
    { id: "red",    label: "Vermelho", isCut: false },
    { id: "green",  label: "Verde",    isCut: false },
    { id: "yellow", label: "Amarelo",  isCut: false },
    { id: "white",  label: "Branco",   isCut: false },
    { id: "black",  label: "Preto",    isCut: false }
  ],
  events: [],
  ui: {
    activeTool: null,
    hoveredWireId: null
  }
};

export function subscribe(fn){
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emit(){
  for(const fn of listeners) fn(structuredClone(store));
}

export function log(type, payload){
  store.events.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), type, payload });
  emit();
}

export function bootstrap(){
  console.log("🔄 AÇÃO: Reiniciando jogo...");
  store.bomb = { status: "ARMED", actions: 0 };
  store.wires = [
    { id: "blue",   label: "Azul",     isCut: true  },
    { id: "red",    label: "Vermelho", isCut: false },
    { id: "green",  label: "Verde",    isCut: false },
    { id: "yellow", label: "Amarelo",  isCut: false },
    { id: "white",  label: "Branco",   isCut: false },
    { id: "black",  label: "Preto",    isCut: false }
  ];
  store.events = [];
  store.ui = {
    activeTool: null,
    hoveredWireId: null
  };
  emit();
  console.log("🔄 RESULTADO: Jogo reiniciado", { bomba: store.bomb, fios: store.wires.length });
}

export function activateTool(toolType) {
  store.ui.activeTool = toolType;
  emit();
}

export function resetTool() {
  store.ui.activeTool = null;
  emit();
}

export function setHoveredWire(wireId) {
  store.ui.hoveredWireId = wireId;
  emit();
}

export function restartGame() {
  bootstrap();
}
