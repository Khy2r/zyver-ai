'use client';
import ButtonLogin from '../components/ButtonLogin.js';
import ButtonSignIn from '../components/ButtonSignin.js';

const scrollToFAQ = () => {
  const faqSection = document.getElementById('faq');
  faqSection.scrollIntoView({ behavior: 'smooth' });
}

export default function Home() {
  return (
    <main className="min-h-screen bg-base-200">

      {/* Navigation Bar */}
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="text-3xl font-bold">ZyverAI</a>
        </div>
        <div className="navbar-center flex gap-4">
          <a className="btn btn-ghost text-xl">Pricing</a>
          <button 
            onClick={scrollToFAQ}
            className="btn btn-ghost text-xl"
          >
            FAQ
          </button>
        </div>
        <div className="navbar-end gap-4">
          <ButtonSignIn />
          <ButtonLogin />
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Track Sales Success Automatically</h1>
            <p className="py-6">
              From Discord to spreadsheet in seconds. Automated report processing for sales teams.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Easy Setup</h3>
                <p>Connect your Discord server and Google Sheet in minutes.</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Automated Reports</h3>
                <p>Automatically process and organize your team's reports.</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Weekly Summaries</h3>
                <p>Get automated weekly performance summaries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-20 bg-base-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="collapse collapse-arrow bg-base-200 hover:bg-base-300 transition-all duration-200 hover:shadow-md">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                How does the bot work?
              </div>
              <div className="collapse-content">
                <p>Our bot automatically processes sales reports posted in your Discord channel and organizes them into a Google Sheet. It calculates key metrics like reply rates and booking rates automatically.</p>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="collapse collapse-arrow bg-base-200 hover:bg-base-300 transition-all duration-200 hover:shadow-md">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                How do I set up the bot?
              </div>
              <div className="collapse-content">
                <p>Simply connect your Discord server, select a channel for reports, and link your Google Sheet. Our setup wizard will guide you through the process in minutes.</p>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="collapse collapse-arrow bg-base-200 hover:bg-base-300 transition-all duration-200 hover:shadow-md">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                What metrics does it track?
              </div>
              <div className="collapse-content">
                <p>The bot tracks outreach sent, replies received, follow-ups, proposed calls, booked calls, and automatically calculates reply rates and booking rates. Weekly summaries are provided automatically.</p>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="collapse collapse-arrow bg-base-200 hover:bg-base-300 transition-all duration-200 hover:shadow-md">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                Is my data secure?
              </div>
              <div className="collapse-content">
                <p>Yes! We only process the reports posted in your designated channel and only write to your specified Google Sheet. We don't store any of your data on our servers!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-base-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <ButtonLogin />
        </div>
      </div>
    </main>
  );
}
