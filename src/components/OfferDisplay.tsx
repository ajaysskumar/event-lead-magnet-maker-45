
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OfferOption } from "@/utils/offerGenerator";
import { Check, Copy, MapPin, ArrowRight } from "lucide-react";

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
                <Card className="border-2 hover:border-primary/50 transition-all bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {offer.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2 mb-4 text-gray-700">
                      {offer.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-center pt-2 pb-6">
                    <Button 
                      onClick={() => handleCollectOffer(offer)}
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
                    >
                      Collect Offer
                    </Button>
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
        <Card className="border-none rounded-xl shadow-md overflow-hidden bg-blue-50">
          <div className="bg-white p-6 pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {selectedOffer?.title}
                </CardTitle>
                <CardDescription className="text-base mt-3 mb-2 text-gray-700">
                  {selectedOffer?.description}
                </CardDescription>
              </div>
              <div className="bg-green-600 rounded-full p-3 flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <CardContent className="px-6 py-5">
            <h3 className="text-xl font-semibold mb-4">Steps to redeem</h3>
            <ol className="space-y-3 list-none">
              {selectedOffer?.redemptionSteps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                    <span className="flex items-center justify-center w-8 h-8 text-lg font-semibold">
                      {index + 1}.
                    </span>
                  </div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
            
            <div className="mt-6 flex justify-center">
              <Button 
                className="w-full py-4 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-200 rounded-full flex items-center justify-center gap-3"
                variant="outline"
              >
                <MapPin className="h-5 w-5" />
                <span className="text-lg">Stand N4-514</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-0 pb-6 px-6 gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowRedemption(false)}
              className="flex-1"
            >
              Back to Offers
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCopyToClipboard}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy Offer"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default OfferDisplay;
