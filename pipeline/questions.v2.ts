/**
 * Question set v2 (v1 + official removed from category; official is an owner flag in code) — one systemOne call per repo (speculative fan-out).
 * Changing anything here = new QSET version; re-judge everything and diff in the calibration report.
 */
import { choice, noul, score } from '@typesafe-ai/sdk'

export const QSET = 'v2'

export const CATEGORIES = {
  sdk_client:
    'Client library, language binding, CLI, or thin wrapper whose main purpose is calling the TypeSafe API from a language or shell',
  integration:
    'Adapter that plugs Jev into an existing framework, gateway, platform, or database (LangGraph, n8n, Rails, Laravel, Postgres, Home Assistant, Vercel AI SDK...)',
  agent_tooling:
    'Tooling for coding agents or agent workflows: model routers, guards, permission gates, code reviewers, agent skills, MCP servers',
  application:
    'An end-user application or product feature whose behavior depends on Jev decisions (triage, moderation, trading, search, assistants)',
  game_sim:
    'A game, robot, simulation, or interactive demo where Jev drives actions in a loop (Mario, Doom, drones, driving, arena games)',
  research_eval:
    'Benchmark, evaluation, calibration study, comparison against LLMs, or an open reimplementation / reverse-engineering of Jev',
  learning:
    'Tutorials, cookbook collections, example galleries, playgrounds, or notes meant to teach how to use Jev',
  other: 'None of the above fits',
} as const

export const PATTERNS = {
  routing: 'Selecting a handler, team, model, tool, or branch from a fixed set of options',
  ranking: 'Reranking, retrieval scoring, prioritization, or choosing the best of many candidates',
  extraction:
    'Selecting values, fields, or structure from text (pre-parsed candidates chosen by the model)',
  verification:
    'Guardrails, citation or claim checks, policy or safety gates, yes/no validation before acting',
  control_loop:
    'Repeated bounded actions on changing state: games, robots, autopilots, browser agents stepping through pages',
  feature_scoring:
    'Turning judgments into reusable numeric scores or features: composite scoring, quality grading, dataset labeling',
  infra:
    'No single decision pattern; the project provides access, plumbing, or a client for others to build on',
  unclear: 'Cannot tell from the available information',
} as const

export const questions = {
  // ---- gates ----
  genuine: noul(
    "Is this repository substantively about TypeSafe's Jev / System One model — it calls the API at runtime, wraps or integrates it, evaluates or benchmarks it, or reimplements it — rather than merely mentioning it in passing, being a generic 'type-safe' programming library, or matching the keyword by coincidence? Use `readme_excerpt`, `description`, `topics`, `manifest_mentions_typesafe`, and `code_evidence`.",
  ),
  runtime_use: noul(
    "Is Jev invoked at runtime as part of the project's core behavior (the thing the project does depends on Jev's answers), rather than only appearing in an example, test, or optional plugin?",
  ),
  is_meta_list: noul(
    'Is this repository itself a curated list, directory, awesome-list, or index of Jev / TypeSafe projects, rather than a project that uses Jev?',
  ),
  is_reimpl: noul(
    "Is this repository an open reimplementation, reverse-engineering, training replica, or 'run something like Jev locally' effort, rather than a consumer of the official API?",
  ),

  // ---- classification (flat, two axes) ----
  category: choice(
    "Which category best describes the repository's primary nature? Judge by what the project IS, not which technologies it mentions.",
    CATEGORIES,
  ),
  pattern: choice('Which System One usage pattern dominates how this project uses Jev?', PATTERNS),

  // ---- quality dimensions (composite scoring inputs) ----
  substance: score(
    'How substantial is the project beyond a toy, judging from `readme_excerpt`, `files_top`, `has_tests`, `has_ci`, and `readme_headings`?',
    [
      'Empty, a template, a fork with no changes, or a single hello-world call to the API',
      'Small demo or experiment with one working flow and little structure',
      'A real tool or application with several flows, some structure, and tests or examples',
      'Production-grade: tests, CI, documentation, releases or versioning, and signs of active use',
    ],
  ),
  docs: score(
    'How usable is the documentation for a newcomer who wants to run or adopt this project?',
    [
      'No README, or one line with no instructions',
      'Install and run instructions only',
      'Explains what it does, why, and how, with at least one example',
      'Excellent: architecture, the design of the questions and state sent to Jev, limitations, and results',
    ],
  ),
  novelty: score(
    "How novel is the use of Jev compared with TypeSafe's official cookbooks and SDK examples (routing tickets, reranking passages, extraction, guardrails, game control demos)?",
    [
      'A copy or light edit of an official cookbook, SDK example, or another well-known demo',
      'An official pattern applied to a new domain or dataset',
      'A new decomposition or combination of Choice / Noul / Score questions, or a new integration surface',
      'Reveals a capability, failure mode, or measurement not documented elsewhere',
    ],
  ),
}

export type QuestionId = keyof typeof questions
