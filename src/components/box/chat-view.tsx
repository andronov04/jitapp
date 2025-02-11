'use client';


import {useState} from "react";

export function ChatView() {
  const [messages] = useState([
    { id: 1, text: "Hi there! How can I help you today?", sender: "bot" },
    { id: 2, text: "I need help with my React component", sender: "user" },
    { id: 3, text: "Sure, I'd be happy to help! What specific issue are you facing?", sender: "bot" },
    { id: 4, text: "I'm trying to implement a resizable layout", sender: "user" },
    { id: 5, text: "That's a great project! Let's break it down step by step...", sender: "bot" },
    { id: 6, text: "Hi there! How can I help you today?", sender: "bot" },
    { id: 7, text: "I need help with my React component", sender: "user" },
    { id: 8, text: "Sure, I'd be happy to help! What specific issue are you facing?", sender: "bot" },
    { id: 9, text: "I'm trying to implement a resizable layout", sender: "user" },
    { id: 10, text: "That's a great project! Let's break it down step by step...", sender: "bot" },
    { id: 11, text: "Hi there! How can I help you today?", sender: "bot" },
    { id: 12, text: "I need help with my React component", sender: "user" },
    { id: 13, text: "Sure, I'd be happy to help! What specific issue are you facing?", sender: "bot" },
    { id: 14, text: "I'm trying to implement a resizable layout", sender: "user" },
    { id: 15, text: "That's a great project! Let's break it down step by step...", sender: "bot" },
  ]);

  return (
    <div style={{
      width: 'inherit',
      maxHeight: 'calc(100vh - 3rem)',
    }} className="flex flex-col h-full fixed bottom-0">

      <div className="flex-1 flex flex-col min-w-0 gap-4 px-2 overflow-y-scroll pt-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Type your message..."
              rows={3}
            />
        {/*<div className="mt-2 flex justify-end">*/}
        {/*  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">*/}
        {/*    Send*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>

    </div>
  );
}

export default ChatView;
