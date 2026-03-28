import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, Upload, CheckCircle2,  FileWarning } from 'lucide-react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { auth, db } from '@/app/firebase';
// import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

import { TemplateSelection } from './TemplateSelection';
import { CSVFileUpload } from './CSVFileUpload';
import { FieldMapping } from './FieldMapping';
import { LocationInput } from './LocationInput';
import { UploadProgress } from './UploadProgress';
import { TemplateCreationDialog } from './TemplateCreationDialog';

import {
  DEFAULT_TEMPLATES
} from './types';

// selectedProject is id
export const CSVUploadTab = ({ selectedProject, projectName }) => {
  const { user } = auth.currentUser;

  // State management
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadState, setUploadState] = useState({
    file: null,
    headers: [],
    records: [],
    selectedTemplate: null,
    fieldMappings: {},
    locationData: {
      district: '',
      taluka: '',
      village: ''
    },
    isUploading: false,
    uploadProgress: 0,
    errors: []
  });
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showColumnValidationDialog, setShowColumnValidationDialog] = useState(false);
  const [csvRecords, setCsvRecords] = useState([]);
  const [columnValidationResult, setColumnValidationResult] = useState({ missingFields: [], extraFields: [] });
  const [showParsedData, setShowParsedData] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState([]);
  const [showUploadedData, setShowUploadedData] = useState(false);

  // Load templates from Firestore
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const templatesCollection = collection(db, 'landRecordTemplate');
      const templateSnapshot = await getDocs(templatesCollection);
      const loadedTemplates = [];

      templateSnapshot.forEach((doc) => {
        const data = doc.data();
        loadedTemplates.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        });
      });

      setTemplates([...DEFAULT_TEMPLATES, ...loadedTemplates]);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates from Firestore');
      setTemplates(DEFAULT_TEMPLATES);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    setUploadState(prev => ({ ...prev, file }));
  };

  // Handle headers extraction and show template creation dialog
  const handleHeadersExtracted = async (headers) => {
    setUploadState(prev => ({ ...prev, headers }));
    
    // Parse the CSV/Excel file
    try {
      if (!uploadState.file) {
        // toast.error('No file selected');
        return;
      }
      
      const records = await parseFile(uploadState.file);
      setCsvRecords(records);
      
      // Show parsed data table
      setShowParsedData(true);
      
      // Show template creation dialog with extracted headers
      setShowTemplateDialog(true);
      
      toast.success(`Found ${headers.length} columns and ${records.length} records`);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Failed to parse the file');
    }
  };

  // Parse CSV/Excel file
  const parseFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          let records = [];

          if (file.name.endsWith('.csv')) {
            // Handle CSV files
            const text = data;
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            
            records = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
              const record = {};
              headers.forEach((header, index) => {
                record[header] = values[index] || '';
              });
              return record;
            }).filter(record => Object.values(record).some(value => value !== ''));
          } else {
            // Handle Excel files
            const XLSX = require('xlsx');
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            records = XLSX.utils.sheet_to_json(firstSheet);
          }

          resolve(records);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  // Toggle parsed data display
  const toggleParsedDataDisplay = () => {
    setShowParsedData(!showParsedData);
  };

  const fetchUploadedRecords = async () => {
    if (!selectedTemplate) return;
    
    try {
      const landRecordsCollection = collection(db, 'landRecord');
      let q;
      
      // Build query based on available location data
      const constraints = [
        where('project_id', '==', selectedProject),
        where('template_name', '==', selectedTemplate.templateName)
      ];
      
      if (uploadState.locationData.district) {
        constraints.push(where('district', '==', uploadState.locationData.district));
      }
      if (uploadState.locationData.taluka) {
        constraints.push(where('taluka', '==', uploadState.locationData.taluka));
      }
      if (uploadState.locationData.village) {
        constraints.push(where('village', '==', uploadState.locationData.village));
      }
      
      q = query(landRecordsCollection, ...constraints);
      
      const querySnapshot = await getDocs(q);
      const records = [];
      
      querySnapshot.forEach((doc) => {
        records.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setUploadedRecords(records);
      setShowUploadedData(true);
      
      toast.success(`Found ${records.length} uploaded records`);
    } catch (error) {
      console.error('Error fetching uploaded records:', error);
      toast.error('Failed to fetch uploaded records');
    }
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setUploadState(prev => ({ ...prev, selectedTemplate: template }));
  };

  // Handle field mapping changes
  const handleMappingChange = (templateField, csvHeader) => {
    setUploadState(prev => ({
      ...prev,
      fieldMappings: {
        ...prev.fieldMappings,
        [templateField]: csvHeader
      }
    }));
  };

  // Handle location changes
  const handleLocationChange = (field, value) => {
    setUploadState(prev => ({
      ...prev,
      locationData: {
        ...prev.locationData,
        [field]: value
      }
    }));
  };

  // Validate CSV columns against template headers
  const validateColumnMatching = () => {
    if (!selectedTemplate || !uploadState.headers.length) {
      return { isValid: false, missingFields: [], extraFields: [] };
    }

    // Get expected fields from template
    const expectedFields = selectedTemplate.uploadedHeaders || selectedTemplate.fields.map(f => f.name);
    const csvHeaders = uploadState.headers;

    // Find missing fields (expected but not in CSV)
    const missingFields = expectedFields.filter(field => 
      !csvHeaders.some(header => header.toLowerCase().includes(field.toLowerCase()) || field.toLowerCase().includes(header.toLowerCase()))
    );

    // Find extra fields (in CSV but not expected)
    const extraFields = csvHeaders.filter(header => 
      !expectedFields.some(field => header.toLowerCase().includes(field.toLowerCase()) || field.toLowerCase().includes(header.toLowerCase()))
    );

    return {
      isValid: missingFields.length === 0,
      missingFields,
      extraFields
    };
  };

  // Handle template creation with extracted headers
  const handleTemplateCreate = async (templateData) => {
    try {
      const templateCollection = collection(db, 'landRecordTemplate');
      const newTemplate = {
        ...templateData,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user?.uid || 'system'
      };

      const docRef = await addDoc(templateCollection, newTemplate);
      const createdTemplate = {
        id: docRef.id,
        ...newTemplate
      };

      setTemplates(prev => [...prev, createdTemplate]);
      setSelectedTemplate(createdTemplate);
      setUploadState(prev => ({ ...prev, selectedTemplate: createdTemplate }));
      
      toast.success('Template created successfully with CSV headers');
      
      setShowTemplateDialog(false);
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    }
  };

  // Handle upload to Firebase
  const handleUploadToFirebase = async () => {
    if (!selectedTemplate || !uploadState.file || csvRecords.length === 0) {
      toast.error('Please complete all steps before uploading');
      return;
    }

    const { district, taluka, village } = uploadState.locationData;
    if (!district.trim() || !taluka.trim() || !village.trim()) {
      toast.error('Please fill in all location fields');
      return;
    }

    // Validate column matching
    const validation = validateColumnMatching();
    if (!validation.isValid) {
      setColumnValidationResult(validation);
      setShowColumnValidationDialog(true);
      return;
    }

    // Check if all required fields are mapped
    const requiredFields = selectedTemplate.fields.filter(f => f.isRequired);
    const mappedRequiredFields = requiredFields.filter(field => 
      uploadState.fieldMappings[field.name] && uploadState.fieldMappings[field.name].trim() !== ''
    );

    if (mappedRequiredFields.length !== requiredFields.length) {
      toast.error('Please map all required fields');
      return;
    }

    setUploadState(prev => ({ ...prev, isUploading: true, uploadProgress: 0, errors: [] }));

    try {
      const landRecordsCollection = collection(db, 'landRecord');
      const errors = [];
      let successCount = 0;

      for (let i = 0; i < csvRecords.length; i++) {
        const record = csvRecords[i];
        const landRecord = {
          project_id: selectedProject,
          project_name: selectedProject,
          template_name: selectedTemplate.templateName,
          act_name: selectedTemplate.actName,
          district,
          taluka,
          village,
          created_at: new Date(),
          updated_at: new Date(),
          uploaded_by: user?.uid || 'system'
        };

        // Map fields according to template
        selectedTemplate.fields.forEach(field => {
          const csvHeader = uploadState.fieldMappings[field.name];
          if (csvHeader && record[csvHeader] !== undefined) {
            let value = record[csvHeader];
            
            // Convert data type
            switch (field.dataType) {
              case 'number':
                value = parseFloat(value) || 0;
                break;
              case 'boolean':
                value = value === 'true' || value === '1' || value === 'yes';
                break;
              case 'date':
                value = new Date(value);
                break;
              default:
                value = String(value);
            }
            
            landRecord[field.name] = value;
          } else if (field.defaultValue !== undefined) {
            landRecord[field.name] = field.defaultValue;
          }
        });

        try {
          await addDoc(landRecordsCollection, landRecord);
          successCount++;
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Update progress
        const progress = ((i + 1) / csvRecords.length) * 100;
        setUploadState(prev => ({ 
          ...prev, 
          uploadProgress: progress,
          errors: [...errors]
        }));
      }

      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false,
        uploadProgress: 100,
        errors: errors
      }));

      toast.success(`Successfully uploaded ${successCount} out of ${csvRecords.length} records`);

      // Fetch uploaded records to show them
      await fetchUploadedRecords();

      // Reset form after successful upload
      if (errors.length === 0) {
        setTimeout(() => {
          setUploadState({
            file: null,
            headers: [],
            records: [],
            selectedTemplate: null,
            fieldMappings: {},
            locationData: { district: '', taluka: '', village: '' },
            isUploading: false,
            uploadProgress: 0,
            errors: []
          });
          setCsvRecords([]);
        }, 3000);
      }

    } catch (error) {
      console.error('Error uploading to Firebase:', error);
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false,
        errors: ['Failed to upload data to Firebase']
      }));
      toast.error('Failed to upload data to Firebase');
    }
  };

  // Continue upload with column mismatches (after user confirms)
  const continueUploadWithWarnings = async () => {
    // Continue with the original upload logic but skip column validation
    const { district, taluka, village } = uploadState.locationData;

    setUploadState(prev => ({ ...prev, isUploading: true, uploadProgress: 0, errors: [] }));

    try {
      const landRecordsCollection = collection(db, 'landRecord');
      const errors = [];
      let successCount = 0;

      for (let i = 0; i < csvRecords.length; i++) {
        const record = csvRecords[i];
        const landRecord = {
          project_id: selectedProject,
          project_name: selectedProject,
          template_name: selectedTemplate.templateName,
          act_name: selectedTemplate.actName,
          district,
          taluka,
          village,
          created_at: new Date(),
          updated_at: new Date(),
          uploaded_by: user?.uid || 'system'
        };

        // Map fields according to template (only map available fields)
        selectedTemplate.fields.forEach(field => {
          const csvHeader = uploadState.fieldMappings[field.name];
          if (csvHeader && record[csvHeader] !== undefined) {
            let value = record[csvHeader];
            
            // Convert data type
            switch (field.dataType) {
              case 'number':
                value = parseFloat(value) || 0;
                break;
              case 'boolean':
                value = value === 'true' || value === '1' || value === 'yes';
                break;
              case 'date':
                value = new Date(value);
                break;
              default:
                value = String(value);
            }
            
            landRecord[field.name] = value;
          } else if (field.defaultValue !== undefined) {
            landRecord[field.name] = field.defaultValue;
          }
          // Skip fields that don't have matching CSV columns
        });

        try {
          await addDoc(landRecordsCollection, landRecord);
          successCount++;
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Update progress
        const progress = ((i + 1) / csvRecords.length) * 100;
        setUploadState(prev => ({ 
          ...prev, 
          uploadProgress: progress,
          errors: [...errors]
        }));
      }

      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false,
        uploadProgress: 100,
        errors: errors
      }));

      toast({
        title: 'Upload Complete',
        description: `Successfully uploaded ${successCount} out of ${csvRecords.length} records with column mismatches`
      });

      // Reset form after successful upload
      if (errors.length === 0) {
        setTimeout(() => {
          setUploadState({
            file: null,
            headers: [],
            records: [],
            selectedTemplate: null,
            fieldMappings: {},
            locationData: { district: '', taluka: '', village: '' },
            isUploading: false,
            uploadProgress: 0,
            errors: []
          });
          setCsvRecords([]);
        }, 3000);
      }

    } catch (error) {
      console.error('Error uploading to Firebase:', error);
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false,
        errors: ['Failed to upload data to Firebase']
      }));
      toast.error('Failed to upload data to Firebase');
    }
  };

  const isReadyForUpload = selectedTemplate && 
    uploadState.file && 
    csvRecords.length > 0 &&
    uploadState.locationData.district.trim() &&
    uploadState.locationData.taluka.trim() &&
    uploadState.locationData.village.trim();

  return (
    <div className="space-y-6">
      {/* Workflow Steps Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 ${selectedTemplate ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              selectedTemplate ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Select Template</span>
          </div>
          <div className={`w-8 h-0.5 ${uploadState.headers.length > 0 ? 'bg-green-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center space-x-2 ${uploadState.headers.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              uploadState.headers.length > 0 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Upload CSV & Create Template</span>
          </div>
          <div className={`w-8 h-0.5 ${uploadState.headers.length > 0 && !showTemplateDialog ? 'bg-green-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center space-x-2 ${uploadState.headers.length > 0 && !showTemplateDialog ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              uploadState.headers.length > 0 && !showTemplateDialog ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className="text-sm font-medium">Map Fields & Upload</span>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <TemplateSelection
        templates={templates}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={handleTemplateSelect}
        onTemplateCreate={() => setShowTemplateDialog(true)}
        isLoading={isLoadingTemplates}
      />

      {/* Workflow Instructions */}
      {selectedTemplate && uploadState.headers.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Step 2: Upload your CSV/Excel file. The system will extract all column headers and allow you to create or modify the template with the extracted fields.
          </AlertDescription>
        </Alert>
      )}

      {uploadState.headers.length > 0 && showTemplateDialog && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Step 2: Review the extracted CSV headers below. You can add all headers as fields or manually create fields. Click "Create Template" when ready.
          </AlertDescription>
        </Alert>
      )}

      {uploadState.headers.length > 0 && !showTemplateDialog && (
        <Alert>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Step 3: Map the CSV columns to template fields, fill in location details, and upload to Firebase.
          </AlertDescription>
        </Alert>
      )}

      {/* CSV File Upload - Show after template selection */}
      {selectedTemplate && (
        <CSVFileUpload
          onFileSelect={handleFileSelect}
          onHeadersExtracted={handleHeadersExtracted}
          // projectId={selectedProject}
          // project_name={projectName}
          onDataExtracted={(data) => {
            // Optionally handle the extracted data in parent component
            // console.log('Extracted data:', data);
          }}
          showDataPreview={true}
          templateName={selectedTemplate.templateName}
          projectName={projectName}
          projectId={selectedProject}
          locationData={{
            district: uploadState.locationData.district,
            taluka: uploadState.locationData.taluka,
            village: uploadState.locationData.village
          }}
        />
      )}

       {/* Location Input - Show after field mapping */}
      {selectedTemplate && uploadState.headers.length > 0 && !showTemplateDialog && (
        <LocationInput
          district={uploadState.locationData.district}
          taluka={uploadState.locationData.taluka}
          village={uploadState.locationData.village}
          onDistrictChange={(value) => handleLocationChange('district', value)}
          onTalukaChange={(value) => handleLocationChange('taluka', value)}
          onVillageChange={(value) => handleLocationChange('village', value)}
          disabled={uploadState.isUploading}
        />
      )}

      {/* Field Mapping - Show after template creation with headers */}
      {selectedTemplate && uploadState.headers.length > 0 && !showTemplateDialog && (
        <FieldMapping
          template={selectedTemplate}
          csvHeaders={uploadState.headers}
          mappings={uploadState.fieldMappings}
          onMappingChange={handleMappingChange}
          onAddCustomField={(fieldName) => {
            // Handle custom field addition if needed
            console.log('Adding custom field:', fieldName);
          }}
        />
      )}

     

      {/* Parsed Data Table - Show after file processing */}
      {csvRecords.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Parsed CSV Data Preview</CardTitle>
                <CardDescription>
                  Review your uploaded data before mapping fields
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleParsedDataDisplay}
              >
                {showParsedData ? 'Hide Data' : 'Show Data'}
              </Button>
            </div>
          </CardHeader>
          
          {showParsedData && (
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        {uploadState.headers.map((header, index) => (
                          <TableHead key={index} className="font-medium text-gray-900">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvRecords.slice(0, 100).map((record, rowIndex) => (
                        <TableRow key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {uploadState.headers.map((header, colIndex) => (
                            <TableCell key={colIndex} className="text-sm text-gray-900">
                              {record[header] || '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {csvRecords.length > 100 && (
                  <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 border-t">
                    Showing first 100 of {csvRecords.length} records
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Uploaded Data Table - Show after successful upload */}
      {uploadedRecords.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Uploaded Records</CardTitle>
                <CardDescription>
                  View the data that was successfully uploaded to Firestore
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUploadedRecords}
                >
                  🔄 Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploadedData(!showUploadedData)}
                >
                  {showUploadedData ? 'Hide Data' : 'Show Data'}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {showUploadedData && (
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50">
                        {uploadedRecords.length > 0 && Object.keys(uploadedRecords[0]).filter(key => 
                          !['id', 'created_at', 'updated_at', 'uploaded_by'].includes(key)
                        ).map((key) => (
                          <TableHead key={key} className="font-medium text-green-900">
                            {key.replace(/_/g, ' ').toUpperCase()}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedRecords.slice(0, 100).map((record, rowIndex) => (
                        <TableRow key={record.id} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {Object.keys(record).filter(key => 
                            !['id', 'created_at', 'updated_at', 'uploaded_by'].includes(key)
                          ).map((key) => (
                            <TableCell key={key} className="text-sm text-gray-900">
                              {record[key] || '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {uploadedRecords.length > 100 && (
                  <div className="bg-green-50 px-4 py-2 text-sm text-green-700 border-t">
                    Showing first 100 of {uploadedRecords.length} uploaded records
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Upload Button - Show after template creation and field mapping */}
      {isReadyForUpload && !showTemplateDialog && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleUploadToFirebase}
            disabled={uploadState.isUploading}
            size="lg"
            className="px-8 bg-green-600 hover:bg-green-700 text-white"
          >
            {uploadState.isUploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading to Firestore...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Data to Firestore
              </>
            )}
          </Button>
          
          {selectedTemplate && uploadState.locationData.district && (
            <Button
              onClick={fetchUploadedRecords}
              variant="outline"
              size="lg"
              className="px-8"
            >
              📊 View Uploaded Records
            </Button>
          )}
        </div>
      )}

      {/* Upload Progress */}
      {uploadState.isUploading && (
        <UploadProgress
          progress={uploadState.uploadProgress}
          currentRecord={Math.floor((uploadState.uploadProgress / 100) * csvRecords.length)}
          totalRecords={csvRecords.length}
          errors={uploadState.errors}
          isComplete={uploadState.uploadProgress >= 100}
        />
      )}

      {/* Template Creation Dialog */}
      <TemplateCreationDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        onTemplateCreate={handleTemplateCreate}
        initialHeaders={uploadState.headers}
      />

      {/* Column Validation Dialog */}
      <Dialog open={showColumnValidationDialog} onOpenChange={setShowColumnValidationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-warning" />
              Column Mismatch Warning
            </DialogTitle>
            <DialogDescription>
              The CSV columns don't match the template headers. Please review the mismatched fields.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {columnValidationResult.missingFields.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">Missing Fields (Expected but not found):</h4>
                <div className="bg-destructive/10 rounded-lg p-3">
                  <ul className="text-sm space-y-1">
                    {columnValidationResult.missingFields.map((field, index) => (
                      <li key={index} className="text-destructive">• {field}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {columnValidationResult.extraFields.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-warning">Extra Fields (Found but not expected):</h4>
                <div className="bg-warning/10 rounded-lg p-3">
                  <ul className="text-sm space-y-1">
                    {columnValidationResult.extraFields.map((field, index) => (
                      <li key={index} className="text-warning">• {field}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowColumnValidationDialog(false)}
            >
              Cancel Upload
            </Button>
            <Button
              onClick={() => {
                setShowColumnValidationDialog(false);
                // Continue with upload despite mismatches
                continueUploadWithWarnings();
              }}
            >
              Continue Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CSVUploadTab;