import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Archive,
  DoorOpen,
  Eye,
  Layers,
  Pencil,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  type ColumnFiltersState,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tailspin } from "ldrs/react";
import type { Course, YearLevel, FormSection, Section } from "@/types";
import StatCard from "@/components/stat-card";
import { SectionForm } from "@/components/section-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSection, updateSection, archiveSection } from "@/actions/private";
import { RefetchOptions } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COURSES, YEAR_LEVELS } from "@/data";
import { Label } from "@/components/ui/label";

const YEAR_LEVEL_LABEL: Record<number, string> = {
  1: "1st Year",
  2: "2nd Year",
  3: "3rd Year",
  4: "4th Year",
};

type SectionRow = Section & { enrolled: number; available: number };

// ─── Root ────────────────────────────────────────────────────────────────────

const Sections = () => {
  const { data, isPending, refetch, isRefetching } = useQuery({
    queryKey: ["sections"],
    queryFn: getSection,
    select: (data) => (Array.isArray(data) ? data : []),
    staleTime: 0,
  });

  if (isPending) {
    return (
      <div className="h-96 w-full flex flex-col gap-4 items-center justify-center">
        <Tailspin size="30" stroke="3" speed="0.9" color="#262E40" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Fetching sections...
        </p>
      </div>
    );
  }

  if (!data?.length) {
    return <NoSectionsPanel refetch={refetch} />;
  }

  return (
    <SectionsTable
      sections={data}
      refetch={refetch}
      isRefetching={isRefetching}
    />
  );
};

// ─── NoSectionsPanel ─────────────────────────────────────────────────────────

function NoSectionsPanel({
  refetch,
}: {
  refetch: (o?: RefetchOptions) => Promise<unknown>;
}) {
  return (
    <div className="rounded-xl border-2 border-dashed border-border w-full h-96 flex flex-col items-center justify-center gap-3 text-center px-4">
      <Layers className="h-10 w-10 text-muted-foreground" />
      <h2 className="text-lg font-semibold">No sections yet</h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Create your first section to start managing classes.
      </p>
      <SectionForm
        title="Create Section"
        onSubmit={() => refetch()}
        submitLabel="Create"
      />
    </div>
  );
}

// ─── SectionsTable ────────────────────────────────────────────────────────────

type SectionsTableProps = {
  sections: Section[];
  refetch: (o?: RefetchOptions) => Promise<unknown>;
  isRefetching: boolean;
};

