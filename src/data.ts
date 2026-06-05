export const COURSES = ["BSIT", "BSCS", "BSBA", "BSED"] as const;

export const YEAR_LEVELS = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
  "1st Year", "2nd Year", "3rd Year", "4th Year",
] as const;

export const SEMESTERS = ["1st Semester", "2nd Semester"] as const;

export const STRAND = ["TVL/ICT", "HUMSS", "ABM", "STEM"] as const ;

export function useAcademics() {
  return {
    sections: [],
    addSection: (_: unknown) => { void _; },
    updateSection: (_id: string, _data: unknown) => { void _id; void _data; },
    archiveSection: (_id: string) => { void _id; },
  } as const;
}

export function enrolledCount(_st: unknown, _sectionId: string) {
  void _st;
  void _sectionId;
  return 0;
}