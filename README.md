# Awesome Jev [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Site](https://img.shields.io/badge/site-awesome--jev.xyz-111827)](https://awesome-jev.xyz) [![Curated](https://img.shields.io/badge/curated-2026-09-21-2563eb)](https://awesome-jev.xyz/?sort=newest) [![Judged](https://img.shields.io/badge/judged-4505%20repos-16a34a)](https://awesome-jev.xyz/?status=all) ![Listed](https://img.shields.io/badge/listed-3559-16a34a)

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

- [jevi](https://github.com/bitomule/jevi) - Ask typed questions about a text and branch on the answer. A shell front end for TypeSafe's Jev.
- [jev-ultralightspeed](https://github.com/collapseindex/jev-ultralightspeed) - BRRRRRRRRRRRRRRRRRRRRRR.
- [jevkit](https://github.com/ariel-frischer/jevkit) - Fast Rust CLI for TypeSafe Jev: typed decisions, offline linting before you pay.
- [ruby_decision_model](https://github.com/obie/ruby_decision_model) - Ruby client for decision models such as Typesafe Jev.
- [jev-tree](https://github.com/reachjalil/jev-tree) - Recursive Jev choice over a taxonomy. Select from more than 255 options without breaking TypeSafe Jev's choice cap.
- [ts-jev-cost-calculator](https://github.com/StefanoITA/ts-jev-cost-calculator) - Unofficial CLI + Python estimator of tokens, cost and context limits for TypeSafe (System One / Jev) API requests. Not affiliated with TypeSafe.
- [jod](https://github.com/mateonunez/jod) - Semantic schemas over TypeSafe's Jev — validate the state locally, then project typed answers.
- [jevkit](https://github.com/tegersdorfer-collab/jevkit) - Decision kernel for TypeSafe Jev (System One): typed questions, bands, state building, composition.
- [jev-spec](https://github.com/nozomi-koborinai/jev-spec) - ⚡ Catch spec drift on every commit: check your code against your Markdown specs with TypeSafe AI's Jev model.
- [typesafe-go](https://github.com/Nibir1/typesafe-go) - Zero-dependency Go SDK for TypeSafe's System One API (Jev). Typed questions in, calibrated probabilities out with static analyzers that catch bad question design at build time, a decision layer, batching and caching. Not affiliated with TypeSafe AI.
- [sytem-one-sdk](https://github.com/ziyu/sytem-one-sdk) - Unified interface wrapper for system one models.
- [jev](https://github.com/dannote/jev) - TypeSafe Jev for OTP: reply to Jev from a GenServer and pattern match on its answer.
- [jev-cli](https://github.com/Nasrallah-AL/jev-cli) - Command-line tool for TypeSafe's Jev AI model.
- [Jev-unofficial-toolkit](https://github.com/HiQS-Labs/Jev-unofficial-toolkit) - HiQS' unofficial starter code for Jev model with examples and toolkit based on our testing.
- [jev-cli](https://github.com/tumf/jev-cli) - Small dependency-free CLI for TypeSafe Jev.

## Integrations

Jev wired into frameworks, gateways, platforms, and databases.

- [pg-jev](https://github.com/realZachi/pg-jev) - Ask your Postgres tables questions in plain language. A PostgreSQL extension powered by TypeSafe's Jev.
- [rag-jev](https://github.com/EmreKaplaner/rag-jev) - Make room for useful evidence. Inspectable context selection for RAG, with Jev reranking and open benchmark studies.
- [duckdb-jev](https://github.com/prasanthj/duckdb-jev) - High-throughput, robust native DuckDB extension for batched and streaming TypeSafe/Jev classification, scoring, and semantic predicates from SQL.
- [HA-Jev](https://github.com/AboveColin/HA-Jev) - Ask your house a question, get a number back. Home Assistant integration for TypeSafe Jev: typed answers as sensors, four actions for automations, and a conversation agent for Assist.
- [jev-browser](https://github.com/tontoko/jev-browser) - One grounded Jev/Playwright core: typed SDK, persistent CLI, and MCP server with native browser operations and deterministic assertions.
- [ruby_llm-typesafe](https://github.com/kieranklaassen/ruby_llm-typesafe) - TypeSafe structured-output provider for RubyLLM 2.
- [jev-langgraph](https://github.com/wudilyy999/jev-langgraph) - JEV-native probabilistic decisions, human review, and auditable execution on LangGraph.
- [n8n-nodes-typesafe-jev](https://github.com/n3ndor/n8n-nodes-typesafe-jev) - N8n community node for TypeSafe Jev structured AI decisions.
- [jevalyn](https://github.com/Ray-Hughes/jevalyn) - The decision layer for your Rails app. A Rails-native wrapper around TypeSafe's Jev System One API: typed, calibrated decisions in your control flow.
- [laravel-typesafe-jev](https://github.com/Butochnikov/laravel-typesafe-jev) - Unofficial Laravel integration for TypeSafe Jev AI with typed responses, async requests, scoped dependency injection, and testing fakes.
- [jev-connector](https://github.com/juanlentino/jev-connector) - WordPress connector for the TypeSafe System One API (Jev): typed questions, confidence-scored answers, core Connectors API key management.
- [dsh-jev](https://github.com/buberlo/dsh-jev) - Jev-powered decision layer for DeepSeek Harness.
- [n8n-nodes-jev-classification](https://github.com/khmuhtadin/n8n-nodes-jev-classification) - N8n community node for Jev by TypeSafe AI: classify, score and check text with calibrated probabilities. Parallel requests and multi-item batching.
- [HA-SystemOne](https://github.com/AtHeartEngineer/HA-SystemOne) - Adding SystemOne APIs like Typesafe Jev to home assistant.

## Agent and Developer Tooling

Routers, guards, reviewers, skills, and MCP servers for coding agents.

- [hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills) - Jev-powered model routing, memory, compaction, skill selection, computer and browser use for Hermes agents (also Claude Code and Codex).
- [jev-belay](https://github.com/valentynkit/jev-belay) - Claude Code Stop hook that blocks an unverified done: reads the transcript for evidence, asks Jev once, fails open on everything else.
- [hermes-jev](https://github.com/keeltrace/hermes-jev) - Typed System One decisions, ranking, verification, and an opt-in Hermes tool gate using TypeSafe Jev.
- [neurolink](https://github.com/juspay/neurolink) - One TypeScript interface for 40 AI providers across three inference types — generate, stream, and decide. Decide returns typed, calibrated judgments (boolean/choice/score) via TypeSafe Jev, not text. MCP-native, voice (TTS/STT/realtime), RAG, memory, file processors. Powers Tara, Yama and Clairvoyance at Juspay.
- [jevwire](https://github.com/Brainwires/jevwire) - Jev decision layer for agents: MCP server, embeddable DecisionModel library, and an escalate-only Claude Code plugin (TypeSafe AI's Jev).
- [pi-jev-auto-mode](https://github.com/jomatsu/pi-jev-auto-mode) - Jev (TypeSafe System One) backed auto mode for the Pi coding agent: semantically auto-approves bash, write, and edit tool calls and fails closed when a decision cannot be made.
- [jev-mcp](https://github.com/Brainwires/jev-mcp) - Jev decision layer for agents: MCP server, embeddable DecisionModel library, and an escalate-only Claude Code plugin (TypeSafe AI's Jev).
- [JevRouter](https://github.com/BillionsBobby/JevRouter) - A lightweight Jev-powered router for models, tools, and subagents.
- [jev-browser](https://github.com/jkudish/jev-browser) - Browser use using Typesafe's Jev model.
- [jev-mcp](https://github.com/jkudish/jev-mcp) - Fast, cheap, typed judgments from TypeSafe's Jev model, as MCP tools.
- [pi-typesafe](https://github.com/DevMortimer/pi-typesafe) - TypeSafe decisions for Pi: batched evaluation tool, terminal playground, and typed API for extension authors.
- [jev-browser](https://github.com/Ying-Kai-Liao/jev-browser) - Browser automation where an LLM plans and Jev (Typesafe System One) decides. Library, CLI and MCP server.
- [jev-gateway](https://github.com/vinilana/jev-gateway) - An easy way to use jev with your coding agent for tool calling reasoning.
- [dsh-jev](https://github.com/zhangxaochen/dsh-jev) - Jev (System One decision model) plugin suite for DeepSeek Harness (dsh).

## Applications

Products and features whose behavior depends on Jev decisions.

- [classifier-dev](https://github.com/mrmps/classifier-dev) - Zero-shot text classification over plain HTTP — no API key, no account. One Cloudflare Worker, a CLI, and an MCP server. https://classifier.dev.
- [jev-search](https://github.com/superagents-lab/jev-search) - Search the web with TypeSafe's Jev: source selection, query understanding and relevance ranking. Built with Search1API.
- [rag-jev](https://github.com/Nixz0824/rag-jev) - 国服《英雄联盟》版本更新公告的本地 RAG 问答：数字只来自公告，Jev（TypeSafe System One）负责候选重排与回答自检.
- [quackd](https://github.com/rokbenko/quackd) - One CLI for all your robots. Connect them, command them, and let them work together, each with an LLM for a brain, Jev for cheaper steps. Microduck, Open Duck Mini, LeRobot, XLeRobot, AlohaMini, ToddlerBot or any ROS base. Claude, OpenAI, Gemini, Grok, or local via Ollama or vLLM. Simulator, .duck safety contracts, MCP, memory between runs, flocks.
- [QuantDinger](https://github.com/OpenByteInc/QuantDinger) - Open-source AI Trading OS, agent trading, and vibe trading, with Jev System One integration. Research, build Python strategies, backtest, and paper/live trade across crypto, stocks, and forex. Launch your own multi-tenant trading SaaS with built-in user management, billing, payments, and settlement.
- [jevgraph](https://github.com/chenmingtang830/jevgraph) - Evidence-backed knowledge graph construction with typed Jev relation decisions.
- [aside-jev](https://github.com/himomohi/aside-jev) - Aside agents decide with TypeSafe Jev (System One: Choice/Score/Noul). Not a Cua binding — Jev is the model, Aside is the browser runtime.
- [VisionClaw-Agent-Public-Release](https://github.com/Huskyauto/VisionClaw-Agent-Public-Release) - Open-source multi-tenant AI agent workspace · 18 personas · 138 active capabilities · 825 platform indexes · 79 curated AI models + 1000+ OpenRouter catalog · self-hosted, BYO-keys.
- [jev-ultrafast](https://github.com/browser-use/jev-ultrafast) - I. am. speed.
- [superterminal](https://github.com/sonnylazuardi/superterminal) - A native multiplexer terminal for Windows, Linux and Mac.
- [typesafe-computer-use](https://github.com/awlevin/typesafe-computer-use) - Computer use for about $0.0002 a step: OCR the screen, classify the next action with TypeSafe, click. macOS.
- [jev-ads-analysis](https://github.com/Wany-i/jev-ads-analysis) - 把决策模型 Jev 接进亚马逊广告优化的参考实现：规则层出可追溯结论，Jev 出独立第二意见，分歧即信号。输出可落到飞书多维表格。.
- [jev-mobile](https://github.com/Friedjof/jev-mobile) - Fast structured Android control loops with TypeSafe Jev and Mobile MCP.
- [mailordinal](https://github.com/Milo318/mailordinal) - Decision-native enterprise inbox: typed AI signals, deterministic priority policy, confidence-aware routing.

## Games, Robotics, and Simulation

Jev in a control loop.

- [jev-parallel-dispatch](https://github.com/Jason-Doyle/jev-parallel-dispatch) - Browser simulation for parallel Jev decisions with capacity-constrained assignment and retained evidence.
- [heist-one](https://github.com/AbdelStark/heist-one) - Observable browser stealth game: Jev makes typed guard judgments while deterministic code owns the world.
- [jev-jstris](https://github.com/SongMarco/jev-jstris) - Jev chooses Tetris placements; a local controller plays Jstris through keyboard input.
- [minesweeper-jev](https://github.com/Hldwsd/minesweeper-jev) - Minesweeper where deterministic logic does the provable work and TypeSafe Jev is consulted only when the board forces a guess.
- [jev-plays-pokemon-red](https://github.com/valentynkit/jev-plays-pokemon-red) - Pokemon Red on PyBoy: code owns the route and the arithmetic, Jev picks at branches in about 100 ms, calibration measured instead of assumed.
- [jev-practice-speed](https://github.com/tubone24/jev-practice-speed) - A WebGL demo where you play the card game Speed against a CPU whose brain is TypeSafe AI's Jev. The whole point of the app is to measure and show Jev's decision speed and decision accuracy in real time.
- [jev-table-tennis](https://github.com/LiuHao-1443/jev-table-tennis) - Table tennis vs. TypeSafe's Jev (System One). Every paddle move on the right is a live model decision — no local prediction, just a lookup table and a servo.
- [jev-torneo-animales](https://github.com/hectorlcastro09/jev-torneo-animales) - Winner-stays-on animal tournament refereed by Jev (TypeSafe System One): a local game to feel how fast typed decisions are. UI in Spanish.
- [jev-nethack](https://github.com/integrate-your-mind/jev-nethack) - Jev x NetHack: bounded runner, research code, and completed recording releases.
- [jev-sonar](https://github.com/meetr1912/jev-sonar) - TypeSafe Jev plays Battleship: one ~100-question typed fan-out per turn returns a calibrated hit-probability heatmap that is also the move policy.
- [embodied-jev](https://github.com/FBddcz/embodied-jev) - EmbodiedJev: MuJoCo robot decision workbench with MiniCPM5-2B, Jev and compatible model APIs.
- [jev-board-game](https://github.com/KeWang0622/jev-board-game) - Belief as a primitive: instrumenting social-deduction games (Undercover, Werewolf, Avalon) with TypeSafe's calibrated System-One model, Jev.
- [spire-jev](https://github.com/enderzcx/spire-jev) - Slay the Spire 2 agent controller: planner models, Jev fast decisions, and verified multi-card turn execution.
- [jev-trade](https://github.com/rikkooo/jev-trade) - A market-data trading simulator powered by auditable Jev judgments.
- [jevball](https://github.com/atarikcaliskan/jevball) - 22 Jev models, one ball: a 3D football match where every player is its own Jev (TypeSafe AI System One) decision. Watch, or take over the number 9.

## Research, Evals, and Reimplementations

Benchmarks, calibration studies, and open replicas.

- [jevbench](https://github.com/fstandhartinger/jevbench) - JevBench v1 - a benchmark for Jev-class typed decision models: smart, cheap, fast, reliable, open.
- [dinostomp](https://github.com/collapseindex/dinostomp) - A verification layer for AI evaluations. Checks the instrument, not just the score: data, scorer, runs, numbers, claims, and itself.
- [laya-mlx](https://github.com/mizorewww/laya-mlx) - Native MLX runtime for Laya typed decision models — 7–14 ms short decisions on M3 Max. No text generation, PyTorch, or cloud API.
- [kev](https://github.com/jaredpalmer/kev) - Tiny Jev-like family of decision models built on top of Qwen3.5 you can train and run on your own.
- [jevtok](https://github.com/LabGuy94/jevtok) - Exact token counting and request-cost prediction for TypeSafe's Jev (tiktoken-style).
- [decider](https://github.com/Mapika/decider) - One-pass typed decisions with calibrated probabilities (System One style model), fine-tuned from Qwen3.5-2B.
- [jevify](https://github.com/fidecastro/jevify) - Supersimple way to serve LLMs as a Jev-like endpoint.
- [von](https://github.com/wfzyx/von) - The open-source System One decision model. Sub-15ms, non-autoregressive, local drop-in alternative to TypeSafe Jev.
- [jevassert](https://github.com/dtduc-git/jevassert) - Record/replay regression tests for Jev (TypeSafe System One) question packs — accuracy, calibration and cost gates in CI.
- [SemIf](https://github.com/TheoLeeCJ/SemIf) - Semantic ifs from open models, on a 3090 at home. Independent; not affiliated with Jev or TypeSafe.
- [jev-benchmarks](https://github.com/AbdelStark/jev-benchmarks) - Probability-aware evaluation for typed decision models: calibration, selective risk, latency, and reproducible benchmarks.
- [openjev](https://github.com/TheoLeeCJ/openjev) - Semantic ifs from open models, on a 3090 at home. Independent; not affiliated with Jev or TypeSafe.
- [jev-packs](https://github.com/dtduc-git/jev-packs) - Evidence-gated registry of Jev question packs — curated questions, golden cases and measured evidence for Jev-compatible decision endpoints.
- [WindTunnel](https://github.com/nekuda-ai/WindTunnel) - A WebMCP benchmark, measures WebMCP against other browser-agent interfaces.
- [openJev-verdict-2.0](https://github.com/Heman10x-NGU/openJev-verdict-2.0) - Calibrated 151M Non-Autoregressive Decision Engine beating TypeSafe Jev & Laya on LocalLLaMA/typed-decisions (77.10% acc, 0.0636 Brier, 0.0144 ECE).

## Learning

Tutorials, example galleries, and playgrounds.

- [jev-lab](https://github.com/xergioalex/jev-lab) - A hands-on lab for Jev, TypeSafe's System One model — AI decision trees, guardrails and routing with typed answers instead of text.
- [jev-builder](https://github.com/collapseindex/jev-builder) - A browser form for building requests to TypeSafe's Jev: pick a template, fill in the blanks, copy the request. No JSON, no install, runs locally.
- [jev](https://github.com/inematds/jev) - Análise crítica e plano de aplicação do Jev em decisões estruturadas.
- [jev-starter](https://github.com/hamakyo/jev-starter) - Typed, policy-driven decision workflows on top of TypeSafe AI Jev: confidence routing, fallbacks, evaluation, and RAG patterns for TypeScript apps.
- [jev-broadcast-lab](https://github.com/4anti/jev-broadcast-lab) - Testing Lab for Jev AI.
- [jev](https://github.com/javsanesq/jev) - A terminal workbench for learning, testing, and connecting TypeSafe Jev decisions.
- [jev-demo](https://github.com/sawzhang/jev-demo) - Jev (TypeSafe System One) 学习与实测：概念文档 + 5 个可运行 demo + 可复现压测。实测 jev-1.13.0：扇出几乎免费，40 问与 1 问等延迟。.
- [jevlab](https://github.com/javsanesq/jevlab) - A terminal workbench for learning, testing, and connecting TypeSafe Jev decisions.
- [jev-preview](https://github.com/ArkadyBuryakov/jev-preview) - TUI Sandbox for Typesafe Jev API.
- [Jev](https://github.com/cobusgreyling/Jev) - Unofficial TypeSafe Jev showcase — System One decisions, not chat.
- [typesafe-ai-jev-example](https://github.com/ItBayMax/typesafe-ai-jev-example) - Hands-on demos for TypeSafe's Jev (System One) model: six runnable examples and four field notes. Runs offline with no API key; samples/ holds real measured output from jev-1.13.0.
- [jev-cookbook](https://github.com/chr-kelly/jev-cookbook) - Runnable question sets for TypeSafe's Jev, an eval harness with measured CLINC150 results, and a linter for the request shapes the API silently mis-reads.
- [typesafe-jev-dojo](https://github.com/lafollett-labs/typesafe-jev-dojo) - A live, graphical dojo for TypeSafe's Jev (System One) typed decision model — routing, a Tetris-playing agent, parallel swarms, and an honest Jev-vs-Claude gauntlet.
- [jev](https://github.com/richy-builds/jev) - Demos of TypeSafe's Jev model: typed judgments at scale (grid, race, sweep, London meetup planner).

## Other Lists

Community-maintained lists and directories.

- [awesome-jev-by-typesafe](https://github.com/Anil-matcha/awesome-jev-by-typesafe) - Evidence-backed use cases, patterns, prompts, and starter code for TypeSafe Jev — a System One model for fast, typed, confidence-aware decisions in software.
- [what-is-jev](https://github.com/g0runmezadam/what-is-jev) - Independent, source-linked research on TypeSafe AI's Jev (System One), with 947 rubric-scored public repositories, recurring patterns, datasets, and bilingual documentation.
- [jev-skill](https://github.com/wuyoscar/jev-skill) - An awesome collection of Jev use cases, workflows, and agent skills.
- [jev-lab](https://github.com/llt22/jev-lab) - Hands-on research lab for TypeSafe's Jev (System One model): reproducible benchmarks of Noul/Choice/Score primitives, confidence gating, fan-out latency, agent control — plus a living audit of the Jev ecosystem.
- [jev-radar](https://github.com/everyinfra/jev-radar) - 📡 全网最全 · The world's most comprehensive tracker of the Jev (TypeSafe AI System One) ecosystem — 220+ documented cases · 108 confidence-graded entries · verified & rescanned every 3 hours · API access guide included.
- [awesome-jev-use-cases](https://github.com/SeeAPI/awesome-jev-use-cases) - Explore real-world use cases and projects built with TypeSafe AI's Jev: content moderation, AI agents, model routing, and semantic search. Curated by SeeAPI.
- [awesome-jev-usecases](https://github.com/aliaihub/awesome-jev-usecases) - Evidence-backed use cases, patterns, and guidance for building with Jev, TypeSafe AI's System One model. Every claim is labeled and sourced.
- [what-is-jev](https://github.com/tunahansahin897/what-is-jev) - A sourced, critical research file on TypeSafe's Jev (System One) model, plus a rubric-scored map of 780 public repositories. English / Türkçe.
- [awesome-jev](https://github.com/cobanov/awesome-jev) - A curated, source-backed list of projects built with Jev, TypeSafe AI's System One model for typed decisions.
- [awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects) - Awesome Jev: source-backed open-source ecosystem radar, plain-language project discovery, and automatic GitHub sync.
- [jev-skill](https://github.com/kcd-dev/jev-skill) - Jev-skill.
- [awesome-jev-typesafe](https://github.com/valentynkit/awesome-jev-typesafe) - Typed decisions with TypeSafe's Jev, the first System One model.
- [awesome-jev-zh](https://github.com/yzfly/awesome-jev-zh) - Jev / TypeSafe System One 中文精选列表：官方资料、SDK、爆款应用、Agent 工具、开源复现与独立评测，附中文上手指南，每日自动收录 GitHub 热门项目。.
- [awesome-jev](https://github.com/fatwang2/awesome-jev) - A source-backed Jev project directory with a reusable Jev-only GitHub review workflow.

## Other

Genuine Jev projects that fit no category above.

- [dotfiles](https://github.com/manifoldfrs/dotfiles) - Config files.
- [jev-quilt](https://github.com/SuperInstance/jev-quilt) - JEV for quilt as understood output: cellular-first decision substrate — typed cells, hook-and-drop deltas, bookkeeper WAL, last-mile projection decoupled.
- [syllago-docs](https://github.com/OpenScribbler/syllago-docs) - Documentation site for Syllago—the package manager for AI coding tool content.

## How This List Is Made

Discover: GitHub repository search, code search for SDK usage, and links from other community lists. Enrich: README excerpt, file listing, manifest dependencies, and activity metadata. Judge: one Jev call per repository with 11 typed questions, gates as Noul, category and pattern as Choice, substance, docs, and novelty as Score. Curate: code applies thresholds and weights to the stored judgments, so changing policy never re-runs inference. Publish: this README and the site are generated from `data/curated.json` every day.

Question set `v2`, model `jev-1.13.0`. The calibration against human labels is on the [how it works](https://awesome-jev.xyz/how-it-works) page.

## Contributing

Missing project? [Submit it](https://github.com/rhc98/awesome-jev/issues/new?template=submit.yml) with the repository URL. A bot checks the link, the next daily run judges it, and the verdict is posted back on the issue. This README carries the top 15 by composite in each category; everything else that passes the gate is on the site. Think Jev got one wrong? [Say so](https://github.com/rhc98/awesome-jev/issues/new?template=jev-got-it-wrong.yml) and a bot drafts the `data/overrides.yaml` change for a maintainer to review. Do not edit this README directly; it is regenerated.
