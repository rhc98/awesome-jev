# Awesome Jev [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Site](https://img.shields.io/badge/site-awesome--jev.xyz-111827)](https://awesome-jev.xyz) [![Curated](https://img.shields.io/badge/curated-2026-09-20-2563eb)](https://awesome-jev.xyz/?sort=newest) [![Judged](https://img.shields.io/badge/judged-3317%20repos-16a34a)](https://awesome-jev.xyz/?status=all) ![Listed](https://img.shields.io/badge/listed-2560-16a34a)

> Projects built on [Jev](https://typesafe.ai), TypeSafe AI's System One model. Curated by Jev itself.

Every repository here was collected from GitHub, then judged by Jev in a single call: is it genuinely about Jev, which category, which decision pattern, and how substantial, documented, and novel it is. Code applies the policy; nothing below was hand-picked. The full index with probabilities lives on the site, along with the [review queue](https://awesome-jev.xyz/review) of borderline cases.

This is an independent community project, not affiliated with TypeSafe AI. Jev and System One are TypeSafe AI product names.

![Pipeline: GitHub search and community lists feed candidates into code, Jev judges each repository in one call, code applies the policy with human overrides, and the README and site are published daily.](docs/diagrams/pipeline.png)

## Contents

- [Official](#official)
- [SDKs and Clients](#sdks-and-clients)
- [Integrations](#integrations)
- [Agent and Developer Tooling](#agent-and-developer-tooling)
- [Applications](#applications)
- [Games, Robotics, and Simulation](#games-robotics-and-simulation)
- [Research, Evals, and Reimplementations](#research-evals-and-reimplementations)
- [Learning](#learning)
- [Other Lists](#other-lists)
- [Other](#other)
- [How This List Is Made](#how-this-list-is-made)

## Official

Maintained by TypeSafe AI.

- [system-one-adapter-python](https://github.com/typesafe-ai/system-one-adapter-python) - Drop-in TypeSafeClient replacement backed by LLM APIs.
- [typesafe-sdk-js](https://github.com/typesafe-ai/typesafe-sdk-js) - The official TypeScript/JavaScript library for the TypeSafe API.
- [typesafe-sdk-python](https://github.com/typesafe-ai/typesafe-sdk-python) - The official Python library for the TypeSafe API.
- [skills](https://github.com/typesafe-ai/skills) - Agent skills for building with TypeSafe's System One API.

## SDKs and Clients

Language bindings, CLIs, and thin wrappers for the API.

- [jevkit](https://github.com/ariel-frischer/jevkit) - Fast Rust CLI for TypeSafe Jev: typed decisions, offline linting before you pay.
- [jevi](https://github.com/bitomule/jevi) - Ask typed questions about a text and branch on the answer. A shell front end for TypeSafe's Jev.
- [ruby_decision_model](https://github.com/obie/ruby_decision_model) - Ruby client for decision models such as Typesafe Jev.
- [jev-ultralightspeed](https://github.com/collapseindex/jev-ultralightspeed) - BRRRRRRRRRRRRRRRRRRRRRR.
- [jev-tree](https://github.com/reachjalil/jev-tree) - Recursive Jev choice over a taxonomy. Select from more than 255 options without breaking TypeSafe Jev's choice cap.
- [ts-jev-cost-calculator](https://github.com/StefanoITA/ts-jev-cost-calculator) - Unofficial CLI + Python estimator of tokens, cost and context limits for TypeSafe (System One / Jev) API requests. Not affiliated with TypeSafe.
- [jod](https://github.com/mateonunez/jod) - Semantic schemas over TypeSafe's Jev — validate the state locally, then project typed answers.
- [typesafe-go](https://github.com/Nibir1/typesafe-go) - Zero-dependency Go SDK for TypeSafe's System One API (Jev). Typed questions in, calibrated probabilities out with static analyzers that catch bad question design at build time, a decision layer, batching and caching. Not affiliated with TypeSafe AI.
- [sytem-one-sdk](https://github.com/ziyu/sytem-one-sdk) - Unified interface wrapper for system one models.
- [jev](https://github.com/dannote/jev) - TypeSafe Jev for OTP: reply to Jev from a GenServer and pattern match on its answer.
- [jev-cli](https://github.com/tumf/jev-cli) - Small dependency-free CLI for TypeSafe Jev.
- [jev-cli](https://github.com/Nasrallah-AL/jev-cli) - Command-line tool for TypeSafe's Jev AI model.
- [huncho](https://github.com/edgardcham/huncho) - Decisions as code on System One models: typed questions, thresholds with hysteresis, nested decisions, journal, calibration.
- [qualm](https://github.com/qddegtya/qualm) - Typed decisions from a System One model. An uncertain answer is a different type from a confident one — and the compiler makes you handle it.
- [jev-cli](https://github.com/jtsang4/jev-cli) - CLI for TypeSafe AI's Jev evaluation model — typed questions in, structured JSON answers out.

## Integrations

Jev wired into frameworks, gateways, platforms, and databases.

- [pg-jev](https://github.com/realZachi/pg-jev) - Ask your Postgres tables questions in plain language. A PostgreSQL extension powered by TypeSafe's Jev.
- [rag-jev](https://github.com/EmreKaplaner/rag-jev) - Make room for useful evidence. Inspectable context selection for RAG, with Jev reranking and open benchmark studies.
- [HA-Jev](https://github.com/AboveColin/HA-Jev) - Ask your house a question, get a number back. Home Assistant integration for TypeSafe Jev: typed answers as sensors, four actions for automations, and a conversation agent for Assist.
- [ruby_llm-typesafe](https://github.com/kieranklaassen/ruby_llm-typesafe) - TypeSafe structured-output provider for RubyLLM 2.
- [n8n-nodes-typesafe-jev](https://github.com/n3ndor/n8n-nodes-typesafe-jev) - N8n community node for TypeSafe Jev structured AI decisions.
- [laravel-typesafe-jev](https://github.com/Butochnikov/laravel-typesafe-jev) - Unofficial Laravel integration for TypeSafe Jev AI with typed responses, async requests, scoped dependency injection, and testing fakes.
- [HA-SystemOne](https://github.com/AtHeartEngineer/HA-SystemOne) - Adding SystemOne APIs like Typesafe Jev to home assistant.
- [vgi-typesafe](https://github.com/Query-farm/vgi-typesafe) - A VGI worker exposing TypeSafe System One questions (choice, noul, score) to DuckDB/SQL as LATERAL-joinable table functions.
- [jev-connector](https://github.com/juanlentino/jev-connector) - WordPress connector for the TypeSafe System One API (Jev): typed questions, confidence-scored answers, core Connectors API key management.
- [openclaw-jev-compaction](https://github.com/SqaaSSL/openclaw-jev-compaction) - Verbatim context compaction for OpenClaw: a context engine powered by TypeSafe's Jev. Drops stale tool calls and results, never summarizes.
- [dsh-jev](https://github.com/buberlo/dsh-jev) - Jev-powered decision layer for DeepSeek Harness.
- [jevalyn](https://github.com/Ray-Hughes/jevalyn) - The decision layer for your Rails app. A Rails-native wrapper around TypeSafe's Jev System One API: typed, calibrated decisions in your control flow.
- [hermes-jev-fastpath](https://github.com/scursel/hermes-jev-fastpath) - Hermes Agent middleware using TypeSafe Jev for fail-open deterministic fast paths before LLM execution.
- [n8n-nodes-jev](https://github.com/vibe-with-me-tools/n8n-nodes-jev) - Helper n8n community node for Jev by TypeSafe. Classify, route, and score text with questions you define, and get a probability for every answer so unsure items can go to review.

## Agent and Developer Tooling

Routers, guards, reviewers, skills, and MCP servers for coding agents.

- [jev-belay](https://github.com/valentynkit/jev-belay) - Claude Code Stop hook that blocks an unverified done: reads the transcript for evidence, asks Jev once, fails open on everything else.
- [hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills) - Jev-powered model routing, memory, compaction, skill selection, computer and browser use for Hermes agents (also Claude Code and Codex).
- [hermes-jev](https://github.com/keeltrace/hermes-jev) - Typed System One decisions, ranking, verification, and an opt-in Hermes tool gate using TypeSafe Jev.
- [pi-jev-auto-mode](https://github.com/jomatsu/pi-jev-auto-mode) - Jev (TypeSafe System One) backed auto mode for the Pi coding agent: semantically auto-approves bash, write, and edit tool calls and fails closed when a decision cannot be made.
- [jevwire](https://github.com/Brainwires/jevwire) - Jev decision layer for agents: MCP server, embeddable DecisionModel library, and an escalate-only Claude Code plugin (TypeSafe AI's Jev).
- [jev-mcp](https://github.com/Brainwires/jev-mcp) - Jev decision layer for agents: MCP server, embeddable DecisionModel library, and an escalate-only Claude Code plugin (TypeSafe AI's Jev).
- [JevRouter](https://github.com/BillionsBobby/JevRouter) - A lightweight Jev-powered router for models, tools, and subagents.
- [jev-browser](https://github.com/Ying-Kai-Liao/jev-browser) - Browser automation where an LLM plans and Jev (Typesafe System One) decides. Library, CLI and MCP server.
- [distill](https://github.com/samuelfaj/distill) - Distill is a lightweight coding agent harness and TUI built to get more done with FAR FEWER tokens 🔥.
- [jev-observatory](https://github.com/XieChengYuan/jev-observatory) - Jev 活动看板：自动接入 MCP，实时查看真实输入、判断结果与用量。Local-first, passive MCP observability.
- [jev-axi](https://github.com/shiftynick/jev-axi) - Agent-ergonomic CLI for TypeSafe's Jev: fast calibrated judgments (pick, rate, check, rank, triage, guard) from the shell.
- [pi-typesafe](https://github.com/DevMortimer/pi-typesafe) - TypeSafe decisions for Pi: batched evaluation tool, terminal playground, and typed API for extension authors.
- [pi-extensions](https://github.com/narumiruna/pi-extensions) - A monorepo of Pi Coding Agent extensions.
- [jev-use](https://github.com/shitianfang/jev-use) - Claude Code / Codex / pi plugin that hands agent steps needing no text output to Jev (TypeSafe's judgment model) — measured p50 ~230 ms and ~$0.02 per 1,000 judgments, with typed escalation back to the LLM.
- [pi-warden](https://github.com/DevMortimer/pi-warden) - Guardrails for Pi built on pi-typesafe that steer the agent instead of interrupting you: Jev judges irreversible and off-task tool calls, detects stuck loops, checks unverified done claims, flags slop.

## Applications

Products and features whose behavior depends on Jev decisions.

- [classifier-dev](https://github.com/mrmps/classifier-dev) - Zero-shot text classification over plain HTTP — no API key, no account. One Cloudflare Worker, a CLI, and an MCP server. https://classifier.dev.
- [QuantDinger](https://github.com/OpenByteInc/QuantDinger) - Open-source AI Trading OS, agent trading, and vibe trading, with Jev System One integration. Research, build Python strategies, backtest, and paper/live trade across crypto, stocks, and forex. Launch your own multi-tenant trading SaaS with built-in user management, billing, payments, and settlement.
- [quackd](https://github.com/rokbenko/quackd) - One CLI for all your robots. Connect them, command them, and let them work together, each with an LLM for a brain, Jev for cheaper steps. Microduck, Open Duck Mini, LeRobot, XLeRobot, AlohaMini, ToddlerBot or any ROS base. Claude, OpenAI, Gemini, Grok, or local via Ollama or vLLM. Simulator, .duck safety contracts, MCP, memory between runs, flocks.
- [jev-search](https://github.com/superagents-lab/jev-search) - Search the web with TypeSafe's Jev: source selection, query understanding and relevance ranking. Built with Search1API.
- [rag-jev](https://github.com/Nixz0824/rag-jev) - 国服《英雄联盟》版本更新公告的本地 RAG 问答：数字只来自公告，Jev（TypeSafe System One）负责候选重排与回答自检.
- [jev-ultrafast](https://github.com/browser-use/jev-ultrafast) - I. am. speed.
- [jev-voice-control](https://github.com/chris-wozniczek/jev-voice-control) - Control your Mac by voice. Speech → Jev (TypeSafe AI System One model) typed decisions → macOS actions. Menu-bar Swift app.
- [typesafe-computer-use](https://github.com/awlevin/typesafe-computer-use) - Computer use for about $0.0002 a step: OCR the screen, classify the next action with TypeSafe, click. macOS.
- [VisionClaw-Agent-Public-Release](https://github.com/Huskyauto/VisionClaw-Agent-Public-Release) - Open-source multi-tenant AI agent workspace · 18 personas · 138 active capabilities · 825 platform indexes · 79 curated AI models + 1000+ OpenRouter catalog · self-hosted, BYO-keys.
- [jev-mobile](https://github.com/Friedjof/jev-mobile) - Fast structured Android control loops with TypeSafe Jev and Mobile MCP.
- [jev-skip](https://github.com/valentynkit/jev-skip) - YouTube sponsor skipper that reads the captions and decides at watch time: a probability heatmap on the seek bar, no crowd database.
- [jev-relay](https://github.com/rnjsxodyd90/jev-relay) - A typed Jev decision gate, local-voice interpreter workbench, and reproducible Jev vs Qwen research.
- [jev-chat-for-twitch](https://github.com/ethanplusai/jev-chat-for-twitch) - Filter any live Twitch chat with Jev: a bring-your-own-key Chrome extension.
- [mappity](https://github.com/kortexa-ai/mappity) - Ask the map anything. Every place answers with a probability. OpenStreetMap + Mapillary + TypeSafe Jev + Cactus Needle.

## Games, Robotics, and Simulation

Jev in a control loop.

- [jev-parallel-dispatch](https://github.com/Jason-Doyle/jev-parallel-dispatch) - Browser simulation for parallel Jev decisions with capacity-constrained assignment and retained evidence.
- [heist-one](https://github.com/AbdelStark/heist-one) - Observable browser stealth game: Jev makes typed guard judgments while deterministic code owns the world.
- [minesweeper-jev](https://github.com/Hldwsd/minesweeper-jev) - Minesweeper where deterministic logic does the provable work and TypeSafe Jev is consulted only when the board forces a guess.
- [jev-jstris](https://github.com/SongMarco/jev-jstris) - Jev chooses Tetris placements; a local controller plays Jstris through keyboard input.
- [jev-plays-pokemon-red](https://github.com/valentynkit/jev-plays-pokemon-red) - Pokemon Red on PyBoy: code owns the route and the arithmetic, Jev picks at branches in about 100 ms, calibration measured instead of assumed.
- [jev-tetris](https://github.com/Tsagaanbayr1/jev-tetris) - Real-time Tetris versus Jev, a TypeSafe decision model — spins, garbage, B2B chains, and decisions prefetched a piece ahead.
- [jev-sonar](https://github.com/meetr1912/jev-sonar) - TypeSafe Jev plays Battleship: one ~100-question typed fan-out per turn returns a calibrated hit-probability heatmap that is also the move policy.
- [jev-nethack](https://github.com/integrate-your-mind/jev-nethack) - Jev x NetHack: bounded runner, research code, and completed recording releases.
- [jev-trade](https://github.com/rikkooo/jev-trade) - A market-data trading simulator powered by auditable Jev judgments.
- [jevball](https://github.com/atarikcaliskan/jevball) - 22 Jev models, one ball: a 3D football match where every player is its own Jev (TypeSafe AI System One) decision. Watch, or take over the number 9.
- [jev-escape](https://github.com/munirad7s/jev-escape) - Escape Room mit Freitext-Eingabe: TypeSafes Jev urteilt als Schiedsrichter über jeden getippten Satz.
- [jev-practice-speed](https://github.com/tubone24/jev-practice-speed) - トランプの スピード を、CPU 側の頭脳に TypeSafe AI の Jev を使って対戦する WebGL デモアプリ。Jev の判断速度と判断精度をリアルタイムに計測して見せることが目的。.
- [robots-world](https://github.com/DanMcInerney/robots-world) - A modular multi-robot control testbed with swappable physics, sensors, AI controllers, and impaired swarm communication.
- [spire-jev](https://github.com/enderzcx/spire-jev) - Slay the Spire 2 agent controller: planner models, Jev fast decisions, and verified multi-card turn execution.

## Research, Evals, and Reimplementations

Benchmarks, calibration studies, and open replicas.

- [jevbench](https://github.com/fstandhartinger/jevbench) - JevBench v1 - a benchmark for Jev-class typed decision models: smart, cheap, fast, reliable, open.
- [kev](https://github.com/jaredpalmer/kev) - Tiny Jev-like model built on top of Qwen2.5-0.5B you can train and run on your MacBook.
- [dinostomp](https://github.com/collapseindex/dinostomp) - A verification layer for AI evaluations. Checks the instrument, not just the score: data, scorer, runs, numbers, claims, and itself.
- [laya-mlx](https://github.com/mizorewww/laya-mlx) - Native MLX runtime for Laya typed decision models — 7–14 ms short decisions on M3 Max. No text generation, PyTorch, or cloud API.
- [decider](https://github.com/Mapika/decider) - One-pass typed decisions with calibrated probabilities (System One style model), fine-tuned from Qwen3.5-2B.
- [jevassert](https://github.com/dtduc-git/jevassert) - Record/replay regression tests for Jev (TypeSafe System One) question packs — accuracy, calibration and cost gates in CI.
- [SemIf](https://github.com/TheoLeeCJ/SemIf) - Semantic ifs from open models, on a 3090 at home. Independent; not affiliated with Jev or TypeSafe.
- [jevmlx](https://github.com/bnsd55/jevmlx) - Jev-style parallel constrained decisions for any MLX model on Apple Silicon. Typed, schema-valid JSON in one forward pass.
- [jev-benchmarks](https://github.com/AbdelStark/jev-benchmarks) - Probability-aware evaluation for typed decision models: calibration, selective risk, latency, and reproducible benchmarks.
- [openjev](https://github.com/TheoLeeCJ/openjev) - Semantic ifs from open models, on a 3090 at home. Independent; not affiliated with Jev or TypeSafe.
- [jev-packs](https://github.com/dtduc-git/jev-packs) - Evidence-gated registry of Jev question packs — curated questions, golden cases and measured evidence for Jev-compatible decision endpoints.
- [WindTunnel](https://github.com/nekuda-ai/WindTunnel) - A WebMCP benchmark, measures WebMCP against other browser-agent interfaces.
- [vernier](https://github.com/n0nuser/vernier) - Measure meaning by perturbing text and watching a calibrated probability move. Ablation attribution over TypeSafe's Jev, reported against a measured noise floor.
- [typesafe-local](https://github.com/aabolfazl/typesafe-local) - Inspired by TypeSafe Ai, Ask a local LLM typed questions, get calibrated probabilities instead of text. Structured output without generation or parsing. MLX / Apple Silicon.
- [von](https://github.com/wfzyx/von) - The open-source System One decision model. Sub-15ms, non-autoregressive, local drop-in alternative to TypeSafe Jev.

## Learning

Tutorials, example galleries, and playgrounds.

- [jev-lab](https://github.com/xergioalex/jev-lab) - A hands-on lab for Jev, TypeSafe's System One model — AI decision trees, guardrails and routing with typed answers instead of text.
- [jev-builder](https://github.com/collapseindex/jev-builder) - A browser form for building requests to TypeSafe's Jev: pick a template, fill in the blanks, copy the request. No JSON, no install, runs locally.
- [jev](https://github.com/inematds/jev) - Análise crítica e plano de aplicação do Jev em decisões estruturadas.
- [jev-starter](https://github.com/hamakyo/jev-starter) - Typed, policy-driven decision workflows on top of TypeSafe AI Jev: confidence routing, fallbacks, evaluation, and RAG patterns for TypeScript apps.
- [jev-demo](https://github.com/sawzhang/jev-demo) - Jev (TypeSafe System One) 学习与实测：概念文档 + 5 个可运行 demo + 可复现压测。实测 jev-1.13.0：扇出几乎免费，40 问与 1 问等延迟。.
- [jev-preview](https://github.com/ArkadyBuryakov/jev-preview) - TUI Sandbox for Typesafe Jev API.
- [Jev](https://github.com/cobusgreyling/Jev) - Unofficial TypeSafe Jev showcase — System One decisions, not chat.
- [jev-cookbook](https://github.com/nexibeo/jev-cookbook) - Practical, tested recipes for TypeSafe's Jev decision model on OpenRouter: support triage, database indexing, file organizing, tagging, taxonomies, dedupe, PII detection, extraction, search re-ranking and a browser agent.
- [jevcode](https://github.com/miounet11/jevcode) - JevCode — Jev (TypeSafe System One) 技术解决方案与最佳实践 · https://www.jevcode.ai.
- [jev-for-engineers](https://github.com/Foadsf/jev-for-engineers) - Eight minimal working examples of TypeSafe's Jev (a System One model) applied to mechanical and electrical engineering: CAD/CAE/CAM routing, FEM result triage, DFM screening, BOM alignment, hallucination-proof extraction. Zero dependencies.
- [neo4jev](https://github.com/jexp/neo4jev) - Typesafe.ai System One Model Jev navigating a Neo4j graph by using a classifier over neighbouring relationships.

## Other Lists

Community-maintained lists and directories.

- [awesome-jev-by-typesafe](https://github.com/Anil-matcha/awesome-jev-by-typesafe) - Evidence-backed use cases, patterns, prompts, and starter code for TypeSafe Jev — a System One model for fast, typed, confidence-aware decisions in software.
- [jev-lab](https://github.com/llt22/jev-lab) - Hands-on research lab for TypeSafe's Jev (System One model): reproducible benchmarks of Noul/Choice/Score primitives, confidence gating, fan-out latency, agent control — plus a living audit of the Jev ecosystem.
- [awesome-jev-use-cases](https://github.com/SeeAPI/awesome-jev-use-cases) - Explore real-world use cases and projects built with TypeSafe AI's Jev: content moderation, AI agents, model routing, and semantic search. Curated by SeeAPI.
- [awesome-jev-usecases](https://github.com/aliaihub/awesome-jev-usecases) - Evidence-backed use cases, patterns, and guidance for building with Jev, TypeSafe AI's System One model. Every claim is labeled and sourced.
- [what-is-jev](https://github.com/tunahansahin897/what-is-jev) - A sourced, critical research file on TypeSafe's Jev (System One) model, plus a rubric-scored map of 780 public repositories. English / Türkçe.
- [jev-radar](https://github.com/everyinfra/jev-radar) - 📡 全网最全 · The world's most comprehensive tracker of the Jev (TypeSafe AI System One) ecosystem — 220+ documented cases · 108 confidence-graded entries · verified & rescanned every 3 hours · API access guide included.
- [awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects) - Awesome Jev: source-backed open-source ecosystem radar, plain-language project discovery, and automatic GitHub sync.
- [awesome-jev-typesafe](https://github.com/valentynkit/awesome-jev-typesafe) - Typed decisions with TypeSafe's Jev, the first System One model.
- [awesome-jev](https://github.com/cobanov/awesome-jev) - A curated, source-backed list of projects built with Jev, TypeSafe AI's System One model for typed decisions.
- [awesome-jev](https://github.com/dog-last/awesome-jev) - A curated guide to Jev, TypeSafe AI's System One decision model — selection advice, API-verified cookbooks, independent evaluations, and 100+ community. 中英双语.
- [awesome-jev-zh](https://github.com/yzfly/awesome-jev-zh) - Jev / TypeSafe System One 中文精选列表：官方资料、SDK、爆款应用、Agent 工具、开源复现与独立评测，附中文上手指南，每日自动收录 GitHub 热门项目。.
- [awesome-typesafe-jev](https://github.com/thevibeworks/awesome-typesafe-jev) - Curated list of projects built on TypeSafe's Jev model, read before listed. With media and our own measurements. Not affiliated with TypeSafe AI.
- [awesome-jev-apps](https://github.com/Justmalhar/awesome-jev-apps) - Awesome Collection of apps built with Jev - a System One model.

## Other

Genuine Jev projects that fit no category above.

- [syllago-docs](https://github.com/OpenScribbler/syllago-docs) - Documentation site for Syllago—the package manager for AI coding tool content.

## How This List Is Made

Discover: GitHub repository search, code search for SDK usage, and links from other community lists. Enrich: README excerpt, file listing, manifest dependencies, and activity metadata. Judge: one Jev call per repository with 11 typed questions, gates as Noul, category and pattern as Choice, substance, docs, and novelty as Score. Curate: code applies thresholds and weights to the stored judgments, so changing policy never re-runs inference. Publish: this README and the site are generated from `data/curated.json` every day.

Question set `v2`, model `jev-1.13.0`. The calibration against human labels is on the [how it works](https://awesome-jev.xyz/how-it-works) page.

## Contributing

Missing project? [Submit it](https://github.com/rhc98/awesome-jev/issues/new?template=submit.yml) with the repository URL. A bot checks the link, the next daily run judges it, and the verdict is posted back on the issue. This README carries the top 15 by composite in each category; everything else that passes the gate is on the site. Think Jev got one wrong? [Say so](https://github.com/rhc98/awesome-jev/issues/new?template=jev-got-it-wrong.yml) and a bot drafts the `data/overrides.yaml` change for a maintainer to review. Do not edit this README directly; it is regenerated.
