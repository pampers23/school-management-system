import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ColumnDef, SortingState, flexRender, getCoreRowModel,
  getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown, BookMarked, Search, Trash2, Pencil, Layers3, ListChecks,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatCard from "@/components/stat-card";
import AddCurriculum from "@/components/add-curriculum";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurriculum, getCurriculumSubjects, getSubjects, removeCurriculum, syncCurriculumSubjects, updateCurriculumSubject } from "@/actions/private";
import { Tailspin } from "ldrs/react";
import { COURSES, YEAR_LEVELS, SEMESTERS, STRAND } from "@/data";
import type { Curriculum, FormCurriculum, Course, YearLevel, Semester, Subject, Strand } from "@/types";
import { getLevelType } from "@/lib/education";

const emptyForm: FormCurriculum = { course: "", year_level: "", semester: "", strand: "" };


// ─── NoCurriculumList ────────────────────────────────────────────────────────

function NoCurriculumList({ onCurriculumAdded }: { onCurriculumAdded: () => void }) {
  return (
    <div className="rounded-md border bg-muted overflow-hidden w-full h-96 flex flex-col items-center justify-center gap-3 my-7 md:my-14 text-center px-4">
      <h2 className="text-lg font-semibold">No curricula to show</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        You haven't added any curriculum records yet.
      </p>
      <AddCurriculum onCurriculumAdded={onCurriculumAdded} />
    </div>
  );
}

// ─── CurriculumList ───────────────────────────────────────────────────────────

function CurriculumList() {
  const queryClient = useQueryClient();

  const handleCurriculumAdded = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["curriculum"] });
  }, [queryClient]);

  const { data, isPending } = useQuery({
    queryKey: ["curriculum"],
    queryFn: getCurriculum,
  });

  if (isPending) {
    return (
      <div className="h-96 w-full flex flex-col gap-4 items-center justify-center my-7 md:my-14">
        <p className="text-sm text-muted-foreground animate-pulse">Fetching curricula...</p>
        <Tailspin size="30" stroke="3" speed="0.9" color="#262E40" />
      </div>
    );
  }

  if (!data?.curriculumList || data.curriculumList.length === 0) {
    return <NoCurriculumList onCurriculumAdded={handleCurriculumAdded} />;
  }

  return (
    <CurriculumListTable
      curriculumList={data.curriculumList}
      onCurriculumAdded={handleCurriculumAdded}
    />
  );
}

// ─── CurriculumListTable ─────────────────────────────────────────────────────

type CurriculumListTableProps = {
  curriculumList: Curriculum[];
  onCurriculumAdded: () => void;
};

