import { Card, CardContent, CardTitle } from "../ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Tasks() {
  return (
    <Card className="bg-gray-50 p-6">
      <CardTitle className="text-sm font-semibold">Tarefas</CardTitle>
      <CardContent className="mt-1 -ml-1.5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Title</TableHead>
              <TableHead className="w-[200px]">Responsável</TableHead>
              <TableHead className="w-[200px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Alimentar a mama</TableCell>
              <TableCell>João</TableCell>
              <TableCell className="text-yellow-600">Em andamento</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Mise en place do dia
              </TableCell>
              <TableCell>Gaby</TableCell>
              <TableCell className="text-green-500">Completo</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
