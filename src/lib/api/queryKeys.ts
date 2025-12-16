export const queryKeys = {
  dashboard: {
    kpis: ["dashboard", "kpis"] as const,
    alerts: ["dashboard", "alerts"] as const,
    history: ["dashboard", "history"] as const,
    trends: ["dashboard", "trends"] as const,
    health: ["dashboard", "health"] as const,
  },
  process: {
    schemes: ["process", "schemes"] as const,
    knowledge: ["process", "knowledge"] as const,
  },
  simulations: ["simulation", "tasks"] as const,
  tests: ["pilot", "schedule"] as const,
  production: {
    overview: ["production", "overview"] as const,
    alerts: ["production", "alerts"] as const,
  },
  models: ["models", "catalog"] as const,
  collaboration: ["collaboration", "lanes"] as const,
};
