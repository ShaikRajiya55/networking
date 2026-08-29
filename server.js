/**
 * NetForge Primary Application Entry Point
 * Starts HTTP Telemetry & Net Protocol Management Server
 */
const http = require('http');
const PORT = process.env.PORT || 8000;

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NetForge - Enterprise Networking Telemetry Suite</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0b0f19;
            --bg-secondary: #111827;
            --card-bg: rgba(17, 24, 39, 0.7);
            --card-border: rgba(255, 255, 255, 0.08);
            --accent-cyan: #38bdf8;
            --accent-indigo: #6366f1;
            --accent-emerald: #10b981;
            --accent-rose: #f43f5e;
            --accent-amber: #f59e0b;
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background-image: 
                radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 85% 85%, rgba(56, 189, 248, 0.12) 0%, transparent 45%);
            background-attachment: fixed;
        }

        header {
            background: rgba(17, 24, 39, 0.8);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--card-border);
            padding: 16px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .logo-box {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 38px;
            height: 38px;
            background: linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo));
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
        }

        .logo-icon svg {
            width: 22px;
            height: 22px;
            fill: #fff;
        }

        .logo-title {
            font-size: 20px;
            font-weight: 700;
            background: linear-gradient(90deg, #ffffff, #93c5fd);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
        }

        .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.12);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #34d399;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 500;
        }

        .pulse-dot {
            width: 8px;
            height: 8px;
            background-color: var(--accent-emerald);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--accent-emerald);
            animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        main {
            flex: 1;
            padding: 32px;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 28px;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
        }

        .card {
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 24px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .card:hover {
            transform: translateY(-4px);
            border-color: rgba(255, 255, 255, 0.18);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--text-muted);
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 12px;
        }

        .card-value {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -1px;
            margin-bottom: 6px;
            font-family: 'JetBrains Mono', monospace;
        }

        .card-subtext {
            font-size: 12px;
            color: var(--accent-emerald);
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .dashboard-row {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 24px;
        }

        @media (max-width: 1024px) {
            .dashboard-row {
                grid-template-columns: 1fr;
            }
        }

        .chart-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 18px;
        }

        .chart-title {
            font-size: 16px;
            font-weight: 600;
        }

        canvas {
            width: 100% !important;
            height: 240px !important;
        }

        .terminal-box {
            background: #090d16;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 16px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            height: 240px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .log-entry {
            display: flex;
            gap: 12px;
            opacity: 0.9;
        }

        .log-ts { color: var(--text-muted); }
        .log-allow { color: var(--accent-emerald); }
        .log-drop { color: var(--accent-rose); }
        .log-warn { color: var(--accent-amber); }

        .subsystem-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }

        .sub-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .sub-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: rgba(99, 102, 241, 0.15);
            color: var(--accent-indigo);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
        }

        .sub-info h4 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .sub-info p {
            font-size: 12px;
            color: var(--text-muted);
        }

        .action-bar {
            display: flex;
            gap: 12px;
        }

        .btn {
            background: linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan));
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
        }

        .btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        footer {
            border-top: 1px solid var(--card-border);
            padding: 20px 32px;
            text-align: center;
            color: var(--text-muted);
            font-size: 13px;
        }
    </style>
