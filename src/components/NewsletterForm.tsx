'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-neutral-900 border border-seed/40 text-seed text-xs font-semibold">
        <Check className="w-4 h-4 text-seed" />
        <span>You are subscribed! Welcome to SEED.</span>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-2"
    >
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-5 py-3 text-xs bg-neutral-900 border border-neutral-700 rounded-full focus:outline-none focus:border-seed text-white placeholder-neutral-500 transition-colors"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-neutral-200 text-black rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap active:scale-95"
      >
        Submit
      </button>
    </form>
  );
}
