"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";

export function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Login successful!");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="shadow-input w-full max-w-xs rounded-2xl bg-zinc-900 p-6 flex flex-col items-center">
        <h2 className="text-lg font-bold text-white text-center mb-1">Login</h2>
        <form className="w-full space-y-3" onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Username"
              className="flex-1 rounded-lg bg-zinc-800 p-2 text-white placeholder-zinc-500 text-xs"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg bg-zinc-800 p-2 text-white placeholder-zinc-500 text-xs"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg bg-zinc-800 p-2 text-white placeholder-zinc-500 text-xs"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 rounded-lg transition text-xs mt-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In →"}
          </button>
          {error && <div className="text-xs text-red-400 text-center mt-2">{error}</div>}
          {success && <div className="text-xs text-green-400 text-center mt-2">{success}</div>}
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
