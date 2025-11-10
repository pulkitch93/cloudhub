import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface ValidationRule {
  id: string;
  field: string;
  operator: string;
  value: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  rules: ValidationRule[];
  createdAt: string;
}

interface PolicyTemplateBuilderProps {
  onSave: (template: PolicyTemplate) => void;
  initialTemplate?: PolicyTemplate;
}

export const PolicyTemplateBuilder = ({ onSave, initialTemplate }: PolicyTemplateBuilderProps) => {
  const [name, setName] = useState(initialTemplate?.name || "");
  const [description, setDescription] = useState(initialTemplate?.description || "");
  const [category, setCategory] = useState(initialTemplate?.category || "");
  const [rules, setRules] = useState<ValidationRule[]>(initialTemplate?.rules || []);

  const addRule = () => {
    const newRule: ValidationRule = {
      id: Math.random().toString(36).substr(2, 9),
      field: "",
      operator: "equals",
      value: "",
      severity: "medium"
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, field: keyof ValidationRule, value: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleSave = () => {
    if (!name || !category || rules.length === 0) {
      toast.error("Please fill in all required fields and add at least one rule");
      return;
    }

    const template: PolicyTemplate = {
      id: initialTemplate?.id || Math.random().toString(36).substr(2, 9),
      name,
      description,
      category,
      rules,
      createdAt: initialTemplate?.createdAt || new Date().toISOString()
    };

    onSave(template);
    toast.success("Policy template saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Policy Template Builder</CardTitle>
        <CardDescription>Create custom compliance rules and validation logic</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Custom GDPR Compliance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data-privacy">Data Privacy</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="access-control">Access Control</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose and scope of this policy template"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Validation Rules *</Label>
            <Button onClick={addRule} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>

          {rules.map((rule, index) => (
            <Card key={rule.id} className="p-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Rule {index + 1}</h4>
                  <Button
                    onClick={() => removeRule(rule.id)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Field</Label>
                    <Input
                      value={rule.field}
                      onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                      placeholder="e.g., encryption_enabled"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Operator</Label>
                    <Select
                      value={rule.operator}
                      onValueChange={(value) => updateRule(rule.id, 'operator', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="not_equals">Not Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                        <SelectItem value="exists">Exists</SelectItem>
                        <SelectItem value="not_exists">Not Exists</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Expected Value</Label>
                    <Input
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                      placeholder="e.g., true"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select
                      value={rule.severity}
                      onValueChange={(value) => updateRule(rule.id, 'severity', value as ValidationRule['severity'])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {rules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No rules added yet. Click "Add Rule" to create validation rules.
            </div>
          )}
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Policy Template
        </Button>
      </CardContent>
    </Card>
  );
};
