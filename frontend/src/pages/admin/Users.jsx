import React, { useState } from "react";
import { FaUser, FaEdit, FaTrashAlt, FaSearch, FaFilePdf } from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  // Initial user data
  const [users, setUsers] = useState([
    {
      id: 1,
      user: "John Doe",
      age: 45,
      gender: "Male",
      address: "123 Main St, Cityville",
      feedbackList: [
        {
          id: 1,
          content: "Service was excellent and timely.",
          date: "2025-01-30",
          recommendedFollowUp: "Routine check-up in 6 months",
          sentimentCategory: "Positive"
        },
        {
          id: 2,
          content: "The waiting area was comfortable but could use more seating.",
          date: "2024-12-15",
          recommendedFollowUp: "None required",
          sentimentCategory: "Neutral"
        }
      ],
      pdfName: "John_Doe_Profile.pdf"
    },
    {
      id: 2,
      user: "Jane Smith",
      age: 38,
      gender: "Female",
      address: "456 Elm St, Townsville",
      feedbackList: [
        {
          id: 1,
          content: "Wait times were longer than expected.",
          date: "2025-01-28",
          recommendedFollowUp: "Customer service follow-up call",
          sentimentCategory: "Neutral"
        },
        {
          id: 2,
          content: "Staff was very helpful but the process was confusing.",
          date: "2024-11-10",
          recommendedFollowUp: "Review process documentation",
          sentimentCategory: "Mixed"
        }
      ],
      pdfName: "Jane_Smith_Profile.pdf"
    },
  ]);

  const filteredUsers = users.filter((user) =>
    user.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user) => {
    setEditMode(true);
    setEditedUser({ ...user });
    setSelectedUser(user);
  };

  const handleSaveUser = () => {
    setUsers(users.map(user => user.id === editedUser.id ? editedUser : user));
    setEditMode(false);
    setSelectedUser(editedUser);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleFeedbackClose = () => {
    setSelectedUser(null);
  };

  const generateUserPDF = (user) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(40, 60, 100);
    doc.text("User Feedback Analysis", 105, 20, null, null, "center");

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("User Profile", 20, 40);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(12);
    doc.text(`Name: ${user.user}`, 20, 55);
    doc.text(`Age: ${user.age}`, 20, 65);
    doc.text(`Gender: ${user.gender}`, 20, 75);
    doc.text(`Address: ${user.address}`, 20, 85);

    doc.setFontSize(16);
    doc.text("Feedback History", 20, 105);
    doc.line(20, 110, 190, 110);

    let yPosition = 120;
    user.feedbackList.forEach((feedback, index) => {
      doc.setFontSize(14);
      doc.text(`Feedback ${index + 1}:`, 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.text(`Date: ${feedback.date}`, 25, yPosition);
      yPosition += 10;
      
      doc.text("Content:", 25, yPosition);
      yPosition += 10;
      const splitFeedback = doc.splitTextToSize(feedback.content, 160);
      doc.text(splitFeedback, 30, yPosition);
      yPosition += splitFeedback.length * 7;
      
      doc.text(`Sentiment: ${feedback.sentimentCategory}`, 25, yPosition);
      yPosition += 10;
      
      doc.text(`Follow-up: ${feedback.recommendedFollowUp}`, 25, yPosition);
      yPosition += 20;
    });

    doc.save(user.pdfName);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">User Management Admin Panel</h2>

          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-xl focus:border-red-500 focus:outline-none transition-colors bg-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-black">
          <div className="grid grid-cols-6 gap-6 text-black mb-4 px-4">
            <div className="font-semibold">User</div>
            <div className="font-semibold">Age</div>
            <div className="font-semibold">Gender</div>
            <div className="font-semibold">Actions</div>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                className="grid grid-cols-6 gap-6 items-center p-4 rounded-lg bg-white border-2 border-black hover:border-red-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center">
                  <FaUser size={24} className="text-red-500 mr-3" />
                  <span className="text-md text-black">{user.user}</span>
                </div>

                <div className="text-md">{user.age}</div>
                <div className="text-md">{user.gender}</div>

                <div className="text-md">
                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => setSelectedUser(user)}
                  >
                    View Feedback
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center text-yellow-500"
                    onClick={() => handleEditUser(user)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="flex items-center text-red-500"
                    onClick={() => generateUserPDF(user)}
                  >
                    <FaFilePdf />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-black">{selectedUser.user}'s Feedback</h3>
                <button onClick={handleFeedbackClose} className="text-xl font-bold text-gray-500">
                  X
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {selectedUser.feedbackList.map((feedback) => (
                  <div key={feedback.id} className="border-b py-2">
                    <div className="text-md font-semibold">{feedback.content}</div>
                    <div className="text-sm text-gray-500">{feedback.date}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Sentiment: {feedback.sentimentCategory}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {editMode && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold text-black mb-4">Edit User</h3>

              <label className="block text-md mb-2">Name</label>
              <input
                type="text"
                name="user"
                value={editedUser.user}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border-2 border-gray-300 rounded-lg"
              />

              <label className="block text-md mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={editedUser.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border-2 border-gray-300 rounded-lg"
              />

              <label className="block text-md mb-2">Gender</label>
              <input
                type="text"
                name="gender"
                value={editedUser.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border-2 border-gray-300 rounded-lg"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;
