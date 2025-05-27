import { FormData } from "@/components/OfferCreationForm";
import { OpenAIService } from "./openaiService";

export interface OfferOption {
  title: string;
  description: string;
  redemptionSteps: string[];
  stand: string; // Optional field for booth or stand number
}

export const generateOffers = async (formData: FormData): Promise<OfferOption[]> => {
  // Extract key information for the prompt
  const { exhibitorName, eventName, goal, secondaryActions, incentiveDescription } = formData;

  // Initialize OpenAIService using Vite env variable
  const openai = new OpenAIService(import.meta.env.VITE_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY');

  // Compose a prompt for OpenAI that instructs it to ONLY reply with a valid JSON array of OfferOption objects
  const prompt = `
You are an expert event marketer. Your goal is to generate compelling offer options for an event exhibitor based on the following details:
Exhibitor: ${exhibitorName}
Event: ${eventName}
Goal: ${goal}
Actions: ${secondaryActions.join(", ")}
Incentive: ${incentiveDescription}.
Generate an array of 3 JSON objects, each matching this TypeScript interface:

interface OfferOption {
  title: string;
  description: string;
  redemptionSteps: string[];
  stand?: string; // Optional field for booth or stand number
}

Reply ONLY with a valid JSON array of OfferOption objects, not even a single extra text, just plain minified json as text, not inside code block.

Constraints:
1. Each offer must have a unique title and description.
2. Titles should be catchy and relevant to the goal and incentive.
3. Descriptions should clearly explain the incentive and how to redeem it.
4. Redemption steps should be clear and actionable.
5. Ensure the JSON is valid and properly formatted.
6. Descriptions must be between min 150 and max 250 characters.
7. Stand number is optional. However, in case its provided. You must use it to return in the response json. Also, it must not go inside offer title, description or redemption steps. Stand info will be shown separately. So in redemption steps, you can just say "Visit our booth" or "Find us at the event" without specifying the stand number.
  `;

  // Call OpenAI API (this is just a sample usage, adapt as needed)
  try {
    const response = await openai.sendMessage({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for event marketing.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    // Parse the OpenAI response as JSON and return it as the offers array
    let offers: OfferOption[] = [];
    try {
      console.log('OpenAI response:', response);
      offers = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', e);
    }
    return offers;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return [];
  }
};
