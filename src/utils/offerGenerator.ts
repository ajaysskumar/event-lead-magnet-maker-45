
import { FormData } from "@/components/OfferCreationForm";

export interface OfferOption {
  title: string;
  description: string;
  redemptionSteps: string[];
}

export const generateOffers = (formData: FormData): OfferOption[] => {
  // Extract key information for the prompt
  const { exhibitorName, eventName, goal, secondaryActions, incentiveDescription } = formData;
  
  // Generate different titles based on goal and actions
  let titleOptions: string[] = [];
  let descriptionOptions: string[] = [];
  let redemptionStepsOptions: string[][] = [];
  
  // Title generation based on goal and secondary actions
  if (goal.includes("leads")) {
    titleOptions.push(`Exclusive ${eventName} offer from ${exhibitorName}`);
    titleOptions.push(`Limited-time ${secondaryActions[0]} opportunity at ${eventName}`);
  } else if (goal.includes("brand")) {
    titleOptions.push(`Experience ${exhibitorName} at ${eventName}`);
    titleOptions.push(`${exhibitorName} ${secondaryActions[0]} - ${eventName} Special`);
  } else {
    titleOptions.push(`${exhibitorName} ${secondaryActions[0]} at ${eventName}`);
    titleOptions.push(`Special ${eventName} ${secondaryActions[0]} by ${exhibitorName}`);
  }
  
  // Add one more creative option
  titleOptions.push(`${secondaryActions[0] || "Exclusive"} ${eventName} Opportunity - ${exhibitorName}`);
  
  // Description generation based on goal and incentive
  if (secondaryActions.includes("Demo")) {
    descriptionOptions.push(`See our product in action! Collect this offer to schedule your personal demo at ${eventName}. Limited slots available.`);
  } else if (secondaryActions.includes("Discount")) {
    descriptionOptions.push(`Special ${eventName} pricing! Collect this offer to unlock exclusive discounts only available during the event.`);
  } else if (secondaryActions.includes("Giveaway")) {
    descriptionOptions.push(`Win big with ${exhibitorName}! Collect this offer to enter our ${eventName} giveaway. Limited entries accepted.`);
  } else {
    descriptionOptions.push(`Don't miss out on our exclusive ${eventName} offer. Collect now to secure your spot!`);
  }
  
  // Add more description options
  descriptionOptions.push(`${exhibitorName} presents a special opportunity at ${eventName}. Collect this offer to unlock the details!`);
  descriptionOptions.push(`Collect this exclusive ${eventName} offer from ${exhibitorName}. Limited availability!`);
  
  // Redemption steps generation
  const redemptionSet1 = [
    `Visit ${exhibitorName} at booth #XXX`,
    "Show the collected offer to our staff",
    "Complete a quick demo/consultation",
    "Receive your exclusive benefit immediately"
  ];
  
  const redemptionSet2 = [
    `Find us at the ${eventName} event space`,
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
      title: titleOptions[i] || `${exhibitorName} at ${eventName} - Special Offer`,
      description: descriptionOptions[i % descriptionOptions.length] || `Exclusive offer from ${exhibitorName} at ${eventName}. Collect now to learn more!`,
      redemptionSteps: redemptionStepsOptions[i % redemptionStepsOptions.length]
    });
  }
  
  return offers;
};
