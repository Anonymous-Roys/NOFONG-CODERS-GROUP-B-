import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I add a new plant to my garden?",
      answer: "Go to the homepage and tap 'Add a plant' or navigate to the Plants page and select a plant from the library. Fill in the plant details and location."
    },
    {
      question: "How do I set up care reminders?",
      answer: "After adding a plant, go to Tasks and tap 'Add a task'. Choose the care type (water, fertilize, prune), set the time and frequency."
    },
    {
      question: "Why am I not receiving notifications?",
      answer: "Make sure you've enabled notifications in your browser settings and granted permission when prompted by the app."
    },
    {
      question: "How often should I water my plants?",
      answer: "It depends on the plant type, season, and environment. Check the soil moisture - water when the top inch feels dry."
    },
    {
      question: "What does pruning mean?",
      answer: "Pruning is removing dead, damaged, or overgrown parts of a plant to promote healthy growth and maintain shape."
    },
    {
      question: "How do I know if my plant needs fertilizer?",
      answer: "Most plants benefit from fertilizing during growing season (spring/summer). Look for slow growth or pale leaves as signs."
    },
    {
      question: "Can I delete or edit tasks?",
      answer: "Yes! In the Task Manager, tap the edit icon to modify a task or the delete icon to remove it. You can undo deletions within 5 seconds."
    },
    {
      question: "How do I mark a task as complete?",
      answer: "Tap the circle button next to any task to mark it complete. You'll hear a satisfying sound and see it move to the completed section."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-green-600">Help Center</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Welcome Section */}
        <div className="p-6 mb-6 bg-white rounded-2xl">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">How can we help you?</h2>
          <p className="text-gray-600">Find answers to common questions about plant care and using Bloom Buddy.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => navigate('/tasks/add')}
            className="p-4 bg-white rounded-xl hover:bg-gray-50"
          >
            <div className="text-2xl mb-2">📝</div>
            <p className="font-medium text-gray-800">Add Task</p>
          </button>
          <button 
            onClick={() => navigate('/plants')}
            className="p-4 bg-white rounded-xl hover:bg-gray-50"
          >
            <div className="text-2xl mb-2">🌱</div>
            <p className="font-medium text-gray-800">Browse Plants</p>
          </button>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {openFaq === index && (
                  <div className="mt-3 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="p-6 mt-6 bg-white rounded-2xl">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">Still need help?</h3>
          <p className="mb-4 text-gray-600">Can't find what you're looking for? We're here to help!</p>
          <button className="w-full py-3 text-white bg-green-600 rounded-xl hover:bg-green-700">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;