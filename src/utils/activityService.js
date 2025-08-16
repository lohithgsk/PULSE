// Mocked recent activity service with simulated latency
export async function fetchRecentActivities() {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  // Simulate network delay 500-900ms
  await delay(500 + Math.random() * 400);
  // Return a stable mocked feed shape
  return [
    {
      id: 1,
      type: 'ai_summary',
      title: 'AI Health Summary Generated',
      description: 'Comprehensive health analysis completed with latest lab results',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
      storageType: 'ipfs',
    },
    {
      id: 2,
      type: 'consent_granted',
      title: 'Access Granted to Dr. Sarah Johnson',
      description: 'Cardiology consultation access approved for 30 days',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      storageType: 'blockchain',
    },
    {
      id: 3,
      type: 'record_accessed',
      title: 'Medical Records Viewed',
      description: 'Dr. Michael Chen accessed your recent blood work results',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      transactionHash: '0x567890abcdef1234567890abcdef1234567890ab',
      storageType: 'ipfs',
    },
    {
      id: 4,
      type: 'data_shared',
      title: 'Secure Link Created',
      description: 'Temporary access link generated for specialist consultation',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      transactionHash: '0xcdef1234567890abcdef1234567890abcdef1234',
      storageType: 'blockchain',
    },
  ];
}
