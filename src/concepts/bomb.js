import { store, log, emit } from "../state/store.js";

export function explode(reason){
  if(store.bomb.status !== "ARMED") return;
  console.log("💥 AÇÃO: Bomba explodindo");
  store.bomb.status = "EXPLODED";
  log("Bomb.explode", { reason });
  emit();
  console.log("💥 RESULTADO: Bomba EXPLODIU", { status: store.bomb.status });
}

export function defuse(){
  if(store.bomb.status !== "ARMED") return;
  console.log("✅ AÇÃO: Desarmando bomba");
  store.bomb.status = "DEFUSED";
  log("Bomb.defuse", {});
  emit();
  console.log("✅ RESULTADO: Bomba DESARMADA com sucesso", { status: store.bomb.status });
}
