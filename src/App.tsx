import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import TicketList from "./pages/ticketList";
import NewTicket from "./pages/newTicket";
import TicketDetail from "./pages/ticketDetail";
import React from "react";
import CreateUser from "./pages/createUser";

export default function App() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  // @ts-ignore
  return (
    <Routes>
      <Route path="/" element={token ? <TicketList token={token} setToken={setToken} /> : <Login setToken={setToken} />} />
      <Route path="/new" element={<NewTicket token={token} />} />
      <Route path="/ticket/:id" element={<TicketDetail token={token!} />} />
      <Route path="/create-user" element={<CreateUser token={token!} />} />
    </Routes>
  );
}
