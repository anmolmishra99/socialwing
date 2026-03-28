import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, AlertCircle, Upload, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';  // Import XLSX at the top level

export const TemplateCreationDialog = ({
  open,
  onOpenChange,
  onTemplateCreate,
  initialHeaders = []
}) => {
  const [templateName, setTemplateName] = useState('');
  const [actName, setActName] = useState('');
  const [fields, setFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldDisplayName, setNewFieldDisplayName] = useState('');
  const [newFieldDataType, setNewFieldDataType] = useState('string');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [error, setError] = useState('');
  const [uploadedHeaders, setUploadedHeaders] = useState([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef(null);

  const addField = () => {
    if (!newFieldName.trim()) {
      setError('Field name is required');
      return;
    }

    const newField = {
      name: newFieldName.trim().toLowerCase().replace(/\s+/g, '_'),
      displayName: newFieldDisplayName.trim() || newFieldName.trim(),
      dataType: newFieldDataType,
      isRequired: newFieldRequired
    };

    setFields([...fields, newField]);
    setNewFieldName('');
    setNewFieldDisplayName('');
    setNewFieldDataType('string');
    setNewFieldRequired(false);
    setError('');
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!templateName.trim()) {
      setError('Template name is required');
      return;
    }

    if (!actName.trim()) {
      setError('Act name is required');
      return;
    }

    if (uploadedHeaders.length === 0) {
      setError('Please upload a file to extract headers');
      return;
    }

    // if (fields.length === 0) {
    //   setError('At least one field is required');
    //   return;
    // }

    const template= {
      templateName: templateName.trim(),
      actName: actName.trim(),
      fields: fields,
      uploadedHeaders: uploadedHeaders, // Include the uploaded headers
      createdBy: 'current_user', // This should come from auth context
      isActive: true
    };

    onTemplateCreate(template);
    resetForm();
  };

  const resetForm = () => {
    setTemplateName('');
    setActName('');
    setFields([]);
    setNewFieldName('');
    setNewFieldDisplayName('');
    setNewFieldDataType('string');
    setNewFieldRequired(false);
    setError('');
    setUploadedHeaders([]); // Reset uploaded headers
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const quickAddFromHeaders = () => {
    if (initialHeaders.length > 0) {
      const newFields = initialHeaders.map(header => ({
        name: header.toLowerCase().replace(/\s+/g, '_'),
        displayName: header,
        dataType: 'string' ,
        isRequired: false
      }));
      setFields([...fields, ...newFields]);
    }
  };

  const addAllHeadersAsFields = () => {
    if (initialHeaders.length > 0) {
      const newFields = initialHeaders.map(header => ({
        name: header.toLowerCase().replace(/\s+/g, '_'),
        displayName: header,
        dataType: 'string' ,
        isRequired: false
      }));
      setFields(newFields);
    }
  };

  const extractHeadersFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          let headers = [];
          
          if (file.name.toLowerCase().endsWith('.csv')) {
            // Parse CSV
            const text = data;
            const lines = text.split('\n');
            if (lines.length > 0) {
              headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            }
          } else if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
            // Parse Excel
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length > 0) {
              headers = jsonData[0].map(h => String(h || '').trim());
            }
          }
          
          // Filter out empty headers and headers with 1 character or less
          const validHeaders = headers.filter(h => h && h.length > 1);
          resolve(validHeaders);
        } catch (error) {
          reject(new Error('Failed to parse file: ' + error.message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setError('');
    
    try {
      const headers = await extractHeadersFromFile(file);
      setUploadedHeaders(headers);
      
      const validHeaders = headers.filter(h => h && h.length > 1);
      if (validHeaders.length > 0) {
        toast.success(`Found ${validHeaders.length} valid columns from ${file.name}`);
      } else {
        setError('No valid columns found. Please check your file format.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';  // Reset file input
      }
    }
  };

  const addUploadedHeadersAsFields = () => {
    const validHeaders = uploadedHeaders.filter(h => h && h.length > 1);
    if (validHeaders.length > 0) {
      const newFields = validHeaders.map(header => ({
        name: header.toLowerCase().replace(/\s+/g, '_'),
        displayName: header,
        dataType: 'string',
        isRequired: false
      }));
      setFields([...fields, ...newFields]);
    }
  };

  const replaceFieldsWithUploadedHeaders = () => {
    const validHeaders = uploadedHeaders.filter(h => h && h.length > 1);
    if (validHeaders.length > 0) {
      const newFields = validHeaders.map(header => ({
        name: header.toLowerCase().replace(/\s+/g, '_'),
        displayName: header,
        dataType: 'string',
        isRequired: false
      }));
      setFields(newFields);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a new template for CSV upload. Define the fields and their data types.
            {initialHeaders.length > 0 && (
              <div className="mt-2 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">
                  Found {initialHeaders.length} CSV headers:
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {initialHeaders.slice(0, 10).map((header, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {header}
                    </Badge>
                  ))}
                  {initialHeaders.length > 10 && (
                    <Badge variant="outline" className="text-xs">
                      +{initialHeaders.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload CSV/Excel File</h3>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="template-file-upload"
                disabled={isProcessingFile}
              />
              <Label htmlFor="template-file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-sm font-medium">
                    {isProcessingFile ? 'Processing file...' : 'Click to upload CSV/Excel file'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Supported formats: CSV, XLSX, XLS
                  </div>
                </div>
              </Label>
            </div>

            {uploadedHeaders.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Extracted Columns ({uploadedHeaders.length})</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={replaceFieldsWithUploadedHeaders}
                    >
                      Replace All Fields
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addUploadedHeadersAsFields}
                    >
                      Add as Fields
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {uploadedHeaders.map((header, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border text-sm ${
                        header && header.length > 1
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      <div className="font-medium">{header || 'Empty Column'}</div>
                      <div className="text-xs text-muted-foreground">
                        {header && header.length > 1 ? 'Valid' : 'Skipped (≤1 char)'}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Columns with 1 character or less are automatically skipped
                </p>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name *</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Land Acquisition Act Template"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="act-name">Act Name *</Label>
                <Input
                  id="act-name"
                  value={actName}
                  onChange={(e) => setActName(e.target.value)}
                  placeholder="e.g., Land Acquisition Act 1894"
                />
              </div>
            </div>
          </div>

          {/* Fields Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Fields ({fields.length})</h3>
              {initialHeaders.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addAllHeadersAsFields}
                  >
                    Add All Headers
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={quickAddFromHeaders}
                  >
                    Append Headers
                  </Button>
                </div>
              )}
            </div>

            {/* Add New Field */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Add New Field</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field-name">Field Name *</Label>
                  <Input
                    id="field-name"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="e.g., owner_name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    value={newFieldDisplayName}
                    onChange={(e) => setNewFieldDisplayName(e.target.value)}
                    placeholder="e.g., Owner Name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data-type">Data Type</Label>
                  <select
                    id="data-type"
                    value={newFieldDataType}
                    onChange={(e) => setNewFieldDataType(e.target.value )}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="required" className="flex items-center gap-2">
                    <input
                      id="required"
                      type="checkbox"
                      checked={newFieldRequired}
                      onChange={(e) => setNewFieldRequired(e.target.checked)}
                      className="rounded"
                    />
                    Required Field
                  </Label>
                </div>
              </div>
              <Button onClick={addField} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            {/* Fields List */}
            {fields.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{field.displayName}</span>
                        {field.isRequired && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {field.dataType}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {field.name}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} >
            Create Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateCreationDialog;