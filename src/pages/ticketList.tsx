import React from "react";
import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { ChevronDown, ChevronUp, Search } from 'lucide-react';


interface Ticket {
  id: string;
  title: string;
  status : string;
}

export default function TicketList({ token, setToken }: { token: string; setToken: (t: string | null) => void }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [query, setQuery] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');


    useEffect(() => {
        fetch("http://localhost:8000/tickets", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setTickets);
    }, [id, token]);

    // Handle sorting
    const handleSort = (field: React.SetStateAction<string>) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    //Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/");
    };

    // Sort icon component
    // @ts-ignore
    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />;
        return sortDirection === 'asc'
            ? <ChevronUp className="w-4 h-4 text-blue-600" />
            : <ChevronDown className="w-4 h-4 text-blue-600" />;
    };

    const filtered = tickets.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.id.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Ticket List</h1>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
                    onClick={() => navigate("/new")}
                >
                    + New Ticket
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search tickets..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/*<div className="mb-4">*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        placeholder="Search by title or ID..."*/}
            {/*        className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"*/}
            {/*        value={query}*/}
            {/*        onChange={e => setQuery(e.target.value)}*/}
            {/*    />*/}
            {/*</div>*/}


            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-b border-gray-200"
                        >
                            <div className="flex items-center">
                                ID <SortIcon field="id" />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-b border-gray-200"
                            onClick={() => handleSort('status')}
                        >
                            <div className="flex items-center">
                                Status <SortIcon field="status" />
                            </div>
                        </th>

                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-b border-gray-200"
                            onClick={() => handleSort('status')}
                        >
                            <div className="flex items-center">
                                Title
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-b border-gray-200"
                            onClick={() => handleSort('status')}
                        >
                            <div className="flex items-center">
                                Action
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="hover:bg-blue-50 transition-colors duration-150">
                    {filtered.map(ticket => (
                        <tr key={ticket.id} className="hover:bg-blue-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-100">{ticket.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 border-r border-gray-100">{ticket.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">{ticket.status}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex justify-center space-x-2">
                                <button
                                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded shadow"
                                >
                                    View
                                </button>
                                {/*<button*/}
                                {/*    onClick={() => setIsDeleteDialogOpen(true)}*/}
                                {/*    className="inline-flex items-center px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors duration-150"*/}
                                {/*    title="Delete ticket"*/}
                                {/*>*/}
                                {/*    <Trash2 className="h-4 w-4" />*/}
                                {/*</button>*/}
                                    </div>

                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={3} className="text-center text-gray-500 py-4">No tickets found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
                <div className="mt-4 text-sm text-gray-500">
                </div>
                </div>
            </div>

            );}
