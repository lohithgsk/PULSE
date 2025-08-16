import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ChatInterface from './components/ChatInterface';
import AIPermissionsPanel from './components/AIPermissionsPanel';
import HealthSummaryCard from './components/HealthSummaryCard';
import AnalysisHistory from './components/AnalysisHistory';
import ProcessingIndicator from './components/ProcessingIndicator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useI18n } from '../../i18n/I18nProvider';

const AIHealthAssistantAnalysis = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('chat');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('analyzing');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [walletConnected, setWalletConnected] = useState(true);
  const [currentNetwork, setCurrentNetwork] = useState('Sepolia');
  // Header is provided by the global AppLayout

  // Mock data for chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: `Hello! I'm your AI Health Assistant. I can help you understand your medical records, provide health insights, and generate summaries for your healthcare providers.\n\nWhat would you like to know about your health today?`,
      timestamp: new Date(Date.now() - 300000),
      dataAccess: false,
      confidence: 0.95,
      sources: [],
      encrypted: true,
      blockchainLogged: true
    }
  ]);

  // Mock data for AI permissions
  const [aiPermissions, setAiPermissions] = useState({
    medical_records: true,
    lab_results: true,
    diagnoses: true,
    treatments: false,
    imaging: true,
    medications: true,
    current_meds: true,
    med_history: true,
    allergies: true,
    vitals: true,
    blood_pressure: true,
    heart_rate: true,
    weight: false,
    lifestyle: false,
    exercise: false,
    diet: false,
    sleep: false
  });

  // Mock data for health summaries
  const [healthSummaries] = useState([
    {
      id: 'summary_001',
      title: 'Comprehensive Health Summary',
      description: 'AI-generated overview of your current health status and recent medical activity',
      keyInsights: `Based on your recent lab results and medical history, your overall health indicators show positive trends:\n\n• Blood pressure has improved by 15% over the last 3 months\n• Cholesterol levels are within normal range (Total: 185 mg/dL)\n• Recent vitamin D levels show significant improvement\n• No concerning patterns detected in recent symptoms`,
      recentChanges: `Notable changes in the past 90 days:\n\n• Started new blood pressure medication (Lisinopril 10mg)\n• Completed physical therapy for lower back pain\n• Updated allergy information to include shellfish sensitivity\n• Scheduled follow-up cardiology appointment`,
      recommendations: `Based on your health data, I recommend:\n\n• Continue current blood pressure medication regimen\n• Schedule annual eye exam due to family history of glaucoma\n• Consider increasing calcium intake based on recent bone density scan\n• Maintain current exercise routine - showing excellent results`,
      followUpActions: `Upcoming healthcare tasks:\n\n• Cardiology follow-up scheduled for March 15, 2025\n• Annual physical exam due in April 2025\n• Lab work recommended in 6 months to monitor cholesterol\n• Consider discussing sleep study with primary care physician`,
      confidence: 0.87,
      dataSources: ['Lab Results (2024)', 'Medication History', 'Vital Signs', 'Imaging Reports'],
      generatedAt: new Date(Date.now() - 86400000),
      transactionHash: '0x1234567890abcdef1234567890abcdef12345678'
    }
  ]);

  // Mock data for analysis history
  const [analysisHistory] = useState([
    {
      id: 'analysis_001',
      type: 'summary',
      title: 'Comprehensive Health Summary',
      description: 'Complete health overview including lab results, medications, and recommendations',
      timestamp: new Date(Date.now() - 86400000),
      dataSourcesCount: 4,
      confidence: 0.87,
      ipfsHash: 'QmX7Vz8K9L2M3N4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1'
    },
    {
      id: 'analysis_002',
      type: 'chat',
      title: 'Blood Pressure Discussion',
      description: 'Conversation about recent blood pressure readings and medication adjustments',
      timestamp: new Date(Date.now() - 172800000),
      dataSourcesCount: 2,
      confidence: 0.92,
      ipfsHash: 'QmY8Wz9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0'
    },
    {
      id: 'analysis_003',
      type: 'insight',
      title: 'Cholesterol Trend Analysis',
      description: 'AI-generated insights on cholesterol level improvements over 6 months',
      timestamp: new Date(Date.now() - 259200000),
      dataSourcesCount: 3,
      confidence: 0.79,
      ipfsHash: 'QmZ9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2'
    },
    {
      id: 'analysis_004',
      type: 'recommendation',
      title: 'Exercise Recommendations',
      description: 'Personalized exercise suggestions based on current health status and limitations',
      timestamp: new Date(Date.now() - 345600000),
      dataSourcesCount: 5,
      confidence: 0.84,
      ipfsHash: 'QmA0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3'
    }
  ]);

  const emergencyContacts = [
    { name: "Dr. Sarah Johnson", relationship: "Primary Care Physician" },
    { name: "Michael Rodriguez", relationship: "Emergency Contact" },
    { name: "Jennifer Chen", relationship: "Spouse" }
  ];

  // Simulate AI processing stages
  useEffect(() => {
    if (isProcessing) {
      const stages = ['analyzing', 'generating', 'encrypting', 'logging', 'finalizing'];
      let currentStageIndex = 0;
      let progress = 0;

      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
          progress = 100;
          setProcessingProgress(progress);
          setTimeout(() => {
            setIsProcessing(false);
            setProcessingProgress(0);
          }, 1000);
          clearInterval(interval);
          return;
        }

        if (progress > (currentStageIndex + 1) * 20 && currentStageIndex < stages?.length - 1) {
          currentStageIndex++;
          setProcessingStage(stages?.[currentStageIndex]);
        }

        setProcessingProgress(progress);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const handleSendMessage = (message) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI processing
    setIsProcessing(true);
    setProcessingStage('analyzing');

    // Simulate AI response after processing
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        content: generateAIResponse(message),
        timestamp: new Date(),
        dataAccess: message?.toLowerCase()?.includes('records') || message?.toLowerCase()?.includes('lab') || message?.toLowerCase()?.includes('medication'),
        confidence: 0.85 + Math.random() * 0.1,
        sources: message?.toLowerCase()?.includes('records') ? ['Lab Results', 'Medication History'] : [],
        encrypted: true,
        blockchainLogged: true
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 6000);
  };

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage?.toLowerCase();
    
    if (lowerMessage?.includes('blood pressure')) {
      return `Based on your recent blood pressure readings, I can see positive improvements:\n\n• Your average BP over the last month is 128/82 mmHg\n• This represents a 12% improvement from your baseline\n• Your current medication (Lisinopril 10mg) appears to be working well\n\nI recommend continuing your current regimen and monitoring daily. Your next cardiology appointment is scheduled for March 15th - this would be a good time to discuss any adjustments.`;
    }
    
    if (lowerMessage?.includes('medication') || lowerMessage?.includes('drugs')) {
      return `Here are your current medications:\n\n• Lisinopril 10mg - Once daily for blood pressure\n• Atorvastatin 20mg - Once daily for cholesterol\n• Vitamin D3 2000 IU - Daily supplement\n\nAll medications are up to date with no concerning interactions detected. Your last medication review was 2 months ago. Remember to take Lisinopril at the same time each day for best results.`;
    }
    
    if (lowerMessage?.includes('lab') || lowerMessage?.includes('results')) {
      return `Your most recent lab results from January 2025 show:\n\n• Total Cholesterol: 185 mg/dL (Normal)\n• LDL: 110 mg/dL (Borderline)\n• HDL: 55 mg/dL (Good)\n• Triglycerides: 120 mg/dL (Normal)\n• Vitamin D: 45 ng/mL (Optimal)\n\nOverall, your lipid panel shows improvement from previous results. The vitamin D supplementation is working well - levels have increased from 28 to 45 ng/mL.`;
    }
    
    if (lowerMessage?.includes('summary') || lowerMessage?.includes('doctor')) {
      return `I can generate a comprehensive health summary for your doctor visit. This will include:\n\n• Current medications and dosages\n• Recent lab results and trends\n• Vital signs patterns\n• Any reported symptoms or concerns\n• Recommended follow-up actions\n\nWould you like me to create this summary now? It will be formatted for easy sharing with your healthcare provider and include all relevant data sources.`;
    }
    
    return `I understand you're asking about "${userMessage}". Based on your health records, I can provide personalized insights. However, I need to access specific data categories to give you the most accurate information.\n\nCould you be more specific about what aspect of your health you'd like to discuss? I can help with:\n• Medication information\n• Lab results analysis\n• Vital signs trends\n• Health summaries for doctor visits`;
  };

  const handleTogglePermission = (permissionId) => {
    setAiPermissions(prev => ({
      ...prev,
      [permissionId]: !prev?.[permissionId]
    }));
  };

  const handleExportSummary = (summaryId, format) => {
    console.log(`Exporting summary ${summaryId} as ${format}`);
    // Simulate export functionality
  };

  const handleRegenerateSummary = (summaryId) => {
    setIsProcessing(true);
    setProcessingStage('analyzing');
    console.log(`Regenerating summary ${summaryId}`);
  };

  const handleViewAnalysis = (analysisId) => {
    console.log(`Viewing analysis ${analysisId}`);
  };

  const handleDeleteAnalysis = (analysisId) => {
    console.log(`Deleting analysis ${analysisId}`);
  };

  const handleWalletConnect = () => {
    setWalletConnected(!walletConnected);
  };

  const handleNetworkSwitch = () => {
    setCurrentNetwork(currentNetwork === 'Sepolia' ? 'Mainnet' : 'Sepolia');
  };

  // Emergency banner/actions are handled in their dedicated pages

  const tabs = [
    { id: 'chat', label: t('ai.tabs.chat'), icon: 'MessageCircle' },
    { id: 'summaries', label: t('ai.tabs.summaries'), icon: 'FileText' },
    { id: 'permissions', label: t('ai.tabs.permissions'), icon: 'Shield' },
    { id: 'history', label: t('ai.tabs.history'), icon: 'History' }
  ];

  return (
    <>
      <Helmet>
  <title>{t('ai.seo.title') || 'AI Health Assistant & Analysis - PULSE'}</title>
  <meta name="description" content={t('ai.seo.description') || 'AI-powered medical insights and interactive health consultations with complete transparency about data usage'} />
      </Helmet>
  <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Brain" size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">{t('ai.header.title')}</h1>
                  <p className="text-muted-foreground">
                    {t('ai.header.subtitle')}
                  </p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-clinical-green rounded-full" />
                  <span className="text-muted-foreground">{t('ai.status.active')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={14} className="text-clinical-green" />
                  <span className="text-muted-foreground">{t('ai.status.encrypted')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={14} className="text-primary" />
                  <span className="text-muted-foreground">{t('ai.status.ipfs')}</span>
                </div>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="lg:hidden mb-6">
              <div className="flex space-x-1 p-1 bg-muted rounded-lg">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-clinical ${
                      activeTab === tab?.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span className="hidden sm:inline">{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-3">
                {/* Desktop Tabs */}
                <div className="hidden lg:flex items-center space-x-1 mb-6 p-1 bg-muted rounded-lg">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-clinical ${
                        activeTab === tab?.id
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="bg-card rounded-lg border border-border shadow-medical-card">
                  {activeTab === 'chat' && (
                    <div className="h-[600px]">
                      <ChatInterface
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isProcessing}
                        aiPermissions={aiPermissions}
                        onTogglePermission={handleTogglePermission}
                      />
                    </div>
                  )}

                  {activeTab === 'summaries' && (
                    <div className="p-6 space-y-6">
                      {healthSummaries?.map((summary) => (
                        <HealthSummaryCard
                          key={summary?.id}
                          summary={summary}
                          onExport={handleExportSummary}
                          onRegenerateRequest={handleRegenerateSummary}
                        />
                      ))}
                      
                      <div className="text-center py-8">
                        <Button
                          variant="outline"
                          iconName="Plus"
                          iconPosition="left"
                          onClick={() => {
                            setIsProcessing(true);
                            setProcessingStage('analyzing');
                          }}
                        >
                          Generate New Summary
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'permissions' && (
                    <div className="p-6">
                      <AIPermissionsPanel
                        permissions={aiPermissions}
                        onTogglePermission={handleTogglePermission}
                      />
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div className="p-6">
                      <AnalysisHistory
                        analysisHistory={analysisHistory}
                        onViewAnalysis={handleViewAnalysis}
                        onDeleteAnalysis={handleDeleteAnalysis}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Stats */}
                <div className="bg-card rounded-lg border border-border p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">AI Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Conversations</span>
                      <span className="text-sm font-medium text-foreground">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Summaries Generated</span>
                      <span className="text-sm font-medium text-foreground">4</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Data Sources</span>
                      <span className="text-sm font-medium text-foreground">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Confidence</span>
                      <span className="text-sm font-medium text-clinical-green">87%</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card rounded-lg border border-border p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {analysisHistory?.slice(0, 3)?.map((item) => (
                      <div key={item?.id} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="Brain" size={12} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item?.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.timestamp)?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Privacy */}
                <div className="bg-card rounded-lg border border-border p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Data Privacy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Icon name="Shield" size={14} className="text-clinical-green" />
                      <span className="text-xs text-muted-foreground">End-to-end encrypted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Database" size={14} className="text-primary" />
                      <span className="text-xs text-muted-foreground">IPFS distributed storage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Link" size={14} className="text-primary" />
                      <span className="text-xs text-muted-foreground">Blockchain audit trail</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={14} className="text-clinical-amber" />
                      <span className="text-xs text-muted-foreground">90-day auto-deletion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Indicator */}
        <ProcessingIndicator
          isVisible={isProcessing}
          stage={processingStage}
          progress={processingProgress}
          estimatedTime="2-3 minutes"
        />
  </>
  );
};

export default AIHealthAssistantAnalysis;