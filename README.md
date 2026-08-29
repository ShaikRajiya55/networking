# NetForge - Enterprise High-Performance Networking Engine

[![CI Build](https://github.com/ShaikRajiya55/networking/actions/workflows/ci.yml/badge.svg)](https://github.com/ShaikRajiya55/networking/actions/workflows/ci.yml)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#)
[![Code Lines](https://img.shields.io/badge/LOC-50000%2B-blue.svg)](https://github.com/ShaikRajiya55/networking)

NetForge is a production-grade, asynchronous networking engine and telemetry suite. It features stateful packet inspection, protocol parsing (Ethernet, IPv4/IPv6, TCP, UDP, DNS, HTTP/1.1, HTTP/2, QUIC, WebSocket, TLS), rate limiting, load balancing, real-time metrics streaming, dynamic Web dashboard, and command-line management utilities.

## Features
- **Async Event Loop Engine**: Non-blocking I/O socket event dispatcher.
- **Protocol Encoders & Decoders**: Full binary header parsing and serialization for Layer 2 through Layer 7.
- **Stateful Firewall & ACL**: IPv4/IPv6 CIDR trie matching, connection tracking, DDoS mitigation.
- **Traffic Routing & Load Balancer**: Round-robin, Weighted Round-Robin, Least Connections, IP-Hash algorithms.
- **Real-Time Telemetry**: Prometheus format export, latency percentiles (p50/p90/p99), packet captures (PCAP).
- **Web & CLI Dashboards**: Embedded HTML5 monitoring UI and interactive terminal console interface.

## Quick Start / Installation
```bash
npm install
npm run build
npm start
```

## Testing
```bash
npm test
```
