"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// 1. Update formFields to include 'phone_number'
const formFields = {
  signIn: {
    username: {
      label: 'Email',
      placeholder: 'Enter your email',
    },
  },
  signUp: {
    username: {
      label: 'Email',
      placeholder: 'Enter your email',
      order: 1,
    },
    // New Field Added Here 👇
    phone_number: {
      label: 'Phone Number',
      placeholder: '+94712345678', // Example format for Sri Lanka
      required: true,
      order: 2,
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
      order: 3,
    },
    confirm_password: {
      label: 'Confirm Password',
      order: 4,
    },
  },
};

export default function Home() {
  return (
    <Authenticator formFields={formFields}>
      {({ signOut, user }) => (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            <h1 className="text-4xl font-bold text-blue-500">
              CloudRetail 🛒
            </h1>
            <div className="flex items-center gap-4">
              <p>Welcome, {user?.signInDetails?.loginId}</p>
              <button
                onClick={signOut}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="mt-10 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-4">
            <div className="group rounded-lg border border-gray-700 px-5 py-4 transition-colors hover:border-blue-500 hover:bg-gray-800">
              <h2 className="mb-3 text-2xl font-semibold">Shop Now 📦</h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">
                Browse our global inventory.
              </p>
            </div>
          </div>
        </main>
      )}
    </Authenticator>
  );
}