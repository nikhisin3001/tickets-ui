import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import React from "react";
import {Ban} from "lucide-react";

export default function Login({ setToken }: { setToken: (t: string) => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(false);


    const handleLogin = async () => {
        try {
            const res = await login(email, password);
            setToken(res.access_token);
            navigate("/");
            localStorage.setItem("token", res.access_token)
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign In</h1>

                <div className="space-y-4">
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="mb-4 flex items-center text-red-600 bg-red-100 rounded-md px-4 py-2">
                        <Ban className="w-4 h-4 mr-2" />
                        <p className="text-sm">Login Failed</p>
                    </div>
                )}

                <button
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                    onClick={handleLogin}

                >
                    Login
                </button>

                <div className="mt-4 text-sm text-center">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate("/create-user")}
                        className="text-blue-600 hover:underline"
                    >
                        Create one
                    </button>
                </div>
            </div>
        </div>
    );
}
