import { useMemo, useState } from "react";
import { ArrowUpDown, Archive, DoorOpen, Eye, Layers, MoreHorizontal, Pencil, Search, Users, } from "lucide-react";
import { toast } from "sonner";
import { type ColumnFiltersState, ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAcademics, enrolledCount } from "@/data";
import type { Course, YearLevel, FormSection, Section } from "@/types";
import StatCard from "@/components/stat-card";
import { SectionForm } from "@/components/section-form";



type SectionRow = Section & { enrolled: number; available: number };


const Sections = () => {
  const st = useAcademics();
  
  const [editTarget, setEditTarget] = useState<SectionRow | null>(null);
  const [viewTarget, setViewTarget] = useState<SectionRow | null>(null);

  const active = useMemo(() => st.sections.filter((s: Section) => !s.archived), [st.sections]);
   const rows: SectionRow[] = useMemo(
    () =>
      active.map((s: Section) => {
        const enrolled = enrolledCount(st, s.id);
        return { ...s, enrolled, available: s.maxStudents - enrolled };
      }),
    [active, st],
  );
  
  const stats = useMemo(() => {
    const totalCap = active.reduce((n: number, s: Section) => n + s.maxStudents, 0);
    const totalEnrolled = rows.reduce((n: number, s: SectionRow) => n + s.enrolled, 0);
    return { total: active.length, totalCap, totalEnrolled };
  }, [active, rows]);

  const validate = (f: FormSection, ignoredId?: string) => {
    if (!f.name.trim() || !f.course || !f.year_level) return "All fields are required.";
    if (f.maxStudents <= 0) return "Max students must be greater than 0.";
    const dup = st.sections.some((s: Section) => 
        s.id !== ignoredId &&
        !s.archived &&
        s.course === f.course &&
        s.year_level === f.year_level &&
        s.name.toLowerCase() === f.name.trim().toLowerCase(),
    );
    if (dup) return "Section name must be unique within the same course and year.";
    return null;
  };

  // Create handler removed — creation dialog not present in this view.

  const handleEdit = () => {
    if (!editTarget) return;
    const f: FormSection = {
      name: editTarget.name,
      course: editTarget.course,
      year_level: editTarget.year_level,
      maxStudents: editTarget.maxStudents,
    };
    const err = validate(f, editTarget.id);
    if (err) return toast.error(err);
    st.updateSection(editTarget.id, {
      name: f.name,
      course: f.course as Course,
      year_level: f.year_level as YearLevel,
      maxStudents: f.maxStudents,
    });
    setEditTarget(null);
    toast.success("Section updated successfully.");
  }

  const columns = useMemo<ColumnDef<SectionRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button variant="ghost" className="ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Section
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{row.getValue("name")}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.course} - {row.original.year_level}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "course",
        header: "Course",
        cell: ({ row }) => <span className="text-sm">{row.getValue("course")}</span>,
      },
      {
        accessorKey: "year_level",
        header: "Year Level",
        cell: ({ row }) => <span className="text-sm">{row.getValue("year_level")}</span>,
      },
       {
        accessorKey: "maxStudents",
        header: ({ column }) => (
          <Button variant="ghost" className="ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Capacity
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => <span className="text-sm">{row.getValue("maxStudents")}</span>,
      },
      {
        accessorKey: "enrolled",
        header: "Enrolled",
        cell: ({ row }) => <span className="text-sm">{row.getValue("enrolled")}</span>,
      },
      {
        accessorKey: "available",
        header: "Available",
        cell: ({ row }) => (
          <Badge variant={row.original.available > 0 ? "secondary" : "destructive"}>
            {row.original.available} slot{row.original.available === 1 ? "" : "s"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onSelect={() => setViewTarget(s)}>
                    <Eye className="mr-2 h-4 w-4" /> View
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setEditTarget(s)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => st.archiveSection(s.id)}>
                    <Archive className="mr-2 h-4 w-4" /> Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        }
      }
    ],
    [st, setViewTarget, setEditTarget],
  )

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: rows,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, columnFilters, pagination },
  })

  const handleCreateSection = (formData?: FormSection) => {
    if (!formData) return;
    // Your create logic here
    st.addSection({
      name: formData.name.trim(),
      course: formData.course as Course,
      year_level: formData.year_level as YearLevel,
      maxStudents: formData.maxStudents,
    });
    toast.success("Section created successfully!");
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            title="Sections"
            description="Manage class sections per course and year level."
          />
          <SectionForm
            title="Create Section"
            onSubmit={handleCreateSection}
            submitLabel="Create"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Active Sections" value={stats.total} icon={Layers} />
          <StatCard label="Total Enrolled" value={stats.totalCap} icon={DoorOpen} />
          <StatCard label="Total Capacity" value={stats.totalEnrolled} icon={Users} />
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-foreground">Section List</h3>
              <p className="text-sm text-muted-foreground">
                Manage and track all active class sections.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search sections by name..."
                  className="pl-9"
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <Table>
                <TableHeader className="bg-muted/40">
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((header) => (
                        <TableHead key={header.id} className="px-4">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())
                          }
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="px-4 py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-sm text-muted-foreground"
                      >
                        No matching sections found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {table.getRowModel().rows.length} of {rows.length} section
                {rows.length === 1 ? "" : "s"}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  Previous
                </Button>
                <Button size="sm" variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        {editTarget && (
          <SectionForm
           title="Edit Section"
           form={{
            name: editTarget.name,
            course: editTarget.course,
            year_level: editTarget.year_level,
            maxStudents: editTarget.maxStudents,
           }}
           setForm={(f) => setEditTarget({ ...editTarget, ...f, course: f.course as Course, year_level: f.year_level as YearLevel })}
           onSubmit={() => handleEdit()}           // ← clean, no event
           open={!!editTarget}
           onOpenChange={(o) => !o && setEditTarget(null)}
           submitLabel="Save Changes"
          />
        )}
      </Dialog>

      {/* view dialog */}
      <Dialog open={!!viewTarget} onOpenChange={(o) => !o && setViewTarget(null)}>
        {viewTarget && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{viewTarget.name}</DialogTitle>
              <DialogDescription>Section Details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 text-sm">
              <Row k="Course" v={viewTarget.course} />
              <Row k="Year Level" v={viewTarget.year_level} />
              <Row k="Capacity" v={viewTarget.maxStudents} />
              <Row k="Enrolled" v={viewTarget.enrolled} />
              <Row k="Available" v={String(viewTarget.maxStudents - enrolledCount(st, viewTarget.id))} />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-foreground">{v}</span>
    </div>
  );
}


export default Sections