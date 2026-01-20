import { store, log } from "../state/store.js";
import { explode, defuse } from "../concepts/bomb.js";

export function afterAnyAction(){
  if(store.bomb.status !== "ARMED") return;

  console.log("🔍 AÇÃO: Validando estado da bomba...");
  const verdict = validate();
  log("Engine.validate", verdict);
  console.log("🔍 RESULTADO: Validação concluída", { válido: verdict.ok, desarmada: verdict.defused });

  if(verdict.ok){
    if(verdict.defused) defuse();
    return;
  }
  explode(verdict.reason);
}

function validate(){
  // ⚠️ BUG intencional: explode sempre após 1ª ação.
  if(store.bomb.actions > 0){
    return { ok: false, defused: false, reason: "invalid_wire_configuration" };
  }
  return { ok: true, defused: false };
}
