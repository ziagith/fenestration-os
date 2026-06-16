import React, { useState } from 'react';

function WebhookTest() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState(''); // নতুন ফিল্ড

  const sendDataToMake = async (e) => {
    e.preventDefault(); 

    try {
      // নিচে আপনার Make.com-এর কপি করা URL টি দিন
      const webhookUrl = "https://hook.eu1.make.com/uh5y4auggsi70539xxljqw97nw701rkj"; 
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: name, 
          email: email, 
          project: project 
        })
      });

      if(response.ok) {
        alert("Success! Data sent to Make.com 🎉");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="p-6 mt-10 bg-white rounded-lg shadow-md border max-w-sm mx-auto">
      <h2 className="text-lg font-bold mb-4 text-blue-600">Webhook Test Form</h2>
      <form onSubmit={sendDataToMake} className="flex flex-col gap-3">
        <input 
          type="text" 
          placeholder="Enter Name" 
          onChange={(e) => setName(e.target.value)} 
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input 
          type="email" 
          placeholder="Enter Email" 
          onChange={(e) => setEmail(e.target.value)} 
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        {/* নতুন Project Details ফিল্ড */}
        <textarea 
          placeholder="Project Details" 
          onChange={(e) => setProject(e.target.value)} 
          className="border border-gray-300 p-2 rounded h-20 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          required
        />
        <button type="submit" className="bg-blue-600 text-white font-medium p-2 rounded hover:bg-blue-700 transition">
          Submit
        </button>
      </form>
    </div>
  );
}

export default WebhookTest;