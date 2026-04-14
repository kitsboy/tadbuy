const fs = require('fs');
const content = fs.readFileSync('src/pages/BuyAds.tsx', 'utf8');
const newContent = content.replace(/<Card>/g, '<Card className="glass-panel">');
fs.writeFileSync('src/pages/BuyAds.tsx', newContent);
console.log('Replaced all <Card> with <Card className="glass-panel">');
