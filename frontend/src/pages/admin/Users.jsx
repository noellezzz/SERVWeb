import React, { useState } from "react";
import { FaUser, FaEdit, FaTrashAlt, FaSearch, FaFilePdf, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [viewFeedbackMode, setViewFeedbackMode] = useState(false);
  const [selectedUserFeedback, setSelectedUserFeedback] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      user: "John Doe",
      age: 45,
      gender: "Male",
      address: "123 Main St, Cityville",
      feedbackList: [
        { id: 1, content: "Service was excellent.", date: "2025-01-30", sentimentCategory: "Positive", recommendedFollowUp: "Routine check-up in 6 months" },
        { id: 2, content: "Waiting area was comfortable.", date: "2024-12-15", sentimentCategory: "Neutral", recommendedFollowUp: "None" }
      ]
    },
    {
      id: 2,
      user: "Jane Smith",
      age: 38,
      gender: "Female",
      address: "456 Elm St, Townsville",
      feedbackList: [
        { id: 1, content: "Wait times were longer.", date: "2025-01-28", sentimentCategory: "Neutral", recommendedFollowUp: "Customer service call" },
        { id: 2, content: "Helpful staff but process confusing.", date: "2024-11-10", sentimentCategory: "Mixed", recommendedFollowUp: "Review process documentation" }
      ]
    }
  ]);

  const filteredUsers = users.filter(user => user.user.toLowerCase().includes(searchTerm.toLowerCase()));

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
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleViewFeedback = (user) => {
    setSelectedUserFeedback(user);
    setViewFeedbackMode(true);
  };

  const handleCloseFeedbackModal = () => {
    setViewFeedbackMode(false);
    setSelectedUserFeedback(null);
  };
  const generateUserPDF = (user) => {
    const doc = new jsPDF();
    // User details
    doc.text(`User Profile: ${user.user}`, 10, 10);
    doc.text(`Age: ${user.age}`, 10, 20);
    doc.text(`Gender: ${user.gender}`, 10, 30);
    doc.text(`Address: ${user.address}`, 10, 40);
  
    // Add feedback to PDF
    let yPosition = 50; // Start position for feedback
    doc.text("Feedback List:", 10, yPosition);
    yPosition += 10;
  
    user.feedbackList.forEach((feedback, index) => {
      doc.text(`Feedback ${index + 1}:`, 10, yPosition);
      yPosition += 10;
      doc.text(`Date: ${feedback.date}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Content: ${feedback.content}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Sentiment: ${feedback.sentimentCategory}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Recommended Follow-up: ${feedback.recommendedFollowUp}`, 10, yPosition);
      yPosition += 15; // Extra space between feedbacks
    });
  
    // Save the PDF
    doc.save(`${user.user}_Profile.pdf`);
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
            <div className="font-semibold">Feedback</div>
            <div className="font-semibold">Actions</div>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                className="grid grid-cols-6 gap-6 items-center p-4 rounded-lg bg-white border-2 border-black hover:border-red-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <FaUser className="text-xl text-black" />
                  <span>{user.user}</span>
                </div>
                <div>{user.age}</div>
                <div>{user.gender}</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewFeedback(user)}
                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-xl"
                  >
                    View Feedback
                  </button>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-300 hover:bg-yellow-400 text-black py-2 px-4 rounded-xl"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => generateUserPDF(user)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl"
                  >
                    <FaFilePdf />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {viewFeedbackMode && selectedUserFeedback && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[80%] max-w-3xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Feedback for {selectedUserFeedback.user}</h3>
                <button onClick={handleCloseFeedbackModal} className="text-black text-lg">
                  <FaTimes />
                </button>
              </div>
              <div>
                {selectedUserFeedback.feedbackList.map((feedback) => (
                  <div key={feedback.id} className="mb-4">
                    <div className="font-semibold">Date: {feedback.date}</div>
                    <div>Content: {feedback.content}</div>
                    <div>Sentiment: {feedback.sentimentCategory}</div>
                    <div>Recommended Follow-up: {feedback.recommendedFollowUp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {editMode && selectedUser && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[80%] max-w-3xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Edit {selectedUser.user}'s Info</h3>
                <button onClick={handleCancelEdit} className="text-black text-lg">
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="user" className="font-semibold">Name</label>
                  <input
                    type="text"
                    name="user"
                    value={editedUser.user}
                    onChange={handleInputChange}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="age" className="font-semibold">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={editedUser.age}
                    onChange={handleInputChange}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="font-semibold">Gender</label>
                  <input
                    type="text"
                    name="gender"
                    value={editedUser.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button onClick={handleSaveUser} className="bg-green-500 text-white py-2 px-4 rounded-xl">Save</button>
                  <button onClick={handleCancelEdit} className="bg-gray-300 text-black py-2 px-4 rounded-xl">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;
