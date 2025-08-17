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
import { ipfsService } from '../../utils/ipfsService';
import { blockchainService } from '../../utils/blockchainService';
import { mockHealthData } from '../../utils/mockHealthData';
import { filterHealthDataByPermissions } from '../../utils/permissions';
const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY;
async function generateHealthSummaryGemini(healthData) {
  const systemPrompt = `You are a medical AI assistant tasked with generating a comprehensive, doctor-ready health summary. Create a professional medical summary that healthcare providers can quickly review and understand.
The summary should include:
1. Current Health Status Overview
2. Key Medical History Points
3. Current Medications and Dosages
4. Recent Lab Results and Trends
5. Notable Symptoms or Changes
6. Recommended Follow-up Actions
7. Risk Factors and Preventive Care Needs
Format the response in a clear, clinical manner suitable for healthcare provider review.
Return only a strict JSON object with the following keys: title, executiveSummary, currentHealthStatus, keyMedicalHistory, currentMedications, recentLabResults, notableSymptoms, recommendations, followUpActions, riskFactors, confidence, dataSources.`;
  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: `Please generate a comprehensive health summary based on this data:\n${JSON.stringify(healthData)}` }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 1500, response_mime_type: 'application/json' }
  };
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`Gemini error ${r.status}`);
  const j = await r.json();
  let t = j?.candidates?.[0]?.content?.parts?.map(p => p?.text || '')?.join('') || '';
  t = t.trim().replace(/^```json\s*/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
  try { return t ? JSON.parse(t) : {}; } catch(_) { return {}; }
}

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
  const [healthSummaries, setHealthSummaries] = useState([
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
  const [analysisHistory, setAnalysisHistory] = useState([
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
    const userMessage = { id: Date.now(), sender: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setProcessingStage('analyzing');
  };

  useEffect(() => {
    const onAiMessage = (e) => {
      const aiMsg = e?.detail;
      if (!aiMsg) return;
      setMessages(prev => [...prev, aiMsg]);
      setAnalysisHistory(prev => [
        {
          id: `analysis_${Date.now()}`,
          type: 'chat',
          title: 'AI Conversation',
          description: aiMsg?.content?.slice(0, 120),
          timestamp: new Date(),
          dataSourcesCount: aiMsg?.sources?.length || 0,
          confidence: aiMsg?.confidence || 0,
          ipfsHash: aiMsg?.ipfsHash
        },
        ...prev
      ]);
      setTimeout(() => { setIsProcessing(false); setProcessingProgress(0); }, 600);
    };
    window.addEventListener('pulse-ai-new-message', onAiMessage);
    return () => window.removeEventListener('pulse-ai-new-message', onAiMessage);
  }, []);

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

  const handleRegenerateSummary = async (summaryId) => {
    try {
      setIsProcessing(true);
      setProcessingStage('analyzing');
      const scoped = filterHealthDataByPermissions(mockHealthData, aiPermissions);
  const s = await generateHealthSummaryGemini(scoped);
      const accessEvent = { type: 'summary_regenerated', summaryId, timestamp: new Date().toISOString(), confidence: s?.confidence, sources: s?.dataSources };
      const tx = await blockchainService.logAccessEvent(accessEvent);
      const mapped = {
        id: `summary_${Date.now()}`,
        title: s?.title || 'Comprehensive Health Summary',
        description: s?.executiveSummary || 'AI-generated health summary',
        keyInsights: `${s?.currentHealthStatus || ''}\n\n${s?.keyMedicalHistory || ''}`.trim(),
        recentChanges: s?.notableSymptoms || 'No notable recent symptoms reported',
        recommendations: s?.recommendations || 'Maintain follow-up as recommended',
        followUpActions: s?.followUpActions || 'Schedule follow-ups as noted',
        confidence: s?.confidence ?? 0.8,
        dataSources: s?.dataSources || [],
        generatedAt: new Date(),
        transactionHash: tx
      };
      const ipfs = await ipfsService.storeAnalysis({ type: 'summary', payload: mapped, metadata: { transactionHash: tx } });
      setHealthSummaries(prev => [mapped, ...prev]);
      setAnalysisHistory(prev => [
        { id: `analysis_${Date.now()}`, type: 'summary', title: mapped.title, description: mapped.description, timestamp: new Date(), dataSourcesCount: mapped.dataSources?.length || 0, confidence: mapped.confidence, ipfsHash: ipfs?.hash },
        ...prev
      ]);
    } catch (e) {
      console.error(e);
      const mapped = {
        id: `summary_${Date.now()}`,
        title: 'Comprehensive Health Summary',
        description: 'AI-generated health summary',
        keyInsights: 'No key insights available at this time.',
        recentChanges: 'No notable recent symptoms reported',
        recommendations: 'Maintain routine follow-ups as recommended',
        followUpActions: 'Schedule follow-ups as noted',
        confidence: 0.5,
        dataSources: [],
        generatedAt: new Date(),
        transactionHash: undefined
      };
      setHealthSummaries(prev => [mapped, ...prev]);
    } finally {
      setTimeout(() => { setIsProcessing(false); setProcessingProgress(0); }, 800);
    }
  };

  const handleViewAnalysis = (analysisId) => {
    console.log(`Viewing analysis ${analysisId}`);
  };

  const handleDeleteAnalysis = (analysisId) => {
    setAnalysisHistory(prev => prev.filter(a => a.id !== analysisId));
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
                          onClick={() => handleRegenerateSummary('new')}
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