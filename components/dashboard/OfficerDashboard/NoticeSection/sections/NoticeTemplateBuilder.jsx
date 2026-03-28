import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';
import { Plus, Save, FileText, Trash2, Edit, Settings, RefreshCw } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { UserAuth } from '@/app/context/AuthContext';
import { 
  saveNoticeTemplate, 
  loadNoticeTemplates, 
  loadLandRecordTemplates
} from '@/utils/noticeTemplateUtils';

const NoticeTemplateBuilder = ({ 
  onTemplateSelect,
  landRecords = [] 
}) => {
  const { user } = UserAuth();
  const [landRecordTemplates, setLandRecordTemplates] = useState([]);
  const [noticeTemplates, setNoticeTemplates] = useState([]);
  const [selectedLandRecordTemplate, setSelectedLandRecordTemplate] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load land record templates on component mount
  useEffect(() => {
    loadLandRecordTemplatesData();
    loadNoticeTemplatesData();
  }, []);

  const loadLandRecordTemplatesData = async () => {
    try {
      setLoading(true);
      const templates = await loadLandRecordTemplates();
      setLandRecordTemplates(templates);
    } catch (error) {
      toast.error('Failed to load land record templates');
      console.error('Error loading land record templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNoticeTemplatesData = async () => {
    try {
      const templates = await loadNoticeTemplates(user?.uid);
      setNoticeTemplates(templates);
    } catch (error) {
      toast.error('Failed to load notice templates');
      console.error('Error loading notice templates:', error);
    }
  };

  const handleLandRecordTemplateSelect = (templateId) => {
    const template = landRecordTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedLandRecordTemplate(template);
      // Initialize with all fields selected by default
      setSelectedFields(template.uploadedHeaders || []);
    }
  };

  const handleFieldSelection = (field, isSelected) => {
    if (isSelected) {
      setSelectedFields(prev => [...prev, field]);
    } else {
      setSelectedFields(prev => prev.filter(f => f !== field));
    }
  };

  const handleSelectAllFields = () => {
    if (selectedLandRecordTemplate) {
      setSelectedFields(selectedLandRecordTemplate.uploadedHeaders || []);
    }
  };

  const handleDeselectAllFields = () => {
    setSelectedFields([]);
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    if (!selectedLandRecordTemplate) {
      toast.error('Please select a land record template');
      return;
    }

    if (selectedFields.length === 0) {
      toast.error('Please select at least one field for the notice');
      return;
    }

    const templateData = {
      templateName: templateName.trim(),
      landRecordTemplateId: selectedLandRecordTemplate.id,
      landRecordTemplateName: selectedLandRecordTemplate.templateName,
      actName: selectedLandRecordTemplate.actName,
      uploadedHeaders: selectedLandRecordTemplate.uploadedHeaders,
      selectedFields: selectedFields
    };

    try {
      setSaving(true);
      const templateId = await saveNoticeTemplate(templateData, user.uid);
      toast.success('Notice template saved successfully');
      
      // Reload templates and reset form
      await loadNoticeTemplatesData();
      resetForm();
    } catch (error) {
      toast.error('Failed to save template');
      console.error('Error saving template:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadExistingTemplate = (template) => {
    setSelectedLandRecordTemplate({
      id: template.landRecordTemplateId,
      templateName: template.landRecordTemplateName,
      actName: template.actName,
      uploadedHeaders: template.uploadedHeaders
    });
    setSelectedFields(template.selectedFields || []);
    setTemplateName(template.templateName);
    
    // Call the parent callback
    if (onTemplateSelect) {
      onTemplateSelect(template, template.selectedFields);
    }
  };

  const resetForm = () => {
    setSelectedLandRecordTemplate(null);
    setSelectedFields([]);
    setTemplateName('');
  };

  return (
    <div className="space-y-6">
      {/* Load Existing Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Load Existing Notice Template</CardTitle>
          <CardDescription>Select from previously saved notice templates</CardDescription>
        </CardHeader>
        <CardContent>
          {noticeTemplates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No saved templates found</p>
          ) : (
            <div className="grid gap-3">
              {noticeTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleLoadExistingTemplate(template)}
                >
                  <div>
                    <h4 className="font-medium">{template.templateName}</h4>
                    <p className="text-sm text-gray-600">{template.actName}</p>
                    <p className="text-xs text-gray-500">
                      {template.selectedFields?.length || 0} fields selected
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Load Template
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Create New Template */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Notice Template</CardTitle>
          <CardDescription>Configure a new template for notice generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Name */}
          <div>
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              placeholder="Enter template name (e.g., LARR 2013 Notice Template)"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          {/* Land Record Template Selection */}
          <div>
            <Label>Select Land Record Template</Label>
            <Select onValueChange={handleLandRecordTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a land record template" />
              </SelectTrigger>
              <SelectContent>
                {landRecordTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.templateName} - {template.actName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loading && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading templates...
              </div>
            )}
          </div>

          {/* Field Selection */}
          {selectedLandRecordTemplate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium mb-2">Select Fields for Notice Generation</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Choose which fields from the template to include in generated notices
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSelectAllFields}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDeselectAllFields}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                {selectedLandRecordTemplate.uploadedHeaders?.map((field) => (
                  <div key={field} className="flex items-center space-x-3">
                    <Checkbox
                      id={field}
                      checked={selectedFields.includes(field)}
                      onCheckedChange={(checked) => handleFieldSelection(field, checked)}
                    />
                    <Label 
                      htmlFor={field} 
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      {field}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Selection Summary */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Selection Summary</h5>
                <div className="text-sm text-blue-800">
                  <p>
                    Selected: {selectedFields.length} of{' '}
                    {selectedLandRecordTemplate.uploadedHeaders?.length || 0} fields
                  </p>
                  {selectedFields.length === 0 && (
                    <p className="text-orange-600 mt-1">
                      Please select at least one field to save the template
                    </p>
                  )}
                  {selectedFields.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium mb-1">Selected fields:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedFields.map((field) => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSaveTemplate}
              disabled={saving || !selectedLandRecordTemplate || !templateName.trim() || selectedFields.length === 0}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoticeTemplateBuilder;