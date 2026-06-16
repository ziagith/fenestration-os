import React, { useState } from 'react';

function OpenAITest() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askChatGPT = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse('');

    try {
      // .env ফাইল থেকে API Key নিয়ে আসা
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY; 
     const apiUrl = "/v1/chat/completions";

      const result = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await result.json();
      
      if (data.choices && data.choices.length > 0) {
        setResponse(data.choices[0].message.content);
      } else {
        setResponse("Error: " + data.error.message);
      }
      
    } catch (error) {
      console.error("Error API Call:", error);
      setResponse("Something went wrong! Check your API Key or internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mt-6 mb-10 bg-white rounded-lg shadow-md border max-w-lg mx-auto">
      <h2 className="text-lg font-bold mb-4 text-green-600">OpenAI API Test</h2>
      <div className="flex flex-col gap-3">
        <textarea 
          placeholder="Ask AI anything... (e.g. Write a 2 line poem about windows)" 
          onChange={(e) => setPrompt(e.target.value)}
          className="border border-gray-300 p-2 rounded h-24 focus:ring-2 focus:ring-green-500 outline-none resize-none"
        />
        <button 
          onClick={askChatGPT} 
          disabled={loading}
          className="bg-green-600 text-white font-medium p-2 rounded hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {loading ? "Thinking... 🤔" : "Ask ChatGPT 🚀"}
        </button>
      </div>
      
      {response && (
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded text-sm text-gray-700 whitespace-pre-wrap">
          <span className="font-bold text-slate-800">AI Says:</span><br/>
          {response}
        </div>
      )}
    </div>
  );
}

export default OpenAITest;