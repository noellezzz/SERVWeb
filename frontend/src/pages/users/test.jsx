import React, { useState } from "react";
import { FaUser, FaEnvelope, FaTransgender, FaCalendar, FaPhoneAlt, FaMapMarkerAlt, FaComments, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";

const Test = () => {
  const [user, setUser] = useState({
    id: 1,
    user: "John Doe",
    email: "johndoe@example.com",
    age: 28,
    gender: "Male",
    phone: "+1234567890",
    address: "123 Main St, Cityville",
    photoUrl: "https://via.placeholder.com/150",
    feedbackList: [
      {
        id: 1,
        content: "Service was excellent and timely.",
        date: "2025-01-30",
        sentimentCategory: "Positive"
      },
      {
        id: 2,
        content: "The waiting area was comfortable but could use more seating.",
        date: "2024-12-15",
        sentimentCategory: "Neutral"
      }
    ]
  });

  const generateUserPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(40, 60, 100);
    doc.text("Your Feedback Report", 105, 20, null, null, "center");

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("User Profile", 20, 40);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(12);
    doc.text(`Name: ${user.user}`, 20, 55);
    doc.text(`Email: ${user.email}`, 20, 65);
    doc.text(`Age: ${user.age}`, 20, 75);
    doc.text(`Gender: ${user.gender}`, 20, 85);
    doc.text(`Phone: ${user.phone}`, 20, 95);
    doc.text(`Address: ${user.address}`, 20, 105);

    doc.setFontSize(16);
    doc.text("Your Feedback", 20, 125);
    doc.line(20, 130, 190, 130);

    let yPosition = 135;
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

      yPosition += 20;
    });

    doc.save(user.user + "_Feedback_Report.pdf");
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* User Profile Container */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-black mb-6">
          <div className="flex mb-6">
            <div className="w-1/4">
              <img
                src={user.photoUrl}
                alt="User Profile"
                className="rounded-full w-40 h-40 object-cover"
              />
            </div>
            <div className="w-3/4 pl-6">
              <h2 className="text-2xl font-semibold text-black mb-4">{user.user}'s Profile</h2>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Age:</strong> {user.age}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Address:</strong> {user.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Feedback Container */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-black">
          <h4 className="text-lg font-semibold mb-4">Your Feedback:</h4>
          {user.feedbackList.map((feedback) => (
            <div key={feedback.id} className="p-4 border-2 border-gray-300 rounded-xl mb-4">
              <p><strong>Content:</strong> {feedback.content}</p>
              <p><strong>Sentiment:</strong> {feedback.sentimentCategory}</p>
              <p><strong>Date:</strong> {feedback.date}</p>
            </div>
          ))}

          {/* Download PDF Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={generateUserPDF}
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400"
            >
              <FaFilePdf size={18} /> Download PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Test;
