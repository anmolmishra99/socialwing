import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { FileText, Download, Eye, Printer, UserCheck, Search, List, Grid, Settings } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { updateDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { UserAuth } from '@/app/context/AuthContext';
import { downloadBulkNoticesAsZip, downloadSingleNotice, printNotice, generateNoticeContent } from '@/utils/pdfUtils';
import { parseRecord } from '@/utils/recordParser';
import DetailedNoticesTable from './DetailedNoticesTable';
import NoticeTemplateBuilder from './NoticeTemplateBuilder';

const ExistingNoticesManager = ({ 
  selectedProject, 
  selectedRecords, 
  setSelectedRecords,
  filteredRecords,
  landRecords,
  searchTerm, 
  setSearchTerm,
  loading,
  loadLandRecords
}) => {
  const { user } = UserAuth();
  const [previewContent, setPreviewContent] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingBulk, setIsDownloadingBulk] = useState(false);
  const [viewMode, setViewMode] = useState('simple'); // 'simple' or 'detailed'
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  
  // Template-related state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);

  // Generate notices for selected records
  const generateNotices = async () => {
    if (selectedRecords.length === 0) {
      toast.error('Please select records to generate notices');
      return;
    }

    setIsGenerating(true);
    try {
      const batch = writeBatch(db);
      const selectedLandRecords = landRecords.filter(record => selectedRecords.includes(record.id));

      for (const record of selectedLandRecords) {
        const recordRef = doc(db, 'landRecord', record.id);
        batch.update(recordRef, {
          notice_generated: true,
          notice_date: serverTimestamp(),
          kycCompleted: false,
          status: 'kyc',
          updatedAt: serverTimestamp()
        });
      }

      await batch.commit();
      toast.success(`Generated notices for ${selectedRecords.length} records`);
      setSelectedRecords([]);
      await loadLandRecords();
    } catch (error) {
      console.error('Error generating notices:', error);
      toast.error('Failed to generate notices');
    } finally {
      setIsGenerating(false);
    }
  };

  // Assign KYC for selected records
  const assignKyc = async (recordIds = selectedRecords) => {
    if (recordIds.length === 0) {
      toast.error('Please select records to assign KYC');
      return;
    }

    try {
      const batch = writeBatch(db);
      const recordsToUpdate = landRecords.filter(record => recordIds.includes(record.id));

      for (const record of recordsToUpdate) {
        const recordRef = doc(db, 'landRecord', record.id);
        batch.update(recordRef, {
          status: 'kyc_assigned',
          updatedAt: serverTimestamp()
        });
      }

      await batch.commit();
      toast.success(`Assigned KYC for ${recordIds.length} records`);
      if (recordIds === selectedRecords) {
        setSelectedRecords([]);
      }
      await loadLandRecords();
    } catch (error) {
      console.error('Error assigning KYC:', error);
      toast.error('Failed to assign KYC');
    }
  };

  // Handle template selection from NoticeTemplateBuilder
  const handleTemplateSelect = (template, fields) => {
    setSelectedTemplate(template);
    setSelectedFields(fields);
    toast.success(`Template "${template.templateName}" loaded with ${fields.length} fields`);
  };

  // Preview notice
  const previewNotice = (record) => {
    const content = generateNoticeContent(record, selectedFields, selectedTemplate);
    setPreviewContent(content);
    setIsPreviewOpen(true);
  };

  // Download notice as HTML
  const downloadNotice = (record) => {
    downloadSingleNotice(record, selectedFields, selectedTemplate);
  };

  // Print notice
  const printSingleNotice = (record) => {
    printNotice(record, selectedFields, selectedTemplate);
  };

  // Download bulk notices as ZIP
  const downloadBulkNotices = async () => {
    if (recordsWithNotices.length === 0) {
      toast.error('No notices available for download');
      return;
    }

    setIsDownloadingBulk(true);
    try {
      await downloadBulkNoticesAsZip(recordsWithNotices, selectedProject || 'project', selectedFields, selectedTemplate);
      toast.success(`Downloaded ${recordsWithNotices.length} notices as ZIP file`);
    } catch (error) {
      console.error('Error downloading bulk notices:', error);
      toast.error('Failed to download bulk notices');
    } finally {
      setIsDownloadingBulk(false);
    }
  };

  // Get status badge for land record
  const getStatusBadge = (record) => {
    if (record.notice_generated) {
      return <Badge variant="success">Notice Generated</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  // Get KYC status badge
  const getKycStatusBadge = (record) => {
    if (record.kycCompleted) {
      return <Badge variant="success">Completed</Badge>;
    }
    if (record.status === 'kyc_assigned') {
      return <Badge variant="warning">Assigned</Badge>;
    }
    if (record.status === 'kyc') {
      return <Badge variant="secondary">Pending</Badge>;
    }
    return <Badge variant="outline">Not Started</Badge>;
  };

  // Filter records that have notices generated
  const recordsWithNotices = landRecords.filter(record => record.notice_generated);

  // Extract dynamic columns from filteredRecords
  useEffect(() => {
    if (filteredRecords.length > 0) {
      const columns = new Set();
      const excludedFields = [
        'id', '_id', '__v', 'notice_generated', 'notice_date', 'kycCompleted', 
        'status', 'updatedAt', 'createdAt', 'created_at', 'updated_at',
        'notice_generated_at', 'kyc_assigned_at', 'kyc_completed_at'
      ];
      
      filteredRecords.forEach(record => {
        Object.keys(record).forEach(key => {
          if (!excludedFields.includes(key) && !key.toLowerCase().includes('timestamp')) {
            columns.add(key);
          }
        });
      });
      setDynamicColumns(Array.from(columns).sort());
    } else {
      setDynamicColumns([]);
    }
  }, [filteredRecords]);

  // Reset current page when search term changes or filtered records change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filteredRecords]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Parse record using utility function - directly use the imported function


  return (
    <div className="space-y-6">
      {/* Template Selection and Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notice Template Configuration</CardTitle>
              <CardDescription>Configure template and field mapping for notice generation</CardDescription>
            </div>
            <Button
              onClick={() => setShowTemplateBuilder(!showTemplateBuilder)}
              variant="outline"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showTemplateBuilder ? 'Hide Template Builder' : 'Configure Template'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showTemplateBuilder && (
            <NoticeTemplateBuilder
              onTemplateSelect={(template, selectedFields) => {
                setSelectedTemplate(template);
                setSelectedFields(selectedFields);
                setShowTemplateBuilder(false);
                toast.success('Template configured successfully');
              }}
            />
          )}

          {selectedTemplate && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                <strong>Selected Template:</strong> {selectedTemplate.templateName} ({selectedTemplate.actName})
              </p>
              <p className="text-sm text-green-600 mt-1">
                Fields selected: {selectedFields ? selectedFields.length : 0} of {selectedTemplate.uploadedHeaders?.length || 0}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2 bg-background border rounded-lg p-1">
          <Button
            variant={viewMode === 'simple' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('simple')}
            className="h-8"
          >
            <List className="w-4 h-4 mr-2" />
            Simple View
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('detailed')}
            className="h-8"
          >
            <Grid className="w-4 h-4 mr-2" />
            Detailed View
          </Button>
        </div>
      </div>

      {/* Detailed View */}
      {viewMode === 'detailed' && (
        <DetailedNoticesTable
          records={filteredRecords}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          onAssignKyc={assignKyc}
          onGenerateNotices={generateNotices}
          isGenerating={isGenerating}
          recordsWithNotices={recordsWithNotices}
          onPreviewNotice={previewNotice}
          onDownloadNotice={downloadNotice}
          onPrintNotice={printSingleNotice}
          onDownloadBulk={downloadBulkNotices}
          isDownloadingBulk={isDownloadingBulk}
          getStatusBadge={getStatusBadge}
          getKycStatusBadge={getKycStatusBadge}
        />
      )}

      {/* Simple View */}
      {viewMode === 'simple' && (
        <>
          {/* Land Records Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle>Select Land Records for Notice Generation</CardTitle>
              <CardDescription>Choose landowner records to generate notices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="search">Search Records</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by owner name, village, or survey number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading land records...</div>
              ) : (
                <>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={paginatedRecords.length > 0 && selectedRecords.length === paginatedRecords.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedRecords(paginatedRecords.map(record => record.id));
                                } else {
                                  setSelectedRecords([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead className="text-blue-900 font-semibold">Serial</TableHead>
                          {dynamicColumns.map(col => (
                            <TableHead key={col} className="text-blue-900 font-semibold">
                              {col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </TableHead>
                          ))}
                          <TableHead className="text-blue-900 font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedRecords.map((record, index) => (
                          <TableRow key={record.id || record._id?.toString() || index} className="hover:bg-blue-50/50">
                            <TableCell>
                              <Checkbox
                                checked={selectedRecords.includes(record.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedRecords(prev => [...prev, record.id]);
                                  } else {
                                    setSelectedRecords(prev => prev.filter(id => id !== record.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-blue-800">{(currentPage - 1) * recordsPerPage + index + 1}</TableCell>
                            {dynamicColumns.map((column) => (
                              <TableCell key={column} className="text-blue-800">
                                {(() => {
                                  const value = record[column];
                                  if (value === null || value === undefined) return '-';
                                  if (typeof value === 'number') return value.toFixed(2);
                                  if (value && typeof value === 'object' && value.seconds !== undefined) {
                                    // Firestore timestamp
                                    return new Date(value.seconds * 1000).toLocaleDateString();
                                  }
                                  if (typeof value === 'object') return JSON.stringify(value);
                                  return String(value);
                                })()}
                              </TableCell>
                            ))}
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => previewNotice(record)} title="Preview">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => downloadNotice(record)} title="Download">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => printSingleNotice(record)} title="Print">
                                  <Printer className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {searchTerm ? `Found ${filteredRecords.length} records matching "${searchTerm}"` : `Showing ${paginatedRecords.length} of ${filteredRecords.length} records`}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={assignKyc}
                        disabled={selectedRecords.length === 0}
                        variant="outline"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Assign KYC (${selectedRecords.length})
                      </Button>
                      <Button 
                        onClick={generateNotices}
                        disabled={selectedRecords.length === 0 || isGenerating}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {isGenerating ? 'Generating...' : `Generate Notices (${selectedRecords.length})`}
                      </Button>
                    </div>
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                              }} 
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <PaginationItem key={page}>
                              <PaginationLink 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(page);
                                }} 
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                              }} 
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Generated Notices Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Generated Notices</CardTitle>
                  <CardDescription>Manage and track generated notices for this project</CardDescription>
                </div>
                {recordsWithNotices.length > 0 && (
                  <Button
                    onClick={downloadBulkNotices}
                    disabled={isDownloadingBulk}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloadingBulk ? 'Downloading...' : `Download All (${recordsWithNotices.length})`}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {recordsWithNotices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No notices generated yet. Select records above to generate notices.
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Survey No.</TableHead>
                        <TableHead>Owner Name</TableHead>
                        <TableHead>Village</TableHead>
                        <TableHead>Notice Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>KYC Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recordsWithNotices.map((record) => {
                        const parsedRecord = parseRecord(record);
                        return (
                          <TableRow key={record.id}>
                            <TableCell>{parsedRecord.survey_number || parsedRecord.old_survey_number || parsedRecord.new_survey_number || 'N/A'}</TableCell>
                            <TableCell>{parsedRecord.owner_name || 'N/A'}</TableCell>
                            <TableCell>{record.village || record['गांव'] || 'N/A'}</TableCell>
                            <TableCell>
                              {record.notice_date ? new Date(record.notice_date.seconds * 1000).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>{getStatusBadge(record)}</TableCell>
                            <TableCell>{getKycStatusBadge(record)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => previewNotice(record)}
                                  title="Preview Notice"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadNotice(record)}
                                  title="Download Notice"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => printSingleNotice(record)}
                                  title="Print Notice"
                                >
                                  <Printer className="w-4 h-4" />
                                </Button>
                                {!record.kycCompleted && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => assignKyc([record.id])}
                                    title="Assign KYC"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Dialog */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Notice Preview</DialogTitle>
                <DialogDescription>Preview of the generated notice</DialogDescription>
              </DialogHeader>
              <div 
                className="border p-4 bg-white text-black"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ExistingNoticesManager;

// Helper function for safe numeric conversion
const safeNumericConversion = (value) => {
  if (value === null || value === undefined || value === '') return '0.00';
  const num = parseFloat(value);
  return isNaN(num) ? value : num.toFixed(2);
};