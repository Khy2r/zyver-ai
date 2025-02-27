'use client';
import { useSession } from 'next-auth/react';
import ButtonLogin from '../../components/ButtonLogin.js';
import ButtonSignIn from '../../components/ButtonSignin.js';

const scrollToFAQ = () => {
  const faqSection = document.getElementById('faq');
  faqSection.scrollIntoView({ behavior: 'smooth' });
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-base-200 p-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4 items-center">
          <div className="text-sm">
            Welcome, <span className="font-bold">{session?.user?.name}</span>
          </div>
          <button className="btn btn-ghost">Settings</button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-100 rounded-lg p-6">
          <div className="stat-title">Total Outreach</div>
          <div className="stat-value">2,345</div>
          <div className="stat-desc">↗︎ 23% more than last week</div>
        </div>
        <div className="stat bg-base-100 rounded-lg p-6">
          <div className="stat-title">Reply Rate</div>
          <div className="stat-value">15.2%</div>
          <div className="stat-desc">↗︎ 4% more than last week</div>
        </div>
        <div className="stat bg-base-100 rounded-lg p-6">
          <div className="stat-title">Booked Calls</div>
          <div className="stat-value">89</div>
          <div className="stat-desc">↘︎ 9% less than last week</div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-base-100 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Outreach</th>
                <th>Replies</th>
                <th>Booked</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>25/03/2024</td>
                <td>John Smith</td>
                <td>100</td>
                <td>15</td>
                <td>5</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
