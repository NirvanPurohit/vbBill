import React from 'react';
import axios from 'axios';

const Test = () => {
  const pingBackend = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/test/ping", { withCredentials: true });
      alert(res.data.message);
    } catch (error) {
      console.error("Error pinging backend:", error);
      alert("Backend not reachable");
    }
  };

  return (
    <div>
      <h2>Test Backend Connection</h2>
      <button onClick={pingBackend}>Ping Backend</button>
    </div>
  );
};
export default Test;