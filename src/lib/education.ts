// ─── Utility ─────────────────────────────────────────────────────────────────

export function getLevelType(yearLevel: string): "basic" | "senior" | "college" {
  if ([
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  ].includes(yearLevel)) return "basic";
  if (["Grade 11", "Grade 12"].includes(yearLevel)) return "senior";
  return "college";
}