function CurriculumListTable({ curriculumList, onCurriculumAdded }: CurriculumListTableProps) {
  const [curricula, setCurricula] = useState<Curriculum[]>(curriculumList);
  const [courseFilter, setCourseFilter] = useState<"all" | Course>("all");
  const [editTarget, setEditTarget] = useState<Curriculum | null>(null);
  const [editForm, setEditForm] = useState<FormCurriculum>(emptyForm);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: subjects = [], isPending: isSubjectsLoading } = useQuery<Subject[]>({
    queryKey: ["subject"],
    queryFn: getSubjects,
    select: (data) => Array.isArray(data) ? data : [],
  });

  const { mutate } = useMutation({
    mutationFn: (id: string) => removeCurriculum(id),
    onSuccess: (_, id) => {
      setCurricula((prev) => prev.filter((c) => c.id !== id));
      toast.success("Curriculum deleted");
    },
    onError: () => {
      toast.error("Failed to delete curriculum");
    }
  });

  const { mutate: editCurriculum } = useMutation({
    mutationFn: async (payload: { id: string; form: FormCurriculum; subject_ids: string[] }) => {
      await updateCurriculumSubject(payload.id, payload.form);
      await syncCurriculumSubjects(payload.id, payload.subject_ids);
    },
    onSuccess: () => {
      setCurricula((prev) =>
        prev.map((c) => {
          if (c.id !== editTarget?.id) return c;
          return {
            ...c,
            year_level: editForm.year_level as YearLevel,
            semester: editForm.semester as Semester,
            course: editForm.course === "" ? undefined : (editForm.course as Course),
            strand: editForm.strand === "" ? undefined : (editForm.strand as Strand),
            subject_id: selectedIds,
          };
        })
      );
      toast.success("Curriculum updated");
      setEditTarget(null);
    },
    onError: () => {
      toast.error("Failed to update curriculum.");
    },
  });
  
  const { data: curriculumSubjects } = useQuery({
    queryKey: ["curriculum_subjects", editTarget?.id],
    queryFn: () => getCurriculumSubjects(editTarget!.id),
    enabled: !!editTarget,
  });

 useEffect(() => {
  if (curriculumSubjects) {
    setSelectedIds(curriculumSubjects.map((cs) => cs.subjects.id));
  }
}, [curriculumSubjects]);

  const handleCurriculumAdd = useCallback(() => {
    onCurriculumAdded();
  }, [onCurriculumAdded]);

  const stats = useMemo(() => {
    const total = curricula.length;
    const courses = new Set(curricula.map((c) => c.course)).size;
    const assigned = curricula.reduce((n, c) => n + (c.subject_id?.length ?? 0), 0);
    return { total, courses, assigned };
  }, [curricula]);

  const filteredByCourse = useMemo(
    () => (courseFilter === "all" ? curricula : curricula.filter((c) => c.course === courseFilter)),
    [curricula, courseFilter],
  );

  const handleDelete = useCallback((id: string) => {
    mutate(id);
  }, [mutate]);

  const openEdit = useCallback((c: Curriculum) => {
    setEditTarget(c);
    setEditForm({ course: c.course ?? "", year_level: c.year_level, semester: c.semester, strand: c.strand ?? "" });
    setSelectedIds(c.subject_id ?? []);
  }, []);

  const toggleSubject = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleStrandChange = (val: string | null) => {
    setEditForm((prev) => ({ ...prev, strand: (val ?? "") as Strand, course: "" }));
  };

  const saveEdit = () => {
    if (!editTarget) return;

    const type = getLevelType(editForm.year_level);

    if (!editForm.year_level || !editForm.semester) {
      toast.error("Please complete all fields.");
      return;
    }
    if (type === "college" && !editForm.course) {
      toast.error("Please select a course.");
      return;
    }
    if (type === "senior" && !editForm.strand) {
      toast.error("Please select a strand.");
      return;
    }

    const duplicate = curricula.some(
      (c) =>
        c.id !== editTarget.id &&
        c.course === editForm.course &&
        c.year_level === editForm.year_level &&
        c.semester === editForm.semester,
    );
    if (duplicate) {
      toast.error("A curriculum with the same course/year/semester already exists.");
      return;
    }

    editCurriculum({ id: editTarget.id, form: editForm, subject_ids: selectedIds });
  };

  // Derived level type for the edit form
  const editLevelType = getLevelType(editForm.year_level);

  const columns = useMemo<ColumnDef<Curriculum>[]>(
    () => [
      {
        accessorKey: "year_level",
        header: ({ column }) => (
          <Button variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Year Level <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => <span className="text-sm text-foreground">{row.getValue("year_level")}</span>,
      },
      {
        accessorKey: "semester",
        header: "Semester",
        cell: ({ row }) => <span className="text-sm text-foreground">{row.getValue("semester")}</span>,
      },
     {
        id: "course_strand",
        header: () => <div>Course / Strand</div>,
        cell: ({ row }) => {
          const type = getLevelType(row.original.year_level);
          if (type === "college")
            return (
              <div className="ml-7">
                <span className="text-sm">
                  {row.original.course || "—"}
                </span>
              </div>
            );
          if (type === "senior")
            return (
              <div className="ml-7">
                <span className="text-xs">
                  {row.original.strand || "—"}
                </span>
              </div>
            );
          return <div className="ml-9 text-xs text-muted-foreground">N/A</div>;
        },
      },
      {
        id: "subjects",
        header: "Subjects",
        cell: ({ row }) => {
          const count = row.original.subject_id?.length ?? 0;
          return <Badge variant="secondary" className="text-xs">{count} subject{count === 1 ? "" : "s"}</Badge>;
        },
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <div className="text-right pr-4">Actions</div>,
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <Button size="icon" variant="ghost" onClick={() => openEdit(c)} aria-label="Edit curriculum">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDelete, openEdit],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<Curriculum>({
    data: filteredByCourse,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, value) => {
      const v = String(value ?? "").toLowerCase();
      if (!v) return true;
      const c = row.original;
      return `${c.course ?? ""} ${c.year_level} ${c.semester} ${c.strand ?? ""}`.toLowerCase().includes(v);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, globalFilter },
  });

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            title="Curriculum Management"
            description="Define which subjects belong to a course, year level, and semester."
          />
          <AddCurriculum onCurriculumAdded={handleCurriculumAdd} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Curricula" value={stats.total} icon={BookMarked} />
          <StatCard label="Courses Covered" value={stats.courses} icon={Layers3} />
          <StatCard label="Assigned Subjects" value={stats.assigned} icon={ListChecks} />
        </div>

        <Card className="rounded-2xl">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base">Curricula</CardTitle>
              <CardDescription>
                {table.getFilteredRowModel().rows.length} of {curricula.length} curricula shown.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search curricula" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="pl-9" />
              </div>
              <Select value={courseFilter} onValueChange={(v) => setCourseFilter(v as "all" | Course)}>
                <SelectTrigger className="sm:w-40">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                        No curricula found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button size="sm" variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
              <Button size="sm" variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit + Manage Subjects Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Curriculum</DialogTitle>
            <DialogDescription>Update the course, year level, semester, and assigned subjects.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Year Level — always shown */}
            <div className="flex flex-col gap-2">
              <Label>Year Level</Label>
              <Select
                value={editForm.year_level}
                onValueChange={(v) =>
                  setEditForm({ ...editForm, year_level: v as YearLevel, course: "", strand: "" })
                }
              >
                <SelectTrigger className="w-full p-5"><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="p-3">
                  {YEAR_LEVELS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Semester — always shown */}
            <div className="flex flex-col gap-2">
              <Label>Semester</Label>
              <Select
                value={editForm.semester}
                onValueChange={(v) => setEditForm({ ...editForm, semester: v as Semester })}
              >
                <SelectTrigger className="w-full p-5"><SelectValue placeholder="Semester" /></SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="p-3">
                  {SEMESTERS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Course / Strand / N/A — conditional */}
            {editLevelType === "college" && (
              <div className="flex flex-col gap-2">
                <Label>Course</Label>
                <Select
                  value={editForm.course}
                  onValueChange={(v) => setEditForm({ ...editForm, course: v as Course, strand: "" })}
                >
                  <SelectTrigger className="w-full p-5"><SelectValue placeholder="Course" /></SelectTrigger>
                  <SelectContent alignItemWithTrigger={false} className="p-3">
                    {COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {editLevelType === "senior" && (
              <div className="flex flex-col gap-2">
                <Label>Strand</Label>
                <Select
                  value={editForm.strand}
                  onValueChange={handleStrandChange}
                >
                  <SelectTrigger className="w-full p-5"><SelectValue placeholder="Strand" /></SelectTrigger>
                  <SelectContent alignItemWithTrigger={false} className="p-3">
                    {STRAND.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {editLevelType === "basic" && (
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Course / Strand</Label>
                <p className="text-sm text-muted-foreground pt-2">Not applicable</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Subjects</Label>
            <div className="max-h-80 overflow-auto rounded-lg border border-border">
              <ul className="divide-y divide-border">
                {isSubjectsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground animate-pulse">Loading subjects...</p>
                  </div>
                ) : subjects.map((s) => {
                  const checked = (selectedIds ?? []).includes(s.id);
                  return (
                    <li key={s.id}>
                      <label htmlFor={`edit-subj-${s.id}`} className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40">
                        <div className="flex items-center gap-3">
                          <Checkbox id={`edit-subj-${s.id}`} checked={checked} onCheckedChange={() => toggleSubject(s.id)} />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{s.subject_code}</span>
                            <span className="text-xs text-muted-foreground">{s.subject_name}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">{s.units} units</Badge>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <span className="mr-auto self-center text-xs text-muted-foreground">
              {(selectedIds ?? []).length} selected
            </span>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Page root ───────────────────────────────────────────────────────────────

function Curriculum() {
  return <CurriculumList />;
}

export default Curriculum;