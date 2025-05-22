
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FormData {
  exhibitorName: string;
  category: string;
  eventName: string;
  goal: string;
  secondaryActions: string[];
  incentiveDescription: string;
}

interface OfferCreationFormProps {
  onSubmit: (data: FormData) => void;
}

const goals = [
  "Generates large volume of leads",
  "High quality of leads",
  "Great brand exposure",
  "Gain credibility for your brand",
  "Drive social following",
  "Promotes product",
  "Booth Traffic",
  "Leads & interest continue post-event",
  "Thought Leadership / Educator",
  "Drive attendance at your private event"
];

const secondaryActions = [
  "Demo",
  "Discount",
  "Giveaway",
  "Exclusive Access",
  "Free Consultation",
  "Limited Time Offer",
  "Product Sample",
  "Free Trial",
  "VIP Experience",
  "Early Access"
];

const OfferCreationForm = ({ onSubmit }: OfferCreationFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    exhibitorName: "",
    category: "",
    eventName: "",
    goal: "",
    secondaryActions: [],
    incentiveDescription: "",
  });

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSecondaryActionToggle = (action: string) => {
    setFormData(prev => {
      const actions = [...prev.secondaryActions];
      if (actions.includes(action)) {
        return { ...prev, secondaryActions: actions.filter(a => a !== action) };
      } else {
        return { ...prev, secondaryActions: [...actions, action] };
      }
    });
  };

  const nextStep = () => {
    if (isStepValid()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStepValid()) {
      onSubmit(formData);
    }
  };

  const isStepValid = () => {
    switch(step) {
      case 1:
        return formData.exhibitorName && formData.category && formData.eventName;
      case 2:
        return formData.goal;
      case 3:
        return formData.secondaryActions.length > 0;
      case 4:
        return formData.incentiveDescription.length > 0;
      default:
        return true;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create an Offer</CardTitle>
        <CardDescription>
          Step {step} of 4: {step === 1 ? "Basic Info" : step === 2 ? "Select Goal" : step === 3 ? "Select Incentive Type" : "Describe Incentive"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exhibitorName">Exhibitor Name</Label>
                <Input
                  id="exhibitorName"
                  placeholder="Enter exhibitor name"
                  value={formData.exhibitorName}
                  onChange={(e) => handleChange("exhibitorName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  placeholder="Enter event name"
                  value={formData.eventName}
                  onChange={(e) => handleChange("eventName", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">What is your goal at {formData.eventName}?</Label>
                <Select
                  value={formData.goal}
                  onValueChange={(value) => handleChange("goal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => (
                      <SelectItem key={goal} value={goal}>
                        {goal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Incentive Type (select multiple)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {secondaryActions.map((action) => (
                    <Badge
                      key={action}
                      variant={formData.secondaryActions.includes(action) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleSecondaryActionToggle(action)}
                    >
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="incentiveDescription">
                  Describe your incentive (demo, discount, giveaway, etc.)
                </Label>
                <Textarea
                  id="incentiveDescription"
                  placeholder="Describe what you're offering in detail..."
                  value={formData.incentiveDescription}
                  onChange={(e) => handleChange("incentiveDescription", e.target.value)}
                  rows={5}
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep} type="button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : (
          <div></div>
        )}
        {step < 4 ? (
          <Button onClick={nextStep} disabled={!isStepValid()} type="button">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!isStepValid()} type="submit">
            Generate Offers
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OfferCreationForm;
