
import React from "react";
import { useEffect, useState } from "react";
import { X, AlertTriangle} from "lucide-react";

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    createdBy: string;
    reporter: string;
}

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export default function DeleteDialog({ isOpen, onClose, onConfirm }: DeleteDialogProps) {
    const [deleteReason, setDeleteReason] = useState("");
    const [otherReason, setOtherReason] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = () => {
        const finalReason = deleteReason === "other" ? otherReason : deleteReason;
        setIsDeleting(true);
        onConfirm(finalReason);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center text-red-600">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <h2 className="text-xl font-bold">Delete Ticket</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-700 mb-4">Are you sure you want to delete this ticket? This action cannot be undone.</p>

                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            <>Delete Ticket</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
