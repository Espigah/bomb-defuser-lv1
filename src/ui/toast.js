let wrap;
export function ensureToasts(){
  if(wrap) return wrap;
  wrap = document.createElement("div");
  wrap.className = "toast-wrap";
  document.body.appendChild(wrap);
  return wrap;
}
export function toast(title, detail){
  ensureToasts();
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<div>${escapeHtml(title)}</div>${detail ? `<small>${escapeHtml(detail)}</small>` : ""}`;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}
function escapeHtml(s){
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
