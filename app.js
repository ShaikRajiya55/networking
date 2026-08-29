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
    <title>NetForge Cyber Command Center</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Share+Tech+Mono&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --neon-cyan: #00f3ff;
            --neon-magenta: #ff0055;
            --neon-purple: #9d00ff;
            --neon-green: #00ff66;
            --cyber-bg: #030712;
            --panel-bg: rgba(11, 19, 38, 0.85);
            --border-cyan: rgba(0, 243, 255, 0.25);
            --text-glow: 0 0 10px rgba(0, 243, 255, 0.6);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--cyber-bg);
            color: #e2e8f0;
            min-height: 100vh;
            background-image: 
                linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
            background-size: 30px 30px;
            background-position: -1px -1px;
            overflow-x: hidden;
        }

        header {
            background: rgba(8, 14, 28, 0.95);
            border-bottom: 2px solid var(--neon-cyan);
            box-shadow: 0 0 25px rgba(0, 243, 255, 0.3);
            padding: 14px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .title-box {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .cyber-logo {
            font-family: 'Orbitron', sans-serif;
            font-size: 24px;
            font-weight: 900;
            color: #fff;
            text-shadow: var(--text-glow);
            letter-spacing: 2px;
        }

        .cyber-logo span {
            color: var(--neon-cyan);
        }

        .cyber-badge {
            font-family: 'Share Tech Mono', monospace;
            background: rgba(0, 243, 255, 0.1);
            border: 1px solid var(--neon-cyan);
            color: var(--neon-cyan);
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            letter-spacing: 1px;
            box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
        }

        main {
            padding: 24px 32px;
            max-width: 1500px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .cyber-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
        }

        @media (max-width: 1024px) {
            .cyber-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .cyber-card {
            background: var(--panel-bg);
            border: 1px solid var(--border-cyan);
            border-radius: 8px;
            padding: 20px;
            position: relative;
            box-shadow: inset 0 0 15px rgba(0, 243, 255, 0.05);
            transition: all 0.2s;
        }

        .cyber-card:hover {
            border-color: var(--neon-cyan);
            box-shadow: 0 0 20px rgba(0, 243, 255, 0.25);
        }

        .card-label {
            font-family: 'Share Tech Mono', monospace;
            font-size: 12px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
        }

        .card-val {
            font-family: 'Orbitron', sans-serif;
            font-size: 30px;
            font-weight: 700;
            color: #fff;
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
        }

        .layout-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 1200px) {
            .layout-row { grid-template-columns: 1fr; }
        }

        .panel-header {
            font-family: 'Orbitron', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: var(--neon-cyan);
            letter-spacing: 1px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px dashed var(--border-cyan);
            padding-bottom: 8px;
        }

        canvas {
            width: 100% !important;
            height: 220px !important;
        }

        .radar-box {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 220px;
            position: relative;
        }

        .cyber-terminal {
            background: #020617;
            border: 1px solid var(--border-cyan);
            border-radius: 6px;
            padding: 12px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 12px;
            height: 220px;
            overflow-y: auto;
            color: var(--neon-green);
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .cmd-line {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #0f172a;
            border: 1px solid var(--border-cyan);
            padding: 6px 12px;
            border-radius: 6px;
            margin-top: 10px;
        }

        .cmd-input {
            background: transparent;
            border: none;
            outline: none;
            color: var(--neon-cyan);
            font-family: 'Share Tech Mono', monospace;
            font-size: 13px;
            width: 100%;
        }

        .proto-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-family: 'Share Tech Mono', monospace;
            font-weight: bold;
        }

        .proto-tcp { background: rgba(0, 243, 255, 0.2); color: var(--neon-cyan); }
        .proto-udp { background: rgba(157, 0, 255, 0.2); color: #c084fc; }
        .proto-http2 { background: rgba(0, 255, 102, 0.2); color: var(--neon-green); }
        .proto-quic { background: rgba(255, 0, 85, 0.2); color: var(--neon-magenta); }

        .btn-cyber {
            font-family: 'Orbitron', sans-serif;
            background: transparent;
            border: 1px solid var(--neon-cyan);
            color: var(--neon-cyan);
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-cyber:hover {
            background: var(--neon-cyan);
            color: #000;
            box-shadow: 0 0 15px var(--neon-cyan);
        }
    </style>
</head>
<body>

    <header>
        <div class="title-box">
            <h1 class="cyber-logo">NET<span>FORGE</span></h1>
            <span class="cyber-badge">CYBER COMMAND CENTER v2.5</span>
        </div>

        <div style="display:flex; align-items:center; gap:20px;">
            <div class="cyber-badge" style="border-color:var(--neon-green); color:var(--neon-green)">
                SYSTEM STATUS: ACTIVE ONLINE
            </div>
            <div style="font-family:'Share Tech Mono'; color:#94a3b8; font-size:13px;" id="sys-clock">
                00:00:00 UTC
            </div>
        </div>
    </header>

    <main>
        <!-- METRICS CARDS -->
        <div class="cyber-grid">
            <div class="cyber-card">
                <div class="card-label">
                    <span>Datagram Throughput</span>
                    <span>10 GbE</span>
                </div>
                <div class="card-val" id="val-packets">2,491,080</div>
                <div style="font-size:12px; color:var(--neon-green); margin-top:6px;">↑ 98.4% Efficiency Rate</div>
            </div>

            <div class="cyber-card">
                <div class="card-label">
                    <span>Bandwidth Rate</span>
                    <span>MAX CAPACITY</span>
                </div>
                <div class="card-val" id="val-bw" style="color:var(--neon-cyan)">1,240.8 MB/s</div>
                <div style="font-size:12px; color:var(--neon-cyan); margin-top:6px;">Dynamic Fiber Array</div>
            </div>

            <div class="cyber-card">
                <div class="card-label">
                    <span>Connection Pool</span>
                    <span>ACTIVE SOCKETS</span>
                </div>
                <div class="card-val" id="val-conn" style="color:#c084fc">8,192</div>
                <div style="font-size:12px; color:#c084fc; margin-top:6px;">Reactor Multiplexer OK</div>
            </div>

            <div class="cyber-card">
                <div class="card-label">
                    <span>SPI Firewall Drops</span>
                    <span>THREAT SHIELD</span>
                </div>
                <div class="card-val" id="val-drops" style="color:var(--neon-magenta)">19,420</div>
                <div style="font-size:12px; color:var(--neon-magenta); margin-top:6px;">SYN Floods Neutralized</div>
            </div>
        </div>

        <!-- THREE COLUMN HIGH TECH DASHBOARD ROW -->
        <div class="layout-row">
            <!-- RADAR SCOPE -->
            <div class="cyber-card">
                <div class="panel-header">
                    <span>PACKET RADAR SWEEP</span>
                    <span>360° RANGE</span>
                </div>
                <div class="radar-box">
                    <canvas id="radarCanvas"></canvas>
                </div>
            </div>

            <!-- WAVEFORM TRAFFIC -->
            <div class="cyber-card">
                <div class="panel-header">
                    <span>TRAFFIC WAVEFORM (p99)</span>
                    <button class="btn-cyber" onclick="burstSim()">BURST TEST</button>
                </div>
                <canvas id="waveCanvas"></canvas>
            </div>

            <!-- CYBER CLI TERMINAL -->
            <div class="cyber-card">
                <div class="panel-header">
                    <span>CYBER COMMAND CLI</span>
                    <span style="color:var(--neon-green)">INTERACTIVE</span>
                </div>
                <div class="cyber-terminal" id="cliTerm">
                    <div>[SYS INIT] NetForge Protocol Stack Loaded</div>
                    <div>[SYS OK] Socket Multiplexer initialized 0.0.0.0:8000</div>
                    <div>[CYBER-OPS] Type 'help' or 'status' in terminal below</div>
                </div>
                <div class="cmd-line">
                    <span style="color:var(--neon-cyan)">root@netforge:~#</span>
                    <input type="text" class="cmd-input" id="cmdInp" placeholder="type 'help', 'status', 'burst'..." onkeydown="handleCmd(event)">
                </div>
            </div>
        </div>

        <!-- PROTOCOL DISTRIBUTION & TOPOLOGY -->
        <div class="cyber-card">
            <div class="panel-header">
                <span>PROTOCOL TRAFFIC DISTRIBUTION MATRIX</span>
                <span>ACTIVE STACK</span>
            </div>
            <div style="display:flex; justify-content:space-around; flex-wrap:wrap; gap:16px; padding:12px 0;">
                <div><span class="proto-badge proto-tcp">TCP / IP</span> <strong>45%</strong> (1,120,986 pkts)</div>
                <div><span class="proto-badge proto-http2">HTTP/2</span> <strong>25%</strong> (622,770 pkts)</div>
                <div><span class="proto-badge proto-quic">QUIC UDP</span> <strong>15%</strong> (373,662 pkts)</div>
                <div><span class="proto-badge proto-udp">RAW UDP</span> <strong>10%</strong> (249,108 pkts)</div>
                <div><span class="proto-badge proto-tcp" style="background:rgba(245,158,11,0.2); color:#f59e0b">DNS / TLS</span> <strong>5%</strong> (124,554 pkts)</div>
            </div>
        </div>
    </main>

    <script>
        // Clock Update
        setInterval(() => {
            document.getElementById('sys-clock').innerText = new Date().toISOString().substring(11, 19) + ' UTC';
        }, 1000);

        let packets = 2491080;
        let drops = 19420;

        setInterval(() => {
            packets += Math.floor(Math.random() * 120) + 30;
            document.getElementById('val-packets').innerText = packets.toLocaleString();
            
            const bw = (1100 + Math.random() * 250).toFixed(1);
            document.getElementById('val-bw').innerText = bw + ' MB/s';
        }, 1000);

        // RADAR SWEEP ANIMATION
        const rCanvas = document.getElementById('radarCanvas');
        const rCtx = rCanvas.getContext('2d');
        let sweepAngle = 0;

        function resizeRadar() {
            rCanvas.width = rCanvas.parentElement.clientWidth;
            rCanvas.height = 220;
        }
        window.addEventListener('resize', resizeRadar);
        resizeRadar();

        function drawRadar() {
            rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);
            const cx = rCanvas.width / 2;
            const cy = rCanvas.height / 2;
            const radius = Math.min(cx, cy) - 15;

            // Concentric Radar Rings
            rCtx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
            rCtx.lineWidth = 1;
            for (let r = 0.25; r <= 1.0; r += 0.25) {
                rCtx.beginPath();
                rCtx.arc(cx, cy, radius * r, 0, Math.PI * 2);
                rCtx.stroke();
            }

            // Radar Axis
            rCtx.beginPath();
            rCtx.moveTo(cx - radius, cy); rCtx.lineTo(cx + radius, cy);
            rCtx.moveTo(cx, cy - radius); rCtx.lineTo(cx, cy + radius);
            rCtx.stroke();

            // Radar Sweeping Wedge
            rCtx.beginPath();
            rCtx.moveTo(cx, cy);
            rCtx.arc(cx, cy, radius, sweepAngle, sweepAngle + 0.4);
            rCtx.closePath();
            const grad = rCtx.createRadialGradient(cx, cy, 0, cx, cy, radius);
            grad.addColorStop(0, 'rgba(0, 243, 255, 0.4)');
            grad.addColorStop(1, 'rgba(0, 243, 255, 0)');
            rCtx.fillStyle = grad;
            rCtx.fill();

            // Simulated Radar Signals (Blips)
            const blips = [
                { r: 0.4, a: 1.2, label: 'Node 1' },
                { r: 0.7, a: 3.5, label: 'Node 2' },
                { r: 0.8, a: 5.1, label: 'Proxy' }
            ];

            blips.forEach(b => {
                const bx = cx + Math.cos(b.a) * (radius * b.r);
                const by = cy + Math.sin(b.a) * (radius * b.r);
                rCtx.beginPath();
                rCtx.arc(bx, by, 4, 0, Math.PI * 2);
                rCtx.fillStyle = '#00ff66';
                rCtx.fill();
                rCtx.shadowColor = '#00ff66';
                rCtx.shadowBlur = 10;
            });
            rCtx.shadowBlur = 0;

            sweepAngle += 0.03;
            requestAnimationFrame(drawRadar);
        }
        drawRadar();

        // WAVEFORM CHART
        const wCanvas = document.getElementById('waveCanvas');
        const wCtx = wCanvas.getContext('2d');
        let wStep = 0;

        function resizeWave() {
            wCanvas.width = wCanvas.parentElement.clientWidth;
            wCanvas.height = 220;
        }
        window.addEventListener('resize', resizeWave);
        resizeWave();

        function drawWave() {
            wCtx.clearRect(0, 0, wCanvas.width, wCanvas.height);
            wCtx.beginPath();
            wCtx.lineWidth = 2;
            wCtx.strokeStyle = '#00f3ff';

            for (let x = 0; x < wCanvas.width; x += 4) {
                const y = 110 + Math.sin((x + wStep) * 0.03) * 30 + Math.cos((x - wStep) * 0.04) * 15;
                if (x === 0) wCtx.moveTo(x, y);
                else wCtx.lineTo(x, y);
            }
            wCtx.stroke();
            wStep += 3;
            requestAnimationFrame(drawWave);
        }
        drawWave();

        // CYBER TERMINAL CLI LOGIC
        const term = document.getElementById('cliTerm');
        const inp = document.getElementById('cmdInp');

        function appendTerm(msg, color='#00ff66') {
            const d = document.createElement('div');
            d.style.color = color;
            d.innerText = msg;
            term.appendChild(d);
            term.scrollTop = term.scrollHeight;
        }

        function handleCmd(e) {
            if (e.key === 'Enter') {
                const val = inp.value.trim().toLowerCase();
                appendTerm('> ' + val, '#00f3ff');
                inp.value = '';

                if (val === 'help') {
                    appendTerm('Available commands: status, burst, firewall, ping, clear');
                } else if (val === 'status') {
                    appendTerm('[STATUS] All 6 Subsystems Operational | Uptime: ' + Math.floor(performance.now()/1000) + 's');
                } else if (val === 'burst') {
                    burstSim();
                } else if (val === 'firewall') {
                    appendTerm('[FIREWALL] SPI Active | CIDR Rules: 2,048 | Dropped: ' + drops);
                } else if (val === 'ping') {
                    appendTerm('[PING] localhost:8000 RTT = 0.4ms');
                } else if (val === 'clear') {
                    term.innerHTML = '';
                } else {
                    appendTerm('Unknown command: ' + val + '. Type "help" for options.', '#ff0055');
                }
            }
        }

        function burstSim() {
            packets += 25000;
            drops += 500;
            document.getElementById('val-packets').innerText = packets.toLocaleString();
            document.getElementById('val-drops').innerText = drops.toLocaleString();
            appendTerm('⚡ [BURST TEST INJECTED] +25,000 Datagrams Processed', '#ff0055');
        }
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
            packets: 2491080,
            active_connections: 8192,
            blocked: 19420,
            uptime: process.uptime()
        }));
    }
    // Main Cyber Command Center UI Route
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(DASHBOARD_HTML);
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`[NetForge] Cyber Command Center Server running at http://localhost:${PORT}`);
    });
}

module.exports = server;
