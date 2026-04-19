const fs = require('fs');
const path = require('path');

function ensureLine(file, snippet){
  const s = fs.existsSync(file) ? fs.readFileSync(file,'utf8') : '';
  if (!s.includes(snippet)){
    fs.writeFileSync(file, s + (s.endsWith('\n')?'':'\n') + snippet + '\n');
    console.log('[INFO] Patched', path.basename(file));
  }
}

// Patch theme tokens
const themeTs = path.join(__dirname,'..','chikitsamedha','frontend','src','lib','theme.ts');
if (fs.existsSync(themeTs)){
  let src = fs.readFileSync(themeTs,'utf8');
  src = src.replace(/gradient:\s*'[^']*'/g, "gradient: 'linear-gradient(120deg,#0EA47A 0%, #19B394 40%, #6BE9C2 100%)'");
  if (!src.includes('export const themeDark')){
    src += "\nexport const themeDark = { bg: '#0C0F14', text: '#F6F8FB', card: 'rgba(255,255,255,0.06)', gradient: 'linear-gradient(135deg,#1A1F2C 0%, #0B3B2E 50%, #0EA47A 100%)' }\n";
  }
  fs.writeFileSync(themeTs, src);
  console.log('[INFO] Theme tokens updated');
}

// Ensure hero spacing to avoid navbar overlap
const css = path.join(__dirname,'..','chikitsamedha','frontend','src','index.css');
ensureLine(css, '.hero-wrap{padding-top:100px}');

