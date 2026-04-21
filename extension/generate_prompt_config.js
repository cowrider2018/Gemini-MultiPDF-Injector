const fs = require('fs');
const path = require('path');

const prompt = process.env.DEFAULT_PROMPT || process.env.PROMPT_DEFAULT || '';
const output = `// 此檔案由環境變數生成，請勿手動修改。
window.DEFAULT_PROMPT = ${JSON.stringify(prompt)};
`;
const outPath = path.join(__dirname, 'popup', 'popup-config.js');
fs.writeFileSync(outPath, output, 'utf8');
console.log(`已生成 ${outPath}`);
console.log(`DEFAULT_PROMPT 長度：${prompt.length}`);
