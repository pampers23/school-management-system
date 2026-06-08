import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { COURSES, YEAR_LEVELS } from "@/data"
import type { Course, YearLevel, FormSection } from "@/types"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createSection } from "@/actions/private";
import { toast } from "sonner";

interface SectionFormDialogProps {
  title: string;
  submitLabel: string;
  onSubmit: (form: FormSection) => void;
  form?: FormSection;
  setForm?: (f: FormSection) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SectionForm = ({ title, onSubmit, submitLabel, form: controlledForm, setForm: controlledSetForm, open: controlledOpen, onOpenChange: controlledOnOpenChange }: SectionFormDialogProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      toast.success("Section created successfully!")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  
  
  // const isControlled = controlledForm !== undefined;

  const [internalOpen, setInternalOpen] = useState(false);
  const [internalForm, setInternalForm] = useState<FormSection>({
    name: "", course: "", year_level: "", maxStudents: 40,
  });

  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  const form = controlledForm ?? internalForm;
  const setForm = controlledSetForm ?? setInternalForm;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Add validation
    if (!form.name.trim()) {
      toast.error("Section name is required");
      return;
    }
    if (!form.course) {
      toast.error("Please select a course");
      return;
    }
    if (!form.year_level) {
      toast.error("Please select a year level");
      return;
    }
    
    mutate(form, {
      onSuccess: () => {
        onSubmit?.(form);
      }
    });
  };




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer">
          <Button className="sm:self-start cursor-pointer">
            <Plus className="h-4 w-4" />
            {title}
          </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Fill in section details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Section Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: BSIT-1A"
              className="p-5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Course</Label>
            <Select
              value={form.course}
              onValueChange={(v) => setForm({ ...form, course: v as Course })}
            >
              <SelectTrigger className="w-full p-5">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="p-3">
                {COURSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Year Level</Label>
            <Select
              value={form.year_level}
              onValueChange={(v) => setForm({ ...form, year_level: v as YearLevel })}
            >
              <SelectTrigger className="w-full p-5">
                <SelectValue placeholder="Select year level" />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="p-3">
                {YEAR_LEVELS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Maximum Students</Label>
            <Input
              type="number"
              min={1}
              value={form.maxStudents}
              onChange={(e) => setForm({ ...form, maxStudents: Number(e.target.value) })}
              className="w-full p-5"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};