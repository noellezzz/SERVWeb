import React, { useState } from "react";
import { FaUser, FaEdit, FaTrashAlt, FaEnvelope, FaSearch, FaFilePdf, FaTransgender, FaMapMarkerAlt, FaNotesMedical } from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    {
      id: 1,
      user: "John Doe",
      email: "johndoe@example.com",
      age: 45,
      gender: "Male",
      address: "123 Main St, Cityville",
      medicalInfo: {
        bloodPressure: "120/80",
        heartRate: 72,
        bloodType: "O+",
        allergies: ["Peanuts", "Dust"],
      },
      latestFeedback: {
        content: "Service was excellent and timely.",
        date: "2025-01-30",
        recommendedFollowUp: "Routine check-up in 6 months",
      },
      pdfName: "John_Doe_Profile.pdf",
      sentimentCategory: "Positive",
    },
    {
      id: 2,
      user: "Jane Smith",
      email: "janesmith@example.com",
      age: 38,
      gender: "Female",
      address: "456 Elm St, Townsville",
      medicalInfo: {
        bloodPressure: "130/85",
        heartRate: 78,
        bloodType: "A+",
        allergies: ["Gluten"],
      },
      latestFeedback: {
        content: "Wait times were longer than expected.",
        date: "2025-01-28",
        recommendedFollowUp: "Customer service follow-up call",
      },
      pdfName: "Jane_Smith_Profile.pdf",
      sentimentCategory: "Neutral",
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateUserPDF = (user) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(40, 60, 100);
    doc.text("Waiting Line Sentiment Analysis", 105, 20, null, null, "center");

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Participant Profile", 20, 40);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(12);
    doc.text(`Name: ${user.user}`, 20, 55);
    doc.text(`Age: ${user.age}`, 20, 65);
    doc.text(`Gender: ${user.gender}`, 20, 75);

    doc.setFontSize(16);
    doc.text("Feedback Sentiment Analysis", 20, 95);
    doc.line(20, 100, 190, 100);

    doc.setFontSize(12);
    doc.text("Feedback Content:", 20, 110);
    const splitFeedback = doc.splitTextToSize(user.latestFeedback.content, 170);
    doc.text(splitFeedback, 20, 120);

    doc.text("Sentiment Score:", 20, 160);
    let sentimentColor, sentimentText;
    switch (user.sentimentCategory) {
      case "Positive":
        sentimentColor = [0, 128, 0];
        sentimentText = "Very Satisfactory Experience";
        break;
      case "Neutral":
        sentimentColor = [255, 165, 0];
        sentimentText = "Moderate Satisfaction";
        break;
      case "Negative":
        sentimentColor = [255, 0, 0];
        sentimentText = "Needs Immediate Improvement";
        break;
      default:
        sentimentColor = [128, 128, 128];
        sentimentText = "Inconclusive";
    }

    doc.setTextColor(...sentimentColor);
    doc.text(sentimentText, 20, 170);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Additional Context", 20, 190);
    doc.line(20, 195, 190, 195);

    doc.setFontSize(12);
    doc.text(`Date of Feedback: ${user.latestFeedback.date}`, 20, 205);
    doc.text(`Recommended Follow-up: ${user.latestFeedback.recommendedFollowUp}`, 20, 215);

    doc.text("Medical Context (if applicable):", 20, 230);
    doc.text(`Blood Pressure: ${user.medicalInfo.bloodPressure}`, 20, 240);
    doc.text(`Heart Rate: ${user.medicalInfo.heartRate}`, 20, 250);

    doc.save(user.pdfName);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">Senior Users Management</h2>

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
            <div className="font-semibold">Profile</div>
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
                    className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <FaFilePdf className="mr-2" />
                    View Profile
                  </button>
                </div>

                <div className="flex justify-end space-x-3">
                  <button className="flex items-center px-3 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-100 transition-all">
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                    <FaTrashAlt className="mr-2" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-4xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-3">
              Detailed Profile: {selectedUser.user}
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaUser className="mr-2 text-red-500" /> Personal Information
                </h3>
                <p className="mb-2"><strong>Name:</strong> {selectedUser.user}</p>
                <p className="mb-2"><strong>Age:</strong> {selectedUser.age}</p>
                <p className="mb-2                "><strong>Gender:</strong> {selectedUser.gender}</p>
                <p className="mb-2"><strong>Address:</strong> {selectedUser.address}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaNotesMedical className="mr-2 text-red-500" /> Medical Information
                </h3>
                <p className="mb-2"><strong>Blood Pressure:</strong> {selectedUser.medicalInfo.bloodPressure}</p>
                <p className="mb-2"><strong>Heart Rate:</strong> {selectedUser.medicalInfo.heartRate}</p>
                <p className="mb-2"><strong>Blood Type:</strong> {selectedUser.medicalInfo.bloodType}</p>
                <p className="mb-2"><strong>Allergies:</strong> {selectedUser.medicalInfo.allergies.join(", ")}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaFilePdf className="mr-2 text-red-500" /> Feedback
                </h3>
                <p className="mb-2"><strong>Content:</strong> {selectedUser.latestFeedback.content}</p>
                <p className="mb-2"><strong>Date:</strong> {selectedUser.latestFeedback.date}</p>
                <p className="mb-2"><strong>Recommended Follow-up:</strong> {selectedUser.latestFeedback.recommendedFollowUp}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-red-500" /> Sentiment Analysis
                </h3>
                <p className="mb-2"><strong>Category:</strong> {selectedUser.sentimentCategory}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-all"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                onClick={() => generateUserPDF(selectedUser)}
              >
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
