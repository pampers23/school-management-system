import { PageHeader } from "@/components/admin/page-header"

const AdminDashboard = () => {

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your school's activity at a glance."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: "1,234" },
          { label: "Total Teachers", value: "56" },
          { label: "Total Subjects", value: "12" },
          { label: "Active Enrollments", value: "8" }
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

export default AdminDashboard