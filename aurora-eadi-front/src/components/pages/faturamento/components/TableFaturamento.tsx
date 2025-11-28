"use client";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaturamentoPost } from "@/services/faturamento/type/type_faturamentoCutOff";

interface Props {
  data: FaturamentoPost[];
  isLoading: boolean;
}

export function FaturamentoTable({ data, isLoading }: Props) {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-auto rounded border">
          <Table className="text-sm w-full">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="p-3 text-left">ID</TableHead>
                <TableHead className="p-3 text-left">User</TableHead>
                <TableHead className="p-3 text-left">Título</TableHead>
                <TableHead className="p-3 text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading
                ? skeletonRows.map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="p-3">
                        <Skeleton className="h-4 w-10" />
                      </TableCell>
                      <TableCell className="p-3">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="p-3">
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell className="p-3">
                        <Skeleton className="h-4 w-6" />
                      </TableCell>
                    </TableRow>
                  ))
                : data.map((item) => (
                    <TableRow key={item.id} className="border-t">
                      <TableCell className="p-3">{item.id}</TableCell>
                      <TableCell className="p-3">{item.userId}</TableCell>
                      <TableCell className="p-3">{item.title}</TableCell>
                      <TableCell className="p-3">
                        <Eye className="w-4 h-4 cursor-pointer hover:text-gray-800" />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
