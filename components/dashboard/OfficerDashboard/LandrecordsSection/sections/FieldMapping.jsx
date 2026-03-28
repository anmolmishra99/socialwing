import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const FieldMapping = ({
  template,
  csvHeaders,
  mappings,
  onMappingChange,
  onAddCustomField
}) => {
  const [customFieldName, setCustomFieldName] = useState('');
  const [showCustomFieldInput, setShowCustomFieldInput] = useState(false);

  const getMappingStatus = () => {
    const requiredFields = template.fields.filter(f => f.isRequired);
    const mappedRequiredFields = requiredFields.filter(field => 
      mappings[field.name] && mappings[field.name].trim() !== ''
    );
    return {
      total: template.fields.length,
      required: requiredFields.length,
      mapped: Object.keys(mappings).filter(key => mappings[key] && mappings[key].trim() !== '').length,
      mappedRequired: mappedRequiredFields.length
    };
  };

  const status = getMappingStatus();
  const allRequiredMapped = status.mappedRequired === status.required;

  const handleAddCustomField = () => {
    if (customFieldName.trim()) {
      onAddCustomField(customFieldName.trim());
      setCustomFieldName('');
      setShowCustomFieldInput(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Mapping</CardTitle>
        <CardDescription>
          Map CSV columns to template fields. Required fields are marked with an asterisk (*).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mapping Status */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Mapping Progress</h4>
              {allRequiredMapped ? (
                <Badge variant="success" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  All Required Mapped
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {status.mappedRequired}/{status.required} Required
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Fields:</span>
                <span className="font-medium ml-2">{status.total}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Mapped:</span>
                <span className="font-medium ml-2">{status.mapped}/{status.total}</span>
              </div>
            </div>
          </div>

          {/* Field Mappings */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {template.fields.map((field) => (
              <div key={field.name} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {field.displayName}
                    </span>
                    {field.isRequired && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {field.dataType}
                    </Badge>
                  </div>
                  {field.defaultValue !== undefined && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Default: {field.defaultValue}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <Select
                    value={mappings[field.name] || ''}
                    onValueChange={(value) => onMappingChange(field.name, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select CSV column...">
                        {mappings[field.name] ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <span>{mappings[field.name]}</span>
                          </div>
                        ) : (
                          'Select CSV column...'
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Skip this field</SelectItem>
                      {csvHeaders.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Field */}
          <div className="border-t pt-4">
            {!showCustomFieldInput ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomFieldInput(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Field
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter field name..."
                  value={customFieldName}
                  onChange={(e) => setCustomFieldName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomField()}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleAddCustomField}
                  disabled={!customFieldName.trim()}
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowCustomFieldInput(false);
                    setCustomFieldName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* CSV Headers Info */}
          {csvHeaders.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium text-sm mb-2">CSV Column Headers</h4>
              <div className="flex flex-wrap gap-2">
                {csvHeaders.map((header, index) => (
                  <Badge key={`${header}-${index}`} variant="secondary" className="text-xs">
                    {header}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Validation Warning */}
          {!allRequiredMapped && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please map all required fields before proceeding with the upload.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldMapping;