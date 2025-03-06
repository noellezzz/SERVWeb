

//cant access itu, nasa test.jsx ung makikita nya list ng feedbacks niya after eval.


import React, { useState } from "react";
import { FaUser, FaEdit, FaTrashAlt, FaEnvelope, FaSearch, FaFilePdf, FaTransgender, FaComments } from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

const AfterEval = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  // Initial user data
  const [users, setUsers] = useState([
    {
      id: 1,
      user: "John Doe",
      email: "johndoe@example.com",
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
      email: "janesmith@example.com",
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

  const handleDeleteFeedback = (feedbackId) => {
    const updatedFeedbackList = editedUser.feedbackList.filter(feedback => feedback.id !== feedbackId);
    setEditedUser({
      ...editedUser,
      feedbackList: updatedFeedbackList
    });
  };

  const handleAddFeedback = () => {
    const newFeedback = {
      id: Math.max(0, ...editedUser.feedbackList.map(f => f.id)) + 1,
      content: "",
      date: new Date().toISOString().split('T')[0],
      recommendedFollowUp: "",
      sentimentCategory: "Neutral"
    };

    setEditedUser({
      ...editedUser,
      feedbackList: [...editedUser.feedbackList, newFeedback]
    });
  };

  const handleFeedbackChange = (id, field, value) => {
    const updatedFeedbackList = editedUser.feedbackList.map(feedback => 
      feedback.id === id ? { ...feedback, [field]: value } : feedback
    );
    
    setEditedUser({
      ...editedUser,
      feedbackList: updatedFeedbackList
    });
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
            <div className="font-semibold">Email</div>
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

                <div className="text-md text-black flex items-center">
                  <FaEnvelope size={18} className="text-red-500 mr-2" />
                  {user.email}
                </div>

                <div className="text-md text-black">{user.age}</div>

                <div className="text-md text-black flex items-center">
                  <FaTransgender size={18} className="text-red-500 mr-2" />
                  {user.gender}
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 flex items-center"
                  >
                    <FaComments className="mr-1" />
                    {user.feedbackList.length}
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white rounded-full p-2 hover:bg-yellow-400"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      generateUserPDF(user);
                    }}
                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400"
                  >
                    <FaFilePdf size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteFeedback(user.id)}
                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-400"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AfterEval;
