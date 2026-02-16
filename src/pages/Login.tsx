import { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { login } from "../services/login";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!username || !password) return alert("Заполните все поля");
    const res = await login({ username, password });
    if (res) {
      navigate("/")
    } else {
      setError("Неправельный пароль или логин!")
    }
  };
  useEffect(() => {
    setError("")
  }, [username, password])
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={2}
    >
      <Typography variant="h4">Вход</Typography>
      <Typography color="red">{error}</Typography>
      <TextField
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Войти
      </Button>
    </Box>
  );
}
