# Awesome Jev [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Site](https://img.shields.io/badge/site-awesome--jev.xyz-111827)](https://awesome-jev.xyz) [![Curated](https://img.shields.io/badge/curated-2026-09-17-2563eb)](https://awesome-jev.xyz/?sort=newest) [![Judged](https://img.shields.io/badge/judged-579%20repos-16a34a)](https://awesome-jev.xyz/?status=all) ![Listed](https://img.shields.io/badge/listed-379-16a34a)

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

- [ts-jev-cost-calculator](https://github.com/StefanoITA/ts-jev-cost-calculator) - Unofficial CLI + Python estimator of tokens, cost and context limits for TypeSafe (System One / Jev) API requests. Not affiliated with TypeSafe.
- [jod](https://github.com/mateonunez/jod) - Semantic schemas over TypeSafe's Jev — validate the state locally, then project typed answers.
- [jev-cli](https://github.com/jtsang4/jev-cli) - CLI for TypeSafe AI's Jev evaluation model — typed questions in, structured JSON answers out.
- [typesafe-dotnet-sdk](https://github.com/saibimajdi/typesafe-dotnet-sdk) - Community .NET SDK for the TypeSafe AI System One API — typed noul, choice, and score questions with structured, confidence-scored answers. Not affiliated with TypeSafe AI.
- [typesafe_ai](https://github.com/hfiguera/typesafe_ai) - A supervised Mint client for the TypeSafe AI System One API.
- [semdecide](https://github.com/sharziki/semdecide) - Typed semantic decisions for Unix pipelines and CI, powered by TypeSafe AI Jev.
- [TypeSafeAI.Net](https://github.com/Hawxy/TypeSafeAI.Net) - .NET SDK for the TypeSafe AI platform.
- [typesafe_sdk](https://github.com/nshkrdotcom/typesafe_sdk) - An idiomatic, type-safe Elixir port of the official TypeScript AI SDK (ai / ai-sdk) providing unified LLM integrations, streaming text and structured outputs, tool calling, and agentic workflows. Jev is their current flagship model and is the first System One model.
- [typesafe_ai](https://github.com/typesend/typesafe_ai) - Unofficial Elixir SDK for the TypeSafe AI API.
- [typesafe-ai-rs](https://github.com/gilljon/typesafe-ai-rs) - Independent async and blocking Rust SDK for the TypeSafe AI System One API.
- [decido](https://github.com/yairshy/decido) - Probabilistic decisions for Python. Use Jev or bring your own provider; crawl with Playwright.
- [typesafe-ai](https://github.com/Twister915/typesafe-ai) - Typed TypeSafe AI clients for Rust, with async and blocking backends and observable retries.
- [typesafe-client](https://github.com/JedimEmO/typesafe-client) - Unofficial typed async Rust client for the TypeSafe System One API.
- [kunobi-jev](https://github.com/kunobi-ninja/kunobi-jev) - Rust client for the TypeSafe System One API (Jev).

## Integrations

Jev wired into frameworks, gateways, platforms, and databases.

- [ruby_llm-typesafe](https://github.com/kieranklaassen/ruby_llm-typesafe) - TypeSafe structured-output provider for RubyLLM 2.
- [laravel-typesafe-jev](https://github.com/Butochnikov/laravel-typesafe-jev) - Unofficial Laravel integration for TypeSafe Jev AI with typed responses, async requests, scoped dependency injection, and testing fakes.
- [HA-Jev](https://github.com/AboveColin/HA-Jev) - Home Assistant integration for TypeSafe Jev. Ask a question about your house and get a probability, a choice or a score as an entity.
- [n8n-nodes-typesafe-ai](https://github.com/DomMonte/n8n-nodes-typesafe-ai) - N8n community node for the TypeSafe AI System One API — typed yes/no, choice and score questions with calibrated probabilities.
- [eve](https://github.com/vercel/eve) - The Open Framework for Building Agents.
- [dspy-typesafeify](https://github.com/typesafeainate/dspy-typesafeify) - Add a decorator for dspy Signatures that automatically uses TypeSafe where relevant.
- [Jev4Mellea](https://github.com/SoundBlaster/Jev4Mellea) - Jev adapter to Mellea.
- [pg_typesafe](https://github.com/giuliosmall/pg_typesafe) - Pre-alpha PostgreSQL extension for TypeSafe AI (Jev) categorical classification.
- [a0-typesafe-ai](https://github.com/3clyp50/a0-typesafe-ai) - TypeSafe AI Jev judgments for Agent Zero, with typed tools and probability cards.
- [typesafe-on-neon](https://github.com/andrelandgraf/typesafe-on-neon) - Neon Function proxy for the Neon AI Gateway with TypeSafe Jev routing.
- [typesafe-assist](https://github.com/JanOstrowka/typesafe-assist) - Home Assistant Assist conversation agent powered by TypeSafe's Jev (System One) model.

## Agent and Developer Tooling

Routers, guards, reviewers, skills, and MCP servers for coding agents.

- [pi-jev-auto-mode](https://github.com/jomatsu/pi-jev-auto-mode) - Jev (TypeSafe System One) backed auto mode for the Pi coding agent: semantically auto-approves bash, write, and edit tool calls and fails closed when a decision cannot be made.
- [hersona](https://github.com/shiro-0x/hersona) - 346 reusable character attributes for AI agent personas — compose, measure, and port system-prompt personas. Build once. Keep personality everywhere.
- [jev-browser](https://github.com/Ying-Kai-Liao/jev-browser) - Browser automation where an LLM plans and Jev (Typesafe System One) decides. Library, CLI and MCP server.
- [jev-axi](https://github.com/shiftynick/jev-axi) - Agent-ergonomic CLI for TypeSafe's Jev: fast calibrated judgments (pick, rate, check, rank, triage, guard) from the shell.
- [jcm-router](https://github.com/adarshmishra07/jcm-router) - Local proxy that picks the Claude model and effort per message using TypeSafe Jev. Routes subagents, leaves your cached main chat alone.
- [vexjoy-agent](https://github.com/notque/vexjoy-agent) - VexJoy AI Agent with Intelligent Routing - /do routes plain-English requests to the right specialist agent and gates the work with reviews, tests, and a learning loop.
- [jev-mcp](https://github.com/rashedInt32/jev-mcp) - MCP server exposing TypeSafe Jev as typed, calibrated judgment tools: classify, score, check, batched ask. Ships as a Claude Code plugin.
- [jev-mcp](https://github.com/blakestone-x/jev-mcp) - MCP server for TypeSafe Jev: typed classify, score, check, match and screen for any agent, with confidence on every answer.
- [pi-warden](https://github.com/DevMortimer/pi-warden) - Guardrails for Pi built on pi-typesafe that steer the agent instead of interrupting you: Jev judges irreversible and off-task tool calls, detects stuck loops, checks unverified done claims, flags slop.
- [goaly](https://github.com/krimvp/goaly) - Deterministic goal cli for your harness.
- [pi-typesafe](https://github.com/DevMortimer/pi-typesafe) - TypeSafe decisions for Pi: batched evaluation tool, terminal playground, and typed API for extension authors.

## Applications

Products and features whose behavior depends on Jev decisions.

- [VisionClaw-Agent-Public-Release](https://github.com/Huskyauto/VisionClaw-Agent-Public-Release) - Open-source multi-tenant AI agent workspace · 18 personas · 137 active capabilities · 806 platform indexes · 80 curated AI models + 1000+ OpenRouter catalog · self-hosted, BYO-keys.
- [typesafe-computer-use](https://github.com/awlevin/typesafe-computer-use) - Computer use for about $0.0002 a step: OCR the screen, classify the next action with TypeSafe, click. macOS.
- [just-another-job-application-tracker](https://github.com/godie/just-another-job-application-tracker) - Just Another Job Application Tracking App.
- [turbo](https://github.com/sightmap/turbo) - Jev-powered semantic browser use.
- [s1s](https://github.com/cpaczek/s1s) - System One Search: navigate and trace code with TypeSafe judgments and repository evidence.
- [jev-trader](https://github.com/jarrodwatts/jev-trader) - One AI trade decision every Monad block. Jev on Kuru MON-USDC.
- [extremely-specific-council](https://github.com/cbetz/extremely-specific-council) - Twelve members. Zero qualifications. A playful TypeSafe AI council with animated votes, inspectable decisions, and shareable verdicts.
- [every](https://github.com/sufianetaouil/every) - Ask a yes/no question of every function in a codebase. Ranked answers in seconds, for cents. Grep whose pattern is a question, powered by TypeSafe Jev.
- [otto](https://github.com/NobleSpartan6/otto) - Open-source native computer use for macOS and Windows: TypeSafe Jev, local OCR, and selective planning.
- [human-compiler](https://github.com/asfarsadewa/human-compiler) - A compiler for human language. Paste text, get diagnostics. Measured by TypeSafe Jev.
- [S_RAG](https://github.com/shrimaanshreyash/S_RAG) - Evidence-aware local RAG and HandoffProof: controlled causal testing for operational handovers, with optional TypeSafe/Jev evidence governance.

## Games, Robotics, and Simulation

Jev in a control loop.

- [heist-one](https://github.com/AbdelStark/heist-one) - Observable browser stealth game: Jev makes typed guard judgments while deterministic code owns the world.
- [last-exit](https://github.com/0x963D/last-exit) - A cyberpunk border encounter powered by TypeSafe Jev. Bluff the guard. Inspect the receipts.
- [typesafe-mario](https://github.com/fhshaik/typesafe-mario) - A TypeSafe/Jev agent that plays Super Mario Bros. from structured emulator state.
- [typesafe-chess](https://github.com/TholeG/typesafe-chess) - Chess where both players are TypeSafe's Jev model: every move is a typed Choice decision.
- [pong-jev](https://github.com/safzanpirani/pong-jev) - TypeSafe's Jev plays Atari Pong. One typed Choice question per frame, no coordinates sent to the model.
- [typesafe-minecraft-demo](https://github.com/ellistev/typesafe-minecraft-demo) - A Minecraft Java player controlled by TypeSafe AI, with live decisions, Canadian flag building, and a side-by-side dashboard.
- [jev-drone](https://github.com/RomanSlack/jev-drone) - Camera-only autonomous drone in MuJoCo with a small judgment model (TypeSafe Jev) in the loop at 2.5Hz.
- [tsai-sc](https://github.com/phyous/tsai-sc) - TypeSafe Jev controls original StarCraft shareware through keyboard and mouse with recorded action probabilities.
- [things-vs-stuff](https://github.com/cpaczek/things-vs-stuff) - Daily doodle tower defense where you type every tower and the TypeSafe judge decides what beats what.
- [Agent-JEV-Tetris](https://github.com/Yasserbhb/Agent-JEV-Tetris) - Using the new model JEV to play the game tetris.
- [jev-broadcast-lab](https://github.com/4anti/jev-broadcast-lab) - Operator lab for TypeSafe Jev. Chess Arena, closed-schema booths, Stockfish HUD for review only.
- [jev-doom-agent](https://github.com/lukaske/jev-doom-agent) - A browser-native Doom agent experiment with structured spatial state, composable AI controls, live decision telemetry, and a Chocolate Doom WebAssembly runtime.
- [jev-play-ping-pong](https://github.com/Icohen007/jev-play-ping-pong) - Jev plays browser table tennis in real time: structured telemetry, typed decisions, ordinary Chrome inputs, and auditable evidence.
- [terrarium](https://github.com/TheGali/terrarium) - A sandbox where a TypeSafe System One model presses the controls of a small creature. Code runs the world.

## Research, Evals, and Reimplementations

Benchmarks, calibration studies, and open replicas.

- [jev-benchmarks](https://github.com/AbdelStark/jev-benchmarks) - Probability-aware evaluation for typed decision models: calibration, selective risk, latency, and reproducible benchmarks.
- [openjev](https://github.com/TheoLeeCJ/openjev) - Can we run something like Jev on a 3090 at home?
- [jev-on-a-laptop](https://github.com/rorshopping/jev-on-a-laptop) - Unofficial study: Jev-style parallel typed decisions on stock 1.5B-8B models on an Apple Silicon laptop. Benchmarks, research notes, and a Hugging Face Space demo.
- [jev-benchmark](https://github.com/wondertwins/jev-benchmark) - Benchmarks and a playground for TypeSafe's Jev (System One) model: chess, and who-is-the-player-talking-to for speech-to-text game NPCs.
- [jev-behavior-study](https://github.com/RINNECODER/jev-behavior-study) - Independent Jev 1.13.0 behavior study: report, controlled prompt experiments, raw results, and offline verification.
- [jev-dspy-lab](https://github.com/jmanhype/jev-dspy-lab) - Reproducible calibration and selective-risk benchmarks for Jev/TypeSafe decisions in DSPy workflows.
- [beyondgreen](https://github.com/SashaSkind/beyondgreen) - Your tests passed. We check what they missed.
- [jevfire](https://github.com/kikoncuo/jevfire) - JEV-inspired parallel decisions for CUDA LLMs. One context, many decisions. vLLM API, game-agent examples, and reproducible benchmarks.
- [qwen-rlcd](https://github.com/shamazharikh/qwen-rlcd) - Jev-style calibrated decision model (Choice/Score/Noul) on Qwen3.5-0.8B.
- [jev-lm](https://github.com/y0usaf/jev-lm) - A word-level language model whose output layer is Jev: n-gram drafter, Noul chunk verification, bits-per-token eval.
- [jev-exploration](https://github.com/SamuelSacco/jev-exploration) - Jev (TypeSafe) exploratory thread: claim audit, live demos, and runnable code.
- [jev-sec-bench](https://github.com/Gaurav-Gosain/jev-sec-bench) - Blind security benchmarks for Jev, TypeSafe's System One model: prompt injection and vulnerable code detection, built on jev-go.
- [typesafe-ai-benchmark](https://github.com/iammrduncan/typesafe-ai-benchmark) - This is a LLM Gateway that mimics typesafe ai structured output. Like an imposter Jev.
- [decider](https://github.com/Mapika/decider) - One-pass typed decisions with calibrated probabilities (System One style model), fine-tuned from Qwen3.5-2B.

## Learning

Tutorials, example galleries, and playgrounds.

- [jev-for-engineers](https://github.com/Foadsf/jev-for-engineers) - Eight minimal working examples of TypeSafe's Jev (a System One model) applied to mechanical and electrical engineering: CAD/CAE/CAM routing, FEM result triage, DFM screening, BOM alignment, hallucination-proof extraction. Zero dependencies.
- [typesafe-ai-playground](https://github.com/BunsDev/typesafe-ai-playground) - Community TypeSafe AI playground: 110 use cases, games, dilemmas and model challenges, with editable prompts, A/B comparisons and a mobile-friendly UI.
- [typesafe-ai-playground](https://github.com/nickthompson480/typesafe-ai-playground) - Community TypeSafe AI playground: 110 use cases, games, dilemmas and model challenges, with editable prompts, A/B comparisons and a mobile-friendly UI.
- [typesafe-playground](https://github.com/kavehmz/typesafe-playground) - Interactive experiments with TypeSafe Jev, from support routing to 3D driving simulations with real AI decisions and visible sensor inputs.
- [jev-playground](https://github.com/wustep/jev-playground) - Can a System One model steer music? Jev picks the plan (enums only); code renders sheet, audio and MIDI.
- [pydantic-jev-examples](https://github.com/adtyavrdhn/pydantic-jev-examples) - Pydantic AI capabilities made stronger with Jev: small runnable demos, one file each.
- [jev-playground](https://github.com/Little-Planet-Labs/jev-playground) - A small Next.js app for experimenting with TypeSafe AI's Jev model (System One).
- [jev-experiments](https://github.com/amithkk/jev-experiments) - Experiments with Typesafe's Jev.
- [jevplay](https://github.com/ndolinschi/jevplay) - TypeSafe Jev playground — custom Choice/Score/Noul builder with live distributions.

## Other Lists

Community-maintained lists and directories.

- [awesome-jev](https://github.com/hellogumbo/awesome-jev) - A community directory of projects built on Jev, TypeSafe AI's System One model.
- [awesome-jev](https://github.com/rhc98/awesome-jev) - Projects built on Jev (TypeSafe AI's System One model), curated by Jev itself.
- [awesome-typesafe](https://github.com/AbdelStark/awesome-typesafe) - A curated list of official resources and community projects for TypeSafe, System One models, and Jev.
- [awesome-jev-prompt](https://github.com/yangzhou-chaofan/awesome-jev-prompt) - Latest top 100 showcases for jev (keep updating) from x / github / latest sources.
- [awesome-jev](https://github.com/AnotiaWang/awesome-jev) - A curated list of awesome Jev / TypeSafe System One applications, libraries, and resources.
- [awesome-jev](https://github.com/yibie/awesome-jev) - A curated list of public projects, integrations, and discussions built on Jev — TypeSafe AI's System One model for typed decisions.
- [awesome-jev](https://github.com/oxwen11/awesome-jev) - A curated list of what people built with Jev.
- [awesome-jev](https://github.com/cagbal/awesome-jev) - Curated list of jev related stuff.

## How This List Is Made

Discover: GitHub repository search, code search for SDK usage, and links from other community lists. Enrich: README excerpt, file listing, manifest dependencies, and activity metadata. Judge: one Jev call per repository with 11 typed questions, gates as Noul, category and pattern as Choice, substance, docs, and novelty as Score. Curate: code applies thresholds and weights to the stored judgments, so changing policy never re-runs inference. Publish: this README and the site are generated from `data/curated.json` every day.

Question set `v2`, model `jev-1.13.0`. The calibration against human labels is on the [how it works](https://awesome-jev.xyz/how-it-works) page.

## Contributing

Missing project? [Open an issue](https://github.com/rhc98/awesome-jev/issues/new?template=submit.yml) with the link; the pipeline picks it up on the next run. Think Jev got one wrong? Edit `data/overrides.yaml` with a reason and open a pull request. Do not edit this README directly; it is regenerated.
