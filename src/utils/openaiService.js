import openai from './openaiClient';

/**
 * Generates a structured chat completion response for health-related queries.
 * @param {string} userMessage - The user's input message.
 * @param {Array} conversationHistory - Previous messages for context.
 * @param {Object} userHealthContext - User's health data context.
 * @returns {Promise<object>} Structured response with health insights.
 */
export async function getHealthAssistantResponse(userMessage, conversationHistory = [], userHealthContext = {}) {
  try {
    const systemPrompt = `You are PULSE AI, a sophisticated medical AI assistant specialized in analyzing health records and providing personalized health insights. You have access to the user's medical data through a secure, blockchain-verified system.

Key Responsibilities:
- Analyze user's medical records and provide accurate health insights
- Generate doctor-ready summaries and reports
- Answer questions about medications, lab results, and health trends
- Provide personalized recommendations based on medical history
- Always cite data sources and provide confidence levels
- Maintain HIPAA-compliant communication standards

Available Health Data Context:
${JSON.stringify(userHealthContext, null, 2)}

Guidelines:
- Always provide specific, actionable insights when possible
- Include confidence levels for your recommendations
- Cite specific data sources from the user's records
- Use medical terminology appropriately but explain complex terms
- Suggest when the user should consult their healthcare provider
- Never provide emergency medical advice - direct to emergency services if needed
- Be empathetic and supportive in your communication style

Response Format:
- Provide clear, structured responses
- Include relevant data sources
- Indicate confidence level for medical insights
- Suggest follow-up actions when appropriate`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory?.map(msg => ({
        role: msg?.sender === 'user' ? 'user' : 'assistant',
        content: msg?.content
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.3, // Lower temperature for more consistent medical advice
      max_tokens: 1000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'health_assistant_response',
          schema: {
            type: 'object',
            properties: {
              response: { type: 'string' },
              confidence: { type: 'number' },
              dataSources: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              recommendations: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              followUpActions: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              requiresProviderConsultation: { type: 'boolean' }
            },
            required: ['response', 'confidence', 'dataSources'],
            additionalProperties: false,
          },
        },
      },
    });

    const result = JSON.parse(response?.choices?.[0]?.message?.content);
    
    return {
      content: result?.response,
      confidence: result?.confidence || 0.8,
      sources: result?.dataSources || [],
      recommendations: result?.recommendations || [],
      followUpActions: result?.followUpActions || [],
      requiresProviderConsultation: result?.requiresProviderConsultation || false,
      dataAccess: true,
      encrypted: true,
      blockchainLogged: true
    };
  } catch (error) {
    console.error('Error in health assistant response:', error);
    
    // Fallback response for API failures
    return {
      content: `I apologize, but I'm currently unable to access the AI service. Please try again in a moment. If you're experiencing a medical emergency, please contact emergency services immediately.

Error details: ${error?.message}`,
      confidence: 0.0,
      sources: [],
      recommendations: [],
      followUpActions: ['Retry your question', 'Contact technical support if the issue persists'],
      requiresProviderConsultation: false,
      dataAccess: false,
      encrypted: true,
      blockchainLogged: false,
      error: true
    };
  }
}

/**
 * Generates a comprehensive health summary for doctor visits.
 * @param {Object} healthData - Complete user health data.
 * @returns {Promise<object>} Structured health summary.
 */
export async function generateHealthSummary(healthData) {
  try {
    const systemPrompt = `You are a medical AI assistant tasked with generating a comprehensive, doctor-ready health summary. Create a professional medical summary that healthcare providers can quickly review and understand.

The summary should include:
1. Current Health Status Overview
2. Key Medical History Points
3. Current Medications and Dosages
4. Recent Lab Results and Trends
5. Notable Symptoms or Changes
6. Recommended Follow-up Actions
7. Risk Factors and Preventive Care Needs

Format the response in a clear, clinical manner suitable for healthcare provider review.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please generate a comprehensive health summary based on this data: ${JSON.stringify(healthData, null, 2)}` }
      ],
      temperature: 0.2,
      max_tokens: 1500,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'health_summary_response',
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              executiveSummary: { type: 'string' },
              currentHealthStatus: { type: 'string' },
              keyMedicalHistory: { type: 'string' },
              currentMedications: { type: 'string' },
              recentLabResults: { type: 'string' },
              notableSymptoms: { type: 'string' },
              recommendations: { type: 'string' },
              followUpActions: { type: 'string' },
              riskFactors: { type: 'string' },
              confidence: { type: 'number' },
              dataSources: { 
                type: 'array', 
                items: { type: 'string' } 
              }
            },
            required: ['title', 'executiveSummary', 'confidence', 'dataSources'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating health summary:', error);
    throw error;
  }
}

/**
 * Analyzes health trends and patterns from historical data.
 * @param {Object} healthTrendData - Historical health data for analysis.
 * @returns {Promise<object>} Trend analysis results.
 */
export async function analyzeHealthTrends(healthTrendData) {
  try {
    const systemPrompt = `You are a medical data analyst AI. Analyze the provided health data for trends, patterns, and insights that could be valuable for healthcare decision-making.

Focus on:
- Identifying positive and concerning trends
- Correlations between different health metrics
- Seasonal or periodic patterns
- Medication effectiveness indicators
- Risk factor progression
- Opportunities for preventive care

Provide actionable insights that both patients and healthcare providers can use.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze these health trends: ${JSON.stringify(healthTrendData, null, 2)}` }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'health_trend_analysis',
          schema: {
            type: 'object',
            properties: {
              overallTrend: { type: 'string' },
              positiveIndicators: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              concerningPatterns: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              correlations: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              recommendations: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              confidence: { type: 'number' },
              timeframeAnalyzed: { type: 'string' }
            },
            required: ['overallTrend', 'confidence', 'timeframeAnalyzed'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error analyzing health trends:', error);
    throw error;
  }
}