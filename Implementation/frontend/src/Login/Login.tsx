import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "stores/AuthStore";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        username: username,
        password: password,
      });

      const { token, role } = response.data;
      localStorage.setItem("authToken", token);

      const whoamiResponse = await axios.get("http://localhost:3001/whoami", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userProfile = whoamiResponse.data;
      console.log("WHOAMI payload:", userProfile);
      useAuthStore.getState().setSession(token, role, userProfile.username);

      // 👇 Redirect based on role
      if (role === "teacher") {
        navigate("/dashboard");
      } else if (role === "student") {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Log In
          </button>
        </form>
      </div>
      <Link
        to="../"
        className="px-4 py-1 mt-4 text-sm text-white bg-gray-400 rounded hover:bg-gray-500"
      >
        Back to drum sampler
      </Link>
    </div>
  );
};

export default LoginPage;
