import { store, log, emit } from "../state/store.js";

// ⚠️ BUG intencional: API recebe 'index' em vez de 'wireId'.
export function cutWire(index){
  const w = store.wires[index];
  console.log("✂️ AÇÃO: Cortando fio", { índice: index, fio: w.id, cor: w.label });
  w.isCut = true;
  store.bomb.actions += 1;
  log("Wire.cut", { index, wire: w.id });
  emit();
  console.log("✂️ RESULTADO: Fio cortado", { fio: w.id, cortado: w.isCut, totalAções: store.bomb.actions });
  return { wire: w.id };
}

export function mendWire(index){
  const w = store.wires[index];
  console.log("🔧 AÇÃO: Reparando fio", { índice: index, fio: w.id, cor: w.label });
  w.isCut = false;
  store.bomb.actions += 1;
  log("Wire.mend", { index, wire: w.id });
  emit();
  console.log("🔧 RESULTADO: Fio reparado", { fio: w.id, cortado: w.isCut, totalAções: store.bomb.actions });
  return { wire: w.id };
}
