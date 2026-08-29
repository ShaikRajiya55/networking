/**
 * NetForge Primary Application Entry Point
 * Starts HTTP Telemetry & Net Protocol Management Server
 */
const http = require('http');
const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/api/v1/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'ok', engine: 'NetForge', uptime: process.uptime() }));
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>NetForge Enterprise Networking Engine Running</h1>');
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`[NetForge] Server listening on port ${PORT}`);
    });
}

module.exports = server;
