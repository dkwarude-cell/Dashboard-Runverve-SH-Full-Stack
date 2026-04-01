import { Platform } from 'react-native';

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  message: string;
  error?: string;
}

const SYSTEM_PROMPT = `You are SmartHeal AI Assistant, an intelligent therapy recommendation and clinical decision-support assistant built for coaches and doctors using the SmartHeal platform.

Your primary role is to SUGGEST THERAPY plans and protocols for clients. When a coach or doctor asks about a client, proactively recommend appropriate therapy types, session frequency, device settings, and rehabilitation milestones.

Your capabilities:
- **Therapy Suggestions**: Recommend personalized therapy plans (type, duration, frequency, intensity) based on client conditions, progress, and goals
- **Treatment Optimization**: Analyze ongoing therapy data and suggest adjustments to improve outcomes
- **Client Progress Analysis**: Interpret progress metrics, adherence rates, and session data to identify trends
- **Device Configuration**: Recommend optimal SmartHeal device settings (intensity, frequency, duration) for specific conditions
- **Risk Identification**: Flag clients showing declining progress, missed sessions, or potential complications
- **Clinical Summaries**: Generate reports and progress summaries for coaches and doctors
- **Rehabilitation Milestones**: Define stage-wise recovery goals and recommend when to advance or modify therapy
- **Scheduling Optimization**: Suggest session scheduling based on treatment protocols and client availability

Medical device types you know about:
- Ultrasound Therapy devices (for tissue healing, pain relief, musculoskeletal conditions)
- Neurostimulation devices (for neurological rehabilitation, chronic pain management)
- EMS Therapy devices (Electrical Muscle Stimulation for muscle re-education, strengthening)
- TENS Units (Transcutaneous Electrical Nerve Stimulation for acute/chronic pain)
- Cardiac Monitors (for cardiac rehabilitation, heart rate monitoring)

Therapy types: Ultrasound Therapy, Neurostimulation, EMS Therapy, TENS Therapy, Cardiac Rehab, General Wellness, Sports Medicine, Physiotherapy, Occupational Therapy

When suggesting therapy, always structure your response with:
1. **Recommended Therapy Type** and rationale
2. **Session Plan** (frequency, duration, number of sessions)
3. **Device Settings** (intensity, mode, parameters)
4. **Goals & Milestones** (short-term and long-term targets)
5. **Precautions** (contraindications, things to monitor)

Always be professional, evidence-based, and helpful. Note that final clinical decisions should always be made by the treating doctor or certified coach. Keep responses concise but thorough.`;

export async function sendAIMessage(
  messages: AIMessage[],
  context?: string
): Promise<AIResponse> {
  if (!OPENROUTER_API_KEY) {
    // Return a simulated mock response if there's no API key
    return new Promise((resolve) => {
      setTimeout(() => {
        const lastMessage = messages[messages.length - 1];
        let mockReply = "I am a simulated AI assistant because you haven't set up the `EXPO_PUBLIC_OPENROUTER_API_KEY` in your `.env` file yet.\n\n";
        
        if (lastMessage.content.toLowerCase().includes('therapy')) {
          mockReply += "Based on the client's profile, I suggest beginning with a 30-minute Ultrasound Therapy session targeting the affected muscle group, followed by lightly graded exercises. We should monitor their adherence closely over the next 3 weeks.";
        } else if (lastMessage.content.toLowerCase().includes('summary') || lastMessage.content.toLowerCase().includes('client')) {
          mockReply += "Looking at the dashboard context, the majority of your clients are making steady progress. The average adherence rate is around 85%. I recommend reviewing the recent 'In Progress' sessions for any signs of discomfort.";
        } else if (lastMessage.content.toLowerCase().includes('risk')) {
          mockReply += "I've analyzed the recent dropout rates and schedule anomalies. There are a couple of clients showing declining adherence who might be at high risk for prolonged recovery timelines. Let's schedule a follow-up call with them.";
        } else {
          mockReply += `I understand you asked: "${lastMessage.content}".\n\nIf you connect a real OpenRouter API key, I can analyze the exact clinical contexts and device setups to give you evidence-based recommendations. For now, try asking me about "therapy", "client summaries", or "risk assessment" to see my mock clinical capabilities!`;
        }

        resolve({ message: mockReply });
      }, 1500); // 1.5s simulated network delay
    });
  }

  const systemMessages: AIMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  if (context) {
    systemMessages.push({
      role: 'system',
      content: `Current dashboard context:\n${context}`,
    });
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': Platform.OS === 'web' ? window.location.origin : 'https://smartheal.app',
        'X-Title': 'SmartHeal Dashboard',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-001',
        messages: [...systemMessages, ...messages],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from AI');
    }

    return { message: content };
  } catch (error: any) {
    console.error('AI API error:', error);
    return {
      message: '',
      error: error.message || 'Failed to get AI response',
    };
  }
}

export function buildClientContext(clients: any[]): string {
  if (!clients.length) return 'No client data available.';
  const summary = clients.slice(0, 10).map(c =>
    `- ${c.name}: ${c.profile_type}, Progress: ${c.progress}%, Sessions: ${c.sessions}, Adherence: ${c.adherence}%, Status: ${c.status}`
  ).join('\n');
  return `Active Clients (${clients.length} total):\n${summary}`;
}

export function buildSessionContext(sessions: any[]): string {
  if (!sessions.length) return 'No session data available.';
  const recent = sessions.slice(0, 8).map(s =>
    `- ${s.therapy_type} on ${s.date} at ${s.time}: ${s.status} (Progress: ${s.progress}%)`
  ).join('\n');
  return `Recent Sessions:\n${recent}`;
}

export function buildDeviceContext(devices: any[]): string {
  if (!devices.length) return 'No device data available.';
  const deviceList = devices.map(d =>
    `- ${d.name} (${d.type}): ${d.status}, Battery: ${d.battery}%, Intensity: ${d.intensity_level}%`
  ).join('\n');
  return `Connected Devices:\n${deviceList}`;
}
