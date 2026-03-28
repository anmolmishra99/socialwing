import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus } from 'lucide-react';

export const TemplateSelection = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onTemplateCreate,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Templates</CardTitle>
          <CardDescription>Fetching available templates from Firestore...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Select Template</CardTitle>
            <CardDescription>
              Choose a template for CSV upload. Templates define the required fields and data structure.
            </CardDescription>
          </div>
          <Button onClick={onTemplateCreate} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="template-select" className="text-sm font-medium">
              Template
            </label>
            <Select
              value={selectedTemplate?.id || ''}
              onValueChange={(value) => {
                const template = templates.find(t => t.id === value);
                if (template) {
                  onTemplateSelect(template);
                }
              }}
            >
              <SelectTrigger id="template-select">
                <SelectValue placeholder="Select a template...">
                  {selectedTemplate ? (
                    <div className="flex items-center gap-2">
                      <span>{selectedTemplate.templateName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {selectedTemplate.uploadedHeaders?.length || 0} columns
                      </Badge>
                    </div>
                  ) : 'Select a template...'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {templates.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No templates available. Create one to get started.
                  </div>
                ) : (
                  templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{template.templateName}</span>
                          <Badge variant="outline" className="text-xs">
                            {template.actName}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {template.uploadedHeaders?.length || 0} columns • {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'No date'}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium text-sm mb-2">Template Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Act Name:</span>
                  <span className="font-medium">{selectedTemplate.actName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Columns:</span>
                  <span className="font-medium">{selectedTemplate.uploadedHeaders?.length || 0}</span>
                </div>
              
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {selectedTemplate.createdAt 
                      ? new Date(selectedTemplate.createdAt).toLocaleDateString() 
                      : 'Unknown'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelection;