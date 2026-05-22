import { createTeacherSchema, CreateTeacherSchema } from "@/zod-schema"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { createTeacher } from "@/actions/private"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldError, FieldGroup } from "@/components/ui/field"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const Teachers = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {                        
      toast.success("Teacher created successfully!")
      form.reset()
    },
    onError: (error: Error) => { 
      toast.error(error.message)
    }
  })

  const form = useForm<CreateTeacherSchema>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      department: "",
      specialization: "",
    }
  });

  function onSubmit(values: CreateTeacherSchema) {
    mutate(values)
  }
  
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Create Teacher Account</CardTitle>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>
            <Controller
              name="firstname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>First Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter first name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="lastname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter last name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter email address"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="department"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Department</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter a department"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="specialization"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Specialization</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter specialization"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full gap-2 cursor-pointer">
            {isPending ? "Creating..." : "Create Teacher"}
          </Button>
        </CardFooter>
      </form>

    </Card>
  )
}

export default Teachers