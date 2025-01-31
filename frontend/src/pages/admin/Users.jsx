import React, { useState } from "react";
import { FaUser, FaEdit, FaTrashAlt, FaEnvelope, FaSearch, FaFilePdf, FaTransgender, FaMapMarkerAlt, FaNotesMedical } from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

// Enhanced Sample User Data with More Comprehensive Information
const users = [
  {
    id: 1,
    user: "John Doe",
    email: "john@example.com",
    age: 65,
    gender: "Male",
    address: "123 Maple Street, Sunnyvale, CA 94086",
    pdfName: "John_Doe_Profile.pdf",
    medicalInfo: {
      bloodPressure: "130/85 mmHg",
      heartRate: "72 bpm",
      bloodType: "O+",
      allergies: ["Penicillin", "Latex"],
    },
    latestFeedback: {
      date: "2024-01-15",
      content: "Patient seems to be managing chronic conditions well. Recommended continued monitoring of blood pressure.",
      recommendedFollowUp: "3 months"
    }
  },
  {
    id: 2,
    user: "Jane Smith",
    email: "jane@example.com",
    age: 70,
    gender: "Female",
    address: "456 Oak Avenue, Riverside, CA 92501",
    pdfName: "Jane_Smith_Profile.pdf",
    medicalInfo: {
      bloodPressure: "140/90 mmHg",
      heartRate: "68 bpm",
      bloodType: "A-",
      allergies: ["Sulfa drugs"],
    },
    latestFeedback: {
      date: "2024-01-22",
      content: "Patient showing signs of early-stage arthritis. Physical therapy recommended.",
      recommendedFollowUp: "2 months"
    }
  },
  {
    id: 3,
    user: "Robert Wilson",
    email: "robert@example.com",
    age: 68,
    gender: "Male",
    address: "789 Pine Road, Mountain View, CA 94043",
    pdfName: "Robert_Wilson_Profile.pdf",
    medicalInfo: {
      bloodPressure: "125/80 mmHg",
      heartRate: "70 bpm",
      bloodType: "B+",
      allergies: ["Aspirin"],
    },
    latestFeedback: {
      date: "2024-01-18",
      content: "Diabetes management improved. Continuing current treatment plan.",
      recommendedFollowUp: "4 months"
    }
  },
  {
    id: 4,
    user: "Mary Johnson",
    email: "mary@example.com",
    age: 75,
    gender: "Female",
    address: "101 Cedar Lane, Palo Alto, CA 94301",
    pdfName: "Mary_Johnson_Profile.pdf",
    medicalInfo: {
      bloodPressure: "135/85 mmHg",
      heartRate: "65 bpm",
      bloodType: "AB-",
      allergies: ["Ibuprofen"],
    },
    latestFeedback: {
      date: "2024-01-20",
      content: "Ongoing cardiac monitoring recommended. Slight improvement in overall health.",
      recommendedFollowUp: "2 months"
    }
  }
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to generate PDF for a specific user
  const generateUserPDF = (user) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Add a sophisticated layout
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(40, 60, 100);
    doc.text("Comprehensive User Profile", 105, 20, null, null, "center");

    // Personal Information Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Personal Information", 20, 40);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(12);
    doc.text(`Name: ${user.user}`, 20, 55);
    doc.text(`Age: ${user.age}`, 20, 65);
    doc.text(`Gender: ${user.gender}`, 20, 75);
    doc.text(`Email: ${user.email}`, 20, 85);
    doc.text(`Address: ${user.address}`, 20, 95);

    // Medical Information Section
    doc.setFontSize(16);
    doc.text("Medical Information", 20, 115);
    doc.line(20, 120, 190, 120);

    doc.setFontSize(12);
    doc.text(`Blood Pressure: ${user.medicalInfo.bloodPressure}`, 20, 130);
    doc.text(`Heart Rate: ${user.medicalInfo.heartRate}`, 20, 140);
    doc.text(`Blood Type: ${user.medicalInfo.bloodType}`, 20, 150);
    
    // Allergies
    doc.text("Allergies:", 20, 160);
    user.medicalInfo.allergies.forEach((allergy, index) => {
      doc.text(`• ${allergy}`, 30, 170 + (index * 10));
    });

    // Latest Feedback Section
    doc.setFontSize(16);
    doc.text("Latest Medical Feedback", 20, 210);
    doc.line(20, 215, 190, 215);

    doc.setFontSize(12);
    doc.text(`Date: ${user.latestFeedback.date}`, 20, 225);
    doc.text("Notes:", 20, 235);
    
    // Wrapping long text
    const splitText = doc.splitTextToSize(user.latestFeedback.content, 170);
    doc.text(splitText, 20, 245);
    doc.text(`Recommended Follow-up: ${user.latestFeedback.recommendedFollowUp}`, 20, 270);

    doc.save(user.pdfName);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Header and Search Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">Senior Users Management</h2>

          {/* Search Box */}
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

        {/* Main Container */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-black">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-6 text-black mb-4 px-4">
            <div className="font-semibold">User</div>
            <div className="font-semibold">Email</div>
            <div className="font-semibold">Age</div>
            <div className="font-semibold">Gender</div>
            <div className="font-semibold">Profile</div>
            <div className="font-semibold">Actions</div>
          </div>

          {/* User Rows */}
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
                {/* User */}
                <div className="flex items-center">
                  <FaUser size={24} className="text-red-500 mr-3" />
                  <span className="text-md text-black">{user.user}</span>
                </div>

                {/* Email */}
                <div className="text-md text-black flex items-center">
                  <FaEnvelope size={18} className="text-red-500 mr-2" />
                  {user.email}
                </div>

                {/* Age */}
                <div className="text-md text-black">{user.age}</div>

                {/* Gender */}
                <div className="text-md text-black flex items-center">
                  <FaTransgender size={18} className="text-red-500 mr-2" />
                  {user.gender}
                </div>

                {/* Profile View */}
                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <FaFilePdf className="mr-2" />
                    View Profile
                  </button>
                </div>

                {/* Actions */}
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

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-4xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-3">
              Detailed Profile: {selectedUser.user}
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaUser className="mr-2 text-red-500" /> Personal Information
                </h3>
                <p className="mb-2"><strong>Name:</strong> {selectedUser.user}</p>
                <p className="mb-2"><strong>Age:</strong> {selectedUser.age}</p>
                <p className="mb-2"><strong>Gender:</strong> {selectedUser.gender}</p>
                <p className="mb-2 flex items-center">
                  <FaEnvelope className="mr-2 text-red-500" /> 
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-red-500" /> 
                  <strong>Address:</strong> {selectedUser.address}
                </p>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaNotesMedical className="mr-2 text-red-500" /> Medical Information
                </h3>
                <p className="mb-2"><strong>Blood Pressure:</strong> {selectedUser.medicalInfo.bloodPressure}</p>
                <p className="mb-2"><strong>Heart Rate:</strong> {selectedUser.medicalInfo.heartRate}</p>
                <p className="mb-2"><strong>Blood Type:</strong> {selectedUser.medicalInfo.bloodType}</p>
                <p className="mb-2"><strong>Allergies:</strong></p>
                <ul className="list-disc pl-5">
                  {selectedUser.medicalInfo.allergies.map((allergy, index) => (
                    <li key={index}>{allergy}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Latest Feedback */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-xl font-semibold mb-4">Latest Medical Feedback</h3>
              <p><strong>Date:</strong> {selectedUser.latestFeedback.date}</p>
              <p className="mt-2"><strong>Notes:</strong> {selectedUser.latestFeedback.content}</p>
              <p className="mt-2"><strong>Recommended Follow-up:</strong> {selectedUser.latestFeedback.recommendedFollowUp}</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2 flex items-center"
                onClick={() => generateUserPDF(selectedUser)}
              >
                <FaFilePdf className="mr-2" /> Download Full Profile PDF
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;