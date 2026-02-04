"use client";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from 'aws-amplify/auth'; // Import Auth helper
import "@aws-amplify/ui-react/styles.css";
import { useState } from "react";

// ⬇️ YOUR API URL
const API_URL = "https://w3mi2ernw3.execute-api.us-east-1.amazonaws.com/dev";

const formFields = {
  signIn: { username: { label: 'Email', placeholder: 'Enter your email' } },
  signUp: {
    username: { label: 'Email', placeholder: 'Enter your email', order: 1 },
    password: { label: 'Password', placeholder: 'Enter your password', order: 3 },
    confirm_password: { label: 'Confirm Password', order: 4 },
  },
};

// Internal Component to access the Hook
function StoreFront() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  const buyItem = async () => {
    setLoading(true);
    setOrderStatus("Processing...");

    try {
      // 🔐 1. GET THE TOKEN (The "ID Card")
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) {
        setOrderStatus("❌ Error: Not Authenticated");
        return;
      }

      // 🔐 2. SEND TOKEN IN HEADER
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": token // 👈 The Key to the Door!
        },
        body: JSON.stringify({ productId: "PROD-101", qty: 1 }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setOrderStatus(`✅ Success! Order ID: ${data.orderId}`);
      } else {
        setOrderStatus(`❌ Failed: ${data.message || "Unauthorized"}`);
      }
    } catch (error) {
      console.error(error);
      setOrderStatus("❌ Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-blue-500">CloudRetail 🛒</h1>
        <div className="flex items-center gap-4">
          <p>Welcome, {user?.signInDetails?.loginId}</p>
          <button onClick={signOut} className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
            Sign Out
          </button>
        </div>
      </div>

      <div className="mt-10 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-4">
        <div className="group rounded-lg border border-gray-700 p-6 transition-colors hover:border-blue-500 hover:bg-gray-800">
          <h2 className="mb-3 text-2xl font-semibold">Gaming Laptop 💻</h2>
          <p className="mb-4 text-sm opacity-50">High-performance rig.</p>
          
          <button
            onClick={buyItem}
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Ordering..." : "Buy Now ($1200)"}
          </button>

          {orderStatus && (
            <p className="mt-4 text-sm font-mono text-yellow-400">{orderStatus}</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Authenticator formFields={formFields}>
      <StoreFront />
    </Authenticator>
  );
}