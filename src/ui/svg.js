// Funções para geração dinâmica de SVG

export function getWireColor(wireId) {
  const colors = {
    "blue":    "#0099ff",
    "red":     "#ff3366", 
    "green":   "#00ff99",
    "yellow":  "#ffcc00",
    "white":   "#ffffff",
    "black":   "#333333"
  };
  return colors[wireId] || "#888888";
}

export function getWireY(wireIndex) {
  // Distribuir 6 fios entre y=80 e y=220 (dentro do retângulo 60-240)
  const startY = 80;
  const endY = 220;
  const spacing = (endY - startY) / 5; // 5 intervalos para 6 fios
  return startY + (wireIndex * spacing);
}

export function createWireSVGPath(wire, wireIndex) {
  const color = getWireColor(wire.id);
  const y = getWireY(wireIndex);
  const startX = 160;
  const endX = 440;
  const midX = (startX + endX) / 2;
  
  // Estado visual baseado em isCut (sem inversão visual - o bug é nas ferramentas)
  if (wire.isCut) {
    // Fio cortado: desenha duas linhas desconectadas com um espaço
    return `
      <!-- Fio cortado - lado esquerdo -->
      <line 
        x1="${startX}" y1="${y}" 
        x2="${midX - 15}" y2="${y}"
        stroke="${color}" 
        stroke-width="3.5"
        opacity="0.4"
        class="wire cut"
        data-wire-id="${wire.id}"
        data-index="${wireIndex}"
      />
      
      <!-- Fio cortado - lado direito -->
      <line 
        x1="${midX + 15}" y1="${y}" 
        x2="${endX}" y2="${y}"
        stroke="${color}" 
        stroke-width="3.5"
        opacity="0.4"
        class="wire cut"
        data-wire-id="${wire.id}"
        data-index="${wireIndex}"
      />
      
      <!-- Marcador de corte (X) -->
      <text 
        x="${midX}" y="${y + 6}" 
        text-anchor="middle"
        font-size="16" 
        font-weight="bold"
        fill="${color}"
        opacity="0.7"
      >
        ✕
      </text>
      
      <!-- Área invisível clicável (lado esquerdo) -->
      <line 
        x1="${startX}" y1="${y}" 
        x2="${midX - 15}" y2="${y}"
        stroke="transparent"
        stroke-width="16"
        class="wire-hitbox"
        data-wire-id="${wire.id}"
        data-index="${wireIndex}"
        style="cursor: inherit;"
      />
      
      <!-- Área invisível clicável (lado direito) -->
      <line 
        x1="${midX + 15}" y1="${y}" 
        x2="${endX}" y2="${y}"
        stroke="transparent"
        stroke-width="16"
        class="wire-hitbox"
        data-wire-id="${wire.id}"
        data-index="${wireIndex}"
        style="cursor: inherit;"
      />
      
      <!-- Área invisível clicável (centro com X) -->
      <circle 
        cx="${midX}" cy="${y}" 
        r="12"
        fill="transparent"
        class="wire-hitbox"
        data-wire-id="${wire.id}"
        data-index="${wireIndex}"
        style="cursor: inherit;"
      />
    `;
  } else {
    // Fio inteiro
    return `
      <!-- Linha do fio inteiro -->
      <line 
        x1="${startX}" y1="${y}" 
        x2="${endX}" y2="${y}"
        stroke="${color}" 
        stroke-width="3.5"
        opacity="1.0"
        class="wire intact"
        data-wire-id="${wire.id}"
        data-index="${wireIndex}"
        style="transition: stroke-width 0.3s, opacity 0.3s;"
      />
      
      <!-- Área invisível clicável (hitbox) -->
      <line 
        x1="${startX}" y1="${y}" 
        x2="${endX}" y2="${y}"
        stroke="transparent"
        stroke-width="16"
        class="wire-hitbox"
        data-wire-id="${wire.id}"
        data-index="${wireIndex}"
        style="cursor: inherit;"
      />
      
      <!-- Círculo clicável (extremidade direita) -->
      <circle 
        cx="${endX}" cy="${y}" 
        r="8"
        fill="${color}"
        class="wire-circle"
        data-wire-id="${wire.id}"
        data-index="${wireIndex}"
        style="cursor: pointer; transition: r 0.2s, filter 0.2s;"
      />
    `;
  }
}

export function createBombSVG(wires, bombStatus) {
  const wiresSvg = wires.map((w, idx) => 
    createWireSVGPath(w, idx)
  ).join("\n");
  
  // Cor e opacidade baseado no status
  const bombColor = bombStatus === "EXPLODED" ? "#ff3366" : "#ffffff";
  const bombOpacity = bombStatus === "EXPLODED" ? "0.3" : "1.0";
  
  return `
    <svg 
      id="bomb-svg" 
      width="600" 
      height="300" 
      viewBox="0 0 600 300"
      style="max-width: 100%; height: auto; display: block; margin: 0 auto;"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- BOMBA (Retângulo) -->
      <g filter="url(#shadow)">
        <rect 
          x="150" y="60" 
          width="300" height="180" 
          rx="12" ry="12"
          stroke="${bombColor}" 
          stroke-width="2"
          fill="rgba(255,255,255,0.02)"
          opacity="${bombOpacity}"
          style="transition: opacity 0.3s, stroke 0.3s;"
        />
      </g>
      
      <!-- STATUS TEXT CENTRAL -->
      <text 
        x="300" y="160" 
        text-anchor="middle"
        font-size="28" 
        font-weight="bold" 
        fill="${bombColor}"
        opacity="${bombOpacity}"
        style="transition: opacity 0.3s, fill 0.3s;"
      >
        ${bombStatus}
      </text>
      
      <!-- FIOS -->
      ${wiresSvg}

      <!-- BOTÃO RESTART (aparece só quando explode) -->
      ${bombStatus === "EXPLODED" ? `
      <g>
        <!-- Fundo do botão (topo da bomba) -->
        <rect 
          x="230" y="80" 
          width="140" height="40"
          rx="8" ry="8"
          fill="#ff3366"
          opacity="0.9"
          class="restart-btn"
          style="cursor: pointer; transition: opacity 0.2s, filter 0.2s;"
        />
        <!-- Texto do botão -->
        <text 
          x="300" y="106"
          text-anchor="middle"
          font-size="18"
          font-weight="bold"
          fill="#ffffff"
          class="restart-btn"
          style="cursor: pointer; pointer-events: none;"
        >
          Restart
        </text>
      </g>
      ` : ""}
    </svg>
  `;
}
