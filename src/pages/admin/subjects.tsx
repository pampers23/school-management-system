import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Header,
  Row,
  Cell,
  HeaderGroup,
  HeaderContext,
  CellContext,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Archive,
  Search,
  Pencil,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AddSubject } from "@/components/add-subject";
import StatCard from "@/components/stat-card";
import type { Subject, SubjectStatus } from "@/types";
import subjectsData from "@/data/subjects.json";
import {
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

// ─── Column Definitions ───────────────────────────────────────────────────────

const buildColumns = (
  toggleArchive: (id: string) => void
): ColumnDef<Subject>[] => [
  {
    accessorKey: "subject_code",
    header: (context: HeaderContext<Subject, unknown>) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => context.column.toggleSorting(context.column.getIsSorted() === "asc")}
      >
        Code
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: (context: CellContext<Subject, unknown>) => (
      <div className="pl-4 font-medium">{context.getValue() as React.ReactNode}</div>
    ),
  },
  {
    accessorKey: "subject_name",
    header: (context: HeaderContext<Subject, unknown>) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => context.column.toggleSorting(context.column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: (context: CellContext<Subject, unknown>) => {
      const subject = context.row.original;
      return (
        <div className="pl-4 flex flex-col">
          <span>{subject.subject_name}</span>
          {subject.description && (
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {subject.description}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "units",
    header: (context: HeaderContext<Subject, unknown>) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => context.column.toggleSorting(context.column.getIsSorted() === "asc")}
      >
        Units
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: (context: CellContext<Subject, unknown>) => (
      <div className="pl-4">{context.getValue() as React.ReactNode}</div>
    ),
  },
  {
    accessorKey: "status",
    header: (context: HeaderContext<Subject, unknown>) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => context.column.toggleSorting(context.column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: (context: CellContext<Subject, unknown>) => {
      const status = context.getValue() as SubjectStatus;
      return (
        <div className="pl-4">
          <Badge
            variant="secondary"
            className={cn(
              "capitalize",
              status === "Active"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-blue-500/10 text-blue-600 dark:bg-muted/50"
            )}
          >
            {status}
          </Badge>
        </div>
      );
    },
    filterFn: (row: Row<Subject>, _columnId: string, filterValue: unknown) => {
      if (filterValue === "All") return true;
      return row.getValue("status") === filterValue;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right pr-4">Actions</div>,
    cell: ({ row }) => {
      const subject = row.original;
      return (
        <div className="flex justify-end gap-1 pr-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => toast.message("Edit feature coming soon!")}
            aria-label="Edit Subject"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => toggleArchive(subject.id)}
            aria-label="Archive subject"
          >
            {subject.status === "Active" ? (
              <Archive className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      );
    },
  },
];

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>(
    subjectsData as Subject[]
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Stable toggle so buildColumns doesn't re-run on every render
  const toggleArchive = useCallback((id: string) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? "Archived" : "Active" }
          : s
      )
    );
    toast.success("Subject status updated.");
  }, []);

  const columns = useMemo(() => buildColumns(toggleArchive), [toggleArchive]);

  const table = useReactTable({
    data: subjects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const handleSubjectAdded = useCallback((newSubject: Subject) => {
    setSubjects((prev) => [...prev, newSubject]);
  }, []);

  // Derived stats always reflect the source data, not the filtered view
  const stats = useMemo(() => {
    const total = subjects.length;
    const active = subjects.filter((s) => s.status === "Active").length;
    return { total, active, archived: total - active };
  }, [subjects]);

  // Current status filter value (for the Select)
  const statusFilterValue =
    (table.getColumn("status")?.getFilterValue() as string) ?? "All";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Subjects Management"
          description="Create, organize, and maintain the subjects offered across your institution."
        />
        <AddSubject onSubjectAdded={handleSubjectAdded} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Subjects" value={stats.total} icon={BookOpen} />
        <StatCard
          label="Active Subjects"
          value={stats.active}
          icon={CheckCircle2}
        />
        <StatCard
          label="Archived Subjects"
          value={stats.archived}
          icon={Archive}
        />
      </div>

      {/* Table Card */}
      <Card className="rounded-2xl">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">Subjects</CardTitle>
            <CardDescription>
              {table.getFilteredRowModel().rows.length} of {subjects.length}{" "}
              subjects shown.
            </CardDescription>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search code or name..."
                value={
                  (table
                    .getColumn("subject_name")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table
                    .getColumn("subject_name")
                    ?.setFilterValue(e.target.value)
                }
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilterValue}
              onValueChange={(v) =>
                table
                  .getColumn("status")
                  ?.setFilterValue(v === "All" ? undefined : v)
              }
            >
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {table.getFilteredRowModel().rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-14 text-center">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                No subjects found
              </p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search or create a new subject
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup: HeaderGroup<Subject>) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header: Header<Subject, unknown>) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row: Row<Subject>) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell: Cell<Subject, unknown>) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          <div className="flex w-full items-center gap-8 lg:w-fit">
            {/* Rows per page */}
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page controls */}
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Subjects;