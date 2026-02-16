import {
    Box,
    Typography,
    Dialog,
    DialogContent,
} from "@mui/material";
import { useEffect, useState, type FC } from "react";
import { api } from "../api/api";
import type { Child } from "../store/useRequests";

const Certificate: FC<{ child: Child }> = ({ child }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let blobUrl: string;

        const load = async () => {
            try {
                const res = await api.get(`${child.path_image}`, {
                    responseType: "blob",
                });

                blobUrl = URL.createObjectURL(res.data);
                setImageSrc(blobUrl);
            } catch (error) {
                console.error(error);
            }
        };

        load();

        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [child.path_image]);

    if (!imageSrc) return null;

    return (
        <>
            <Box mt={1}>
                <Typography>
                    <strong>Свидетельство:</strong>
                </Typography>

                <Box
                    component="img"
                    src={imageSrc}
                    alt="certificate"
                    onClick={() => setOpen(true)}
                    sx={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 2,
                        cursor: "pointer",
                        border: "1px solid #ddd",
                        transition: "0.2s",
                        "&:hover": {
                            transform: "scale(1.05)",
                        },
                    }}
                />
            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="lg"
            >
                <DialogContent
                    sx={{
                        p: 0,
                        backgroundColor: "#000",
                    }}
                >
                    <Box
                        component="img"
                        src={imageSrc}
                        alt="preview"
                        sx={{
                            width: "100%",
                            maxHeight: "90vh",
                            objectFit: "contain",
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Certificate;
