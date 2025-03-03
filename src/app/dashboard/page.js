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
  const [goals, setGoals] = useState({
    outreach: { target: 500, current: 350 },
    replies: { target: 75, current: 52 },
    booked: { target: 25, current: 18 }
  });
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [discordConnected, setDiscordConnected] = useState(false);
  const [discordChannelId, setDiscordChannelId] = useState('');
  const [discordVerifying, setDiscordVerifying] = useState(false);
  const [discordVerified, setDiscordVerified] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [googleVerifying, setGoogleVerifying] = useState(false);
  const [googleVerified, setGoogleVerified] = useState(false);
  const [reportFormat, setReportFormat] = useState('');
  const [processingSchedule, setProcessingSchedule] = useState('real-time');
  const [sendNotifications, setSendNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [testReport, setTestReport] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState(null);
  const [showTestSection, setShowTestSection] = useState(false);
  const [processError, setProcessError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
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

  useEffect(() => {
    // Simulate getting notifications
    const fakeNotifications = [
      { id: 1, text: "John added a new report", time: "2 min ago", read: false },
      { id: 2, text: "Sarah booked 3 new calls", time: "1 hour ago", read: false },
      { id: 3, text: "Weekly report is ready", time: "5 hours ago", read: true }
    ];
    
    setNotifications(fakeNotifications);
    setHasUnread(fakeNotifications.some(n => !n.read));
    
    // Later you'd replace this with a real-time connection
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

  // Update the Discord verification function
  const verifyDiscordChannel = async () => {
    setDiscordVerifying(true);
    try {
      const response = await fetch('/api/discord/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          channelId: discordChannelId,
          token: 'demo-token' // In production, use actual token
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDiscordVerified(true);
        // You could store additional data like channelName if needed
      } else {
        alert(`Verification failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Discord verification error:", error);
      alert("Failed to verify Discord channel. Please try again.");
    } finally {
      setDiscordVerifying(false);
    }
  };

  // Update the Google Sheets verification function
  const verifyGoogleSheet = async () => {
    setGoogleVerifying(true);
    try {
      const response = await fetch('/api/sheets/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sheetUrl: googleSheetUrl
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGoogleVerified(true);
        // If the API returns available sheets, you could populate a dropdown
        if (data.availableSheets && data.availableSheets.length > 0) {
          setSheetName(data.availableSheets[0]);
        }
      } else {
        alert(`Verification failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Google Sheets verification error:", error);
      alert("Failed to verify Google Sheet. Please try again.");
    } finally {
      setGoogleVerifying(false);
    }
  };

  // Update the process report function
  const processReport = async () => {
    setIsProcessing(true);
    setProcessedResult(null);
    
    try {
      console.log("Processing report:", testReport);
      
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report: testReport }),
      });
      
      const data = await response.json();
      
      console.log("Processed data:", data);
      
      if (data.error) {
        setToastMessage(`Error: ${data.error}`);
        setShowToast(true);
      } else {
        // Ensure all required fields are present and in the correct format
        const formattedResult = {
          date: data.date || new Date().toLocaleDateString(),
          name: data.name || 'Unknown',
          outreach_sent: parseInt(data.outreach_sent) || 0,
          replies: parseInt(data.replies) || 0,
          follow_ups: parseInt(data.follow_ups) || 0,
          proposed_calls: parseInt(data.proposed_calls) || 0,
          booked_calls: parseInt(data.booked_calls) || 0,
          reply_rate: data.reply_rate || 0,
          booking_rate: data.booking_rate || 0
        };
        
        console.log("Formatted result:", formattedResult);
        setProcessedResult(formattedResult);
        setToastMessage('Report processed successfully!');
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error processing report:", error);
      setToastMessage('Failed to process report: ' + (error.message || 'Unknown error'));
      setShowToast(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Update the saveToGoogleSheets function
  const saveToGoogleSheets = async () => {
    if (!processedResult || !googleVerified) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Saving to Google Sheets with debug approach...");
      console.log("Original processed result:", processedResult);
      
      // Format the data exactly like in the debug function
      const formattedData = {
        date: processedResult.date || new Date().toLocaleDateString(),
        name: processedResult.name || 'Unknown',
        outreach_sent: parseInt(processedResult.outreach_sent) || 0,
        replies: parseInt(processedResult.replies) || 0,
        follow_ups: parseInt(processedResult.follow_ups) || 0,
        proposed_calls: parseInt(processedResult.proposed_calls) || 0,
        booked_calls: parseInt(processedResult.booked_calls) || 0
      };
      
      console.log("Formatted data:", formattedData);
      
      const spreadsheetId = googleSheetUrl.split('/d/')[1]?.split('/')[0];
      console.log("Spreadsheet ID:", spreadsheetId);
      console.log("Sheet name:", sheetName || 'Sheet1');
      
      // Use the debug endpoint since we know it works
      const response = await fetch('/api/sheets/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: formattedData,
          spreadsheetId: spreadsheetId,
          sheetName: sheetName || 'Sheet1'
        }),
      });
      
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", e);
        alert('Failed to parse server response');
        return;
      }
      
      if (data.success) {
        setToastMessage(`Report saved to Google Sheets! Updated range: ${data.updatedRange}`);
        setShowToast(true);
      } else {
        setToastMessage(`Failed to save: ${data.error}`);
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error saving to sheets:", error);
      setToastMessage('Failed to save to Google Sheets: ' + (error.message || 'Unknown error'));
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Add this function to test the Google Sheets API
  const testGoogleSheets = async () => {
    try {
      const response = await fetch('/api/sheets/test');
      const data = await response.json();
      
      if (data.success) {
        alert(`Google Sheets API is working! Spreadsheet: ${data.spreadsheetTitle}`);
      } else {
        alert(`Test failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Test error:", error);
      alert('Test failed: ' + (error.message || 'Unknown error'));
    }
  };

  // Update the debugGoogleSheets function
  const debugGoogleSheets = async () => {
    try {
      console.log("Debugging Google Sheets integration...");
      
      // Use a test data object if no processed result is available
      const testData = processedResult || {
        date: new Date().toLocaleDateString(),
        name: "Test User",
        outreach_sent: 100,
        replies: 20,
        follow_ups: 30,
        proposed_calls: 10,
        booked_calls: 5
      };
      
      console.log("Test data:", testData);
      
      // Use a test spreadsheet ID if none is provided
      const spreadsheetId = googleSheetUrl ? 
        googleSheetUrl.split('/d/')[1]?.split('/')[0] : 
        "1xL8HDCKSPiCzj57urjZigVPGWtNU7YTb7dDnxUj7Hl0"; // Replace with your test spreadsheet ID
      
      console.log("Spreadsheet ID:", spreadsheetId);
      console.log("Sheet name:", sheetName || 'Sheet1');
      
      const response = await fetch('/api/sheets/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: testData,
          spreadsheetId: spreadsheetId,
          sheetName: sheetName || 'Sheet1'
        }),
      });
      
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", e);
        alert('Failed to parse server response');
        return;
      }
      
      if (data.success) {
        alert(`Debug successful! Updated range: ${data.updatedRange}`);
      } else {
        alert(`Debug failed: ${data.error}\n\nDetails: ${JSON.stringify(data.details)}`);
      }
    } catch (error) {
      console.error("Debug error:", error);
      alert('Debug failed: ' + (error.message || 'Unknown error'));
    }
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
            className={`tab ${activeTab === 'integrations' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            Integrations
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

            {/* Monthly Goals */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4">Monthly Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Outreach</span>
                    <span>{goals.outreach.current}/{goals.outreach.target}</span>
                  </div>
                  <progress 
                    className="progress progress-primary w-full" 
                    value={goals.outreach.current} 
                    max={goals.outreach.target}
                  ></progress>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Replies</span>
                    <span>{goals.replies.current}/{goals.replies.target}</span>
                  </div>
                  <progress 
                    className="progress progress-secondary w-full" 
                    value={goals.replies.current} 
                    max={goals.replies.target}
                  ></progress>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Booked Calls</span>
                    <span>{goals.booked.current}/{goals.booked.target}</span>
                  </div>
                  <progress 
                    className="progress progress-accent w-full" 
                    value={goals.booked.current} 
                    max={goals.booked.target}
                  ></progress>
                </div>
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

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Connect Your Services</h2>
            
            {/* Connection Status Dashboard */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Connection Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Discord Status */}
                <div className="bg-base-200 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${discordConnected ? 'bg-success' : 'bg-error'}`}></div>
                    <h4 className="font-semibold">Discord</h4>
                  </div>
                  <p className="text-sm mb-2">
                    {discordConnected 
                      ? 'Connected to Discord' 
                      : 'Not connected to Discord'}
                  </p>
                  {discordConnected && (
                    <div className="text-xs flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${discordVerified ? 'bg-success' : 'bg-warning'}`}></div>
                      <span>
                        {discordVerified 
                          ? `Channel verified: ${discordChannelId}` 
                          : 'Channel not verified'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Google Sheets Status */}
                <div className="bg-base-200 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${googleConnected ? 'bg-success' : 'bg-error'}`}></div>
                    <h4 className="font-semibold">Google Sheets</h4>
                  </div>
                  <p className="text-sm mb-2">
                    {googleConnected 
                      ? 'Connected to Google' 
                      : 'Not connected to Google Sheets'}
                  </p>
                  {googleConnected && (
                    <div className="text-xs flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${googleVerified ? 'bg-success' : 'bg-warning'}`}></div>
                      <span>
                        {googleVerified 
                          ? `Sheet verified: ${sheetName || 'Default'}` 
                          : 'Sheet not verified'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* AI Configuration Status */}
                <div className="bg-base-200 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${configSaved ? 'bg-success' : 'bg-warning'}`}></div>
                    <h4 className="font-semibold">AI Configuration</h4>
                  </div>
                  <p className="text-sm mb-2">
                    {configSaved 
                      ? 'Configuration saved' 
                      : 'Configuration not saved'}
                  </p>
                  {reportFormat && (
                    <div className="text-xs">
                      Format: {reportFormat === 'standard' ? 'Standard' : 'Custom'}<br />
                      Schedule: {processingSchedule === 'real-time' ? 'Real-time' : 
                                processingSchedule === 'hourly' ? 'Hourly' : 
                                processingSchedule === 'daily' ? 'Daily' : 'Weekly'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Overall Status */}
              <div className="mt-6 p-3 rounded-lg border border-base-300">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    (discordConnected && discordVerified && googleConnected && googleVerified && configSaved) 
                      ? 'bg-success' 
                      : 'bg-warning'
                  }`}></div>
                  <div>
                    <h4 className="font-semibold">System Status</h4>
                    <p className="text-sm">
                      {(discordConnected && discordVerified && googleConnected && googleVerified && configSaved)
                        ? 'All systems connected and ready' 
                        : 'Setup incomplete - finish configuration to enable processing'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Discord Connection */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#5865F2] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 127.14 96.36" fill="#FFFFFF">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Discord</h3>
                    <p className="text-sm opacity-70">Connect to your Discord server to process sales reports</p>
                  </div>
                </div>
                <button 
                  className={`btn ${discordConnected ? 'btn-success' : 'btn-primary'}`}
                  onClick={() => {
                    // In a real app, this would redirect to Discord OAuth
                    setDiscordConnected(!discordConnected);
                  }}
                >
                  {discordConnected ? 'Connected ✓' : 'Connect Discord'}
                </button>
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Discord Channel ID</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter channel ID (e.g., 123456789012345678)" 
                    className={`input input-bordered w-full ${discordVerified ? 'input-success' : ''}`}
                    value={discordChannelId}
                    onChange={(e) => setDiscordChannelId(e.target.value)}
                    disabled={!discordConnected}
                  />
                  <button 
                    className={`btn ${discordVerified ? 'btn-success' : ''}`}
                    onClick={verifyDiscordChannel}
                    disabled={!discordConnected || !discordChannelId || discordVerifying}
                  >
                    {discordVerifying ? 
                      <span className="loading loading-spinner loading-xs"></span> : 
                      discordVerified ? 'Verified ✓' : 'Verify'}
                  </button>
                </div>
                <label className="label">
                  <span className="label-text-alt">The channel where your sales team posts their reports</span>
                </label>
              </div>
            </div>
            
            {/* Google Sheets Connection */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0F9D58] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
                      <path d="M19.5,3H14.5V7H19.5V3M14.5,9H19.5V13H14.5V9M9.5,3H4.5V13H9.5V3M9.5,15H4.5V19H9.5V15M19.5,15H14.5V19H19.5V15M12,3H10.5V7H12V3M12,9H10.5V13H12V9M12,15H10.5V19H12V15Z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Google Sheets</h3>
                    <p className="text-sm opacity-70">Connect to Google Sheets to organize your data</p>
                  </div>
                </div>
                <button 
                  className={`btn ${googleConnected ? 'btn-success' : 'btn-primary'}`}
                  onClick={() => {
                    // In a real app, this would redirect to Google OAuth
                    setGoogleConnected(!googleConnected);
                  }}
                >
                  {googleConnected ? 'Connected ✓' : 'Connect Google'}
                </button>
              </div>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Google Sheet URL</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="https://docs.google.com/spreadsheets/d/..." 
                    className={`input input-bordered w-full ${googleVerified ? 'input-success' : ''}`}
                    value={googleSheetUrl}
                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                    disabled={!googleConnected}
                  />
                  <button 
                    className={`btn ${googleVerified ? 'btn-success' : ''}`}
                    onClick={verifyGoogleSheet}
                    disabled={!googleConnected || !googleSheetUrl || googleVerifying}
                  >
                    {googleVerifying ? 
                      <span className="loading loading-spinner loading-xs"></span> : 
                      googleVerified ? 'Verified ✓' : 'Verify'}
                  </button>
                </div>
                <label className="label">
                  <span className="label-text-alt">The Google Sheet where your data will be organized</span>
                </label>
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Sheet Name</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., Sales Reports" 
                  className="input input-bordered w-full"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  disabled={!googleConnected || !googleVerified}
                />
                <label className="label">
                  <span className="label-text-alt">The specific sheet tab to use</span>
                </label>
              </div>
            </div>
            
            {/* AI Configuration */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">AI Configuration</h3>
              <p className="mb-4">Configure how the AI processes your sales reports</p>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Report Format</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                  disabled={!discordVerified || !googleVerified}
                >
                  <option value="" disabled>Select a format</option>
                  <option value="standard">Standard Format</option>
                  <option value="custom">Custom Format</option>
                </select>
              </div>
              
              {reportFormat === 'custom' && (
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text">Custom Format Template</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered h-24"
                    placeholder="Example: Name: {name}, Outreach: {outreach}, Replies: {replies}, Booked: {booked}"
                  ></textarea>
                  <label className="label">
                    <span className="label-text-alt">Use {variable} to define fields to extract</span>
                  </label>
                </div>
              )}
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Processing Schedule</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={processingSchedule}
                  onChange={(e) => setProcessingSchedule(e.target.value)}
                  disabled={!discordVerified || !googleVerified}
                >
                  <option value="real-time">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary"
                    checked={sendNotifications}
                    onChange={(e) => setSendNotifications(e.target.checked)}
                    disabled={!discordVerified || !googleVerified}
                  />
                  <span className="label-text">Send notifications when reports are processed</span>
                </label>
              </div>
              
              <div className="mt-6">
                <button 
                  className={`btn ${configSaved ? 'btn-success' : 'btn-primary'} mr-2`}
                  onClick={() => {
                    setIsSaving(true);
                    // Simulate saving
                    setTimeout(() => {
                      setConfigSaved(true);
                      setIsSaving(false);
                      
                      // Reset success message after 3 seconds
                      setTimeout(() => {
                        setConfigSaved(false);
                      }, 3000);
                    }, 1500);
                  }}
                  disabled={!discordVerified || !googleVerified || !reportFormat || isSaving}
                >
                  {isSaving ? 
                    <><span className="loading loading-spinner loading-xs mr-2"></span>Saving...</> : 
                    configSaved ? 'Saved Successfully ✓' : 'Save Configuration'}
                </button>
                
                {configSaved && (
                  <span className="text-success ml-2">
                    Configuration saved successfully!
                  </span>
                )}
              </div>

              {/* Test AI Processing */}
              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">Test AI Processing</h4>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => setShowTestSection(!showTestSection)}
                  >
                    {showTestSection ? 'Hide Test' : 'Show Test'}
                  </button>
                </div>
                
                {showTestSection && (
                  <>
                    <p className="mb-4 text-sm">
                      Paste a sample sales report to see how the AI would process it.
                    </p>
                    
                    <div className="flex justify-end mb-2">
                      <button 
                        className="btn btn-xs btn-outline"
                        onClick={() => {
                          setTestReport(
                            "Sales Report - April 5, 2024\n" +
                            "Name: John Smith\n" +
                            "Outreach: 120\n" +
                            "Replies: 18\n" +
                            "Booked: 6\n" +
                            "Notes: Had a great day with several promising leads!"
                          );
                        }}
                      >
                        Load Sample Report
                      </button>
                    </div>
                    
                    <div className="form-control w-full mb-4">
                      <label className="label">
                        <span className="label-text">Sample Report</span>
                      </label>
                      <textarea 
                        className="textarea textarea-bordered h-32"
                        placeholder="Paste a sample report here..."
                        value={testReport}
                        onChange={(e) => setTestReport(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="flex gap-2 mb-6">
                      <button 
                        className="btn btn-primary"
                        onClick={processReport}
                        disabled={!testReport || isProcessing}
                      >
                        {isProcessing ? 
                          <><span className="loading loading-spinner loading-xs mr-2"></span>Processing...</> : 
                          'Process Report'}
                      </button>
                      
                      <button 
                        className="btn btn-outline"
                        onClick={() => setTestReport('')}
                        disabled={!testReport || isProcessing}
                      >
                        Clear
                      </button>
                    </div>
                    
                    {/* Error display */}
                    {processError && (
                      <div className="bg-error text-error-content p-4 rounded-lg mb-6">
                        <h5 className="font-semibold mb-2">Error Processing Report:</h5>
                        <p>{processError}</p>
                      </div>
                    )}
                    
                    {/* Results display */}
                    {processedResult && (
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">Processed Result:</h5>
                        <div className="overflow-x-auto">
                          <table className="table table-sm w-full">
                            <thead>
                              <tr>
                                <th>Field</th>
                                <th>Extracted Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(processedResult).map(([key, value]) => (
                                <tr key={key}>
                                  <td className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                                  <td>{value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-success flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Successfully processed
                          </span>
                          <div className="flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => {
                                // Copy to clipboard
                                const text = Object.entries(processedResult)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join('\n');
                                navigator.clipboard.writeText(text);
                                alert('Copied to clipboard!');
                              }}
                            >
                              Copy
                            </button>
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={saveToGoogleSheets}
                              disabled={!googleVerified || !processedResult || isSaving}
                            >
                              {isSaving ? 
                                <><span className="loading loading-spinner loading-xs mr-2"></span>Saving...</> : 
                                'Save to Sheet'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Test Google Sheets API */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Test Google Sheets API</h4>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={testGoogleSheets}
                >
                  Test Google Sheets API
                </button>
              </div>
            </div>

            {/* Debug Google Sheets */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Debug Google Sheets</h4>
                <button 
                  className="btn btn-sm btn-warning"
                  onClick={debugGoogleSheets}
                >
                  Debug Google Sheets
                </button>
              </div>
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
