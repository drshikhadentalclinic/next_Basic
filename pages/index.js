import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

// Existing Next.js index.js file

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Dr. Shikha's Dental Clinic</h1>
        <p className="text-lg text-gray-600">Your smile, our passion – Welcome to TeethFix.in</p>
      </header>

      <main className="text-center max-w-xl">
        <h2 className="text-2xl font-semibold mb-4">Comprehensive Dental Care for All Ages</h2>
        <p className="mb-6">
          At Dr. Shikha's Dental Clinic, we are committed to delivering personalized and high-quality dental care in a comfortable and caring environment. Whether it's a routine checkup or a complete smile makeover, we’re here to help you shine.
        </p>
        <p className="mb-6">
          Visit us at <strong>TeethFix.in</strong> or reach out directly via WhatsApp below.
        </p>
        <a
          href="https://wa.me/919560222949"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
        >
          Chat with us on WhatsApp
        </a>
      </main>

      <footer className="mt-16 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Dr. Shikha's Dental Clinic. All rights reserved.
      </footer>
    </div>
  );
}