function SectionsTable({
  sections,
  refetch,
  isRefetching,
}: SectionsTableProps) {
  const [editTarget, setEditTarget] = useState<SectionRow | null>(null);
  const [viewTarget, setViewTarget] = useState<SectionRow | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { mutate: archive } = useMutation({
    mutationFn: (id: string) => archiveSection(id),
    onSuccess: () => {
      console.log("archived success"); // ✅ add
      refetch();
      toast.success("Section archived.");
    },
    onError: (error) => {
      console.log("archived error", error); // ✅ add
      toast.error("Failed to archive section.");
    },
  });

  const { mutate: editMutate } = useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormSection }) =>
      updateSection(id, form),
    onSuccess: () => {
      refetch();
      toast.success("Section updated.");
      setEditTarget(null);
    },
    onError: () => toast.error("Failed to update section."),
  });

  const rows: SectionRow[] = useMemo(
    () =>
      sections.map((s) => ({ ...s, enrolled: 0, available: s.max_students })),
    [sections],
  );

  const stats = useMemo(
    () => ({
      total: sections.length,
      totalCap: sections.reduce((n, s) => n + s.max_students, 0),
      totalEnrolled: 0,
    }),
    [sections],
  );

  const handleEdit = () => {
    if (!editTarget) return;
    const f: FormSection = {
      name: editTarget.name,
      course: editTarget.course,
      year_level: editTarget.year_level,
      max_students: editTarget.max_students,
    };
    if (!f.name.trim() || !f.course || !f.year_level) {
      toast.error("All fields are required.");
      return;
    }
    editMutate({ id: editTarget.id, form: f });
  };

  const columns = useMemo<ColumnDef<SectionRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="ml-3 h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Section <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex flex-col ml-5">
            <span className="font-medium text-foreground">
              {row.getValue("name")}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.course} —{" "}
              {YEAR_LEVEL_LABEL[row.original.year_level as unknown as number] ??
                row.original.year_level}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "course",
        header: "Course",
        cell: ({ row }) => (
          <div className="flex flex-col ml-2">
            <span className="text-sm">{row.getValue("course")}</span>
          </div>
        ),
      },
      {
        accessorKey: "year_level",
        header: "Year Level",
        cell: ({ row }) => (
          <div className="flex flex-col ml-2">
            <span className="text-sm">
              {YEAR_LEVEL_LABEL[row.getValue("year_level") as number] ??
                row.getValue("year_level")}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "max_students",
        header: ({ column }) => (
          <div className="text-center">
            <Button
              variant="ghost"
              className="h-8 px-2"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Capacity <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm">{row.getValue("max_students")}</span>
          </div>
        ),
      },
      {
        accessorKey: "enrolled",
        header: () => <div className="text-center">Enrolled</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm">{row.getValue("enrolled")}</span>
          </div>
        ),
      },
      {
        accessorKey: "available",
        header: () => <div className="text-center">Available</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Badge
              variant={row.original.available > 0 ? "secondary" : "destructive"}
            >
              {row.original.available} slot
              {row.original.available === 1 ? "" : "s"}
            </Badge>
          </div>
        ),
      },
      // Temporarily replace your actions cell with this
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  console.log("view clicked", s);
                  setViewTarget(s);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditTarget(s)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => {
                  console.log("archive clicked", s.id);
                  archive(s.id);
                }}
              >
                <Archive className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [archive, setViewTarget, setEditTarget],
  );

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
  });

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
            onSubmit={() => refetch()}
            submitLabel="Create"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Active Sections" value={stats.total} icon={Layers} />
          <StatCard
            label="Total Enrolled"
            value={stats.totalEnrolled}
            icon={DoorOpen}
          />
          <StatCard
            label="Total Capacity"
            value={stats.totalCap}
            icon={Users}
          />
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-foreground">
                Section List
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage and track all active class sections.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search sections by name..."
                  className="pl-9"
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(e) =>
                    table.getColumn("name")?.setFilterValue(e.target.value)
                  }
                />
              </div>
              {/* ✅ Refresh button — same as StudentsList */}
              <Button
                size="icon"
                variant="outline"
                disabled={isRefetching}
                onClick={() => refetch()}
              >
                <ArrowUpDown
                  className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            <div className="mt-4 rounded-xl border border-border">
              <Table>
                <TableHeader className="bg-muted/40">
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((header) => (
                        <TableHead key={header.id} className="px-4">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
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
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
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

            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {table.getRowModel().rows.length} of {rows.length}{" "}
                section{rows.length === 1 ? "" : "s"}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
      >
        {editTarget && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Section</DialogTitle>
              <DialogDescription>
                Update the section details below.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Section Name</Label>
                <Input
                  value={editTarget.name}
                  onChange={(e) =>
                    setEditTarget({ ...editTarget, name: e.target.value })
                  }
                  placeholder="Ex: BSIT-1A"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Course</Label>
                <Select
                  value={editTarget.course}
                  onValueChange={(v) =>
                    setEditTarget({ ...editTarget, course: v as Course })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
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
                  value={String(editTarget.year_level)}
                  onValueChange={(v) =>
                    setEditTarget({ ...editTarget, year_level: v as YearLevel })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year level" />
                  </SelectTrigger>
                  <SelectContent>
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
                  value={editTarget.max_students}
                  onChange={(e) =>
                    setEditTarget({
                      ...editTarget,
                      max_students: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setEditTarget(null)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={!!viewTarget}
        onOpenChange={(o) => !o && setViewTarget(null)}
      >
        {viewTarget && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{viewTarget.name}</DialogTitle>
              <DialogDescription>Section Details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 text-sm">
              <Row k="Course" v={viewTarget.course} />
              <Row
                k="Year Level"
                v={
                  YEAR_LEVEL_LABEL[
                    viewTarget.year_level as unknown as number
                  ] ?? viewTarget.year_level
                }
              />
              <Row k="Capacity" v={viewTarget.max_students} />
              <Row k="Enrolled" v={viewTarget.enrolled} />
              <Row k="Available" v={viewTarget.available} />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-foreground">{v}</span>
    </div>
  );
}

export default Sections;
