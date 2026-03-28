"use client";
import React, { useCallback, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, AlertCircle, Eye, EyeOff, Upload as UploadIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

export const CSVFileUpload = ({
  onFileSelect,
  onHeadersExtracted,
  onDataExtracted,
  acceptedFormats = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  showDataPreview = true,
  templateName,
  projectName,
  projectId,
  locationData
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [error, setError] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [extractedData, setExtractedData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  const extractHeaders = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          let headers = [];

          if (file.name.endsWith('.csv')) {
            // Handle CSV files
            const text = data;
            const lines = text.split('\n');
            if (lines.length > 0) {
              headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            }
          } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            // Handle Excel files
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
            
            if (jsonData.length > 0) {
              headers = jsonData[0].map(h => String(h).trim());
            }
          }

          resolve(headers.filter(h => h && h.length > 0));
        } catch (err) {
          reject(new Error('Failed to extract headers from file. Please check the file format.'));
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
  }, []);

  const extractData = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          let records = [];

          if (file.name.endsWith('.csv')) {
            // Handle CSV files with Marathi parsing logic
            const text = data;
            const lines = text.split('\n').filter(line => line.trim());
            
            if (lines.length > 0) {
              let startRow = 0;
              
              // Check if first row has only one entry (skip it)
              const firstRowCells = lines[0].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
              if (firstRowCells.length === 1 && firstRowCells[0].length > 0) {
                startRow = 1;
              }
              
              // Find the row with actual headers (multiple columns)
              let headerRowIndex = startRow;
              for (let i = startRow; i < lines.length; i++) {
                const cells = lines[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
                if (cells.length > 1) {
                  headerRowIndex = i;
                  break;
                }
              }
              
              if (headerRowIndex < lines.length) {
                const headers = lines[headerRowIndex].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

                // Identify serial and name column indices
                const serialIndex = headers.findIndex(h => h.includes('अ.क्र') || h.toLowerCase().includes('sr') || h.toLowerCase().includes('serial'));
                const nameIndex = headers.findIndex(h => h.includes('खातेदाराचे नांव') || h.toLowerCase().includes('owner'));

                const dataRows = lines.slice(headerRowIndex + 1);
                
                records = [];
                dataRows.forEach((line, rowIndex) => {
                  const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));

                  const serialValue = serialIndex >= 0 ? values[serialIndex]?.trim() : '';
                  if (serialIndex >= 0 && serialValue !== '' && !isNaN(parseFloat(serialValue))) {
                    const record = {};
                    headers.forEach((header, index) => {
                      if (header && index < values.length) {
                        record[header] = values[index];
                      }
                    });
                    records.push(record);
                  } else if (nameIndex >= 0 && values[nameIndex] && values[nameIndex].trim() !== '') {
                    const prevRecord = records[records.length - 1];
                    if (prevRecord) {
                      // Check if continuation: other fields are empty
                      const isCont = values.filter((v, i) => i !== nameIndex).every(v => v === '');
                      if (isCont) {
                        const nameHeader = headers[nameIndex];
                        prevRecord[nameHeader] = (prevRecord[nameHeader] || '') + ' | ' + values[nameIndex];
                      }
                    }
                  }
                });
              }
            }
          } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            // Handle Excel files
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

            if (jsonData.length === 0) {
              resolve([]);
              return;
            }

            const headers = jsonData[0].map(h => String(h).trim());

            // Identify serial and name column indices
            const serialIndex = headers.findIndex(h => h.includes('अ.क्र') || h.toLowerCase().includes('sr') || h.toLowerCase().includes('serial'));
            const nameIndex = headers.findIndex(h => h.includes('खातेदाराचे नांव') || h.toLowerCase().includes('owner'));

            const dataRows = jsonData.slice(1);
            
            records = [];
            dataRows.forEach((row, rowIndex) => {
              const values = row.map(v => v != null ? String(v).trim() : '');

              const serialValue = serialIndex >= 0 ? values[serialIndex] : '';
              if (serialIndex >= 0 && serialValue !== '' && !isNaN(parseFloat(serialValue))) {
                const record = {};
                headers.forEach((header, index) => {
                  if (header && index < values.length) {
                    record[header] = values[index];
                  }
                });
                records.push(record);
              } else if (nameIndex >= 0 && values[nameIndex] && values[nameIndex].trim() !== '') {
                const prevRecord = records[records.length - 1];
                if (prevRecord) {
                  // Check if continuation: other fields are empty
                  const isCont = values.filter((v, i) => i !== nameIndex).every(v => v === '');
                  if (isCont) {
                    const nameHeader = headers[nameIndex];
                    prevRecord[nameHeader] = (prevRecord[nameHeader] || '') + ' | ' + values[nameIndex];
                  }
                }
              }
            });
          }

          // Add metadata to records
          records = records.map((record) => {
            const processedRecord = { ...record };
            
            if (templateName) processedRecord._templateName = templateName;
            if (projectName) processedRecord._projectName = projectName;
            if (projectId) processedRecord._projectId = projectId;
            if (locationData) {
              processedRecord._district = locationData.district;
              processedRecord._taluka = locationData.taluka;
              processedRecord._village = locationData.village;
            }
            
            return processedRecord;
          }).filter(record => Object.keys(record).length > 1);

          resolve(records);
        } catch (err) {
          reject(new Error('Failed to extract data from file. Please check the file format.'));
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
  }, [templateName, projectName, projectId, locationData]);

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    
    // Validate file size
    if (file.size > maxFileSize) {
      setError(`File size exceeds maximum allowed size of ${maxFileSize / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.some(format => format.toLowerCase() === fileExtension)) {
      setError(`Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`);
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      onFileSelect(file);
      const headers = await extractHeaders(file);
      onHeadersExtracted(headers);
      
      // Extract and display data preview
      const data = await extractData(file);
      setExtractedData(data);
      setShowPreview(showDataPreview);
      if (onDataExtracted) {
        onDataExtracted(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setSelectedFile(null);
      setExtractedData([]);
      setShowPreview(false);
    } finally {
      setIsProcessing(false);
    }
  }, [maxFileSize, acceptedFormats, onFileSelect, onHeadersExtracted, extractHeaders, extractData, onDataExtracted, showDataPreview]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileSelect({ target: { files: dataTransfer.files } });
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async () => {
    if (!extractedData || extractedData.length === 0) {
      toast.error('No data to upload. Please select a file first.');
      return;
    }

    if (!projectId) {
      toast.error('Project ID is required');
      return;
    }

    if (!locationData.district || !locationData.taluka || !locationData.village) {
      toast.error('Please fill in all location fields (District, Taluka, Village)');
      return;
    }
  
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const landRecordsCollection = collection(db, 'landRecord');
      let uploadedCount = 0;
      const totalRecords = extractedData.length;
      
      // Upload each record individually to Firestore
      for (let i = 0; i < extractedData.length; i++) {
        const record = extractedData[i];
        
        // Prepare the land record data with all required fields
        const landRecordData = {
          ...record,
          templateName: templateName || '',
          village: locationData?.village || '',
          district: locationData?.district || '',
          taluka: locationData?.taluka || '',
          project_id: projectId,
          project_name: projectName || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          // Add metadata fields that were already added during extraction
          ...(record._templateName && { templateName: record._templateName }),
          ...(record._projectName && { projectName: record._projectName }),
          ...(record._projectId && { projectId: record._projectId }),
          ...(record._district && { district: record._district }),
          ...(record._taluka && { taluka: record._taluka }),
          ...(record._village && { village: record._village })
        };
        
        // Remove the underscore-prefixed metadata fields since we're using the proper ones
        delete landRecordData._templateName;
        delete landRecordData._projectName;
        delete landRecordData._projectId;
        delete landRecordData._district;
        delete landRecordData._taluka;
        delete landRecordData._village;
        
        await addDoc(landRecordsCollection, landRecordData);
        uploadedCount++;
        
        // Update progress
        setUploadProgress(Math.round((uploadedCount / totalRecords) * 100));
        
        // Small delay to show progress updates
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      toast.success(`Successfully uploaded ${uploadedCount} land records to Firestore!`);
      
      // Clear the form after successful upload
      setSelectedFile(null);
      setExtractedData([]);
      setShowPreview(false);
      
    } catch (error) {
      console.error('Error uploading to Firestore:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload records to Firestore');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload CSV/Excel File</CardTitle>
        <CardDescription>
          Select a CSV or Excel file to upload. The system will automatically extract column headers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm font-medium">
                  {isProcessing ? 'Processing file...' : 'Click to upload or drag and drop'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Supported formats: {acceptedFormats.join(', ')} (Max {formatFileSize(maxFileSize)})
                </div>
              </div>
            </Label>
          </div>

          {selectedFile && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{selectedFile.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </div>
                </div>
                <Badge variant="secondary">
                  {isProcessing ? 'Processing...' : 'Ready'}
                </Badge>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {extractedData.length > 0 && (
            <Card className="border-muted">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Data Preview</CardTitle>
                    <CardDescription>
                      Showing first 10 rows of {extractedData.length} total records
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-2"
                  >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPreview ? 'Hide Data' : 'Show Data'}
                  </Button>
                </div>
              </CardHeader>
              {showPreview && (
                <CardContent className="pt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(extractedData[0] || {}).map((header) => (
                            <TableHead key={header} className="text-xs">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extractedData.slice(0, 10).map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((value, cellIndex) => (
                              <TableCell key={cellIndex} className="text-xs py-2">
                                {value?.toString() || '-'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {extractedData.length > 10 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ... and {extractedData.length - 10} more rows
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          )}

          {extractedData.length > 0 && (
            <div className="space-y-4">
              <Button
                onClick={handleFileUpload}
                disabled={isUploading}
                className="w-full gap-2"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Uploading... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4" />
                    Upload {extractedData.length} Records
                  </>
                )}
              </Button>
              
              {isUploading && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Ensure your CSV/Excel file has headers in the first row</li>
              <li>Column names should be descriptive and match your template fields</li>
              <li>Remove any empty rows or columns before uploading</li>
              <li>Check that data formats are consistent (dates, numbers, etc.)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVFileUpload;