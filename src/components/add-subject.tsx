import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormSub, Subject } from "@/types"
import { Plus } from "lucide-react"
import { useState } from "react";
import { toast } from "sonner"

const emptyForm: FormSub = {
  subject_code: "",
  subject_name: "",
  units: "",
  description: "",
}

type AddSubjectProps = {
  onSubjectAdded?: (newSubject: Subject) => void;
}

export function AddSubject({ onSubjectAdded }: AddSubjectProps) {  
  const [form, setForm] = useState<FormSub>(emptyForm);  

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject_code || !form.subject_name || !form.units) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const units = Number(form.units);
    if (Number.isNaN(units) || units <= 0) {
      toast.error("Units must be a positive number.");
      return;
    }
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      subject_code: form.subject_code.trim().toUpperCase(),
      subject_name: form.subject_name.trim(),
      units,
      description: form.description.trim(),
      status: "Active" as const,
    };
    onSubjectAdded?.(newSubject);
    setForm(emptyForm);
    toast.success("Subject created successfully.");
  };  

  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button
            className="sm:self-start"
            onClick={() => document.getElementById("subject-code")?.focus()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
            <DialogDescription>
              Enter the details for the new subject.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2">
               <Label htmlFor="subject-code">Subject Code</Label> 
               <Input 
                  id="subject-code" 
                  placeholder="e.g. MATH101"
                  value={form.subject_code}
                  onChange={(e) => setForm({ ...form, subject_code: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-2">
               <Label htmlFor="subject-name">Subject Name</Label> 
               <Input 
                  id="subject-name" 
                  placeholder="e.g. Calculus I"
                  value={form.subject_name}
                  onChange={(e) => setForm({ ...form, subject_name: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-2">
               <Label htmlFor="units">Units</Label> 
               <Input 
                  id="units" 
                  type="number"
                  min={1}
                  placeholder="e.g. 3"
                  value={form.units}
                  onChange={(e) => setForm({ ...form, units: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-2">
               <Label htmlFor="description">Description</Label> 
               <Input 
                  id="description" 
                  placeholder="e.g. Introduction to Calculus"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
            </div>
          </form>
          <DialogFooter>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setForm(emptyForm)}>
                Clear Form
              </Button>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button type="submit">Save changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
