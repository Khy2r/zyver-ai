'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const scrollToFAQ = () => {
  const faqSection = document.getElementById('faq');
  faqSection.scrollIntoView({ behavior: 'smooth' });
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch reports data
  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchReports = async () => {
      try {
        // Simulate API call with mock data
        setTimeout(() => {
          setReports([
            { id: 1, date: '2024-03-25', name: 'John Smith', outreach: 100, replies: 15, booked: 5 },
            { id: 2, date: '2024-03-24', name: 'Sarah Johnson', outreach: 85, replies: 12, booked: 4 },
            { id: 3, date: '2024-03-23', name: 'Michael Brown', outreach: 120, replies: 18, booked: 7 },
            { id: 4, date: '2024-03-22', name: 'Emily Davis', outreach: 95, replies: 14, booked: 6 },
            { id: 5, date: '2024-03-21', name: 'David Wilson', outreach: 110, replies: 16, booked: 5 },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Prepare chart data
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Outreach',
        data: [65, 78, 90, 85, 95, 88, 100],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Replies',
        data: [15, 12, 18, 14, 16, 15, 20],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Booked',
        data: [5, 4, 7, 6, 5, 6, 8],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const barChartData = {
    labels: ['John', 'Sarah', 'Michael', 'Emily', 'David'],
    datasets: [
      {
        label: 'Outreach',
        data: [100, 85, 120, 95, 110],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Replies',
        data: [15, 12, 18, 14, 16],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Booked',
        data: [5, 4, 7, 6, 5],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-base-200">
      {/* Dashboard Header */}
      <div className="bg-base-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Zyver Dashboard</h1>
            <div className="flex gap-4 items-center">
              <div className="text-sm hidden md:block">
                Welcome, <span className="font-bold">{session?.user?.name}</span>
              </div>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt={session.user.name} />
                    ) : (
                      <div className="bg-primary text-white flex items-center justify-center h-full text-xl">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li><a>Profile</a></li>
                  <li><a>Settings</a></li>
                  <li><a>Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-8 bg-base-100 p-1">
          <button 
            className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'reports' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
          <button 
            className={`tab ${activeTab === 'team' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            Team
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="stat bg-base-100 rounded-lg p-6 shadow-md">
                <div className="stat-figure text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="stat-title">Total Outreach</div>
                <div className="stat-value">2,345</div>
                <div className="stat-desc text-success">↗︎ 23% more than last week</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-6 shadow-md">
                <div className="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <div className="stat-title">Reply Rate</div>
                <div className="stat-value">15.2%</div>
                <div className="stat-desc text-success">↗︎ 4% more than last week</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-6 shadow-md">
                <div className="stat-figure text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                </div>
                <div className="stat-title">Booked Calls</div>
                <div className="stat-value">89</div>
                <div className="stat-desc text-error">↘︎ 9% less than last week</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-base-100 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
                <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
              <div className="bg-base-100 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
                <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Activity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>25/03/2024</td>
                      <td>John Smith</td>
                      <td>Added 100 new contacts</td>
                      <td><span className="badge badge-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>24/03/2024</td>
                      <td>Sarah Johnson</td>
                      <td>Booked 4 new calls</td>
                      <td><span className="badge badge-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>23/03/2024</td>
                      <td>Michael Brown</td>
                      <td>Sent 120 outreach messages</td>
                      <td><span className="badge badge-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>22/03/2024</td>
                      <td>Emily Davis</td>
                      <td>Updated campaign settings</td>
                      <td><span className="badge badge-info">In Progress</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-base-100 rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Sales Reports</h3>
              <button className="btn btn-primary btn-sm">Export CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Outreach</th>
                    <th>Replies</th>
                    <th>Booked</th>
                    <th>Reply Rate</th>
                    <th>Booking Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id}>
                      <td>{report.date}</td>
                      <td>{report.name}</td>
                      <td>{report.outreach}</td>
                      <td>{report.replies}</td>
                      <td>{report.booked}</td>
                      <td>{((report.replies / report.outreach) * 100).toFixed(1)}%</td>
                      <td>{((report.booked / report.replies) * 100).toFixed(1)}%</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-ghost btn-xs">View</button>
                          <button className="btn btn-ghost btn-xs">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="bg-base-100 rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <button className="btn btn-primary btn-sm">Add Member</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Team Member Cards */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <div className="bg-primary text-white flex items-center justify-center h-full text-xl">JS</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="card-title">John Smith</h3>
                      <p className="text-sm">Sales Representative</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance</span>
                      <span>85%</span>
                    </div>
                    <progress className="progress progress-primary" value="85" max="100"></progress>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-ghost btn-sm">View</button>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <div className="bg-secondary text-white flex items-center justify-center h-full text-xl">SJ</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="card-title">Sarah Johnson</h3>
                      <p className="text-sm">Sales Manager</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance</span>
                      <span>92%</span>
                    </div>
                    <progress className="progress progress-secondary" value="92" max="100"></progress>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-ghost btn-sm">View</button>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <div className="bg-accent text-white flex items-center justify-center h-full text-xl">MB</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="card-title">Michael Brown</h3>
                      <p className="text-sm">Sales Representative</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance</span>
                      <span>78%</span>
                    </div>
                    <progress className="progress progress-accent" value="78" max="100"></progress>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-ghost btn-sm">View</button>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-base-100 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-6">Account Settings</h3>
            
            <div className="form-control w-full max-w-md mb-6">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input type="text" placeholder="Your name" className="input input-bordered w-full" defaultValue={session?.user?.name} />
            </div>
            
            <div className="form-control w-full max-w-md mb-6">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="Your email" className="input input-bordered w-full" defaultValue={session?.user?.email} readOnly />
            </div>
            
            <div className="form-control w-full max-w-md mb-6">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
            </div>
            
            <div className="form-control w-full max-w-md mb-6">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
            </div>
            
            <div className="form-control w-full max-w-md mb-6">
              <label className="label">
                <span className="label-text">Notification Preferences</span>
              </label>
              <div className="flex flex-col gap-2 mt-2">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                    <span className="label-text">Email notifications</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                    <span className="label-text">Weekly report summary</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" className="checkbox checkbox-primary" />
                    <span className="label-text">Team activity notifications</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button className="btn btn-primary">Save Changes</button>
              <button className="btn btn-outline">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
