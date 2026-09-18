# Awesome Jev [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Site](https://img.shields.io/badge/site-awesome--jev.xyz-111827)](https://awesome-jev.xyz) [![Curated](https://img.shields.io/badge/curated-2026-09-18-2563eb)](https://awesome-jev.xyz/?sort=newest) [![Judged](https://img.shields.io/badge/judged-1277%20repos-16a34a)](https://awesome-jev.xyz/?status=all) ![Listed](https://img.shields.io/badge/listed-887-16a34a)

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
- [How This List Is Made](#how-this-list-is-made)

## Official

Maintained by TypeSafe AI.

- [system-one-adapter-python](https://github.com/typesafe-ai/system-one-adapter-python) - Drop-in TypeSafeClient replacement backed by LLM APIs.
- [typesafe-sdk-js](https://github.com/typesafe-ai/typesafe-sdk-js) - The official TypeScript/JavaScript library for the TypeSafe API.
- [typesafe-sdk-python](https://github.com/typesafe-ai/typesafe-sdk-python) - The official Python library for the TypeSafe API.
- [skills](https://github.com/typesafe-ai/skills) - Agent skills for building with TypeSafe's System One API.

## SDKs and Clients

Language bindings, CLIs, and thin wrappers for the API.

- [jev-tree](https://github.com/reachjalil/jev-tree) - Recursive Jev choice over a taxonomy. Select from more than 255 options without breaking TypeSafe Jev's choice cap.
- [ts-jev-cost-calculator](https://github.com/StefanoITA/ts-jev-cost-calculator) - Unofficial CLI + Python estimator of tokens, cost and context limits for TypeSafe (System One / Jev) API requests. Not affiliated with TypeSafe.
- [jod](https://github.com/mateonunez/jod) - Semantic schemas over TypeSafe's Jev — validate the state locally, then project typed answers.
- [sytem-one-sdk](https://github.com/ziyu/sytem-one-sdk) - Unified interface wrapper for system one models.
- [jev](https://github.com/dannote/jev) - TypeSafe Jev for OTP: reply to Jev from a GenServer and pattern match on its answer.
- [qualm](https://github.com/qddegtya/qualm) - Typed decisions from a System One model. An uncertain answer is a different type from a confident one — and the compiler makes you handle it.
- [jev](https://github.com/okooo5km/jev) - Typed decisions from the shell: a stdlib-Python CLI and Agent Skill for TypeSafe Jev on OpenRouter. Yes/no, choice and ordinal scores with calibrated probabilities, semantic grep and batch mode.
- [jev-cli](https://github.com/jtsang4/jev-cli) - CLI for TypeSafe AI's Jev evaluation model — typed questions in, structured JSON answers out.
- [jev-cli](https://github.com/tumf/jev-cli) - Small dependency-free CLI for TypeSafe Jev.
- [kunobi-jev](https://github.com/kunobi-ninja/kunobi-jev) - Rust client for the TypeSafe System One API (Jev).
- [typesafe_ai](https://github.com/hfiguera/typesafe_ai) - An Elixir client for TypeSafe AI with typed responses and bounded concurrency.
- [typesafe-dotnet-sdk](https://github.com/saibimajdi/typesafe-dotnet-sdk) - Community .NET SDK for the TypeSafe AI System One API — typed noul, choice, and score questions with structured, confidence-scored answers. Not affiliated with TypeSafe AI.
- [semdecide](https://github.com/sharziki/semdecide) - Typed semantic decisions for Unix pipelines and CI, powered by TypeSafe AI Jev.
- [typesafe.zig](https://github.com/mattneel/typesafe.zig) - An idiomatic Zig client for the TypeSafe AI API.

## Integrations

Jev wired into frameworks, gateways, platforms, and databases.

- [pg-jev](https://github.com/realZachi/pg-jev) - Ask your Postgres tables questions in plain language. A PostgreSQL extension powered by TypeSafe's Jev.
- [ruby_llm-typesafe](https://github.com/kieranklaassen/ruby_llm-typesafe) - TypeSafe structured-output provider for RubyLLM 2.
- [laravel-typesafe-jev](https://github.com/Butochnikov/laravel-typesafe-jev) - Unofficial Laravel integration for TypeSafe Jev AI with typed responses, async requests, scoped dependency injection, and testing fakes.
- [HA-Jev](https://github.com/AboveColin/HA-Jev) - Home Assistant integration for TypeSafe Jev. Ask a question about your house and get a probability, a choice or a score as an entity.
- [EDcheck](https://github.com/edteamlat/EDcheck) - Semantic validation for Zod schemas, powered by TypeSafe Jev. Validate meaning, not just structure.
- [sql-jev](https://github.com/sashimikun/sql-jev) - Ask your SQLite tables questions in plain language: jev() predicates for Turso/libSQL, Cloudflare D1 and plain SQLite.
- [jevsql](https://github.com/EugeneBoondock/jevsql) - SQL with natural-language predicates, powered by TypeSafe's Jev. Filter, rank, classify and score rows by meaning — batched, cached and cost-guarded.
- [dsh-spire-jev](https://github.com/enderzcx/dsh-spire-jev) - Native DeepSeek Harness plugin for Spire Jev: structured game tools and verified turn plans.
- [duckdb-jev](https://github.com/recodelabs/duckdb-jev) - Natural-language WHERE clauses for DuckDB, powered by TypeSafe's Jev.
- [n8n-nodes-typesafe-ai](https://github.com/DomMonte/n8n-nodes-typesafe-ai) - N8n community node for the TypeSafe AI System One API — typed yes/no, choice and score questions with calibrated probabilities.
- [hono-jev-router](https://github.com/yusukebe/hono-jev-router) - Route HTTP requests by meaning. A semantic router for Hono powered by Jev.
- [tripwire](https://github.com/noelzappy/tripwire) - Judge every LLM response before the user sees it. AI SDK middleware and OpenAI-compatible proxy.

## Agent and Developer Tooling

Routers, guards, reviewers, skills, and MCP servers for coding agents.

- [pi-warden](https://github.com/DevMortimer/pi-warden) - Guardrails for Pi built on pi-typesafe that steer the agent instead of interrupting you: Jev judges irreversible and off-task tool calls, detects stuck loops, checks unverified done claims, flags slop.
- [pi-jev-auto-mode](https://github.com/jomatsu/pi-jev-auto-mode) - Jev (TypeSafe System One) backed auto mode for the Pi coding agent: semantically auto-approves bash, write, and edit tool calls and fails closed when a decision cannot be made.
- [jev-browser](https://github.com/Ying-Kai-Liao/jev-browser) - Browser automation where an LLM plans and Jev (Typesafe System One) decides. Library, CLI and MCP server.
- [jev-mcp](https://github.com/Brainwires/jev-mcp) - Jev decision layer for agents: MCP server, embeddable DecisionModel library, and an escalate-only Claude Code plugin (TypeSafe AI's Jev).
- [jevwire](https://github.com/Brainwires/jevwire) - Jev decision layer for agents: MCP server, embeddable DecisionModel library, and an escalate-only Claude Code plugin (TypeSafe AI's Jev).
- [jev-axi](https://github.com/shiftynick/jev-axi) - Agent-ergonomic CLI for TypeSafe's Jev: fast calibrated judgments (pick, rate, check, rank, triage, guard) from the shell.
- [hersona](https://github.com/shiro-0x/hersona) - 346 reusable character attributes for AI agent personas — compose, measure, and port system-prompt personas. Build once. Keep personality everywhere.
- [hermes-jev](https://github.com/keeltrace/hermes-jev) - Typed System One decisions, ranking, verification, and an opt-in Hermes tool gate using TypeSafe Jev.
- [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) - Claude Code plugin that replaces the compaction summary with Jev decisions: every tool call and result is scored in one fast request, stale ones are dropped or truncated, everything kept stays verbatim.
- [jcm-router](https://github.com/adarshmishra07/jcm-router) - Local proxy that picks the Claude model and effort per message using TypeSafe Jev. Routes subagents, leaves your cached main chat alone.
- [jev-browser-pilot](https://github.com/aidil2105/jev-browser-pilot) - A bounded decision layer for browser and desktop automation: a decision-only model picks one next step; the code owns perception, content, actuation and verification.
- [jev-mcp](https://github.com/blakestone-x/jev-mcp) - MCP server for TypeSafe Jev: typed classify, score, check, match and screen for any agent, with confidence on every answer.
- [vexjoy-agent](https://github.com/notque/vexjoy-agent) - VexJoy AI Agent with Intelligent Routing - /do routes plain-English requests to the right specialist agent and gates the work with reviews, tests, and a learning loop.
- [pi-codemcp](https://github.com/yolonir/pi-codemcp) - Typed, sandboxed Code Mode access to configured MCP servers for Pi.

## Applications

Products and features whose behavior depends on Jev decisions.

- [jev-ultrafast](https://github.com/browser-use/jev-ultrafast) - I. am. speed.
- [VisionClaw-Agent-Public-Release](https://github.com/Huskyauto/VisionClaw-Agent-Public-Release) - Open-source multi-tenant AI agent workspace · 18 personas · 137 active capabilities · 806 platform indexes · 80 curated AI models + 1000+ OpenRouter catalog · self-hosted, BYO-keys.
- [typesafe-computer-use](https://github.com/awlevin/typesafe-computer-use) - Computer use for about $0.0002 a step: OCR the screen, classify the next action with TypeSafe, click. macOS.
- [jev-search](https://github.com/superagents-lab/jev-search) - Search the web with TypeSafe's Jev: source selection, query understanding and relevance ranking. Built with Search1API.
- [jev-calculator](https://github.com/sstehniy/jev-calculator) - IOS 6-inspired Jev calculator demo with a lifetime API budget.
- [FeedGate](https://github.com/zsoXi/FeedGate) - Precision-first Chrome feed filter (v2.1.0) using TypeSafe Jev judgments: promotional posts are kept unless independently strong spam or ad evidence appears. Reversible cosmetic filtering, zero runtime dependencies.
- [just-another-job-application-tracker](https://github.com/godie/just-another-job-application-tracker) - Just Another Job Application Tracking App.
- [jev-shell-history](https://github.com/mrnugget/jev-shell-history) - Fish-style zsh history autosuggestions ranked by Jev (TypeSafe).
- [jev-voice-browser](https://github.com/moritzkremb/jev-voice-browser) - Control a real browser by voice. Jev (TypeSafe System One) decides intent + target in ~300 ms per spoken word; Playwright acts — often before you finish the sentence.
- [trading-bot-jev](https://github.com/Spykoninho/trading-bot-jev) - Crypto trading bot on Binance testnet using TypeSafe (Jev) to judge news.

## Games, Robotics, and Simulation

Jev in a control loop.

- [heist-one](https://github.com/AbdelStark/heist-one) - Observable browser stealth game: Jev makes typed guard judgments while deterministic code owns the world.
- [jev-jstris](https://github.com/SongMarco/jev-jstris) - Jev chooses Tetris placements; a local controller plays Jstris through keyboard input.
- [jev-lego](https://github.com/youngsemicolon/jev-lego) - A System One model builds Lego in 3D — code enumerates legal placements, Jev picks among them.
- [spire-jev](https://github.com/enderzcx/spire-jev) - Slay the Spire 2 agent controller: planner models, Jev fast decisions, and verified multi-card turn execution.
- [last-exit](https://github.com/0x963D/last-exit) - A cyberpunk border encounter powered by TypeSafe Jev. Bluff the guard. Inspect the receipts.
- [tsai-sc](https://github.com/phyous/tsai-sc) - TypeSafe Jev controls original StarCraft shareware through keyboard and mouse with recorded action probabilities.
- [typesafe-mario](https://github.com/fhshaik/typesafe-mario) - A TypeSafe/Jev agent that plays Super Mario Bros. from structured emulator state.
- [typesafe-chess](https://github.com/TholeG/typesafe-chess) - Chess where both players are TypeSafe's Jev model: every move is a typed Choice decision.
- [robots-world](https://github.com/DanMcInerney/robots-world) - A modular multi-robot control testbed with swappable physics, sensors, AI controllers, and impaired swarm communication.
- [pong-jev](https://github.com/safzanpirani/pong-jev) - TypeSafe's Jev plays Atari Pong. One typed Choice question per frame, no coordinates sent to the model.
- [JEV-EVAC](https://github.com/using76/JEV-EVAC) - 화재 피난 판단 에이전트 — Jev 형식 타입 판독 판단층 + 소셜포스 이동, FDS-GPU 위험장 위에서 개인별 역할·구조·경로 결정.
- [typesafe-minecraft-demo](https://github.com/ellistev/typesafe-minecraft-demo) - A Minecraft Java player controlled by TypeSafe AI, with live decisions, Canadian flag building, and a side-by-side dashboard.
- [jev-drone](https://github.com/RomanSlack/jev-drone) - Camera-only autonomous drone in MuJoCo with a small judgment model (TypeSafe Jev) in the loop at 2.5Hz.
- [jev2048](https://github.com/erhanmeydan/jev2048) - TypeSafe'in Jev karar modeli gerçek bir online 2048 sitesinde oynuyor — hamle başına tek API çağrısı, tek anahtar.
- [JevPlaysPokemon](https://github.com/anxkhn/JevPlaysPokemon) - Jev plays Generation 3 Pokémon via Showdown and a real FireRed ROM.

## Research, Evals, and Reimplementations

Benchmarks, calibration studies, and open replicas.

- [openjev](https://github.com/TheoLeeCJ/openjev) - Typed decisions from open models, on a 3090 at home.
- [jev-benchmarks](https://github.com/AbdelStark/jev-benchmarks) - Probability-aware evaluation for typed decision models: calibration, selective risk, latency, and reproducible benchmarks.
- [WindTunnel](https://github.com/nekuda-ai/WindTunnel) - A WebMCP benchmark, measures WebMCP against other browser-agent interfaces.
- [jev-dspy-lab](https://github.com/jmanhype/jev-dspy-lab) - Reproducible calibration and selective-risk benchmarks for Jev/TypeSafe decisions in DSPy workflows.
- [jev-on-a-laptop](https://github.com/rorshopping/jev-on-a-laptop) - Unofficial study: Jev-style parallel typed decisions on stock 1.5B-8B models on an Apple Silicon laptop. Benchmarks, research notes, and a Hugging Face Space demo.
- [jevcal](https://github.com/abhixhek/jevcal) - Stop guessing confidence thresholds: calibrate, threshold, and drift-check typed decision models (TypeSafe Jev) against an LLM teacher.
- [jev-exploration](https://github.com/SamuelSacco/jev-exploration) - Jev (TypeSafe) exploratory thread: claim audit, live demos, and runnable code.
- [jev-benchmark](https://github.com/wondertwins/jev-benchmark) - Benchmarks and a playground for TypeSafe's Jev (System One) model: chess, and who-is-the-player-talking-to for speech-to-text game NPCs.
- [jev-calibration-audit](https://github.com/jujumilk3/jev-calibration-audit) - Independent API-only calibration audit of TypeSafe AI's Jev decision model.
- [jev-behavior-study](https://github.com/RINNECODER/jev-behavior-study) - Independent Jev 1.13.0 behavior study: report, controlled prompt experiments, raw results, and offline verification.
- [jev-gomoku](https://github.com/XieChengYuan/jev-gomoku) - 弈瞬：双 Jev 五子棋九宫格输入实验台，逐手查看模型决策，支持真实对局回放与实时对战。.
- [beyondgreen](https://github.com/SashaSkind/beyondgreen) - Your tests passed. We check what they missed.
- [qwen-rlcd](https://github.com/shamazharikh/qwen-rlcd) - Jev-style calibrated decision model (Choice/Score/Noul) on Qwen3.5-0.8B.

## Learning

Tutorials, example galleries, and playgrounds.

- [jev-starter](https://github.com/hamakyo/jev-starter) - Typed, policy-driven decision workflows on top of TypeSafe AI Jev: confidence routing, fallbacks, evaluation, and RAG patterns for TypeScript apps.
- [jev-for-engineers](https://github.com/Foadsf/jev-for-engineers) - Eight minimal working examples of TypeSafe's Jev (a System One model) applied to mechanical and electrical engineering: CAD/CAE/CAM routing, FEM result triage, DFM screening, BOM alignment, hallucination-proof extraction. Zero dependencies.
- [jev-lab](https://github.com/BrendanH18/jev-lab) - Six small apps and a workbench that show what TypeSafe's Jev (System One) model can do.
- [neo4jev](https://github.com/jexp/neo4jev) - Typesafe.ai System One Model Jev navigating a Neo4j graph by using a classifier over neighbouring relationships.
- [jev](https://github.com/inematds/jev) - Análise crítica e plano de aplicação do Jev em decisões estruturadas.
- [typesafe-ai-playground](https://github.com/BunsDev/typesafe-ai-playground) - Community TypeSafe AI playground: 110 use cases, games, dilemmas and model challenges, with editable prompts, A/B comparisons and a mobile-friendly UI.
- [jev-playground](https://github.com/wustep/jev-playground) - Can a System One model steer music? Jev picks the plan (enums only); code renders sheet, audio and MIDI.
- [agent-workflow-lab](https://github.com/stillroom/agent-workflow-lab) - Typed state, explicit transitions, one narrow model judgment, and a human approval gate — a rebuildable agent workflow using and testing Jev.
- [jev-router-playground](https://github.com/hugo-alves/jev-router-playground) - Interactive playground for testing Jev model-routing decisions against OpenRouter models.
- [jev-use-cases](https://github.com/galigutta/jev-use-cases) - An inspired MECE map of TypeSafe Jev use cases from the first days on X.
- [typesafe-ai-playground](https://github.com/nickthompson480/typesafe-ai-playground) - Community TypeSafe AI playground: 110 use cases, games, dilemmas and model challenges, with editable prompts, A/B comparisons and a mobile-friendly UI.

## Other Lists

Community-maintained lists and directories.

- [awesome-jev-by-typesafe](https://github.com/Anil-matcha/awesome-jev-by-typesafe) - Evidence-backed use cases, patterns, prompts, and starter code for TypeSafe Jev — a System One model for fast, typed, confidence-aware decisions in software.
- [awesome-jev-usecases](https://github.com/aliaihub/awesome-jev-usecases) - Evidence-backed use cases, patterns, and guidance for building with Jev, TypeSafe AI's System One model. Every claim is labeled and sourced.
- [awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects) - Awesome Jev: source-backed open-source ecosystem radar, plain-language project discovery, and automatic GitHub sync.
- [awesome-typesafe-jev](https://github.com/thevibeworks/awesome-typesafe-jev) - Curated list of projects built on TypeSafe's Jev model, read before listed. With media and our own measurements. Not affiliated with TypeSafe AI.
- [awesome-jev-zh](https://github.com/yzfly/awesome-jev-zh) - Jev / TypeSafe System One 中文精选列表：官方资料、SDK、爆款应用、Agent 工具、开源复现与独立评测，附中文上手指南，每日自动收录 GitHub 热门项目。.
- [awesome-jev-usecases](https://github.com/anandi1989/awesome-jev-usecases) - Evidence-backed index of real-world Jev (TypeSafe AI System One) use cases, cookbook, how-to, repos, patterns, and measured results.
- [awesome-jev](https://github.com/hellogumbo/awesome-jev) - A community directory of projects built on Jev, TypeSafe AI's System One model.
- [awesome-jev](https://github.com/cobanov/awesome-jev) - A curated, source-backed list of projects built with Jev, TypeSafe AI's System One model for typed decisions.
- [awesome-jev-use-cases](https://github.com/SeeAPI/awesome-jev-use-cases) - Explore real-world use cases and projects built with TypeSafe AI's Jev: content moderation, AI agents, model routing, and semantic search. Curated by SeeAPI.
- [awesome-jev](https://github.com/fatwang2/awesome-jev) - A source-backed Jev project directory with a reusable Jev-only GitHub review workflow.
- [awesome-jev](https://github.com/rhc98/awesome-jev) - Projects built on Jev (TypeSafe AI's System One model), curated by Jev itself.
- [Jev_apps](https://github.com/JackZeng/Jev_apps) - 看看 Jev 能做什么：用中英文讲清热门应用、工作原理和各自优缺点。Explore Jev apps with plain-language examples, explanations, and comparisons.
- [awesome-jev](https://github.com/sontakey/awesome-jev) - Unofficial list of insanely useful TypeSafe AI Jev / System One projects.
- [awesome-jev](https://github.com/MrJev/awesome-jev) - A curated list of projects, integrations, and resources for Jev, TypeSafe AI's System One model.

## How This List Is Made

Discover: GitHub repository search, code search for SDK usage, and links from other community lists. Enrich: README excerpt, file listing, manifest dependencies, and activity metadata. Judge: one Jev call per repository with 11 typed questions, gates as Noul, category and pattern as Choice, substance, docs, and novelty as Score. Curate: code applies thresholds and weights to the stored judgments, so changing policy never re-runs inference. Publish: this README and the site are generated from `data/curated.json` every day.

Question set `v2`, model `jev-1.13.0`. The calibration against human labels is on the [how it works](https://awesome-jev.xyz/how-it-works) page.

## Contributing

Missing project? [Open an issue](https://github.com/rhc98/awesome-jev/issues/new?template=submit.yml) with the link; the pipeline picks it up on the next run. Think Jev got one wrong? Edit `data/overrides.yaml` with a reason and open a pull request. Do not edit this README directly; it is regenerated.
