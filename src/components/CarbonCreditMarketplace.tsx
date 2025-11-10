import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Leaf, MapPin, CheckCircle2, TrendingUp, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CarbonCredit {
  id: string;
  provider: string;
  project: string;
  location: string;
  type: "reforestation" | "renewable" | "carbon-capture" | "conservation";
  pricePerTon: number;
  available: number;
  certification: string;
  vintage: number;
  description: string;
}

const mockCredits: CarbonCredit[] = [
  {
    id: "1",
    provider: "Verified Carbon Standard",
    project: "Amazon Rainforest Conservation",
    location: "Brazil",
    type: "reforestation",
    pricePerTon: 25,
    available: 5000,
    certification: "VCS",
    vintage: 2024,
    description: "Protect 50,000 acres of pristine Amazon rainforest from deforestation"
  },
  {
    id: "2",
    provider: "Gold Standard",
    project: "Wind Farm Energy - Gujarat",
    location: "India",
    type: "renewable",
    pricePerTon: 18,
    available: 8500,
    certification: "Gold Standard",
    vintage: 2024,
    description: "125MW wind power replacing coal-based electricity generation"
  },
  {
    id: "3",
    provider: "Climate Action Reserve",
    project: "Direct Air Capture Facility",
    location: "Iceland",
    type: "carbon-capture",
    pricePerTon: 45,
    available: 1200,
    certification: "CAR",
    vintage: 2024,
    description: "Advanced DAC technology permanently removing CO₂ from atmosphere"
  },
  {
    id: "4",
    provider: "American Carbon Registry",
    project: "Ocean Blue Carbon - Mangroves",
    location: "Indonesia",
    type: "conservation",
    pricePerTon: 22,
    available: 3800,
    certification: "ACR",
    vintage: 2024,
    description: "Restore and protect coastal mangrove ecosystems"
  }
];

export const CarbonCreditMarketplace = () => {
  const [selectedCredit, setSelectedCredit] = useState<CarbonCredit | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(100);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const getTypeIcon = (type: CarbonCredit["type"]) => {
    switch (type) {
      case "reforestation":
        return <Leaf className="h-4 w-4" />;
      case "renewable":
        return <TrendingUp className="h-4 w-4" />;
      case "carbon-capture":
        return <Award className="h-4 w-4" />;
      case "conservation":
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: CarbonCredit["type"]) => {
    switch (type) {
      case "reforestation":
        return <Badge className="bg-success/10 text-success border-success/20">Reforestation</Badge>;
      case "renewable":
        return <Badge className="bg-chart-4/10 text-[hsl(var(--chart-4))] border-chart-4/20">Renewable Energy</Badge>;
      case "carbon-capture":
        return <Badge className="bg-chart-5/10 text-[hsl(var(--chart-5))] border-chart-5/20">Carbon Capture</Badge>;
      case "conservation":
        return <Badge className="bg-accent/10 text-accent border-accent/20">Conservation</Badge>;
    }
  };

  const handlePurchaseClick = (credit: CarbonCredit) => {
    setSelectedCredit(credit);
    setIsPurchaseDialogOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedCredit) {
      const totalCost = purchaseAmount * selectedCredit.pricePerTon;
      toast({
        title: "Purchase Successful!",
        description: `Purchased ${purchaseAmount}T of carbon credits from ${selectedCredit.project} for $${totalCost.toLocaleString()}`,
      });
      setIsPurchaseDialogOpen(false);
      setPurchaseAmount(100);
    }
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-success" />
              <CardTitle className="text-foreground">Carbon Credit Marketplace</CardTitle>
            </div>
            <Badge variant="outline" className="text-muted-foreground">
              4 Projects Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCredits.map((credit) => (
              <div 
                key={credit.id} 
                className="p-4 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{credit.project}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {credit.location}
                      </div>
                    </div>
                    {getTypeIcon(credit.type)}
                  </div>

                  <div className="flex items-center gap-2">
                    {getTypeBadge(credit.type)}
                    <Badge variant="outline" className="text-xs">
                      {credit.certification}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {credit.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        ${credit.pricePerTon}
                        <span className="text-sm text-muted-foreground font-normal">/ton</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {credit.available.toLocaleString()} tons available
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-success border-success/20 hover:bg-success/10"
                      onClick={() => handlePurchaseClick(credit)}
                    >
                      Purchase
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Purchase Carbon Credits</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Offset your carbon footprint by purchasing verified carbon credits
            </DialogDescription>
          </DialogHeader>

          {selectedCredit && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <h4 className="font-semibold text-foreground mb-2">{selectedCredit.project}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3 w-3" />
                  {selectedCredit.location} • {selectedCredit.certification} Certified • Vintage {selectedCredit.vintage}
                </div>
                <p className="text-sm text-muted-foreground">{selectedCredit.description}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Amount (tons of CO₂)
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedCredit.available}
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum: {selectedCredit.available.toLocaleString()} tons available
                </p>
              </div>

              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Price per ton:</span>
                  <span className="text-sm font-medium text-foreground">${selectedCredit.pricePerTon}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Amount:</span>
                  <span className="text-sm font-medium text-foreground">{purchaseAmount}T</span>
                </div>
                <div className="pt-2 border-t border-success/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total:</span>
                    <span className="text-xl font-bold text-success">
                      ${(purchaseAmount * selectedCredit.pricePerTon).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPurchaseDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-success hover:bg-success/90 text-success-foreground"
              onClick={handleConfirmPurchase}
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};