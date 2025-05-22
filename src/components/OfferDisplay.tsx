
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OfferOption } from "@/utils/offerGenerator";
import { Check, Copy, Ticket } from "lucide-react";

interface OfferDisplayProps {
  offers: OfferOption[];
  onReset: () => void;
}

const OfferDisplay = ({ offers, onReset }: OfferDisplayProps) => {
  const [selectedOffer, setSelectedOffer] = useState<OfferOption | null>(null);
  const [showRedemption, setShowRedemption] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCollectOffer = (offer: OfferOption) => {
    setSelectedOffer(offer);
    setShowRedemption(true);
  };

  const handleCopyToClipboard = () => {
    if (!selectedOffer) return;
    
    const offerText = `
Title: ${selectedOffer.title}

Description: ${selectedOffer.description}

Redemption Steps:
${selectedOffer.redemptionSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(offerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!showRedemption ? (
        <>
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Choose Your Offer</h2>
            <p className="text-muted-foreground">Select one of the generated offers below</p>
          </div>
          
          <Tabs defaultValue="offer1" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="offer1">Offer 1</TabsTrigger>
              <TabsTrigger value="offer2">Offer 2</TabsTrigger>
              <TabsTrigger value="offer3">Offer 3</TabsTrigger>
            </TabsList>
            
            {offers.map((offer, index) => (
              <TabsContent key={index} value={`offer${index + 1}`} className="mt-0">
                <Card className="border-2 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      {offer.title}
                    </CardTitle>
                    <CardDescription className="text-base">{offer.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-center pt-2 pb-6">
                    <Button onClick={() => handleCollectOffer(offer)}>Collect Offer</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={onReset}>Start Over</Button>
          </div>
        </>
      ) : (
        <Card className="border-2 border-primary/50 transition-all">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  {selectedOffer?.title}
                </CardTitle>
                <CardDescription className="text-base mt-2">{selectedOffer?.description}</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyToClipboard}
                className="h-9 w-9"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Redemption Steps:</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {selectedOffer?.redemptionSteps.map((step, index) => (
                  <li key={index} className="text-muted-foreground">{step}</li>
                ))}
              </ol>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline" onClick={() => setShowRedemption(false)}>Back to Offers</Button>
            <Button variant="outline" onClick={onReset}>Start Over</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default OfferDisplay;
