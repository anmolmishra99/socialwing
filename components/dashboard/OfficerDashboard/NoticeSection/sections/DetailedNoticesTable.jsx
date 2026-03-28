import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Download, 
  FileText,
  Eye,
  Printer,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { toast } from 'react-hot-toast';
import { downloadSingleNotice, printNotice } from '@/utils/pdfUtils';
import * as XLSX from 'xlsx';

const DetailedNoticesTable = ({ 
  recordsWithNotices = [], 
  selectedRecords,
  setSelectedRecords,
  searchTerm,
  setSearchTerm,
  loading,
  onAssignKyc,
  onGenerateNotices,
  isGenerating,
  onPreviewNotice,
  onDownloadNotice,
  onPrintNotice,
  onDownloadBulk,
  isDownloadingBulk,
  // getStatusBadge,
  // getKycStatusBadge
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [dynamicColumns, setDynamicColumns] = useState([]);
  
  const recordsPerPage = 10;

  // Extract dynamic columns from notices data
  useEffect(() => {
    if (recordsWithNotices && recordsWithNotices.length > 0) {
      const allKeys = new Set();
      recordsWithNotices.forEach(notice => {
        Object.keys(notice).forEach(key => {
          if (!['id', '_id', '__v', 'createdAt', 'updatedAt', 'projectId', 'userId'].includes(key)) {
            allKeys.add(key);
          }
        });
      });
      
      // Prioritize important columns first
      const priorityColumns = [
        'serial_number', 'अ_क्र', 'स.नं./हि.नं./ग.नं.', 'old_survey_number', 'new_survey_number',
        'owner_name', 'खातेदाराचे_नांव', 'village', 'गांव', 'taluka', 'district',
        'land_area', 'क्षेत्रफळ', 'compensation', 'नुकसान_भरपाई', 'notice_generated',
        'notice_date', 'kycCompleted', 'status', 'notice_number'
      ];
      
      const sortedColumns = [];
      priorityColumns.forEach(col => {
        if (allKeys.has(col)) {
          sortedColumns.push(col);
          allKeys.delete(col);
        }
      });
      
      setDynamicColumns([...sortedColumns, ...Array.from(allKeys)]);
    }
  }, [recordsWithNotices]);

  // Filter notices based on search term
  const filteredNotices = (recordsWithNotices || []).filter(notice => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      String(notice.owner_name || notice['खातेदाराचे_नांव'] || '').toLowerCase().includes(searchLower) ||
      String(notice.village || notice['गांव'] || '').toLowerCase().includes(searchLower) ||
      String(notice.old_survey_number || notice['जुना_स_नं'] || notice['स.नं./हि.नं./ग.नं.'] || '').toLowerCase().includes(searchLower) ||
      String(notice.new_survey_number || notice['नविन_स_नं'] || '').toLowerCase().includes(searchLower) ||
      String(notice.serial_number || notice['अ_क्र'] || '').toLowerCase().includes(searchLower) ||
      String(notice.notice_number || '').toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredNotices.length / recordsPerPage);
  const paginatedRecords = filteredNotices.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Status badge functions
  const getStatusBadge = (record) => {
    if (record.notice_generated) {
      return <Badge variant="success" className="bg-green-100 text-green-800">Generated</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Pending</Badge>;
  };

  const getKycStatusBadge = (record) => {
    if (record.kycCompleted) {
      return <Badge variant="success" className="bg-green-100 text-green-800">Completed</Badge>;
    }
    if (record.status === 'kyc_assigned') {
      return <Badge variant="warning" className="bg-yellow-100 text-yellow-800">Assigned</Badge>;
    }
    if (record.status === 'kyc') {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Pending</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-100 text-gray-800">Not Started</Badge>;
  };

  // Edit functions
  const handleEdit = (record) => {
    setEditingRecord(record.id);
    setEditForm(record);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord || !editForm) return;
    
    try {
      const sanitizedEditForm = { ...editForm };
      delete sanitizedEditForm.id;
      
      await updateDoc(doc(db, "landRecords", editingRecord), sanitizedEditForm);
      toast.success('Notice record updated successfully');
      setEditingRecord(null);
      setEditForm({});
      // Note: Parent component should handle reloading data
    } catch (error) {
      console.error('Error updating notice record:', error);
      toast.error('Error updating notice record');
    }
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditForm({});
  };

  const handleEditInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Action functions
  const handlePreviewNotice = (record) => {
    if (onPreviewNotice) {
      onPreviewNotice(record);
    }
  };

  const handleDownloadNotice = (record) => {
    if (onDownloadNotice) {
      onDownloadNotice(record);
    }
  };

  const handlePrintNotice = (record) => {
    if (onPrintNotice) {
      onPrintNotice(record);
    }
  };

  // Helper function for numeric conversion
  const safeNumericConversion = (value) => {
    if (value === null || value === undefined || value === '') return '0';
    const num = Number(value);
    return isNaN(num) ? String(value) : num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredNotices.map(record => {
        const row = {};
        dynamicColumns.forEach(col => {
          let value = record[col];
          if (['land_area_as_per_7_12', 'acquired_land_area', 'approved_rate_per_hectare', 'market_value_as_per_acquired_area', 'land_compensation_as_per_section_26', 'structures', 'forest_trees', 'fruit_trees', 'wells_borewells', 'total_structures_amount', 'total_amount_14_23', 'determined_compensation_26', 'total_compensation_26_27', 'deduction_amount', 'final_payable_compensation', 'क्षेत्रफळ', 'नुकसान_भरपाई'].includes(col)) {
            value = safeNumericConversion(value);
          } else if (col === 'notice_date' && value) {
            value = value.seconds ? new Date(value.seconds * 1000).toLocaleDateString() : new Date(value).toLocaleDateString();
          } else if (col === 'notice_generated') {
            value = record.notice_generated ? 'Generated' : 'Pending';
          } else if (col === 'kycCompleted') {
            value = record.kycCompleted ? 'Completed' : 'Not Started';
          } else {
            value = String(value || 'N/A');
          }
          row[formatColumnName(col)] = value;
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Notices');

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `detailed_notices_${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);
      toast.success('Notices exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export notices');
    }
  };

  // Column name formatting
  const formatColumnName = (column) => {
    return column
      .replace(/_/g, ' ')
      .replace(/\.\./g, '.')
      .replace(/\//g, '/')
      .toUpperCase();
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="bg-blue-50 border-b border-blue-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detailed Notices View
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={exportToExcel}
              disabled={filteredNotices.length === 0}
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button
              onClick={() => window.location.reload()}
              disabled={loading}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Search className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Search Bar */}
        <div className="mb-4">
          <Label htmlFor="search-notices" className="text-blue-800 font-medium">Search Notices</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="search-notices"
              placeholder="Search by owner name, village, survey number, or notice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-blue-200"
            />
          </div>
        </div>

        {/* Records Info */}
        <div className="text-sm text-blue-600 mb-4">
          Showing {paginatedRecords.length} of {filteredNotices.length} notices
                {searchTerm && ` (filtered from ${recordsWithNotices.length} total)`}
        </div>

        {/* Detailed Table */}
        {paginatedRecords.length === 0 ? (
          <div className="text-center py-8 text-blue-600">
            {searchTerm ? `No notices found matching "${searchTerm}"` : "No notices found for this project"}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border border-blue-200 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-100">
                    <TableHead className="text-blue-900 font-semibold w-12">#</TableHead>
                    {dynamicColumns.map(col => (
                      <TableHead key={col} className="text-blue-900 font-semibold min-w-32">
                        {formatColumnName(col)}
                      </TableHead>
                    ))}
                    <TableHead className="text-blue-900 font-semibold w-32">Notice Status</TableHead>
                    <TableHead className="text-blue-900 font-semibold w-32">KYC Status</TableHead>
                    <TableHead className="text-blue-900 font-semibold w-48">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.map((record, index) => (
                    <TableRow key={record.id} className="hover:bg-blue-50/50 border-b border-blue-100">
                      <TableCell className="text-blue-800 font-medium">
                        {(currentPage - 1) * recordsPerPage + index + 1}
                      </TableCell>
                      {dynamicColumns.map((column) => (
                        <TableCell key={column} className="text-blue-800">
                          {editingRecord === record.id ? (
                            column === 'compensation_distribution_status' ? (
                              <Select
                                value={editForm[column] || 'PENDING'}
                                onValueChange={(value) => handleEditInputChange(column, value)}
                              >
                                <SelectTrigger className="border-blue-200 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDING">PENDING</SelectItem>
                                  <SelectItem value="PAID">PAID</SelectItem>
                                  <SelectItem value="UNPAID">UNPAID</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : ['land_area_as_per_7_12', 'acquired_land_area', 'approved_rate_per_hectare', 'market_value_as_per_acquired_area', 'land_compensation_as_per_section_26', 'structures', 'forest_trees', 'fruit_trees', 'wells_borewells', 'total_structures_amount', 'total_amount_14_23', 'determined_compensation_26', 'total_compensation_26_27', 'deduction_amount', 'final_payable_compensation', 'क्षेत्रफळ', 'नुकसान_भरपाई'].includes(column) ? (
                              <Input
                                type="number"
                                step="0.01"
                                value={editForm[column] || ''}
                                onChange={(e) => handleEditInputChange(column, parseFloat(e.target.value) || 0)}
                                className="border-blue-200 h-8"
                              />
                            ) : column === 'remarks' ? (
                              <Textarea
                                value={editForm[column] || ''}
                                onChange={(e) => handleEditInputChange(column, e.target.value)}
                                className="border-blue-200 min-h-8"
                                rows={1}
                              />
                            ) : (
                              <Input
                                value={editForm[column] || ''}
                                onChange={(e) => handleEditInputChange(column, e.target.value)}
                                className="border-blue-200 h-8"
                              />
                            )
                          ) : column === 'compensation_distribution_status' ? (
                            getStatusBadge(record)
                          ) : ['land_area_as_per_7_12', 'acquired_land_area', 'approved_rate_per_hectare', 'market_value_as_per_acquired_area', 'land_compensation_as_per_section_26', 'structures', 'forest_trees', 'fruit_trees', 'wells_borewells', 'total_structures_amount', 'total_amount_14_23', 'determined_compensation_26', 'total_compensation_26_27', 'deduction_amount', 'final_payable_compensation', 'क्षेत्रफळ', 'नुकसान_भरपाई'].includes(column) ? (
                            safeNumericConversion(record[column])
                          ) : (
                            String(record[column] || 'N/A')
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        {editingRecord === record.id ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleSaveEdit}
                              className="border-green-200 text-green-700 hover:bg-green-50 h-8 px-2"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="border-red-200 text-red-700 hover:bg-red-50 h-8 px-2"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(record)}
                            {getKycStatusBadge(record)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRecord === record.id ? (
                          <div className="text-xs text-gray-500">Editing...</div>
                        ) : (
                          <div className="flex gap-1 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(record)}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 h-8 px-2"
                              title="Edit Record"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            {record.notice_generated && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePreviewNotice(record)}
                                  className="border-purple-200 text-purple-700 hover:bg-purple-50 h-8 px-2"
                                  title="Preview Notice"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadNotice(record)}
                                  className="border-green-200 text-green-700 hover:bg-green-50 h-8 px-2"
                                  title="Download Notice"
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePrintNotice(record)}
                                  className="border-orange-200 text-orange-700 hover:bg-orange-50 h-8 px-2"
                                  title="Print Notice"
                                >
                                  <Printer className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }} 
                      className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
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
                      className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailedNoticesTable;