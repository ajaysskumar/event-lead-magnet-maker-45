
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
  
  const incentiveKeyword = incentiveWords.length > 0 
    ? incentiveWords[0] 
    : secondaryActions[0] || "Exclusive";
  
  // Title generation focusing on incentive and exhibitor
  if (goal.includes("leads")) {
    titleOptions.push(`${exhibitorName} ${incentiveKeyword} Opportunity`);
    titleOptions.push(`${incentiveKeyword} from ${exhibitorName}`);
  } else if (goal.includes("brand")) {
    titleOptions.push(`Experience ${exhibitorName}'s ${incentiveKeyword}`);
    titleOptions.push(`${exhibitorName} ${secondaryActions[0] || "Experience"}`);
  } else {
    titleOptions.push(`${exhibitorName} ${secondaryActions[0] || "Special"}`);
    titleOptions.push(`${incentiveKeyword} by ${exhibitorName}`);
  }
  
  // Add one more creative option based on incentive
  titleOptions.push(`${exhibitorName} ${secondaryActions[0] || ""} ${incentiveKeyword}`.trim());
  
  // Description generation based on incentive description
  const createCustomDescription = () => {
    const firstSentence = getIncentiveBasedSentence(secondaryActions, incentiveDescription);
    return `${firstSentence} Collect this offer to secure your spot!`;
  };
  
  const getIncentiveBasedSentence = (actions: string[], incentive: string) => {
    if (incentive.length < 15) {
      return `Don't miss ${exhibitorName}'s exclusive offer.`;
    }
    
    // Create more personalized first sentences based on secondary actions
    if (actions.includes("Demo")) {
      return `See our product in action with a personalized demo.`;
    } else if (actions.includes("Discount")) {
      return `Access special pricing only available to event attendees.`;
    } else if (actions.includes("Giveaway")) {
      return `Join our exclusive giveaway with limited entries accepted.`;
    } else if (actions.includes("Free Consultation")) {
      return `Get expert advice with our complimentary consultation.`;
    } else if (actions.includes("Exclusive Access")) {
      return `Gain privileged access to our latest offerings.`;
    } else {
      // Use parts of the incentive description itself
      const shortIncentive = incentive.length > 50 ? 
        `${incentive.substring(0, 50)}...` : 
        incentive;
      
      return `${shortIncentive}`;
    }
  };
  
  descriptionOptions.push(createCustomDescription());
  descriptionOptions.push(`${exhibitorName} presents: ${getIncentiveBasedSentence(secondaryActions, incentiveDescription)} Limited availability!`);
  descriptionOptions.push(`Exclusive opportunity from ${exhibitorName}. Collect now to unlock the details!`);
  
  // Redemption steps generation
  const redemptionSet1 = [
    `Visit ${exhibitorName} at booth #XXX`,
    "Show the collected offer to our staff",
    "Complete a quick demo/consultation",
    "Receive your exclusive benefit immediately"
  ];
  
  const redemptionSet2 = [
    `Find us at the event space`,
    "Mention the offer code: EVENT2024",
    "Share your business card or contact info",
    "We'll set up your benefit within 24 hours"
  ];
  
  const redemptionSet3 = [
    "Scan the QR code at our registration desk",
    `Tell our team you're here for the "${secondaryActions[0] || "special"}" offer`,
    "Complete a brief preferences form",
    "Get immediate access to your exclusive benefit"
  ];
  
  redemptionStepsOptions.push(redemptionSet1);
  redemptionStepsOptions.push(redemptionSet2);
  redemptionStepsOptions.push(redemptionSet3);
  
  // Create the final offer options
  const offers: OfferOption[] = [];
  
  for (let i = 0; i < 3; i++) {
    offers.push({
      title: titleOptions[i] || `${exhibitorName} Special Offer`,
      description: descriptionOptions[i % descriptionOptions.length] || `Exclusive offer from ${exhibitorName}. Collect now to learn more!`,
      redemptionSteps: redemptionStepsOptions[i % redemptionStepsOptions.length]
    });
  }
  
  return offers;
};
