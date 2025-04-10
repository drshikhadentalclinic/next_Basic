import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>teethfix.in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome to Dr. Shikha's Dental Clinic!" />
        <p className="description">
          Website Under Construction! For queries and more information, please contact us on WhatsApp: 9560222949 We appreciate your patience and look forward to serving you soon!
        </p>
      </main>

      <Footer />
    </div>
  )
}
