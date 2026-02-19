import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Paper,
  Divider,
} from "@mui/material";
import { useRequestsStore, type RequestStatus } from "../store/useRequests";

export const STATUS_MAP: Record<RequestStatus, string> = {
  APPROVED: "Одобрен",
  NEW: "В ожидании",
  REJECTED: "Отказано",
};

export default function Requests() {
  const { requests, getRequest } = useRequestsStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  useEffect(() => {
    getRequest();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const searchValue = search.toLowerCase();
      return (
        r.full_name?.toLowerCase().includes(searchValue) ||
        r.whatsapp_phone?.toLowerCase().includes(searchValue) ||
        r.email?.toLowerCase().includes(searchValue)
      );
    });
  }, [requests, search]);

  const grouped = {
    NEW: filteredRequests.filter((r) => r.status === "NEW"),
    APPROVED: filteredRequests.filter((r) => r.status === "APPROVED"),
    REJECTED: filteredRequests.filter((r) => r.status === "REJECTED"),
  };

  const renderTable = (data: typeof requests) => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>ФИО</TableCell>
          <TableCell>Телефон</TableCell>
          <TableCell>Детей приходит</TableCell>
          <TableCell>Статус</TableCell>
          <TableCell>Почта</TableCell>
          <TableCell>Действие</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} align="center">
              Нет данных
            </TableCell>
          </TableRow>
        ) : (
          data.map((r) => (
            <TableRow key={r.id}>   
              <TableCell>{r.full_name}</TableCell>
              <TableCell>{r.whatsapp_phone}</TableCell>
              <TableCell>{r.children_coming}</TableCell>
              <TableCell>{STATUS_MAP[r.status]}</TableCell>
              <TableCell>{r.email}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(`/requests/${r.id}`)}
                >
                  Детали
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Заявки
      </Typography>

      {/* 🔍 Поиск */}
      <TextField
        fullWidth
        label="Поиск по ФИО или номеру"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {/* 🟡 NEW */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" mb={2}>
          В ожидании ({grouped.NEW.length})
        </Typography>
        {renderTable(grouped.NEW)}
      </Paper>

      <Divider sx={{ mb: 4 }} />

      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Одобренные ({grouped.APPROVED.length})
        </Typography>
        {renderTable(grouped.APPROVED)}
      </Paper>

      <Divider sx={{ mb: 4 }} />

      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Отказанные ({grouped.REJECTED.length})
        </Typography>
        {renderTable(grouped.REJECTED)}
      </Paper>
    </Box>
  );
}
