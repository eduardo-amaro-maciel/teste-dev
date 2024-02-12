import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { productService, Product } from "@/services/ProductService";
import { Pencil, Trash2 } from "lucide-react";

export default function ProductList() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(productService.getAllProducts());

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: () => <div>Nome</div>,
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "price",
      header: () => <div>Preço</div>,
      cell: ({ row }) => <div>R$ {row.getValue("price")}</div>,
    },
    {
      accessorKey: "unit",
      header: () => <div>Unidade</div>,
      cell: ({ row }) => {
        const original = row.original;
        return <div>{original.quantity + " " + row.getValue("unit")}</div>;
      },
    },
    {
      accessorKey: "manufacturingDate",
      header: () => <div>Data de Fabricação</div>,
      cell: ({ row }) => <div>{formatDate(row.getValue("manufacturingDate"))}</div>,
    },
    {
      accessorKey: "expirationDate",
      header: () => <div>Data de Validade</div>,
      cell: ({ row }) => <div>{formatDate(row.getValue("expirationDate"))}</div>,
    },
    {
      accessorKey: "perishable",
      header: () => <div>Perecível?</div>,
      cell: ({ row }) => <div>{row.getValue("perishable") ? "Sim" : "Não"}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { id } = row.original;

        return (
          <div className="flex gap-4">
            <Link to={"/edit-product/" + id}>
              <Button className="flex items-center gap-2 flex-1">
                Editar <Pencil className="w-4 h-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger className="gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors text-primary-foreground hover:bg-destructive/90 h-10 px-4 py-2 bg-destructive">
                Excluir <Trash2 className="w-4 h-4" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and
                    remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Não, Cancele</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      productService.deleteProduct(id);
                      setData(productService.getAllProducts());
                    }}
                    className="bg-destructive"
                  >
                    Sim, deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  const formatDate = (date: string) => {
    if (date) {
      const parts = date.split("-");
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return "*";
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold tracking-tight max-[650px]:text-2xl">Lista de Produtos</h1>
      <div className="p-3mt-10 rounded-lg overflow-hidden mt-10">
        <div className="rounded-md border overflow-hidden w-full">
          <Table className="overflow-hidden">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Nenhum produto encontrado!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
