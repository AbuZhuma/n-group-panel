import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Login from "./pages/Login";
import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetail";
import Layout from "./layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Requests />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
    </BrowserRouter>
  );
}
