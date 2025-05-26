
import React, { useState } from "react";
import OfferCreationForm, { FormData } from "@/components/OfferCreationForm";
import OfferDisplay from "@/components/OfferDisplay";
import { generateOffers, OfferOption } from "@/utils/offerGenerator";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [step, setStep] = useState<"form" | "results">("form");
  const [offers, setOffers] = useState<OfferOption[]>([]);
  const { toast } = useToast();

  const handleFormSubmit = async (data: FormData) => {
    try {
      const generatedOffers = await generateOffers(data);
      setOffers(generatedOffers);
      setStep("results");
      toast({
        title: "Offers Generated",
        description: "Choose the offer that best fits your needs.",
      });
    } catch (error) {
      console.error("Error generating offers:", error);
      toast({
        title: "Error",
        description: "Failed to generate offers. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setStep("form");
    setOffers([]);
  };

  return (
    <div className="container py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Event Offer Creator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create compelling event offers that help you achieve your goals and drive engagement with your booth visitors.
        </p>
      </header>

      <main>
        {step === "form" ? (
          <OfferCreationForm onSubmit={handleFormSubmit} />
        ) : (
          <OfferDisplay offers={offers} onReset={handleReset} />
        )}
      </main>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Event Offer Creator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
