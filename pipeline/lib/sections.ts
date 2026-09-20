/**
 * Category sections and the public URLs that name this list.
 *
 * Lives here rather than in build-readme.ts because that module builds the README as a side
 * effect of being imported, and the issue-reply scripts need the same section titles to tell
 * a submitter which shelf their repo landed on.
 */

export const SITE = 'https://awesome-jev.xyz'
export const REPO = 'rhc98/awesome-jev'

export const SECTIONS: { id: string; title: string; blurb: string }[] = [
  { id: 'official', title: 'Official', blurb: 'Maintained by TypeSafe AI.' },
  {
    id: 'sdk_client',
    title: 'SDKs and Clients',
    blurb: 'Language bindings, CLIs, and thin wrappers for the API.',
  },
  {
    id: 'integration',
    title: 'Integrations',
    blurb: 'Jev wired into frameworks, gateways, platforms, and databases.',
  },
  {
    id: 'agent_tooling',
    title: 'Agent and Developer Tooling',
    blurb: 'Routers, guards, reviewers, skills, and MCP servers for coding agents.',
  },
  {
    id: 'application',
    title: 'Applications',
    blurb: 'Products and features whose behavior depends on Jev decisions.',
  },
  { id: 'game_sim', title: 'Games, Robotics, and Simulation', blurb: 'Jev in a control loop.' },
  {
    id: 'research_eval',
    title: 'Research, Evals, and Reimplementations',
    blurb: 'Benchmarks, calibration studies, and open replicas.',
  },
  { id: 'learning', title: 'Learning', blurb: 'Tutorials, example galleries, and playgrounds.' },
  { id: 'meta_list', title: 'Other Lists', blurb: 'Community-maintained lists and directories.' },
  { id: 'other', title: 'Other', blurb: 'Genuine Jev projects that fit no category above.' },
]

/** Display title for a category id, falling back to the id itself for anything unlisted. */
export const sectionTitle = (id: string) => SECTIONS.find(s => s.id === id)?.title ?? id
