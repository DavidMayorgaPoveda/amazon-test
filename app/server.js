const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT ?? 3333);
const DB_PATH = path.join(__dirname, 'db.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function serveStatic(req, res) {
  const filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  if (!filePath.startsWith(PUBLIC_DIR) || !fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const html = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/api/products') {
    const db = readDb();
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const products = q
      ? db.products.filter((p) => p.title.toLowerCase().includes(q) || p.asin.toLowerCase().includes(q))
      : db.products;
    sendJson(res, 200, products);
    return;
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/products/')) {
    const asin = url.pathname.split('/').pop();
    const product = readDb().products.find((p) => p.asin === asin);
    if (!product) {
      sendJson(res, 404, { error: 'Product not found' });
      return;
    }
    sendJson(res, 200, product);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/orders') {
    try {
      const body = await parseBody(req);
      const db = readDb();
      const product = db.products.find((p) => p.asin === body.asin);
      if (!product) {
        sendJson(res, 404, { error: 'Product not found' });
        return;
      }
      const quantity = Number(body.quantity ?? 1);
      if (product.stock < quantity) {
        sendJson(res, 409, { error: 'Out of stock' });
        return;
      }
      product.stock -= quantity;
      const order = {
        orderId: `ORD-${Date.now()}`,
        asin: product.asin,
        quantity,
        total: Number((product.price * quantity).toFixed(2)),
        status: 'PLACED',
      };
      db.orders.push(order);
      writeDb(db);
      sendJson(res, 201, order);
      return;
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON' });
      return;
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/orders') {
    sendJson(res, 200, readDb().orders);
    return;
  }

  if (req.method === 'GET') {
    serveStatic(req, res);
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed' });
});

server.listen(PORT, () => {
  console.log(`StudyMart listening on http://127.0.0.1:${PORT}`);
});
