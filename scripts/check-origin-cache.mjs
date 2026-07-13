import https from 'https';

function fetch(path, withOrigin) {
  return new Promise((resolve) => {
    const headers = withOrigin ? { Origin: 'https://tadbuy.giveabit.io' } : {};
    https.get({ hostname: 'tadbuy.giveabit.io', path, headers }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        const head = body.subarray(0, 15).toString('utf8');
        resolve({
          ok: /^(import|const|var|\/\*)/.test(head),
          cache: res.headers['cf-cache-status'],
          len: body.length,
        });
      });
    }).on('error', () => resolve({ ok: false, cache: 'error', len: 0 }));
  });
}

const indexPath = await new Promise((resolve) => {
  https.get('https://tadbuy.giveabit.io/', (res) => {
    let data = '';
    res.on('data', (c) => (data += c));
    res.on('end', () => {
      const m = data.match(/\/assets\/(index-[A-Za-z0-9_-]+\.js)/);
      resolve(m ? `/assets/${m[1]}` : '/assets/index-DVcfR3g7.js');
    });
  });
});

const indexText = await new Promise((resolve) => {
  https.get(`https://tadbuy.giveabit.io${indexPath}`, (res) => {
    let data = '';
    res.on('data', (c) => (data += c));
    res.on('end', () => resolve(data));
  });
});

const files = [...new Set([...indexText.matchAll(/assets\/([A-Za-z0-9_.-]+\.js)/g)].map((m) => m[1]))];
console.error(`Checking ${files.length} chunks from ${indexPath}`);
const results = await Promise.all(
  files.map(async (file) => ({ file, ...(await fetch(`/assets/${file}`, true)) }))
);
const bad = results.filter((r) => !r.ok);
console.log(JSON.stringify({ total: files.length, poisoned: bad.length, bad }, null, 2));