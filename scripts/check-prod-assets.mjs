import https from 'https';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, ct: res.headers['content-type'] || '', body: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

const index = await fetch('https://tadbuy.giveabit.io/assets/index-DVcfR3g7.js');
const text = index.body.toString('utf8');
const files = [...new Set([...text.matchAll(/assets\/([A-Za-z0-9_.-]+\.js)/g)].map((m) => m[1]))];

let ok = 0;
const missing = [];
for (const file of files) {
  const res = await fetch(`https://tadbuy.giveabit.io/assets/${file}`);
  const head = res.body.subarray(0, 20).toString('utf8');
  const isJs = /^(import|const|var|\/\*|export|\(function)/.test(head);
  if (isJs) ok++;
  else missing.push({ file, ct: res.ct, status: res.status, head: head.slice(0, 30) });
}

console.log(JSON.stringify({ total: files.length, ok, missing }, null, 2));