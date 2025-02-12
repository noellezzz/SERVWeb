import React, { useState } from 'react';
import { Plus, Trash2, Edit, MessageSquare } from 'lucide-react';

const Question = () => {
  const [questions, setQuestions] = useState([
    { id: 1, text: "How satisfied are you with our service?" },
    { id: 2, text: "What can we improve in our service?" },
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");

  const addQuestion = () => {
    if (newQuestion.trim() !== "") {
      setQuestions([...questions, { id: Date.now(), text: newQuestion }]);
      setNewQuestion("");
    }
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const startEditing = (question) => {
    setEditing(question.id);
    setEditText(question.text);
  };

  const saveEdit = (id) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, text: editText } : q))
    );
    setEditing(null);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-black mb-8">
      {/* Title */}
      <div className="flex items-center mb-4">
        <MessageSquare size={28} className="text-red-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">Manage Questions</h2>
      </div>

      {/* Question Input */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex gap-2 mb-4">
          <input
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter a new question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button 
            onClick={addQuestion}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            <Plus size={18} className="mr-2" />
            Add
          </button>
        </div>

        {/* Questions List */}
        {questions.length > 0 ? (
          <ul className="space-y-3">
            {questions.map((q) => (
              <li 
                key={q.id} 
                className="flex justify-between items-center px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 shadow-sm hover:border-red-200 hover:shadow-md transition-all"
              >
                {editing === q.id ? (
                  <input
                    className="flex-1 mr-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(q.id)}
                    autoFocus
                  />
                ) : (
                  <span className="text-md">{q.text}</span>
                )}
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEditing(q)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit size={18} className="text-blue-500" />
                  </button>
                  <button 
                    onClick={() => deleteQuestion(q.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No questions added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Question;