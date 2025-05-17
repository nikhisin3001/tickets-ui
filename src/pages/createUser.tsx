import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Ban} from "lucide-react";

export default function CreateUser({ token }: { token: string }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    const handleCreateUser = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to create user");
            }

            setMessage("User successfully created");
            setTimeout(() => navigate("/"), 1500);
        } catch (err: any) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Create New User</h2>
            {message && <p className="mb-4 text-sm text-red-500">{message}</p>}

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full mb-3 px-4 py-2 border rounded"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full mb-3 px-4 py-2 border rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded"
            />

            {error && (
                <div className="mb-4 flex items-center text-red-600 bg-red-100 rounded-md px-4 py-2">
                    <Ban className="w-4 h-4 mr-2" />
                    <p className="text-sm">User creation failed</p>
                </div>
            )}
            <button
                onClick={handleCreateUser}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
                {loading ? "Creating..." : "Create User"}
            </button>
        </div>
    );
}
