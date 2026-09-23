import { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { fetchCadastros } from "../api/cadastros";
import type { Cadastro } from "../types/cadastro";

// Nenhuma feature opcional (ordenação, filtro, paginação client-side, etc.) é
// necessária aqui: a paginação é feita manualmente contra a API mockada.
const features = tableFeatures({});

const columnHelper = createColumnHelper<typeof features, Cadastro>();

// `useTable` espera `columns: ColumnDef<TFeatures, TData, unknown>[]`, mas por
// causa do parâmetro contravariante de `footer` (e outros), um array com
// colunas de `TValue` concretos (aqui, `string`) nunca é atribuível a esse
// tipo — é uma limitação de variância da própria lib. `any` é o único valor
// de `TValue` que contorna isso (mesma solução usada pela própria
// `@tanstack/react-table/legacy`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<typeof features, Cadastro, any>[] = [
  columnHelper.accessor("nome", { header: "Nome" }),
  columnHelper.accessor("sobrenome", { header: "Sobrenome" }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("cidade", { header: "Cidade" }),
  columnHelper.accessor("estado", { header: "Estado" }),
];

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export function CadastrosTable() {
  const [data, setData] = useState<Cadastro[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0); // 0-based, como o MUI TablePagination espera
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setError(null);

    fetchCadastros({ page: page + 1, pageSize: rowsPerPage })
      .then((response) => {
        if (!isActive) return;
        setData(response.data);
        setTotal(response.total);
      })
      .catch(() => {
        if (!isActive) return;
        setError("Não foi possível carregar os cadastros. Tente novamente.");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [page, rowsPerPage]);

  const table = useTable({
    features,
    data,
    columns,
  });

  const emptyRowsMessage = useMemo(() => {
    if (isLoading) return null;
    if (data.length === 0) return "Nenhum cadastro encontrado.";
    return null;
  }, [isLoading, data.length]);

  return (
    <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
      {error && (
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          {error}
        </Alert>
      )}

      <TableContainer sx={{ position: "relative", minHeight: 200 }}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} sx={{ fontWeight: 700 }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} hover>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {emptyRowsMessage && (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Box component="span" sx={{ color: "text.secondary" }}>
              {emptyRowsMessage}
            </Box>
          </Box>
        )}

        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.6)",
            }}
          >
            <CircularProgress size={28} />
          </Box>
        )}
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        labelRowsPerPage="Linhas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </Paper>
  );
}
