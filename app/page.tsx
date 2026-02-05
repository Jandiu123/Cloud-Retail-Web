"use client";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from 'aws-amplify/auth';
import "@aws-amplify/ui-react/styles.css";
import { useState } from "react";

// ⬇️ YOUR API URL
const API_URL = "https://w3mi2ernw3.execute-api.us-east-1.amazonaws.com/dev";

const formFields = {
  signIn: { username: { label: 'Email', placeholder: 'Enter your email' } },
  signUp: {
    username: { label: 'Email', placeholder: 'Enter your email', order: 1 },
    password: { label: 'Password', placeholder: 'Create a password', order: 3 },
    confirm_password: { label: 'Confirm Password', order: 4 },
  },
};

// --- COMPONENTS ---

// 1. Navbar
const Navbar = ({ user, signOut }: any) => (
  <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">CloudRetail</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            Signed in as <span className="font-medium text-gray-900">{user?.signInDetails?.loginId}</span>
          </span>
          <button 
            onClick={signOut} 
            className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </nav>
);

// 2. Product Card
const ProductCard = ({ title, price, image, features, onBuy, loading }: any) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="relative h-64 bg-gray-100">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900">
        In Stock
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">Professional Series</p>
        </div>
        <span className="text-2xl font-bold text-blue-600">${price}</span>
      </div>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onBuy}
        disabled={loading}
        className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          "Buy Now"
        )}
      </button>
    </div>
  </div>
);

// --- MAIN PAGE LOGIC ---

function StoreFront() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const buyItem = async () => {
    setLoading(true);
    setNotification(null);

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) throw new Error("Authentication failed. Please refresh.");

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": token 
        },
        body: JSON.stringify({ productId: "PROD-101", qty: 1 }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setNotification({ type: 'success', message: `Order Placed! ID: ${data.orderId}` });
      } else {
        throw new Error(data.message || "Order failed");
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Network Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
      <Navbar user={user} signOut={signOut} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50 ${
            notification.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-500 text-white'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-500' : 'bg-white/20'}`}>
              {notification.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
            <div>
              <p className="font-bold text-sm">{notification.type === 'success' ? 'Success' : 'Error'}</p>
              <p className="text-xs opacity-90">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-75">✕</button>
          </div>
        )}

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            The Future of <span className="text-blue-600">Cloud Retail</span>.
          </h1>
          <p className="text-lg text-gray-600">
            Experience the power of a fully distributed, event-driven architecture. 
            Powered by AWS Lambda, DynamoDB, and EventBridge.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Main Product (The Real One) */}
          <ProductCard 
            title="CloudBook Pro X1"
            price="1,200"
            image="https://images.unsplash.com/photo-1517336714731-489689fd1ca4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            features={[
              "M2 Ultra Chip Processor",
              "32GB Unified Memory",
              "1TB NVMe SSD Storage",
              "Event-Driven Architecture Included"
            ]}
            onBuy={buyItem}
            loading={loading}
          />

          {/* Dummy Products (Visual Only) */}
          <div className="opacity-60 pointer-events-none relative">
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">Coming Soon</span>
            </div>
            <ProductCard 
              title="DevStation Studio"
              price="2,400"
              image="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              features={["Dual 4K Monitor Support", "Liquid Cooling System", "Silent Operation"]}
              onBuy={() => {}}
              loading={false}
            />
          </div>

          <div className="opacity-60 pointer-events-none relative">
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">Sold Out</span>
            </div>
            <ProductCard 
              title="Server Rack Mini"
              price="899"
              image="https://images.unsplash.com/photo-1558494949-ef526b01201b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              features={["Compact Form Factor", "10GbE Networking", "Redundant Power"]}
              onBuy={() => {}}
              loading={false}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
          <p>© 2026 CloudRetail Inc. Built on AWS Serverless.</p>
        </div>

      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Authenticator formFields={formFields} hideSignUp={false}>
      <StoreFront />
    </Authenticator>
  );
}