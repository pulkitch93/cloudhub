import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const steps = [
  "Organization Details",
  "Contracting Model",
  "Infrastructure",
  "Compliance & Support",
  "Review & Create",
];

export default function CreateOrganization() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    orgName: "",
    vertical: "",
    contractModel: "",
    stackType: "",
    regions: [] as string[],
    compliancePack: "",
    supportLevel: "",
    ssoEnabled: false,
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast.success("Organization created successfully!");
    navigate("/admin/tenant-directory");
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/tenant-directory")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create New Organization
            </h1>
            <p className="text-muted-foreground mt-1">
              Set up a new customer deployment
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="text-sm mt-2 text-center">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    index < currentStep ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Organization Name *</Label>
                  <Input
                    value={formData.orgName}
                    onChange={(e) => updateFormData("orgName", e.target.value)}
                    placeholder="Acme Corporation"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry Vertical *</Label>
                  <Select
                    value={formData.vertical}
                    onValueChange={(value) => updateFormData("vertical", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vertical" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Contracting Model *</Label>
                  <Select
                    value={formData.contractModel}
                    onValueChange={(value) => updateFormData("contractModel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truscale">CloudHub (Consumption-based)</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="perpetual">Perpetual License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Stack Type *</Label>
                  <Select
                    value={formData.stackType}
                    onValueChange={(value) => updateFormData("stackType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stack" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vmware">VMware</SelectItem>
                      <SelectItem value="azure">Azure Stack HCI</SelectItem>
                      <SelectItem value="nutanix">Nutanix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Deployment Regions *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["US East", "US West", "EU West", "EU Central", "APAC"].map(
                      (region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={region}
                            checked={formData.regions.includes(region)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData("regions", [
                                  ...formData.regions,
                                  region,
                                ]);
                              } else {
                                updateFormData(
                                  "regions",
                                  formData.regions.filter((r) => r !== region)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={region}>{region}</Label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Compliance Pack *</Label>
                  <Select
                    value={formData.compliancePack}
                    onValueChange={(value) => updateFormData("compliancePack", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select compliance pack" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="hipaa">HIPAA (Healthcare)</SelectItem>
                      <SelectItem value="pci">PCI-DSS (Finance)</SelectItem>
                      <SelectItem value="gdpr">GDPR (EU)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Support Level *</Label>
                  <Select
                    value={formData.supportLevel}
                    onValueChange={(value) => updateFormData("supportLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select support level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (Business Hours)</SelectItem>
                      <SelectItem value="premium">Premium (24/7)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (Dedicated)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sso"
                    checked={formData.ssoEnabled}
                    onCheckedChange={(checked) =>
                      updateFormData("ssoEnabled", checked)
                    }
                  />
                  <Label htmlFor="sso">Enable SSO Integration</Label>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Review Configuration</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Organization Name</p>
                    <p className="font-medium">{formData.orgName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vertical</p>
                    <p className="font-medium">{formData.vertical || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contract Model</p>
                    <p className="font-medium">{formData.contractModel || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stack Type</p>
                    <p className="font-medium">{formData.stackType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Regions</p>
                    <p className="font-medium">
                      {formData.regions.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Compliance Pack</p>
                    <p className="font-medium">{formData.compliancePack || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Support Level</p>
                    <p className="font-medium">{formData.supportLevel || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">SSO Enabled</p>
                    <p className="font-medium">{formData.ssoEnabled ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Create Organization
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
