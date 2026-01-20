// Interface de ferramentas (Cortar, Reparar)

export function createToolIcon(toolType) {
  if (toolType === "cut") {
    return `
      <svg width="40" height="40" viewBox="0 0 40 40" style="fill: none; stroke: currentColor; stroke-width: 2;">
        <path d="M10 10 L30 30 M30 10 L10 30" />
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
        <circle cx="28" cy="28" r="2" fill="currentColor"/>
      </svg>
    `;
  } else if (toolType === "mend") {
    return `
      <svg width="40" height="40" viewBox="0 0 40 40" style="fill: none; stroke: currentColor; stroke-width: 2;">
        <path d="M10 20 L30 20 M20 10 L20 30" />
        <circle cx="10" cy="20" r="3" fill="currentColor"/>
        <circle cx="30" cy="20" r="3" fill="currentColor"/>
      </svg>
    `;
  }
  return "";
}

export function renderToolbar(activeTool) {
  const tools = [
    { id: "cut", label: "CORTAR", icon: "cut", color: "#ff6633" },
    { id: "mend", label: "REPARAR", icon: "mend", color: "#33ff99" }
  ];
  
  const toolsHtml = tools.map(tool => {
    const isActive = activeTool === tool.id;
    const activeClass = isActive ? "active" : "";
    
    return `
      <button 
        class="tool ${activeClass}" 
        data-tool="${tool.id}"
        title="${tool.label}"
        style="--tool-color: ${tool.color};"
      >
        ${createToolIcon(tool.icon)}
        <span>${tool.label}</span>
      </button>
    `;
  }).join("\n");
  
  return `
    <div class="toolbar">
      ${toolsHtml}
    </div>
  `;
}
