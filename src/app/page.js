'use client';

import Navbar from '../components/Navbar';
import ButtonLogin from '../components/ButtonLogin';

export default function Home() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-base-200">
      <Navbar scrollToSection={scrollToSection} />
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl space-y-8">
            <h1 className="text-5xl font-bold mb-8">
              Track Your Sales Team's Success
            </h1>
            <p className="text-xl mb-12">
              Automatically process sales reports from Discord and organize them into Google Sheets. 
              Get instant insights into your team's performance.
            </p>
            <div className="mt-8">
              <ButtonLogin className="text-base px-8 hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="card-body">
                <h3 className="card-title">Automated Processing</h3>
                <p>Instantly process sales reports from Discord messages into organized data.</p>
              </div>
            </div>
            <div className="card bg-base-200 hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="card-body">
                <h3 className="card-title">Smart Analytics</h3>
                <p>Get instant insights with automatically calculated metrics and trends.</p>
              </div>
            </div>
            <div className="card bg-base-200 hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="card-body">
                <h3 className="card-title">Team Dashboard</h3>
                <p>View your team's performance at a glance with our intuitive dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 bg-base-200 scroll-mt-20 animate-fadeIn">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="card-body">
                <h3 className="card-title">Starter</h3>
                <p className="text-3xl font-bold">$29/mo</p>
                <ul className="mt-4">
                  <li>✓ Up to 5 team members</li>
                  <li>✓ Basic analytics</li>
                  <li>✓ 30-day history</li>
                </ul>
                <div className="card-actions justify-end mt-4">
                  <button className="btn bg-primary text-primary-content group-hover:bg-primary-content group-hover:text-primary transition-colors">Get Started</button>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="card-body">
                <h3 className="card-title">Pro</h3>
                <p className="text-3xl font-bold">$49/mo</p>
                <ul className="mt-4">
                  <li>✓ Up to 15 team members</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ 90-day history</li>
                </ul>
                <div className="card-actions justify-end mt-4">
                  <button className="btn bg-primary text-primary-content group-hover:bg-primary-content group-hover:text-primary transition-colors">Get Started</button>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 hover:bg-primary hover:text-primary-content transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="card-body">
                <h3 className="card-title">Enterprise</h3>
                <p className="text-3xl font-bold">$99/mo</p>
                <ul className="mt-4">
                  <li>✓ Unlimited team members</li>
                  <li>✓ Custom analytics</li>
                  <li>✓ Unlimited history</li>
                </ul>
                <div className="card-actions justify-end mt-4">
                  <button className="btn bg-primary text-primary-content group-hover:bg-primary-content group-hover:text-primary transition-colors">Get Started</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div 
        id="faq" 
        className="py-20 bg-base-100 scroll-mt-20 animate-fadeIn"
      >
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-bold">
                How does the bot work?
              </div>
              <div className="collapse-content">
                <p>Our bot automatically processes sales reports posted in your Discord channel and organizes them into a Google Sheet. It calculates key metrics like reply rates and booking rates automatically.</p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-bold">
                How do I set up the bot?
              </div>
              <div className="collapse-content">
                <p>Simply connect your Discord server, select a channel for reports, and link your Google Sheet. Our setup wizard will guide you through the process in minutes.</p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-bold">
                What metrics does it track?
              </div>
              <div className="collapse-content">
                <p>The bot tracks outreach sent, replies received, follow-ups, proposed calls, booked calls, and automatically calculates reply rates and booking rates. Weekly summaries are provided automatically.</p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-bold">
                Is my data secure?
              </div>
              <div className="collapse-content">
                <p>Yes! We only process the reports posted in your designated channel and only write to your specified Google Sheet. We don't store any of your data on our servers.</p>
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
