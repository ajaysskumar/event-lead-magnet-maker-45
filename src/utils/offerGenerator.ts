
import { FormData } from "@/components/OfferCreationForm";

export interface OfferOption {
  title: string;
  description: string;
  redemptionSteps: string[];
}

export const generateOffers = (formData: FormData): OfferOption[] => {
  // Extract key information for the prompt
  const { exhibitorName, eventName, goal, secondaryActions, incentiveDescription } = formData;
  
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
  
  // Description generation based on incentive description
  const createCustomDescription = () => {
    const firstSentence = getIncentiveBasedSentence(secondaryActions, incentiveDescription);
    return `${firstSentence} Collect this offer to secure your spot!`;
  };
  
  const getIncentiveBasedSentence = (actions: string[], incentive: string) => {
    // If incentive is already short and compelling, use it directly
    if (incentive.length < 50 && !incentive.toLowerCase().includes('lorem ipsum')) {
      return incentive;
    }
    
    // Create more personalized first sentences based on secondary actions
    if (actions.includes("Demo")) {
      return `Get hands-on with our latest technology through a personalized demo.`;
    } else if (actions.includes("Discount")) {
      return `Enjoy special event pricing available only for a limited time.`;
    } else if (actions.includes("Giveaway")) {
      return `Enter our exclusive giveaway with limited entries accepted.`;
    } else if (actions.includes("Free Consultation")) {
      return `Receive expert advice tailored to your specific needs.`;
    } else if (actions.includes("Exclusive Access")) {
      return `Gain early access to our newest offerings before the general public.`;
    } else {
      // Extract a compelling fragment from the incentive description
      const sentences = incentive.split(/[.!?]/);
      const shortestSentence = sentences
        .filter(s => s.trim().length > 10)
        .sort((a, b) => a.length - b.length)[0];
      
      if (shortestSentence && shortestSentence.length < 100) {
        return shortestSentence.trim();
      }
      
      // If we can't find a good sentence, create one from the incentive
      const shortIncentive = incentive.length > 80 ? 
        `${incentive.substring(0, 80)}...` : 
        incentive;
      
      return shortIncentive;
    }
  };
  
  descriptionOptions.push(createCustomDescription());
  descriptionOptions.push(`Don't miss this opportunity: ${getIncentiveBasedSentence(secondaryActions, incentiveDescription)} Limited availability at our booth!`);
  descriptionOptions.push(`Exclusive for ${eventName} attendees. Collect now to unlock the full details and benefits.`);
  
  // Redemption steps generation - more specific and practical
  const boothText = `Visit our booth${goal.includes("traffic") ? " #XXX at " + eventName : ""}`;
  
  const redemptionSet1 = [
    boothText,
    "Show this collected offer to our staff",
    `Mention "${secondaryActions[0] || "special offer"}"`,
    "Get immediate access to your benefit"
  ];
  
  const redemptionSet2 = [
    `Find us at ${eventName}`,
    "Scan our QR code at the registration desk",
    "Complete a quick digital form",
    "Receive your exclusive access immediately"
  ];
  
  const redemptionSet3 = [
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
