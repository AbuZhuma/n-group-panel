import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Divider,
    Button,
    Stack,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import { getRequestById } from "../services/getById";
import { useRequestsStore, type Request } from "../store/useRequests";
import Certificate from "../components/Child";
import { statusChange } from "../services/statusChange";
import { toast } from "react-toastify";
import { STATUS_MAP } from "./Requests";

export default function RequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [req, setReq] = useState<Request | null>(null);
    const [loading, setLoading] = useState(true);

    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectLoading, setRejectLoading] = useState(false);

    const { getRequest } = useRequestsStore();

    const onBack = () => {
        navigate("/");
    };

    const init = async () => {
        try {
            if (!id) return;

            const res = await getRequestById(id);
            if (res) {
                setReq(res);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        init();
    }, [id]);

    if (loading) {
        return (
            <Box p={4} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    if (!req) {
        return (
            <Box p={4}>
                <Typography>Заявка не найдена</Typography>
            </Box>
        );
    }

    const onApprove = async () => {
        try {
            const res = await statusChange(String(req.id), "approve");

            if (res) {
                toast.success("Одобрено");
                getRequest();
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при одобрении");
        }
    };

    const onReject = async () => {
        if (!rejectReason.trim()) {
            toast.error("Введите причину отказа");
            return;
        }

        try {
            setRejectLoading(true);

            const res = await statusChange(
                String(req.id),
                "reject",
                rejectReason
            );

            if (res) {
                toast.success("Отказано");
                getRequest();
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при отказе");
        } finally {
            setRejectLoading(false);
            setRejectOpen(false);
            setRejectReason("");
        }
    };
        
    return (
        <Box p={4}>
            <Stack direction="row" spacing={3} alignItems="center" mb={3}>
                <Button onClick={onBack} variant="outlined">
                    Назад
                </Button>
                <Typography variant="h4">
                    Детали заявки от {req.full_name}
                </Typography>
            </Stack>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography><strong>ФИО:</strong> {req.full_name}</Typography>
                <Typography><strong>Телефон:</strong> {req.whatsapp_phone}</Typography>
                <Typography><strong>Почта:</strong> {req.email}</Typography>

                <Typography>
                    <strong>Инвестор:</strong>{" "}
                    {req.is_investor ? "Да" : "Нет"}
                </Typography>

                <Typography>
                    <strong>Объекты:</strong> {req.objects.join(", ")}
                </Typography>

                <Typography>
                    <strong>Номер договора:</strong>{" "}
                    {req.contract_number || "-"}
                </Typography>

                <Typography>
                    <strong>Всего детей:</strong> {req.children_total}
                </Typography>

                <Typography>
                    <strong>Детей придет:</strong> {req.children_coming}
                </Typography>

                <Typography>
                    <strong>Статус:</strong> {STATUS_MAP[req.status]}
                </Typography>
                {req.reject_reason && req.status === "REJECTED" &&
                    <Typography><strong>Причина отказа:</strong> {req.reject_reason}</Typography>
                }
            </Paper>

            <Typography variant="h5" mb={2}>
                Дети
            </Typography>

            {req.children.length === 0 && (
                <Typography mb={2}>Нет добавленных детей</Typography>
            )}

            {req.children.map((child, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Typography>
                        <strong>ФИО:</strong> {child.full_name}
                    </Typography>

                    <Typography>
                        <strong>Возраст:</strong> {child.age}
                    </Typography>

                    {child.path_image && (
                        <Certificate child={child} />
                    )}
                </Paper>
            ))}

            <Divider sx={{ my: 3 }} />
            {req.status === "NEW" || req.status === "REJECTED" ?
                <Button
                    variant="contained"
                    onClick={onApprove}
                    color="success"
                    sx={{ mr: 2 }}
                >
                    Одобрить
                </Button>
                : null}
            {req.status === "NEW" || req.status === "APPROVED" ?
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setRejectOpen(true)}
                >
                    Отказать
                </Button>
                : null}
            <Dialog
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Причина отказа</DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Введите причину"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setRejectOpen(false)}>
                        Отмена
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={onReject}
                        disabled={rejectLoading}
                    >
                        {rejectLoading ? "Отправка..." : "Подтвердить отказ"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
