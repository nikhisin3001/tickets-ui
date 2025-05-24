import React from "react";
import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ArrowLeft, Calendar, Check, Clock, Edit, Trash2, User, X} from "lucide-react";
import DeleteDialog from "./deleteTicket";
import {ENDPOINT} from "../contants";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  createdBy: string;
  reporter: string;
  severity: string;
  category: string;
}

function StatusBadge(props: { status: any }) {
  return null;
}

function PriorityBadge(props: { priority: any }) {
  return null;
}

export default function TicketDetail({ token }: { token: string }) {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editable, setEditable] = useState(false);
  // Create a copy of the ticket for editing
  const [editedTicket, setEditedTicket] = useState<Ticket | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // Set up the edited ticket when the original ticket loads or when edit mode is toggled
  useEffect(() => {
    if (ticket) {
      setEditedTicket({ ...ticket });
    }
  }, [ticket]);

  // Set up the edited ticket when the original ticket loads or when edit mode is toggled
  useEffect(() => {
    if (ticket) {
      setEditedTicket({ ...ticket });
      console.log("Setting edited ticket from original:", ticket);
    }
  }, [ticket, editable]);

  const navigate = useNavigate();

  // Handle deletion API
  const handleDeleteTicket = (reason: string) => {
    // Reset state
    setDeleteError(null);

    // Call API to delete the ticket
    fetch(ENDPOINT+`tickets/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    })
        .then(async response => {
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete ticket');
          }
          return response.json();
        })
        .then(() => {
          setDeleteSuccess(true);
          // Redirect after successful deletion with a short delay
          setTimeout(() => {
            navigate('/');
          }, 1500);
        })
        .catch(error => {
          setDeleteError(error.message);
          setIsDeleteDialogOpen(false);
        });
  };


  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to:`, value); // Add logging to debug
    if (editedTicket) {
      setEditedTicket({
        ...editedTicket,
        [name]: value
      });
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditable(false);
    // Reset the edited ticket to the original
    if (ticket) {
      setEditedTicket({ ...ticket });
    }
    setUpdateError(null);
  };

  // Update API details
  const updateTicket = async () => {
    const res = await fetch(ENDPOINT+`tickets/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: ticket?.title,
        description: ticket?.description,
        status: ticket?.status,
        severity: ticket?.severity
      })
    });
    const updated = await res.json();
    setTicket(updated);
    setEditable(false);
    window.location.reload(true);
    //router.refresh();

  };

  useEffect(() => {
    fetch(ENDPOINT+`tickets/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setTicket);
  }, [id, token]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">

      {deleteSuccess && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Ticket successfully deleted. Redirecting to ticket list...
          </div>
      )}

      {deleteError && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {deleteError}
          </div>
      )}

      {ticket ? (
        <>
          {/* Header with back button */}
          <div className="mb-6">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to tickets
            </button>
          </div>

          {/* Ticket header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 mr-3">{ticket.title}</h1>
                  <span className="text-gray-500 font-medium">#{ticket.id}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <StatusBadge status={ticket.status} />
                  {/*<PriorityBadge priority={ticket.priority} />*/}
                  {/*<span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">*/}
                  {/*  {ticket.category}*/}
                  {/*</span>*/}
                </div>
              </div>

              <div className="flex space-x-2">
                {editable ? (
                    <>
                    <button
                        onClick={updateTicket}
                        disabled={isUpdating}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      {isUpdating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                      ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </>
                      )}
                    </button>
                      <button
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </>
                ) : (
                    <>
                      <button
                          onClick={() => setEditable(true)}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                          className="flex items-center px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
                          onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </>
                )}
              </div>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created
                </div>
                <div>{ticket.createdAt}</div>
              </div>
              {/*<div>*/}
              {/*  <div className="text-gray-500 flex items-center">*/}
              {/*    <User className="h-4 w-4 mr-1" />*/}
              {/*    Assigned to*/}
              {/*  </div>*/}
              {/*  <div>{ticket.assignedTo}</div>*/}
              {/*</div>*/}
              <div>
                <div className="text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Reporter
                </div>
                <div>{ticket.reporter}</div>
              </div>

              <div>
                <div className="text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Category
                </div>
                <div>{ticket.category}</div>
              </div>
            </div>


          {/* Description section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Description</h2>
            {editable ? (
                <textarea
                    name="description"
                    value={editedTicket.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                    rows={6}
                />
            ) : (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
                </div>
            )}
          </div>

          {/* Delete dialog */}
          <DeleteDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              onConfirm={handleDeleteTicket}
          />

            {/*</div>*/}
          </div>
        </>
      ) : <p>Loading...</p>}
    </div>
  );
}
