import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PageNation } from "./pageNation";

export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

interface PaginationData {
  pageNum: number;
  totalPages: number;
}

interface TableListProps<T extends { id: string; isBlocked?: boolean }> {
  title: string;
  columns: ColumnConfig<T>[];
  data: T[];
  onAction?: (id: string, isBlocked: boolean) => void;
  pagination?: PaginationData;
onPageChange?: (page: number, select?: string, searchData?: string) => Promise<void>;
}

export function TableList<T extends { id: string; isBlocked?: boolean }>({
  title,
  columns,
  data,
  onAction,
  pagination,
  onPageChange,
}: TableListProps<T>) {
  return (
    <div className="w-full h-full p-5">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-zinc-100">
          {title}
        </h1>
      </div>

      <div className="w-full py-[2rem] px-[3rem]">
        <Table>
          <TableHeader>
            <TableRow className="w-full bg-zinc-200 dark:bg-zinc-800">
              {columns.map((col) => (
                <TableHead key={col.key as string} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
              {onAction && <TableHead className="text-end">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => {
                  const value = row[col.key];
                  return (
                    <TableCell
                      key={col.key as string}
                      className={col.className}
                    >
                      {col.render
                        ? col.render(value, row)
                        : (value as React.ReactNode)}
                    </TableCell>
                  );
                })}
                {onAction && (
                  <TableCell className="text-right">
                    <Button
                      className={`${
                        row.isBlocked
                          ? "bg-red-700 hover:bg-red-800"
                          : "bg-green-800 hover:bg-green-900"
                      } text-white min-w-24`}
                      onClick={() => onAction(row.id, !row.isBlocked)}
                    >
                      {row.isBlocked ? "Blocked" : "Active"}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pagination && pagination.totalPages > 1 && onPageChange && (
          <div className="w-full mt-8 flex justify-end">
            <PageNation
              pageNationData={pagination}
              fetchUserData={onPageChange}
              setpageNationData={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
