import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendar, FaComments, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';

const AfterFeedback = ({ info }) => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState({
    user: 'Thank You',
    email: info.userId ? `User ID: ${info.userId}` : 'Anonymous Submission',
    date: new Date().toISOString().split('T')[0],
    feedbackList: info.feedbackList || [],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 50000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const generateFeedbackPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(40, 60, 100);
    doc.text('Your Feedback Report', 105, 20, null, null, 'center');

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('User Information', 20, 40);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(12);
    doc.text(`User: ${feedbackData.user}`, 20, 55);
    doc.text(`Email: ${feedbackData.email}`, 20, 65);
    doc.text(`Date: ${feedbackData.date}`, 20, 75);

    doc.setFontSize(16);
    doc.text('Feedback Details', 20, 95);
    doc.line(20, 100, 190, 100);

    let yPosition = 110;
    feedbackData.feedbackList.forEach((feedback, index) => {
      doc.setFontSize(14);
      doc.text(`Feedback ${index + 1}:`, 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.text(`Date: ${feedback.date}`, 25, yPosition);
      yPosition += 10;
      doc.text('Content:', 25, yPosition);
      yPosition += 10;
      const splitFeedback = doc.splitTextToSize(feedback.content, 160);
      doc.text(splitFeedback, 30, yPosition);
      yPosition += splitFeedback.length * 7;
      doc.text(`Sentiment: ${feedback.sentimentCategory}`, 25, yPosition);
      yPosition += 20;
    });

    doc.save('Feedback_Report.pdf');
  };

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
        <div className='bg-white shadow-lg rounded-xl p-6 border-2 border-black mb-6'>
          <h2 className='text-2xl font-semibold text-black mb-4'>Thank You for Your Feedback!</h2>
          <p className='text-gray-600'>We appreciate your input. You will be redirected shortly.</p>
        </div>

        <div className='bg-white shadow-lg rounded-xl p-6 border-2 border-black'>
          <h4 className='text-lg font-semibold mb-4'>Your Feedback:</h4>
          {feedbackData.feedbackList.map((feedback, index) => (
            <div key={index} className='p-4 border-2 border-gray-300 rounded-xl mb-4'>
              <p>
                <strong>Content:</strong> {feedback.content}
              </p>
              <p>
                <strong>Sentiment:</strong> {feedback.sentimentCategory}
              </p>
              <p>
                <strong>Date:</strong> {feedback.date}
              </p>
            </div>
          ))}

          <div className='flex justify-end mt-6 space-x-4'>
            <button onClick={() => navigate('/')} className='bg-blue-600 text-white px-4 py-2 rounded-full'>
              Return Home
            </button>
            <button onClick={generateFeedbackPDF} className='bg-green-600 text-white px-4 py-2 rounded-full flex items-center'>
              <FaFilePdf className='mr-2' /> Download PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AfterFeedback;
