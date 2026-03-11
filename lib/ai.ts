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
    return {
      message: '',
      error: 'OpenRouter API key not configured. Add EXPO_PUBLIC_OPENROUTER_API_KEY to your .env file.',
    };
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
        model: 'anthropic/claude-sonnet-4',
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
