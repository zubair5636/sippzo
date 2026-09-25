import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || '';

  res.setHeader('Content-Type', 'application/json');

  if (url === '/api/health' || url.endsWith('/health')) {
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        ok: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
      })
    );
  }

  // Handle other api endpoints
  res.statusCode = 200;
  return res.end(
    JSON.stringify({
      ok: true,
      service: 'SIPPZO API',
      status: 'operational',
      path: url,
      timestamp: new Date().toISOString()
    })
  );
}
