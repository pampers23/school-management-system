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
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import type { Subject } from "@/types"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { CreateSubjectSchema, createSubjectSchema } from "@/zod-schema"
import { createSubject } from "@/actions/private"
import { useMutation } from "@tanstack/react-query"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useState } from "react"

type AddSubjectProps = {
  onSubjectAdded?: (newSubject: Subject) => void;
}

export function AddSubject({ onSubjectAdded }: AddSubjectProps) {  
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: createSubject,
    onSuccess: (data) => {          
      onSubjectAdded?.(data as Subject);            
      toast.success("Subject created successfully!")
      form.reset()
      setOpen(false)
    },
    onError: (error: Error) => { 
      toast.error(error.message)
    }
  })

  const form = useForm<CreateSubjectSchema>({
      resolver: zodResolver(createSubjectSchema),
      defaultValues: {
        subject_code: "",
        subject_name: "",
        units: 0,
        description: "",
      }
    });

  function onSubmit(values: CreateSubjectSchema) {
      mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button
        className="sm:self-start cursor-pointer"
        onClick={() => document.getElementById("subject-code")?.focus()}
      >
        <Plus className="h-4 w-4" />
            Add Subject
      </Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
            <DialogDescription>
              Enter the details for the new subject.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
            <FieldGroup>
              <div className="flex flex-col gap-2">
              <Controller 
                name="subject_code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Subject Code</FieldLabel>
                    <Input 
                      {...field}
                      id="subject-code"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. MATH101"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}                 
              />
            </div>
            <div className="flex flex-col gap-2">
               <Controller 
                name="subject_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Subject Name</FieldLabel>
                    <Input 
                      {...field}
                      id="subject-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Calculus I"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}                 
              />
            </div>
              <div className="flex flex-col gap-2">
                <Controller 
                  name="units"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Units</FieldLabel>
                      <Input 
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        id="units"
                        aria-invalid={fieldState.invalid}
                        type="number"
                        min={1}
                        placeholder="e.g. 3"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}                 
                />
              </div>
            <div className="flex flex-col gap-2">
              <Controller 
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description</FieldLabel>
                    <Input 
                      {...field}
                      id="description"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Introduction to Calculus"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}                 
              />
            </div>
            </FieldGroup>
            <DialogFooter>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button type="submit" disabled={isPending} className="w-full gap-2 cursor-pointer">
                  {isPending ? "Creating..." : "Create Subject"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}
