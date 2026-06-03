import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { toast } from "sonner"
import { COURSES, SEMESTERS, STRAND, YEAR_LEVELS } from "@/data"
import { useMutation } from "@tanstack/react-query"
import { addCurriculum } from "@/actions/private"
import type { Course, Curriculum, FormState, Semester, Strand, YearLevel } from "@/types"

type AddCurriculumProp = {
  onCurriculumAdded?: () => void;
}

// const ELEMENTARY_JHS = ["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10"] as const;
const SHS = ["Grade 11", "Grade 12"] as const;
const COLLEGE = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;

const emptyForm: FormState = { course: "", year_level: "", semester: "", strand: "" };

const AddCurriculum = ({ onCurriculumAdded }: AddCurriculumProp) => {
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [createOpen, setCreateOpen] = useState(false);

  // Derived booleans based on selected year level
  const isSHS = (SHS as readonly string[]).includes(form.year_level);
  const isCollege = (COLLEGE as readonly string[]).includes(form.year_level);

  const handleYearLevelChange = (v: string | null) => {
    if (!v) return;
    setForm({ ...emptyForm, year_level: v as YearLevel });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addCurriculum,
    onSuccess: (data) => {
      const newCurriculum: Curriculum = {
        id: data.id,
        course: data.course as Course,
        year_level: data.year_level as YearLevel,
        semester: data.semester as Semester,
        strand: data.strand ?? undefined,
        subject_id: [],
      };
      setCurricula((prev) => [newCurriculum, ...prev]);
      onCurriculumAdded?.();
      setForm(emptyForm);
      setCreateOpen(false);
      toast.success("Curriculum created");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.year_level || !form.semester) {
      toast.error("Please complete all fields.");
      return;
    }
    if (isSHS && !form.strand) {
      toast.error("Please select a strand.");
      return;
    }
    if (isCollege && !form.course) {
      toast.error("Please select a course.");
      return;
    }

    const duplicate = curricula.some(
      (c) =>
        c.course === form.course &&
        c.year_level === form.year_level &&
        c.semester === form.semester,
    );
    if (duplicate) {
      toast.error("This curriculum already exists.");
      return;
    }

    const optimisticCurriculum: Curriculum = {
      id: crypto.randomUUID(),
      course: form.course as Course,
      year_level: form.year_level as YearLevel,
      semester: form.semester as Semester,
      strand: form.strand || undefined,
      subject_id: [],
    };
    setCurricula((prev) => [optimisticCurriculum, ...prev]);
    onCurriculumAdded?.();
    mutate({
      course: form.course,
      year_level: form.year_level,
      semester: form.semester,
      strand: form.strand
    });
  };

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      {/* ✅ Fixed trigger button */}
      <DialogTrigger className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer">
        <Plus className="h-4 w-4" />
        Create Curriculum
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Curriculum</DialogTitle>
          <DialogDescription>
            Add a new course / year / semester combination.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">

          {/* Year Level — always shown */}
          <div className="flex flex-col gap-2">
            <Label>Year Level</Label>
            <Select value={form.year_level} onValueChange={handleYearLevelChange}>
              <SelectTrigger className="w-full p-5"><SelectValue placeholder="Select year level" /></SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="p-3">
                {YEAR_LEVELS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Strand — Grade 11 & 12 only */}
          {isSHS && (
            <div className="flex flex-col gap-2">
              <Label>Strand</Label>
              <Select
                value={form.strand}
                onValueChange={(v) => setForm({ ...form, strand: v as Strand })}
              >
                <SelectTrigger className="w-full p-5"><SelectValue placeholder="Select strand" /></SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="p-3">
                  {STRAND.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Course — College only */}
          {isCollege && (
            <div className="flex flex-col gap-2">
              <Label>Course</Label>
              <Select
                value={form.course}
                onValueChange={(v) => setForm({ ...form, course: v as Course })}
              >
                <SelectTrigger className="w-full p-5"><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="p-3">
                  {COURSES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Semester — always shown */}
          <div className="flex flex-col gap-2">
            <Label>Semester</Label>
            <Select
              value={form.semester}
              onValueChange={(v) => setForm({ ...form, semester: v as Semester })}
            >
              <SelectTrigger className="w-full p-5"><SelectValue placeholder="Select semester" /></SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="p-3">
                {SEMESTERS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => setForm(emptyForm)}>
              Clear
            </Button>
            <Button type="submit" disabled={isPending}>
              <Plus className="h-4 w-4" />
              {isPending ? "Creating..." : "Create Curriculum"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCurriculum;