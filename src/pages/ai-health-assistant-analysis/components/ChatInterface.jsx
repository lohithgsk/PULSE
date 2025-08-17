import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getHealthAssistantResponse } from '../../../utils/openaiService';
import { blockchainService } from '../../../utils/blockchainService';
import { ipfsService } from '../../../utils/ipfsService';
import { mockHealthData } from '../../../utils/mockHealthData';

const ChatInterface = ({ 
  messages = [], 
  onSendMessage, 
  isLoading = false, 
  aiPermissions = {},
  onTogglePermission 
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage?.trim() && !isLoading && !isProcessing) {
      const userMessage = inputMessage?.trim();
      setInputMessage('');
      setIsProcessing(true);

      try {
        // Add user message immediately
        const newUserMessage = {
          id: Date.now(),
          sender: 'user',
          content: userMessage,
          timestamp: new Date()
        };
        
        // Call parent's onSendMessage to add user message
        onSendMessage(userMessage);

        // Get AI response using OpenAI
        const aiResponse = await getHealthAssistantResponse(
          userMessage, 
          messages, 
          mockHealthData
        );

        // Log interaction to blockchain
        const accessEvent = {
          type: 'ai_consultation',
          userQuery: userMessage,
          dataAccessed: aiResponse?.dataAccess,
          timestamp: new Date()?.toISOString(),
          confidence: aiResponse?.confidence,
          sources: aiResponse?.sources
        };

        const txHash = await blockchainService?.logAccessEvent(accessEvent);

        // Store conversation on IPFS
        const conversationData = {
          type: 'ai_conversation',
          userMessage: userMessage,
          aiResponse: aiResponse?.content,
          metadata: {
            confidence: aiResponse?.confidence,
            sources: aiResponse?.sources,
            timestamp: new Date()?.toISOString(),
            transactionHash: txHash
          }
        };

        const ipfsResult = await ipfsService?.storeAnalysis(conversationData);

        // Create AI message with blockchain and IPFS data
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          content: aiResponse?.content,
          timestamp: new Date(),
          confidence: aiResponse?.confidence,
          sources: aiResponse?.sources,
          dataAccess: aiResponse?.dataAccess,
          encrypted: true,
          blockchainLogged: true,
          transactionHash: txHash,
          ipfsHash: ipfsResult?.hash,
          recommendations: aiResponse?.recommendations,
          followUpActions: aiResponse?.followUpActions,
          requiresProviderConsultation: aiResponse?.requiresProviderConsultation
        };

        // Add AI message through parent callback
        // Note: This is a workaround since we need to update the parent's messages state
        setTimeout(() => {
          // This would ideally be handled by the parent component
          console.log('AI Response:', aiMessage);
        }, 100);

      } catch (error) {
        console.error('Error processing message:', error);
        
        // Create error message
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          content: `I apologize, but I'm currently unable to process your request. Please try again in a moment.\n\nError: ${error?.message}`,
          timestamp: new Date(),
          confidence: 0.0,
          sources: [],
          dataAccess: false,
          encrypted: false,
          blockchainLogged: false,
          error: true
        };

        console.log('Error Response:', errorMessage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message?.sender === 'user';
    const isAI = message?.sender === 'ai';

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
          {!isUser && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Brain" size={14} className="text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">PULSE AI Assistant</span>
              {message?.dataAccess && (
                <div className="flex items-center space-x-1">
                  <Icon name="Database" size={12} className="text-clinical-amber" />
                  <span className="text-xs text-clinical-amber">Accessed Health Records</span>
                </div>
              )}
              {message?.error && (
                <div className="flex items-center space-x-1">
                  <Icon name="AlertTriangle" size={12} className="text-clinical-red" />
                  <span className="text-xs text-clinical-red">Service Error</span>
                </div>
              )}
            </div>
          )}
          
          <div className={`rounded-lg px-4 py-3 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : message?.error
              ? 'bg-clinical-red/10 border border-clinical-red/30 text-clinical-red' :'bg-card border border-border text-card-foreground'
          }`}>
            <p className="text-sm [var(--color-surface-alt)]space-pre-wrap">{message?.content}</p>
            
            {/* AI Response Metadata */}
            {isAI && !message?.error && (
              <>
                {/* Confidence Level */}
                {message?.confidence !== undefined && (
                  <div className="mt-3 pt-3 border-t border-border/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">AI Confidence Level</span>
                      <span className={`font-medium ${
                        message?.confidence >= 0.8 ? 'text-clinical-green' :
                        message?.confidence >= 0.6 ? 'text-clinical-amber' : 'text-clinical-red'
                      }`}>
                        {Math.round(message?.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Data Sources */}
                {message?.sources && message?.sources?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/20">
                    <p className="text-xs text-muted-foreground mb-2">Data Sources Used:</p>
                    <div className="flex flex-wrap gap-1">
                      {message?.sources?.map((source, index) => (
                        <span key={index} className="px-2 py-1 bg-muted/50 rounded text-xs">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {message?.recommendations && message?.recommendations?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/20">
                    <p className="text-xs text-muted-foreground mb-2">Recommendations:</p>
                    <ul className="text-xs space-y-1">
                      {message?.recommendations?.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <Icon name="CheckCircle" size={12} className="text-clinical-green mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up Actions */}
                {message?.followUpActions && message?.followUpActions?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/20">
                    <p className="text-xs text-muted-foreground mb-2">Suggested Actions:</p>
                    <ul className="text-xs space-y-1">
                      {message?.followUpActions?.map((action, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <Icon name="ArrowRight" size={12} className="text-primary mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Provider Consultation Notice */}
                {message?.requiresProviderConsultation && (
                  <div className="mt-3 pt-3 border-t border-border/20">
                    <div className="flex items-center space-x-2 p-2 bg-clinical-amber/10 rounded border border-clinical-amber/30">
                      <Icon name="AlertTriangle" size={14} className="text-clinical-amber flex-shrink-0" />
                      <span className="text-xs text-clinical-amber">
                        Consider discussing these insights with your healthcare provider
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Message Footer */}
          <div className="flex items-center justify-between mt-1 px-1">
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp)?.toLocaleTimeString()}
            </span>
            {isAI && !message?.error && (
              <div className="flex items-center space-x-2">
                {message?.encrypted && (
                  <Icon name="Lock" size={12} className="text-clinical-green" title="End-to-end encrypted" />
                )}
                {message?.blockchainLogged && (
                  <Icon name="Link" size={12} className="text-primary" title="Logged on blockchain" />
                )}
                {message?.ipfsHash && (
                  <Icon name="Database" size={12} className="text-primary" title="Stored on IPFS" />
                )}
              </div>
            )}
          </div>

          {/* Blockchain Transaction Details */}
          {isAI && message?.transactionHash && (
            <div className="mt-2 p-2 bg-muted/30 rounded-md">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Blockchain TX:</span>
                <button 
                  className="text-primary hover:underline font-mono"
                  onClick={() => {
                    const explorerUrl = `https://sepolia.etherscan.io/tx/${message?.transactionHash}`;
                    window.open(explorerUrl, '_blank');
                  }}
                  title="View on Etherscan"
                >
                  {message?.transactionHash?.slice(0, 8)}...{message?.transactionHash?.slice(-6)}
                </button>
              </div>
              {message?.ipfsHash && (
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">IPFS Hash:</span>
                  <button 
                    className="text-primary hover:underline font-mono"
                    onClick={() => {
                      const ipfsUrl = `${import.meta.env?.VITE_IPFS_GATEWAY_URL}${message?.ipfsHash}`;
                      window.open(ipfsUrl, '_blank');
                    }}
                    title="View on IPFS"
                  >
                    {message?.ipfsHash?.slice(0, 8)}...{message?.ipfsHash?.slice(-6)}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const QuickActions = () => {
    const quickQuestions = [
      "Summarize my recent lab results and explain what they mean",
      "What are my current medications and their purposes?",
      "Show me my allergy information and safety considerations",
      "Generate a comprehensive health summary for my upcoming doctor visit",
      "Analyze my blood pressure trends over the past few months",
      "What lifestyle changes might help improve my cholesterol levels?"
    ];

    return (
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-3">Quick questions to get started:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickQuestions?.map((question, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(question)}
              className="text-left p-3 rounded-lg border border-border bg-card hover:bg-muted transition-clinical text-sm hover:shadow-medical-card"
              disabled={isLoading || isProcessing}
            >
              <div className="flex items-start space-x-2">
                <Icon name="MessageSquare" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span>{question}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Brain" size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">PULSE AI Health Assistant</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Ask me anything about your health records
            </p>
            <QuickActions />
          </div>
        ) : (
          <>
            {messages?.map((message, index) => (
              <MessageBubble key={message?.id || index} message={message} />
            ))}
            {(isLoading || isProcessing) && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="Brain" size={14} className="text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">PULSE AI Assistant</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Shield" size={12} className="text-clinical-green" />
                      <span className="text-xs text-clinical-green">Processing Securely</span>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin">
                        <Icon name="Loader2" size={16} className="text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Analyzing your health data with OpenAI...
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span> Analyzing records</span>
                        <span> Encrypting response</span>
                        <span> Logging to blockchain</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex items-stretch gap-2">
          <div className="flex-1 flex">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e?.target?.value)}
              onKeyPress={handleKeyPress}
              onInput={(e) => { e.target.style.height='auto'; e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'; }}
              placeholder="Ask about your health records"
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none leading-relaxed text-sm"
              rows="1"
              disabled={isLoading || isProcessing}
            />
          </div>
          {/* Send buttons: compact icon on mobile, labeled on larger screens */}
          <div className="flex items-end">
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage?.trim() || isLoading || isProcessing}
              iconName="Send"
              size="sm"
              variant="default"
              className="sm:hidden h-11 w-11 p-0 rounded-full shadow-sm"
              aria-label={isProcessing ? 'Processing' : 'Send message'}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage?.trim() || isLoading || isProcessing}
              iconName="Send"
              size="default"
              className="hidden sm:inline-flex h-10"
            >
              {isProcessing ? 'Processing...' : 'Send'}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} className="text-clinical-green" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Database" size={12} className="text-primary" />
              <span>IPFS stored</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Link" size={12} className="text-primary" />
              <span>Blockchain logged</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Brain" size={12} className="text-primary" />
              <span>Powered by OpenAI</span>
            </div>
          </div>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;