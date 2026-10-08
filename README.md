# Awesome Jev [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Site](https://img.shields.io/badge/site-awesome--jev.xyz-111827)](https://awesome-jev.xyz) [![Curated](https://img.shields.io/badge/curated-2026-10-08-2563eb)](https://awesome-jev.xyz/?sort=newest) [![Judged](https://img.shields.io/badge/judged-11477%20repos-16a34a)](https://awesome-jev.xyz/?status=all) ![Listed](https://img.shields.io/badge/listed-9030-16a34a)

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
- [WorkflowEvals](https://github.com/typesafe-ai/WorkflowEvals) - Evals.typesafe.ai workflow code published.
- [typesafe-sdk-js](https://github.com/typesafe-ai/typesafe-sdk-js) - The official TypeScript/JavaScript library for the TypeSafe API.
- [typesafe-sdk-python](https://github.com/typesafe-ai/typesafe-sdk-python) - The official Python library for the TypeSafe API.
- [skills](https://github.com/typesafe-ai/skills) - Agent skills for building with TypeSafe's System One API.

## SDKs and Clients

Language bindings, CLIs, and thin wrappers for the API.

- [jevi](https://github.com/bitomule/jevi) - Ask typed questions about a text and branch on the answer. A shell front end for TypeSafe's Jev.
- [daf-jev](https://github.com/docxology/daf-jev) - Composable Python toolkit for TypeSafe's Jev (System One) decision API — question builders, confidence gates, evaluator, calibration, CLI, MCP server, agent skill.
- [jevkit](https://github.com/ariel-frischer/jevkit) - Fast Rust CLI for TypeSafe Jev: typed decisions, offline linting before you pay.
- [jev-ultralightspeed](https://github.com/collapseindex/jev-ultralightspeed) - BRRRRRRRRRRRRRRRRRRRRRR.
- [solo_jev](https://github.com/0814wdwd/solo_jev) - Per-row semantic judgements over large relational tables on a decision model (Jev).
- [ruby_decision_model](https://github.com/obie/ruby_decision_model) - Ruby client for decision models such as Typesafe Jev.
- [ak-jev](https://github.com/ak--47/ak-jev) - Node.js bindings for TypeSafe's Jev — the System One model. Typed decisions, probabilities and confidence, with no text generation and no parsing.
- [kunobi-decision](https://github.com/kunobi-ninja/kunobi-decision) - Rust client for the TypeSafe System One API (Jev).
- [jev-spec](https://github.com/nozomi-koborinai/jev-spec) - ⚡ Catch spec drift on every commit: check your code against your Markdown specs with TypeSafe AI's Jev model.
- [jev-tree](https://github.com/reachjalil/jev-tree) - Recursive Jev choice over a taxonomy. Select from more than 255 options without breaking TypeSafe Jev's choice cap.
- [ts-jev-cost-calculator](https://github.com/StefanoITA/ts-jev-cost-calculator) - Unofficial CLI + Python estimator of tokens, cost and context limits for TypeSafe (System One / Jev) API requests. Not affiliated with TypeSafe.
- [typesafe-go](https://github.com/Nibir1/typesafe-go) - Zero-dependency Go SDK for TypeSafe's System One API (Jev). Typed questions in, calibrated probabilities out with static analyzers that catch bad question design at build time, a decision layer, batching and caching. Not affiliated with TypeSafe AI.
- [decision-gate](https://github.com/zachlandes/decision-gate) - Rate and spend limits for code that calls Jev and other decision models.
- [jod](https://github.com/mateonunez/jod) - Semantic schemas over TypeSafe's Jev — validate the state locally, then project typed answers.
- [jev-cli](https://github.com/tumf/jev-cli) - Small dependency-free CLI for TypeSafe Jev.

## Integrations

Jev wired into frameworks, gateways, platforms, and databases.

- [pg-jev](https://github.com/realZachi/pg-jev) - Ask your PostgreSQL tables questions in plain language. A PostgreSQL extension powered by TypeSafe's Jev.
- [Jevstiller](https://github.com/tomerglick57/Jevstiller) - Distill a repeated Jev classification task into a local model, on the fly — same answers, your hardware.
- [duckdb-jev](https://github.com/prasanthj/duckdb-jev) - High-throughput, robust native DuckDB extension for batched and streaming TypeSafe/Jev classification, scoring, and semantic predicates from SQL.
- [deepeval](https://github.com/confident-ai/deepeval) - The LLM Evaluation Framework.
- [jev4pg](https://github.com/Sheltercosmo/jev4pg) - Established strong JEV based natural language to SQL performance and well-covered semantic operators for PostgreSQL(PG) with optimized cost and latency. Reusable evidence, with native execution, parallel plans and explainable embeddings in development preview.
- [rag-jev](https://github.com/EmreKaplaner/rag-jev) - Make room for useful evidence. Inspectable context selection for RAG, with Jev reranking and open benchmark studies.
- [dsh-jev-tools](https://github.com/HorusJiang/dsh-jev-tools) - Jev judgment, not generation: prune long tool output, screen fetched pages for injected instructions, and gate completion claims inside DeepSeek Harness.
- [ruby_llm-typesafe](https://github.com/kieranklaassen/ruby_llm-typesafe) - TypeSafe structured-output provider for RubyLLM 2.
- [jev_nx](https://github.com/dannote/jev_nx) - Open decision models as a Jev backend, running in-process on Nx.
- [jev-browser](https://github.com/tontoko/jev-browser) - One grounded Jev/Playwright core: typed SDK, persistent CLI, and MCP server with native browser operations and deterministic assertions.
- [dsh-jev](https://github.com/buberlo/dsh-jev) - Jev-powered decision layer for DeepSeek Harness.
- [n8n-nodes-jev-classification](https://github.com/khmuhtadin/n8n-nodes-jev-classification) - N8n community node for Jev by TypeSafe AI: classify, score and check text with calibrated probabilities. Parallel requests and multi-item batching.
- [n8n-nodes-typesafe-jev](https://github.com/n3ndor/n8n-nodes-typesafe-jev) - N8n community node for TypeSafe Jev structured AI decisions.

## Agent and Developer Tooling

Routers, guards, reviewers, skills, and MCP servers for coding agents.

- [hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills) - Jev-powered model routing, memory, compaction, skill selection, computer and browser use for Hermes agents (also Claude Code and Codex).
- [pi-warden](https://github.com/DevMortimer/pi-warden) - Guardrails for Pi that steer instead of interrupt: enforces your project rules on every write, holds only hard-to-undo actions (3 per 1,000 calls, measured on real sessions), catches unverified "done" claims and stuck loops, and trims tool output. Built on pi-typesafe.
- [jev-browser](https://github.com/Ying-Kai-Liao/jev-browser) - Browser automation where an LLM plans and Jev (Typesafe System One) decides. Library, CLI and MCP server.
- [jev-judge-mcp](https://github.com/PyModel/jev-judge-mcp) - Typed judgment tools for MCP agents. TypeSafe's Jev model as verify, screen, find, classify, rerank, decide, compare, extract, review, gate, and score: the model judges, policy decides auto, review, or escalate.
- [Jevest](https://github.com/tincke10/Jevest) - Automated PR review pipeline using Jev (TypeSafe AI) as a millisecond decision layer over an LLM reviewer.
- [jevmem](https://github.com/Avinash-jetwani/jevmem) - Jevmem saves the decisions, rules and failed approaches from your Claude Code chats to JEVMEM.md in your repo, and brings the relevant ones back next session.
- [neurolink](https://github.com/juspay/neurolink) - The pipe layer of an AI nervous system — one interface connecting provider neurons to your application, across three inference types: generate, stream, and a calibrated decide (via TypeSafe Jev). MCP-native, voice (TTS/STT/realtime), RAG, memory, file processors. Powers Tara, Yama and Clairvoyance at Juspay.
- [jev-belay](https://github.com/valentynkit/jev-belay) - Claude Code Stop hook that blocks an unverified done: reads the transcript for evidence, asks Jev once, fails open on everything else.
- [JevRouter](https://github.com/BillionsBobby/JevRouter) - A lightweight Jev-powered router for models, tools, and subagents.
- [pi-jev-auto-mode](https://github.com/jomatsu/pi-jev-auto-mode) - Jev (TypeSafe System One) backed auto mode for the Pi coding agent: semantically auto-approves bash, write, and edit tool calls and fails closed when a decision cannot be made.
- [jev-mcp](https://github.com/jkudish/jev-mcp) - Fast, cheap, typed judgments from TypeSafe's Jev model, as MCP tools.
- [jevgrep](https://github.com/dzhng/jevgrep) - Find code by asking what it does. A CLI for coding agents that uses Jev to discover relevant files and source context.
- [jevwire](https://github.com/Brainwires/jevwire) - Jev decision layer for agents: MCP server, embeddable DecisionModel library, and an escalate-only Claude Code plugin (TypeSafe AI's Jev).

## Applications

Products and features whose behavior depends on Jev decisions.

- [doc2mark](https://github.com/luisleo526/doc2mark) - AI-powered Python library that converts any document (PDF, Word, Excel, PowerPoint, HTML) to clean Markdown while preserving complex tables and layouts using AI-Powered OCR technology.
- [JevGuide](https://github.com/Nisaka520/JevGuide) - 弦外之音 —— 微信聊天里的关系进展助手：读屏（无障碍树 / 截屏视觉）→ Jev 判读 + 攻略度 → 聊天模型出 3 条候选回复，攻略度常驻挂在屏幕上。不改微信、不发消息、不注入点击。.
- [TradingAgents](https://github.com/TauricResearch/TradingAgents) - Multi-Agents LLM Financial Trading Framework.
- [classifier-dev](https://github.com/mrmps/classifier-dev) - Zero-shot text classification over plain HTTP — no API key, no account. One Cloudflare Worker, a CLI, and an MCP server. https://classifier.dev.
- [Math-To-Manim](https://github.com/HarleyCoops/Math-To-Manim) - Create Epic Math and Physics Animations & Study Notes From Text and Images.
- [jev-seo](https://github.com/AgriciDaniel/jev-seo) - Live SEO audit for any website from one homepage URL, judged by Jev. PDF, XLSX and Markdown reports.
- [jev-search](https://github.com/superagents-lab/jev-search) - Search the web with TypeSafe's Jev: source selection, query understanding and relevance ranking. Built with Search1API.
- [JevBystander](https://github.com/Nisaka520/JevBystander) - 安卓无障碍版微信判读：只读屏、只弹 3 条 Toast（意图 / 情绪 / 着急 / 建议），不生成回复文案、不发送 · 零第三方依赖，APK 861 KB.
- [jev-semgrep](https://github.com/uehaj/jev-semgrep) - Grep by meaning, across languages. TypeSafe Jev scores every line against a meaning; combine meanings with AND/OR/NOT. 意味で探す grep。日本語で英語を、英語で日本語を検索できる.
- [yao](https://github.com/YaoApp/yao) - ✨ All your agents and workspaces in one place, on every device you own. Track tasks on a board, accessible from desktop, mobile, browser, or API. Self-hosted.
- [typesafe-computer-use](https://github.com/awlevin/typesafe-computer-use) - Computer use for about $0.0002 a step: OCR the screen, classify the next action with TypeSafe, click. macOS.
- [Bud-Decision-Studio](https://github.com/BudEcosystem/Bud-Decision-Studio) - Bud Decision studio is an easy to use cross platform desktop application & serving system for Jev like models locally.
- [rag-jev](https://github.com/Nixz0824/rag-jev) - 国服《英雄联盟》版本更新公告的本地 RAG 问答：数字只来自公告，Jev（TypeSafe System One）负责候选重排与回答自检.
- [sys1grep](https://github.com/uehaj/sys1grep) - Grep by meaning, across languages. TypeSafe Jev scores every line against a meaning; combine meanings with AND/OR/NOT. 意味で探す grep。日本語で英語を、英語で日本語を検索できる.
- [jev-rag](https://github.com/aifabrice/jev-rag) - Jev RAG (Jev-RAG / JevRAG): open-source local knowledge search with BM25 + Jev reranking, agentic and hybrid retrieval, cited answers, and reproducible benchmarks.

## Games, Robotics, and Simulation

Jev in a control loop.

- [heist-one](https://github.com/AbdelStark/heist-one) - Observable browser stealth game: Jev makes typed guard judgments while deterministic code owns the world.
- [jev-parallel-dispatch](https://github.com/Jason-Doyle/jev-parallel-dispatch) - Browser simulation for parallel Jev decisions with capacity-constrained assignment and retained evidence.
- [jev-card-agent](https://github.com/hewenyu/jev-card-agent) - Auto paly with jev.
- [jevcraft](https://github.com/mrubens/jevcraft) - Jev-powered Minecraft bot.
- [board-games](https://github.com/tripodxu/board-games) - Jev 棋馆：六种棋类对弈，TypeSafe 系统一模型 Jev 走子。零框架零构建纯静态，双击即玩。.
- [jev-dino](https://github.com/GiladR1979/jev-dino) - JEV action selection at 10 Hz meets original Chromium Dino physics. 13,724 points, 1080p60 recording, and auditable evidence.
- [jev-helper](https://github.com/ra2web/jev-helper) - A helper which use JEV to play ra2web(WannaFire Version)\[王二火大\].
- [embodied-jev](https://github.com/FBddcz/embodied-jev) - EmbodiedJev: MuJoCo robot decision workbench with MiniCPM5-2B, Jev and compatible model APIs.
- [jev-arena](https://github.com/Eliot5566/jev-arena) - Write a fighter in plain English. Jev pilots it in real time. PR-driven ladder, swappable brains.
- [jev-jstris](https://github.com/SongMarco/jev-jstris) - Jev chooses Tetris placements; a local controller plays Jstris through keyboard input.
- [minesweeper-jev](https://github.com/Hldwsd/minesweeper-jev) - Minesweeper where deterministic logic does the provable work and TypeSafe Jev is consulted only when the board forces a guess.
- [JEV-Arcade](https://github.com/Analytics206/JEV-Arcade) - Fifteen live AI games: TypeSafe Jev vs. Claude, GPT, OpenRouter and Ollama models.
- [jev-plays-pokemon-red](https://github.com/valentynkit/jev-plays-pokemon-red) - Pokemon Red on PyBoy: code owns the route and the arithmetic, Jev picks at branches in about 100 ms, calibration measured instead of assumed.

## Research, Evals, and Reimplementations

Benchmarks, calibration studies, and open replicas.

- [decider](https://github.com/Mapika/decider) - A family of System One-style models fine-tuned from Qwen3.5, designed for one-pass typed decisions with calibrated probabilities.
- [von](https://github.com/wfzyx/von) - The open-source System One decision model. Sub-15ms, non-autoregressive, local drop-in alternative to TypeSafe Jev.
- [kev](https://github.com/jaredpalmer/kev) - Jev-like family of decision models built on top of Qwen3.5/3.8 you can train and run on your own.
- [jevbench](https://github.com/fstandhartinger/jevbench) - A benchmark for Jev-class typed decision models: smart, cheap, fast, reliable, open.
- [laya-mlx](https://github.com/mizorewww/laya-mlx) - Native MLX runtime for Laya typed decision models — 7–14 ms short decisions on M3 Max. No text generation, PyTorch, or cloud API.
- [AnyJev](https://github.com/nokia-applied-research/AnyJev) - Turn any LLM into a Jev-style decision model: typed decisions, real probabilities, no training. (continue updating, welcome any issue and PR request).
- [judge-audit](https://github.com/kunko-ai-labs/judge-audit) - Independent calibration audits for AI judges. The Moody's for AI judgment.
- [RSI-Jev](https://github.com/Shanghua-Gao/RSI-Jev) - Typed-decision models (noul / choice / score) trained by a self-improving loop of AI agents — checkpoints, the code that produced them, and every version that failed.
- [reflexbench](https://github.com/brida-ai/reflexbench) - Open benchmark and evaluation harness for System One models and typed decision engines.
- [jev](https://github.com/feder-cr/jev) - Jevos is an open-source alternative to Jev for yes/no decisions that runs on your laptop.
- [privatemode-decisions-benchmark](https://github.com/edgelesssys/privatemode-decisions-benchmark) - Benchmarking Jev/Laya/GLM-5.3 Flash for System One-like tasks.
- [notjev](https://github.com/9pings/notjev) - Super fast Jev like server, model agnostic, working with any OpenAI compatible endpoint.
- [open-spark-jev](https://github.com/abhishek085/open-spark-jev) - Open-source, local decision models inspired by TypeSafe’s Jev and System One - built on Qwen3 for NVIDIA DGX Spark.
- [stuntd](https://github.com/bladedevoff/stuntd) - Local proxy that learns your app's typed LLM decisions and answers them with a Laya head. Jev and OpenAI compatible.

## Learning

Tutorials, example galleries, and playgrounds.

- [agentic-rl](https://github.com/cookiespiggy/agentic-rl) - Agentic RL 中文零基础教程（33 章）：从概念到 GRPO 实战，含 TRL 最小可跑示例；26–33 章附一套可运行的三方判别模型实证工程（encoder vs LLM-LoRA vs 规则基线）。第 25 章讲清 Jev / TypeSafe System One 与 RL 的能力边界 | Chinese Agentic RL tutorial (33 chapters) + a reproducible discriminative-model benchmark.
- [jev-lab](https://github.com/xergioalex/jev-lab) - A hands-on lab for Jev, TypeSafe's System One model — AI decision trees, guardrails and routing with typed answers instead of text.
- [Jev](https://github.com/cobusgreyling/Jev) - Unofficial TypeSafe Jev showcase — System One decisions, not chat.
- [jev](https://github.com/inematds/jev) - Análise crítica e plano de aplicação do Jev em decisões estruturadas.
- [jev-builder](https://github.com/collapseindex/jev-builder) - A browser form for building requests to TypeSafe's Jev: pick a template, fill in the blanks, copy the request. No JSON, no install, runs locally.
- [jev-starter](https://github.com/hamakyo/jev-starter) - Typed, policy-driven decision workflows on top of TypeSafe AI Jev: confidence routing, fallbacks, evaluation, and RAG patterns for TypeScript apps.
- [jev-poc](https://github.com/garygentry/jev-poc) - A hands-on tour of Jev, TypeSafe's decisions model: twenty demos across seven shapes, with a cost-and-agreement assessment against a chat-model baseline.
- [jev-broadcast-lab](https://github.com/4anti/jev-broadcast-lab) - Testing Lab for Jev AI.
- [jev-demo](https://github.com/sawzhang/jev-demo) - Jev (TypeSafe System One) 学习与实测：概念文档 + 5 个可运行 demo + 可复现压测。实测 jev-1.13.0：扇出几乎免费，40 问与 1 问等延迟。.
- [decide-dont-generate](https://github.com/Mukkandi-Sridhar/decide-dont-generate) - Code, labs and interactive tools for the book "Decide, Don't Generate": build the decision layer of AI agents with calibrated probabilities, cost-based thresholds and a free mock API. Runs in Python, no API key needed.
- [jev-decision-lab](https://github.com/jlov7/jev-decision-lab) - A local lab for seeing what TypeSafe's Jev judgment model does on realistic business cases: typed answers, probabilities, policy in code, receipts.
- [typesafe-ai-jev-example](https://github.com/ItBayMax/typesafe-ai-jev-example) - Hands-on demos for TypeSafe's Jev (System One) model: six runnable examples and four field notes. Runs offline with no API key; samples/ holds real measured output from jev-1.13.0.
- [langchain-jev-tutorial](https://github.com/PromptEngineer48/langchain-jev-tutorial) - LangChain + Jev (TypeSafe) tutorial: a support-ops agent whose small decisions (triage, model routing, tool guarding, evals) are made by Jev. Real run outputs included.

## Other Lists

Community-maintained lists and directories.

- [awesome-jev-survey](https://github.com/Eurekaleo/awesome-jev-survey) - Awesome Jev: an evidence survey of Jev and Jev-like typed decision models — calibration, selective control and open implementations, with a searchable literature site.
- [awesome-jev](https://github.com/kydlikebtc/awesome-jev) - 1207 public resources for Jev, TypeSafe AI's System One decision model, indexed by decision pattern. Source citations, dated link checks and scheduled call-site text checks; runtime and performance are not independently tested here. EN/中文, JSON schema and platform compatibility.
- [awesome-typesafe-jev](https://github.com/AbdelStark/awesome-typesafe-jev) - Awesome Jev: a source-backed field guide to TypeSafe's System One model, with SDKs, live demos, agent tools, and independent evaluations.
- [what-is-jev](https://github.com/g0runmezadam/what-is-jev) - Independent, source-linked research on TypeSafe AI's Jev (System One), with 947 rubric-scored public repositories, recurring patterns, datasets, and bilingual documentation.
- [awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects) - Awesome Jev: source-backed open-source ecosystem radar, plain-language project discovery, and automatic GitHub sync.
- [jev-lab](https://github.com/llt22/jev-lab) - Hands-on research lab for TypeSafe's Jev (System One model): reproducible benchmarks of Noul/Choice/Score primitives, confidence gating, fan-out latency, agent control — plus a living audit of the Jev ecosystem.
- [jev-skill](https://github.com/wuyoscar/jev-skill) - An awesome collection of Jev use cases, workflows, and agent skills.
- [jev-skills-market](https://github.com/kangshifu1/jev-skills-market) - Community Jev skill market and assistant for automation testing, finance research and voice workflows. Computer Use is an independent repository.
- [jev-in-the-wild](https://github.com/Jessie-QingYu/jev-in-the-wild) - Real-world Jev use cases, open-source projects, benchmarks and criticism — what people actually build with TypeSafe AI's Jev, and where it fails. Machine-readable, updated daily.
- [awesome-jev-verified](https://github.com/punk2898/awesome-jev-verified) - A curated list of open-source Jev projects where every entry links to the line of code that calls Jev, and every performance number comes from an independent 2,390-question benchmark.
- [awesome-jev](https://github.com/heyjunpenn/awesome-jev) - A verified, community-maintained catalog of 981 open-source projects built with Jev.
- [jev-radar](https://github.com/everyinfra/jev-radar) - 📡 全网最全 · The world's most comprehensive tracker of the Jev (TypeSafe AI System One) ecosystem — 220+ documented cases · 108 confidence-graded entries · verified & rescanned every 3 hours · API access guide included.
- [building-with-typesafe-jev](https://github.com/aaddrick/building-with-typesafe-jev) - Unofficial skill that teaches coding agents to build with TypeSafe AI's Jev: typed decisions, calibrated confidence, and prior art from 150+ community projects.
- [awesome-jev-usecases](https://github.com/aliaihub/awesome-jev-usecases) - Evidence-backed use cases, patterns, and guidance for building with Jev, TypeSafe AI's System One model. Every claim is labeled and sourced.
- [awesome-jev-use-cases](https://github.com/SeeAPI/awesome-jev-use-cases) - Explore real-world use cases and projects built with TypeSafe AI's Jev: content moderation, AI agents, model routing, and semantic search. Curated by SeeAPI.

## Other

Genuine Jev projects that fit no category above.

- [jev-rankkit](https://github.com/kashyaprparmar/jev-rankkit) - Universal, type-safe reranking for Python objects, search, RAG, and agents.
- [homeflare-kit](https://github.com/taslabs-net/homeflare-kit) - A collection of what I use to keep things consitent.
- [JEVe](https://github.com/4i7/JEVe) - JEV-powered decision architecture for EVE Online.
- [dotfiles](https://github.com/manifoldfrs/dotfiles) - Config files.
- [jev-quilt](https://github.com/SuperInstance/jev-quilt) - JEV for quilt as understood output: cellular-first decision substrate — typed cells, hook-and-drop deltas, bookkeeper WAL, last-mile projection decoupled.
- [syllago-docs](https://github.com/OpenScribbler/syllago-docs) - Documentation site for Syllago—the package manager for AI coding tool content.
- [Jev-Style-0.8B-Decision-v3-GGUF](https://github.com/lawrence3699/Jev-Style-0.8B-Decision-v3-GGUF) - GitHub mirror of the chaoliangUNSW/Jev-Style-0.8B-Decision-v3-GGUF Hugging Face model.

## How This List Is Made

Discover: GitHub repository search, code search for SDK usage, and links from other community lists. Enrich: README excerpt, file listing, manifest dependencies, and activity metadata. Judge: one Jev call per repository with 11 typed questions, gates as Noul, category and pattern as Choice, substance, docs, and novelty as Score. Curate: code applies thresholds and weights to the stored judgments, so changing policy never re-runs inference. Publish: this README and the site are generated from `data/curated.json` every day.

Question set `v2`, model `jev-1.13.0`. The calibration against human labels is on the [how it works](https://awesome-jev.xyz/how-it-works) page.

## Contributing

Missing project? [Submit it](https://github.com/rhc98/awesome-jev/issues/new?template=submit.yml) with the repository URL. A bot checks the link, the next daily run judges it, and the verdict is posted back on the issue. This README carries the top 15 by composite in each category; everything else that passes the gate is on the site. Think Jev got one wrong? [Say so](https://github.com/rhc98/awesome-jev/issues/new?template=jev-got-it-wrong.yml) and a bot drafts the `data/overrides.yaml` change for a maintainer to review. Do not edit this README directly; it is regenerated.
