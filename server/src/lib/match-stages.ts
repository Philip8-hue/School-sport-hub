export const matchStages = {
  Football: ["Half-time", "Second half", "Extra time"],
  Basketball: ["End of Q1", "Half-time (end of Q2)", "End of Q3", "End of Q4", "Overtime"],
  Volleyball: ["End of set 1", "End of set 2", "End of set 3", "End of set 4", "End of set 5"]
} as const;

export function scoreSport(competition: string) {
  return (Object.keys(matchStages) as (keyof typeof matchStages)[]).find(sport => competition.toLowerCase().includes(sport.toLowerCase()));
}

export function scoreStageLabel(competition: string, status: string, stage?: string | null) {
  if (status === "COMPLETED") return scoreSport(competition) === "Football" ? "Full-time" : "Final";
  return stage || "Live";
}
