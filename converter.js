const fs = require('fs');

// 1. Lê o arquivo SVG original baixado
let svg = fs.readFileSync('./mapa.svg', 'utf8');

// 2. Converte os atributos do SVG (HTML) para o padrão JSX (React)
svg = svg.replace(/stroke-width/g, 'strokeWidth');
svg = svg.replace(/stroke-linejoin/g, 'strokeLinejoin');
svg = svg.replace(/stroke-linecap/g, 'strokeLinecap');
svg = svg.replace(/stroke-miterlimit/g, 'strokeMiterlimit');
svg = svg.replace(/fill-opacity/g, 'fillOpacity');
svg = svg.replace(/fill-rule/g, 'fillRule');
svg = svg.replace(/clip-rule/g, 'clipRule');

// 3. Remove cabeçalhos XML que o React não suporta
svg = svg.replace(/<\?xml.*?\?>/g, '');
svg = svg.replace(/<!DOCTYPE.*?>/g, '');

// 4. Injeta a inteligência do React e do Tailwind em cada tag <path> ou <g>
// O regex captura IDs no formato "SP" ou "BR-SP" (padrão Wikimedia)
svg = svg.replace(/<path([^>]*?)id="?(BR-)?([A-Z]{2})"?([^>]*?)>/g, (match, before, brPrefix, uf, after) => {
    
    // Limpa cores e classes antigas do SVG para não conflitar com o nosso Tailwind
    let cleanBefore = before.replace(/class="[^"]*"/g, '').replace(/fill="[^"]*"/g, '');
    let cleanAfter = after.replace(/class="[^"]*"/g, '').replace(/fill="[^"]*"/g, '');

    // Monta a nova linha com a interatividade
    return `<path${cleanBefore}id="${uf}"${cleanAfter} onClick={() => onStateClick("${uf}")} className={\`cursor-pointer transition-colors duration-200 stroke-slate-900 stroke-[1px] \${activeState === '${uf}' ? 'fill-blue-500' : 'fill-slate-700 hover:fill-slate-500'}\`} />`;
});

// 5. Salva o resultado final pronto para uso
fs.writeFileSync('./mapa-pronto.tsx', svg);
console.log('✅ Máquina girou! SVG convertido com sucesso. Abra o arquivo mapa-pronto.tsx');