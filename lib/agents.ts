export type Agent = {
  id: string;
  name: string;
  description: string;
  price: string;
};

export const AGENTS: Agent[] = [
  {
    id: "trading",
    name: "Trading",
    description: "Crypto trading agent for structured market analysis and actions.",
    price: "$29/run",
  },
  {
    id: "content",
    name: "Content",
    description: "Viral content generator for short-form, platform-ready posts.",
    price: "$19/run",
  },
  {
    id: "resume",
    name: "Resume",
    description: "Resume writer that turns raw info into ATS-friendly bullets.",
    price: "$25/run",
  },
  {
    id: "copilot",
    name: "Copilot",
    description: "Personal AI copilot for goals, plans, and practical guidance.",
    price: "$15/run",
  },
  {
    id: "news",
    name: "News",
    description: "Finds trending topics and turns them into a clean daily brief.",
    price: "$9/run",
  },
];

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