</head>
<body>

    <header>
        <div class="logo-box">
            <div class="logo-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div>
                <h1 class="logo-title">NetForge Telemetry Suite</h1>
                <p style="font-size:11px; color:var(--text-muted);">High-Performance Asynchronous Network Engine</p>
            </div>
        </div>

        <div style="display:flex; align-items:center; gap:20px;">
            <div class="status-pill">
                <span class="pulse-dot"></span>
                <span>SYSTEM ONLINE</span>
            </div>
            <div style="font-family:'JetBrains Mono'; font-size:13px; color:var(--text-muted);">
                Uptime: <span id="uptime-val" style="color:var(--text-main); font-weight:600;">0s</span>
            </div>
        </div>
    </header>

    <main>
        <!-- METRICS OVERVIEW -->
        <div class="metrics-grid">
            <div class="card">
                <div class="card-header">
                    <span>Total Packets Processed</span>
                    <span style="color:var(--accent-cyan)">⚡ 10GbE</span>
                </div>
                <div class="card-value" id="packets-count">1,849,204</div>
                <div class="card-subtext">↑ +14.2% vs last 5m interval</div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span>Current Bandwidth</span>
                    <span style="color:var(--accent-emerald)">🌐 Dynamic</span>
                </div>
                <div class="card-value" id="bandwidth-val">842.5 MB/s</div>
                <div class="card-subtext">Optimal throughput state</div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span>Active TCP/UDP Conns</span>
                    <span style="color:var(--accent-indigo)">🔗 Pool</span>
                </div>
                <div class="card-value" id="connections-count">4,096</div>
                <div class="card-subtext">Connection Pooler 100% healthy</div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span>SPI Firewall Filtered</span>
                    <span style="color:var(--accent-rose)">🛡️ Stateful</span>
                </div>
                <div class="card-value" id="blocked-count">12,840</div>
                <div class="card-subtext" style="color:var(--accent-rose);">Dropped malicious SYN floods</div>
            </div>
        </div>

        <!-- CHARTS & REAL-TIME TRAFFIC TERMINAL -->
        <div class="dashboard-row">
            <div class="card">
                <div class="chart-header">
                    <h3 class="chart-title">Real-Time Network Traffic & Latency Percentiles (p99)</h3>
                    <div class="action-bar">
                        <button class="btn" onclick="triggerBurst()">Simulate Traffic Burst</button>
                    </div>
                </div>
                <canvas id="trafficCanvas"></canvas>
            </div>

            <div class="card">
                <div class="chart-header">
                    <h3 class="chart-title">Live Packet Inspector Console</h3>
                    <span style="font-size:12px; color:var(--accent-emerald);">Live Stream</span>
                </div>
                <div class="terminal-box" id="terminalLog">
                    <!-- Logs injected dynamically -->
                </div>
            </div>
        </div>

        <!-- SUBSYSTEM STATUS MATRIX -->
        <div class="card">
            <h3 class="chart-title" style="margin-bottom:16px;">Core Subsystem Readiness Matrix</h3>
            <div class="subsystem-grid">
                <div class="sub-card">
                    <div class="sub-icon">⚡</div>
                    <div class="sub-info">
                        <h4>Async Reactor Loop</h4>
                        <p>Non-blocking Select / Epoll</p>
                    </div>
                </div>
                <div class="sub-card">
                    <div class="sub-icon">📦</div>
                    <div class="sub-info">
                        <h4>L2-L7 Protocol Stack</h4>
                        <p>Eth, IP, TCP, HTTP/2, TLS, QUIC</p>
                    </div>
                </div>
                <div class="sub-card">
                    <div class="sub-icon">🛡️</div>
                    <div class="sub-info">
                        <h4>SPI Firewall & CIDR</h4>
                        <p>Token Bucket & Rate Limiter</p>
                    </div>
                </div>
                <div class="sub-card">
                    <div class="sub-icon">⚖️</div>
                    <div class="sub-info">
                        <h4>Load Balancer Engine</h4>
                        <p>Weighted Round-Robin & Hash</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <p>NetForge Enterprise Networking Engine v1.0.0 &bull; Licensed for Proprietary Internal Infrastructure</p>
    </footer>

    <script>
        let packetCount = 1849204;
        let blockedCount = 12840;
        let connCount = 4096;
        let uptimeSec = 0;

        // Animate counters
        setInterval(() => {
            packetCount += Math.floor(Math.random() * 80) + 20;
            document.getElementById('packets-count').innerText = packetCount.toLocaleString();
            
            const bw = (750 + Math.random() * 150).toFixed(1);
            document.getElementById('bandwidth-val').innerText = bw + ' MB/s';
            
            uptimeSec++;
            const m = Math.floor(uptimeSec / 60);
            const s = uptimeSec % 60;
            document.getElementById('uptime-val').innerText = \`\${m}m \${s}s\`;
        }, 1000);

        // Terminal Log Streaming
        const term = document.getElementById('terminalLog');
        const sampleLogs = [
            { type: 'log-allow', text: '[TCP SYN] 192.168.1.104:54320 -> 10.0.0.1:443 [ALLOW - TLS 1.3]' },
            { type: 'log-allow', text: '[HTTP/2] GET /api/v1/telemetry STREAM_ID: 15 [200 OK]' },
            { type: 'log-drop',  text: '[SPI DROP] 185.220.101.5:38920 -> CIDR Blocked Rule #14' },
            { type: 'log-allow', text: '[DNS Query] api.netforge.internal -> 10.0.0.53 [RESOLVED]' },
            { type: 'log-warn',  text: '[RATE LIMIT] Token bucket threshold 92% capacity node_04' },
            { type: 'log-allow', text: '[QUIC Packet] Connection ID: 0x8F4A21 [STREAM DATA]' }
        ];

        function addLogEntry(item) {
            const div = document.createElement('div');
            div.className = 'log-entry';
            const now = new Date().toLocaleTimeString();
            div.innerHTML = \`<span class="log-ts">\${now}</span> <span class="\${item.type}">\${item.text}</span>\`;
            term.appendChild(div);
            term.scrollTop = term.scrollHeight;
            if (term.children.length > 50) term.removeChild(term.firstChild);
        }

        setInterval(() => {
            const idx = Math.floor(Math.random() * sampleLogs.length);
            addLogEntry(sampleLogs[idx]);
        }, 1500);

        function triggerBurst() {
            packetCount += 15000;
            blockedCount += 320;
            document.getElementById('packets-count').innerText = packetCount.toLocaleString();
            document.getElementById('blocked-count').innerText = blockedCount.toLocaleString();
            addLogEntry({ type: 'log-warn', text: '⚡ TRAFFIC BURST SIMULATION: +15,000 Datagrams Injected' });
        }

        // Live Canvas Waveform Chart
        const canvas = document.getElementById('trafficCanvas');
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth - 48;
            canvas.height = 220;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let step = 0;
        function drawChart() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Grid lines
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            for (let y = 40; y < canvas.height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Waveform path
            ctx.beginPath();
            ctx.lineWidth = 3;
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(0.5, '#38bdf8');
            gradient.addColorStop(1, '#10b981');
            ctx.strokeStyle = gradient;

            for (let x = 0; x < canvas.width; x += 5) {
                const y = 110 + Math.sin((x + step) * 0.02) * 35 + Math.cos((x - step) * 0.03) * 20;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Fill gradient under wave
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            const fillGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            fillGrad.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
            fillGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
            ctx.fillStyle = fillGrad;
            ctx.fill();

            step += 2;
            requestAnimationFrame(drawChart);
        }
        drawChart();
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/api/v1/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'ok', engine: 'NetForge', uptime: process.uptime() }));
    }
    if (req.url === '/api/v1/stats') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            engine: 'NetForge',
            packets: 1849204,
            active_connections: 4096,
            blocked: 12840,
            uptime: process.uptime()
        }));
    }
    // Main UI Dashboard Route
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(DASHBOARD_HTML);
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`[NetForge] Telemetry & Management Server running at http://localhost:${PORT}`);
    });
}

module.exports = server;
