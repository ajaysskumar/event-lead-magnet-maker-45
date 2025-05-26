import { FormData } from "@/components/OfferCreationForm";
import { OpenAIService } from "./openaiService";

export interface OfferOption {
  title: string;
  description: string;
  redemptionSteps: string[];
}

export const generateOffers = async (formData: FormData): Promise<OfferOption[]> => {
  // Extract key information for the prompt
  const { exhibitorName, eventName, goal, secondaryActions, incentiveDescription } = formData;

  // Initialize OpenAIService using Vite env variable
  const openai = new OpenAIService(import.meta.env.VITE_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY');

  // Compose a prompt for OpenAI that instructs it to ONLY reply with a valid JSON array of OfferOption objects
  const prompt = `You are an expert event marketer. Given the following context, generate an array of 3 JSON objects, each matching this TypeScript interface:\n\ninterface OfferOption { title: string; description: string; redemptionSteps: string[]; }\n\nReply ONLY with a valid JSON array of OfferOption objects, not even a single extra text, just plain minified json as text, not inside code block.\n\nContext:\nExhibitor: ${exhibitorName}\nEvent: ${eventName}\nGoal: ${goal}\nActions: ${secondaryActions.join(", ")}\nIncentive: ${incentiveDescription}`;

  // Call OpenAI API (this is just a sample usage, adapt as needed)
  try {
    const response = await openai.sendMessage({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for event marketing.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 512
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
  }

  // Generate different titles based on goal, actions and incentive
  let titleOptions: string[] = [];
  let descriptionOptions: string[] = [];
  let redemptionStepsOptions: string[][] = [];
  
  // Extract main keywords from incentive description
  const incentiveWords = incentiveDescription
    .split(' ')
    .filter(word => word.length > 3)
    .slice(0, 3);
  
  // Get keywords for title generation
  const keywordExtractor = () => {
    // Find adjectives and nouns in the incentive description
    const words = incentiveDescription.toLowerCase().split(/\s+/);
    const potentialKeywords = words.filter(word => 
      word.length > 3 && 
      !['with', 'that', 'this', 'from', 'your', 'will', 'have', 'more'].includes(word)
    );
    
    return potentialKeywords.length > 0 
      ? potentialKeywords[Math.floor(Math.random() * potentialKeywords.length)] 
      : secondaryActions[0] || "Special";
  };
  
  const incentiveKeyword = keywordExtractor();
  const secondKeyword = keywordExtractor();
  
  // Title generation focusing on the incentive more directly
  if (goal.includes("leads")) {
    titleOptions.push(`Exclusive ${incentiveKeyword} Opportunity`);
    titleOptions.push(`${incentiveKeyword} Access for ${eventName} Attendees`);
  } else if (goal.includes("brand")) {
    titleOptions.push(`Experience Our ${incentiveKeyword} ${secondKeyword}`.trim());
    titleOptions.push(`${incentiveKeyword} ${secondaryActions[0] || "Experience"}`.trim());
  } else {
    titleOptions.push(`${secondaryActions[0] || "Special"} ${incentiveKeyword}`.trim());
    titleOptions.push(`Limited ${eventName} ${incentiveKeyword} Access`.trim());
  }
  
  // Add one more creative option based on incentive
  const incentivePhrases = incentiveDescription.split(/[.,!?]/);
  const shortPhrase = incentivePhrases[0].trim();
  titleOptions.push(shortPhrase.length < 50 ? shortPhrase : `${incentiveKeyword} ${secondKeyword} Access`.trim());
  
  // Description generation - use the full incentive description more prominently
  const createCustomDescription = () => {
    // Use the full incentive description if it's not too long
    if (incentiveDescription.length < 120 && !incentiveDescription.toLowerCase().includes('lorem ipsum')) {
      return `${incentiveDescription} Collect this offer to secure your spot!`;
    }
    
    // Otherwise, use a shorter version
    const firstSentence = getIncentiveBasedSentence(secondaryActions, incentiveDescription);
    return `${firstSentence} Collect this offer to secure your spot!`;
  };
  
  const getIncentiveBasedSentence = (actions: string[], incentive: string) => {
    // If incentive is already short and compelling, use it directly
    if (incentive.length < 80 && !incentive.toLowerCase().includes('lorem ipsum')) {
      return incentive;
    }
    
    // Extract a compelling fragment from the incentive description
    const sentences = incentive.split(/[.!?]/);
    const shortestSentence = sentences
      .filter(s => s.trim().length > 10)
      .sort((a, b) => a.length - b.length)[0];
    
    if (shortestSentence && shortestSentence.length < 100) {
      return shortestSentence.trim();
    }
    
    // Create more personalized first sentences based on secondary actions
    if (actions.includes("Demo")) {
      return `Get hands-on with our latest technology through a personalized demo. ${incentive.substring(0, 60)}...`;
    } else if (actions.includes("Discount")) {
      return `Enjoy special event pricing available only for a limited time. ${incentive.substring(0, 60)}...`;
    } else if (actions.includes("Giveaway")) {
      return `Enter our exclusive giveaway with limited entries accepted. ${incentive.substring(0, 60)}...`;
    } else if (actions.includes("Free Consultation")) {
      return `Receive expert advice tailored to your specific needs. ${incentive.substring(0, 60)}...`;
    } else if (actions.includes("Exclusive Access")) {
      return `Gain early access to our newest offerings before the general public. ${incentive.substring(0, 60)}...`;
    } else {
      // If we can't find a good sentence, create one from the incentive
      const shortIncentive = incentive.length > 80 ? 
        `${incentive.substring(0, 80)}...` : 
        incentive;
      
      return shortIncentive;
    }
  };
  
  descriptionOptions.push(createCustomDescription());
  descriptionOptions.push(`${getIncentiveBasedSentence(secondaryActions, incentiveDescription)} Limited availability at our booth!`);
  descriptionOptions.push(`Exclusive for ${eventName} attendees: ${getIncentiveBasedSentence(secondaryActions, incentiveDescription)}`);
  
  // Redemption steps - include specific details from the incentive
  const addIncentiveToRedemption = (steps: string[]): string[] => {
    if (incentiveDescription.length < 80) {
      // For short incentives, add as a specific step
      return [...steps.slice(0, -1), `Ask about "${incentiveDescription.substring(0, 60)}"`, steps[steps.length - 1]];
    } else {
      // For longer incentives, extract keyword
      const keyword = incentiveKeyword.charAt(0).toUpperCase() + incentiveKeyword.slice(1);
      steps[1] = `Show this offer and ask about our "${keyword}" special`;
      return steps;
    }
  };
  
  const boothText = `Visit our booth${goal.includes("traffic") ? " #XXX at " + eventName : ""}`;
  
  let redemptionSet1 = [
    boothText,
    "Show this collected offer to our staff",
    `Mention "${secondaryActions[0] || "special offer"}"`,
    "Get immediate access to your benefit"
  ];
  redemptionSet1 = addIncentiveToRedemption(redemptionSet1);
  
  let redemptionSet2 = [
    `Find us at ${eventName}`,
    "Scan our QR code at the registration desk",
    "Complete a quick digital form",
    "Receive your exclusive access immediately"
  ];
  redemptionSet2 = addIncentiveToRedemption(redemptionSet2);
  
  let redemptionSet3 = [
    "Stop by our booth during exhibition hours",
    `Ask about the ${incentiveKeyword} offering`,
    "Share your contact information",
    "Our team will set up your benefit on the spot"
  ];
  
  redemptionStepsOptions.push(redemptionSet1);
  redemptionStepsOptions.push(redemptionSet2);
  redemptionStepsOptions.push(redemptionSet3);
  
  // Create the final offer options
  const offers: OfferOption[] = [];
  
  for (let i = 0; i < 3; i++) {
    offers.push({
      title: titleOptions[i] || `Special ${eventName} Offer`,
      description: descriptionOptions[i % descriptionOptions.length] || `Exclusive offer for ${eventName} attendees. Collect now to learn more!`,
      redemptionSteps: redemptionStepsOptions[i % redemptionStepsOptions.length]
    });
  }
  
  return offers;
};
