import { createServer } from 'node:http'

const items = new Map([
  ['BRK-011', { sku: 'BRK-011', name: 'Hydraulic brake caliper', quantity: 40 }],
  ['DRV-204', { sku: 'DRV-204', name: '12-speed derailleur', quantity: 12 }],
])

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (status, body) => {
    res.writeHead(status, { 'content-type': 'application/json' })
    res.end(JSON.stringify(body))
  }

  if (req.method === 'GET' && url.pathname === '/items') {
    return send(200, [...items.values()])
  }
  const skuMatch = url.pathname.match(/^\/items\/([^/]+)$/)
  if (req.method === 'GET' && skuMatch) {
    const item = items.get(skuMatch[1])
    return item ? send(200, item) : send(404, { error: 'Unknown SKU' })
  }
  send(404, { error: 'Not found' })
})

server.listen(8000, () => console.log('Inventory API on http://localhost:8000'))
