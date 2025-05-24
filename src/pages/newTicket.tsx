
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, AlertCircle, Tag, Calendar, Clock } from 'lucide-react';
import {ENDPOINT} from "../contants";

export default function EnhancedNewTicketForm({ token }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!description.trim()) {
      setError("Description is required");
      return false;
    }
    return true;
  };

  // Handle form submission
  const createTicket = async () => {
    if (!validateForm()) return;

    setError("");
    setIsSubmitting(true);

    try {
      // Simulate API request (replace with your actual API call)
      console.log("Creating ticket with:", { title, description, category, severity });

      // This would be your actual fetch call:
      const res = await fetch(ENDPOINT+"tickets/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          category,
         severity
        })
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data = await res.json();
      navigate(`/ticket/${data.id}`);


      // navigate to home for timeout
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/ticket'); // Replace with actual ID from response
      }, 100000000);

    } catch (err) {
      // @ts-ignore
      setError(err.message || "Failed to create ticket. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
      <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <button
                onClick={() => navigate('/')}
                className="mr-4 text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
          </div>
        </div>

        {/* Error message */}
        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Title field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
                id="title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Brief summary of the issue"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Category and severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-4 w-4 text-gray-400" />
                </div>
                <select
                    id="category"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Security">Security</option>
                  <option value="Performance">Performance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* severity field */}
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <div className="flex space-x-2">
                {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                    <button
                        key={p}
                        type="button"
                        className={`flex-1 py-2 px-3 rounded-md border ${
                            severity === p
                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSeverity(p)}
                    >
                      {p}
                    </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
                id="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-32"
                placeholder="Detailed description of the issue"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Additional help text */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-700">
            <p className="font-medium">Tips for a good ticket:</p>
            <ul className="mt-2 ml-4 list-disc">
              <li>Be specific about what the issue is</li>
              <li>Include steps to reproduce if applicable</li>
              <li>Mention any error messages you've seen</li>
              <li>Describe expected vs. actual behavior</li>
            </ul>
          </div>

          {/* Metadata information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 border-t border-gray-200 pt-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Created: {new Date().toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Estimated response time: 24-48 hours
            </div>
          </div>

          {/* Form actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                onClick={() => navigate('/tickets')}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
                type="button"
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                onClick={createTicket}
                disabled={isSubmitting}
            >
              {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
              ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Ticket
                  </>
              )}
            </button>
          </div>
        </div>
      </div>
  );
}



// export default function NewTicket({ token }: { token: string }) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const navigate = useNavigate();
//
//   const createTicket = async () => {
//     const res = await fetch("http://localhost:8000/tickets", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ title, description })
//     });
//     const data = await res.json();
//     navigate(`/ticket/${data.id}`);
//   };
//
//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h1 className="text-xl font-bold mb-4">New Ticket</h1>
//       <input className="border p-2 w-full mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
//       <textarea className="border p-2 w-full mb-4" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
//       <button className="bg-blue-600 text-white px-4 py-2" onClick={createTicket}>Create</button>
//     </div>
//   );
// }
