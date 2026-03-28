import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/app/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import KycDocumentDialog from '@/components/dashboard/FieldOfficerDashboard/KycDocumentDialog/KycDocumentDialog';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Search,
  Trash2,
  Plus,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getDocs, collection, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '@/app/firebase';
import { toast } from 'react-hot-toast';

const DocumentManagementSection = () => {
  const user = auth.currentUser;
  const [projects, setProjects] = useState([]);
  const [landRecords, setLandRecords] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isKycDialogOpen, setIsKycDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documentType, setDocumentType] = useState('');
  
  // Filter states
  const [villageFilter, setVillageFilter] = useState('all');
  const [talukaFilter, setTalukaFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [surveyNumberFilter, setSurveyNumberFilter] = useState('');
  const [availableVillages, setAvailableVillages] = useState([]);
  const [availableTalukas, setAvailableTalukas] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [parsedRecords, setParsedRecords] = useState([]);

  // Document types for upload
  const documentTypes = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'bank_passbook', label: 'Bank Passbook' },
    { value: 'land_documents', label: 'Land Documents' },
    { value: 'identity_proof', label: 'Identity Proof' },
    { value: 'address_proof', label: 'Address Proof' },
    { value: 'other', label: 'Other' }
  ];

  // Utility functions for parsing land records
  const parseHaAreToDecimalHa = (haAreString) => {
    if (!haAreString) return 0;
    
    // Handle different formats like "2-15-00" (hectare-are-square meter)
    const parts = String(haAreString).split('-').map(part => parseFloat(part) || 0);
    
    if (parts.length >= 2) {
      const hectares = parts[0] || 0;
      const ares = parts[1] || 0;
      const squareMeters = parts[2] || 0;
      
      // Convert to decimal hectares (1 are = 0.01 hectare, 1 sqm = 0.0001 hectare)
      return hectares + (ares * 0.01) + (squareMeters * 0.0001);
    }
    
    // If it's already a decimal number, return it
    const parsed = parseFloat(haAreString);
    return isNaN(parsed) ? 0 : parsed;
  };

  const convertSqmToHa = (sqmString) => {
    if (!sqmString) return 0;
    const sqm = parseFloat(String(sqmString).replace(/,/g, ''));
    return isNaN(sqm) ? 0 : sqm * 0.0001;
  };

  const safeNumericConversion = (value) => {
    if (value === null || value === undefined || value === '') return '₹0';
    const num = parseFloat(value);
    if (isNaN(num)) return '₹0';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // Parse record function to align with DashboardSection
  const parseRecord = (record) => {
    const templateName = record.templateName || '';
    
    // Start with basic parsed data
    const parsed = {
      id: record.id,
      serial_number: '',
      owner_name: '',
      survey_number: '',
      old_survey_number: '',
      new_survey_number: '',
      village: '',
      taluka: '',
      district: '',
      land_type: '',
      total_land_area_ha: 0,
      acquired_land_area_ha: 0,
      approved_rate_per_hectare: 0,
      market_value: 0,
      factor: 0,
      land_compensation: 0,
      structures_amount: 0,
      forest_trees_count: 0,
      forest_trees_amount: 0,
      fruit_trees_count: 0,
      fruit_trees_amount: 0,
      wells_count: 0,
      wells_amount: 0,
      total_assets_amount: 0,
      total_compensation: 0,
      interest_12percent: 0,
      solatium: 0,
      additional_nazrana: 0,
      net_payable: 0,
      deduction: 0,
      remarks: '',
      compensation_distribution: '',
      arbitration_remark: '',
      compensation_distribution_status: 'PENDING',
      kyc_status: record.kycCompleted ? 'completed' : 'pending',
      documents_uploaded: record.documents_uploaded || false,
      document_verified: record.document_verified || false,
      payment_slip_generate: record.payment_slip_generate || false,
      payment_slip_generated: record.payment_slip_generated || false,
      kyc_assigned: record.kyc_assigned || false,
      kycCompleted: record.kycCompleted || false,
      // Add original record data for fallback
      ...record
    };

    // Parse based on template type
    if (templateName.includes('RFCTLARR 2013')) {
      parsed.serial_number = record['अ.क्र'] || '';
      parsed.owner_name = record['संयुक्त मोजणी विवरण पत्रानुसार खातेदारांची नावे'] || '';
      parsed.survey_number = record['संयुक्त मोजणी विवरणपत्रानुसार गट नंबर'] || '';
      parsed.old_survey_number = record['जुने सर्वे नंबर'] || '';
      parsed.new_survey_number = record['नवीन सर्वे नंबर'] || '';
      parsed.village = record['गावाचे नाव'] || '';
      parsed.taluka = record['तालुका'] || '';
      parsed.district = record['जिल्हा'] || '';
      parsed.land_type = record['जमिनीचा प्रकार'] || '';
      parsed.total_land_area_ha = parseHaAreToDecimalHa(record['गांव नमुना 7/12 नुसार जमिनीचे क्षेत्र हे.आर']);
      parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record['संपादित जमिनीचे क्षेत्र हेक्टर आर']) || convertSqmToHa(record['संपादित जमिनीचे क्षेत्र चौ.मी']);
      parsed.approved_rate_per_hectare = parseFloat(record['संपादित जमिनीचे निश्चित केलेले दर प्रति हेक्टरी (रुपये)']) || 0;
      parsed.market_value = parseFloat(record['संपादित जमिनीचे येणारे मुल्य (रुपये)']) || 0;
      parsed.factor = parseFloat(record['घटक क्र. 2 अन्वये गावास येणारे मुल्यांकन (रुपये)']) || 0;
      parsed.land_compensation = parseFloat(record['मुल्यांकन']) || 0;
      parsed.structures_amount = parseFloat(record['घरे/इमारती व इतर बांधकामे रक्कम रुपये']) || 0;
      parsed.forest_trees_count = parseFloat(record['वनझाडे झाडांची संख्या']) || 0;
      parsed.forest_trees_amount = parseFloat(record['वनझाडे झाडांची रक्कम रु.']) || 0;
      parsed.fruit_trees_count = parseFloat(record['फळझाडे झाडांची संख्या']) || 0;
      parsed.fruit_trees_amount = parseFloat(record['फळझाडे झाडांची रक्कम रु.']) || 0;
      parsed.wells_count = parseFloat(record['विहिरी/बोअरवेल संख्या']) || 0;
      parsed.wells_amount = parseFloat(record['विहिरी/बोअरवेल रक्कम रुपये']) || 0;
      parsed.total_assets_amount = parseFloat(record['रक्कम रुपये']) || 0;
      parsed.total_compensation = parseFloat(record['एकुण रक्कम']) || 0;
      parsed.interest_12percent = parseFloat(record['कलम 3 (अ) ची अधिसूचना प्रसिध्द झालेल्या दिनांकापासुन ते निवाडा घोषित दिनांकापर्यत 12 % जमिनीचा वाढीव मोबदला प्रमाणे प्रतवर्ष सेक्शन 30 (3) RFCT-LARR 2013 च्या कलम 26 (1) व 26 (2) मधील तरतुदीनुसार दि.03/07/2023 ते दि.15/04/2025 पर्यंत 652 दिवसाचे व्याज']) || 0;
      parsed.solatium = parseFloat(record['100 %  सोलेटीएम (दिलासा रक्कम) सेक्शन 30 (1)  RFCT-LARR 2013 अनूचि 1 अ.नं. 5']) || 0;
      parsed.additional_nazrana = parseFloat(record['(+) नजराणा रक्कम 10 %']) || 0;
      parsed.net_payable = parseFloat(record['एकुण मोबदला निवाडयाची एकुण रक्कम']) || 0;
      parsed.deduction = parseFloat(record['(-) वजाती']) || 0;
      parsed.remarks = record['शेरा'] || '';
      parsed.compensation_distribution = record['मोबदला वाटप तपशिल'] || '';
      parsed.arbitration_remark = record['मध्यस्थी संबंधी टिप्पणी (Arbitration Remark)'] || '';
      parsed.compensation_distribution_status = record['मोबदला वाटप तपशिल'] || 'PENDING';
    } else if (templateName.includes('RAA 2008')) {
      parsed.serial_number = record['अ.क्र'] || '';
      parsed.owner_name = record['संयुक्त मोजणी विवरण पत्रानुसार खातेदारांची नावे'] || '';
      parsed.survey_number = record['संयुक्त मोजणी विवरणपत्रानुसार ग.नं.'] || '';
      parsed.old_survey_number = record['जुने सर्वे नंबर'] || '';
      parsed.new_survey_number = record['नवीन सर्वे नंबर'] || '';
      parsed.village = record['गावाचे नाव'] || '';
      parsed.taluka = record['तालुका'] || '';
      parsed.district = record['जिल्हा'] || '';
      parsed.land_type = record['जमिनीचा प्रकार'] || '';
      parsed.total_land_area_ha = parseHaAreToDecimalHa(record['संयुक्त मोजणी विवरण पत्रानुसार एकूण क्षेत्र (हे.आर)']);
      parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record['संयुक्त मोजणी विवरणपत्रा नुसार संपादित जमिनीचे क्षेत्र (हे.आर)']);
      parsed.approved_rate_per_hectare = parseFloat(record['संपादित जमिनीचे निश्चित केलेले दर प्रति हेक्टरी (र.रू)']) || 0;
      parsed.market_value = parseFloat(record['संपादित जमिनीचे येणारे मुल्य (र.रू)']) || 0;
      parsed.factor = parseFloat(record['सहायक संचालक नगर रचना पालघर यांचेकडील पत्र दि. 23/02/2024 रोजीचे पत्रान्वये गांवास येणारा घटक - 2 हिशोबित करून येणारे मुल्यांकन र.रू.']) || 0;
      parsed.forest_trees_count = parseFloat(record['वनझाडे संख्या']) || 0;
      parsed.forest_trees_amount = parseFloat(record['वनझाडे किंमत रू.']) || 0;
      parsed.fruit_trees_count = parseFloat(record['फळझाडे संख्या']) || 0;
      parsed.fruit_trees_amount = parseFloat(record['फळझाडे किंमत रू.']) || 0;
      parsed.solatium = parseFloat(record['100% सोलेशियम (दिलासा रक्कम) (सेक्शन 30 (1) RFCT-LARR 2013 अनूची 1 अ.क्र. 5)']) || 0;
      parsed.interest_12percent = parseFloat(record['20 A अधिसूचना दिनांका पासुन ते निवाडा घोषित दिनांकापर्यत जमिनीचे वाढीव मोबदला 12% प्रमाणे प्रतवर्ष (सेक्शन 30 (3) RFCT-LARR - 2013 अनूची 1 अ.क्र. 8, कलम 26 (1) व 26 (2) मधील तरतुदीनुसार) (दि. 10/10/2023 ते दि. 05/02/2025 पर्यत ) (कालावधी 484 दिवस)']) || 0;
      parsed.subsistence_allowance = parseFloat(record['प्रति महा रक्कम रुपये 3000/- प्रमाणे एक वर्षाकरिता निर्वाह भत्ता (कलम 3 RFCT-LARR 2013 अनुसुचि 2 अ.क्र. 5)']) || 0;
      parsed.additional_allowance_st_sc = parseFloat(record['अनुसूचित जमाती व अनुसूचित जाती करिता अतिरिक्त निर्वाह भत्ता (कलम 3 RFCT-LARR 2013 अनुसुचि 2 अ.क्र. 5)']) || 0;
      parsed.resettlement_assistance = parseFloat(record['बाधित कुटुंबास पुनर्वसनाकरिता आर्थिक सहाय प्रति कुटुबास रु. 50,000 (कलम 3 RFCT-LARR 2013 अनुसुचि 2 अ.क्र. 10)']) || 0;
      parsed.total_compensation = parseFloat(record['एकूण मोबदला']) || 0;
      parsed.deduction = parseFloat(record['वजाती']) || 0;
      parsed.net_payable = parseFloat(record['निव्वळ देय रक्कम']) || 0;
      parsed.remarks = record['शेरा'] || '';
      parsed.compensation_distribution = record['मोबदला वाटप तपशिल'] || '';
      parsed.arbitration_remark = record['मध्यस्थी संबंधी टिप्पणी (Arbitration Remark)'] || '';
      parsed.compensation_distribution_status = record['मोबदला वाटप तपशिल'] || 'PENDING';
    } else {
      // Default mapping if no template match (use English keys if present)
      Object.keys(parsed).forEach(key => {
        parsed[key] = record[key] || parsed[key];
      });
      parsed.total_land_area_ha = parseHaAreToDecimalHa(record.total_land_area_ha || record['गांव नमुना 7/12 नुसार जमिनीचे क्षेत्र हे.आर']);
      parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record.acquired_land_area_ha || record['संपादित जमिनीचे क्षेत्र हेक्टर आर']) || convertSqmToHa(record['संपादित जमिनीचे क्षेत्र चौ.मी']);
    }

    return parsed;
  };

  // Utility function to get document type label
  const getDocumentTypeLabel = (type) => {
    const types = {
      'aadhar': 'Aadhar Card',
      'pan': 'PAN Card',
      'bank_passbook': 'Bank Passbook',
      'land_documents': 'Land Documents',
      'identity_proof': 'Identity Proof',
      'address_proof': 'Address Proof',
      'other': 'Other Documents'
    };
    return types[type] || type;
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // Handle document upload
  const handleDocumentUpload = async () => {
    if (!selectedRecord || !documentType || selectedFiles.length === 0) {
      toast.error('Please select document type and files');
      return;
    }

    setUploading(true);
    try {
      const uploadedDocuments = [];

      // Upload each file to Firebase Storage
      for (const file of selectedFiles) {
        const fileName = `${selectedRecord.id}_${documentType}_${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `documents/${fileName}`);
        
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        uploadedDocuments.push({
          name: file.name,
          type: documentType,
          url: downloadURL,
          size: file.size,
          uploadedAt: new Date()
        });
      }

      // Update the record in Firestore
      const recordRef = doc(db, 'landRecord', selectedRecord.id);
      const existingDocuments = selectedRecord.documents || [];
      
      await updateDoc(recordRef, {
        documents: [...existingDocuments, ...uploadedDocuments],
        documents_uploaded: true,
        document_verified: false, // Reset verification status
        updated_at: new Date()
      });

      toast.success('Documents uploaded successfully!');
      
      // Reset form and close dialog
      setIsUploadDialogOpen(false);
      setSelectedFiles([]);
      setDocumentType('');
      
      // Refresh data
      loadLandRecords();
      
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  // Load projects
  const loadProjects = async () => {
    try {
      const projectsQuery = query(collection(db, 'projects'));
      const querySnapshot = await getDocs(projectsQuery);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    }
  };

  // Load land records
  const loadLandRecords = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      // Query for records that are either KYC assigned or have documents uploaded
      const recordsQuery = query(
        collection(db, 'landRecord'),
        where('project_id', '==', selectedProject)
      );

      const querySnapshot = await getDocs(recordsQuery);
      const recordsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        documents_uploaded: doc.data().documents_uploaded || false,
        document_verified: doc.data().document_verified || false,
        payment_slip_generate: doc.data().payment_slip_generate || false,
        payment_slip_generated: doc.data().payment_slip_generated || false,
        kyc_assigned: doc.data().kyc_assigned || false,
        kycCompleted: doc.data().kycCompleted || false,
        documents: doc.data().documents || []
      }));

      setLandRecords(recordsData);
      
      // Extract unique filter values
      const villages = [...new Set(recordsData.map(record => record.village).filter(Boolean))];
      const talukas = [...new Set(recordsData.map(record => record.taluka).filter(Boolean))];
      const districts = [...new Set(recordsData.map(record => record.district).filter(Boolean))];
      
      setAvailableVillages(villages);
      setAvailableTalukas(talukas);
      setAvailableDistricts(districts);
      
    } catch (error) {
      console.error('Error loading land records:', error);
      toast.error('Failed to load land records');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentView = (document) => {
    window.open(document.url, '_blank');
  };

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Load land records when project changes
  useEffect(() => {
    if (selectedProject) {
      loadLandRecords();
    }
  }, [selectedProject]);

  // Filter records based on search and filters
  useEffect(() => {
    let filtered = landRecords;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(record => {
        const parsedRecord = parseRecord(record);
        return (
          parsedRecord.owner_name?.toLowerCase().includes(searchLower) ||
          parsedRecord.survey_number?.toString().includes(searchLower) ||
          parsedRecord.village?.toLowerCase().includes(searchLower) ||
          parsedRecord.taluka?.toLowerCase().includes(searchLower) ||
          parsedRecord.district?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply district filter
    if (districtFilter !== 'all') {
      filtered = filtered.filter(record => {
        const parsedRecord = parseRecord(record);
        return parsedRecord.district === districtFilter;
      });
    }

    // Apply taluka filter
    if (talukaFilter !== 'all') {
      filtered = filtered.filter(record => {
        const parsedRecord = parseRecord(record);
        return parsedRecord.taluka === talukaFilter;
      });
    }

    // Apply village filter
    if (villageFilter !== 'all') {
      filtered = filtered.filter(record => {
        const parsedRecord = parseRecord(record);
        return parsedRecord.village === villageFilter;
      });
    }

    // Apply survey number filter
    if (surveyNumberFilter) {
      filtered = filtered.filter(record => {
        const parsedRecord = parseRecord(record);
        return parsedRecord.survey_number?.toString().includes(surveyNumberFilter);
      });
    }

    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, landRecords, districtFilter, talukaFilter, villageFilter, surveyNumberFilter]);

  // Update parsed records when filtered records change
  useEffect(() => {
    const parsed = filteredRecords.map(record => parseRecord(record));
    setParsedRecords(parsed);
  }, [filteredRecords]);

  // Fixed columns for table display
  const fixedColumns = [
    'serial_number',
    'owner_name',
    'survey_number',
    'total_land_area_ha',
    'acquired_land_area_ha',
    'land_type',
    'approved_rate_per_hectare',
    'market_value',
    'factor',
    'land_compensation',
    'structures_amount',
    'forest_trees_amount',
    'fruit_trees_amount',
    'wells_amount',
    'solatium',
    'interest_12percent',
    'total_compensation',
    'deduction',
    'net_payable',
    'compensation_distribution_status',
    'arbitration_remark'
  ];
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">PENDING</Badge>;
      case 'PAID':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">PAID</Badge>;
      case 'UNPAID':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">UNPAID</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(parsedRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, parsedRecords.length);
  const currentRecords = parsedRecords.slice(startIndex, endIndex);

  // Status badge functions
  const getKycStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', className: 'bg-green-100 text-green-800' };
      case 'pending':
        return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
      case 'assigned':
        return { text: 'Assigned', className: 'bg-blue-100 text-blue-800' };
      default:
        return { text: 'Not Assigned', className: 'bg-gray-100 text-gray-800' };
    }
  };

  const getDocumentStatusBadge = (uploaded, verified) => {
    if (!uploaded) {
      return { text: 'Not Uploaded', className: 'bg-gray-100 text-gray-800' };
    }
    if (verified) {
      return { text: 'Verified', className: 'bg-green-100 text-green-800' };
    }
    return { text: 'Uploaded', className: 'bg-yellow-100 text-yellow-800' };
  };

  const getPaymentSlipStatusBadge = (generated, generate) => {
    if (generated) {
      return { text: 'Generated', className: 'bg-green-100 text-green-800' };
    }
    if (generate) {
      return { text: 'Ready', className: 'bg-blue-100 text-blue-800' };
    }
    return { text: 'Not Ready', className: 'bg-gray-100 text-gray-800' };
  };

  const handleDocumentVerification = async (record, verified) => {
    try {
      const recordRef = doc(db, 'landRecord', record.id);
      await updateDoc(recordRef, {
        document_verified: verified,
        document_verified_at: new Date(),
        document_verified_by: user?.uid,
        payment_slip_generate: verified ? true : false // Set payment_slip_generate to true when verified
      });

      toast.success(`Documents ${verified ? 'verified' : 'unverified'} successfully`);
      loadLandRecords(); // Refresh the data
      
    } catch (error) {
      console.error('Error updating document verification:', error);
      toast.error('Failed to update document verification');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Management
          </CardTitle>
          <CardDescription>
            Upload and manage documents for KYC assigned land records and records with uploaded documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">Select Project</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProject && (
            <>
              {/* Filter Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="district-filter" style={{ 
                    
                    fontWeight: 500
                  }}>District</Label>
                  <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger id="district-filter">
                      <SelectValue placeholder="All Districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {availableDistricts.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taluka-filter" style={{ 
                    
                    fontWeight: 500
                  }}>Taluka</Label>
                  <Select value={talukaFilter} onValueChange={setTalukaFilter}>
                    <SelectTrigger id="taluka-filter">
                      <SelectValue placeholder="All Talukas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Talukas</SelectItem>
                      {availableTalukas.map(taluka => (
                        <SelectItem key={taluka} value={taluka}>{taluka}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="village-filter" style={{ 
                    
                    fontWeight: 500
                  }}>Village</Label>
                  <Select value={villageFilter} onValueChange={setVillageFilter}>
                    <SelectTrigger id="village-filter">
                      <SelectValue placeholder="All Villages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Villages</SelectItem>
                      {availableVillages.map(village => (
                        <SelectItem key={village} value={village}>{village}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="survey-filter" style={{ 
                    
                    fontWeight: 500
                  }}>Survey Number</Label>
                  <Input
                    id="survey-filter"
                    placeholder="Enter survey number..."
                    value={surveyNumberFilter}
                    onChange={(e) => setSurveyNumberFilter(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Search */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by owner name, survey number, or village..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Records Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                       {fixedColumns.map(col => (
                        <TableHead key={col} className="text-blue-900 font-semibold" >
                          {col.replace(/_/g, ' ').toUpperCase()}
                        </TableHead>
                      ))}
                      <TableHead className="text-blue-900 font-semibold" >
                        KYC Status
                      </TableHead>
                      <TableHead className="text-blue-900 font-semibold" >
                        Documents
                      </TableHead>
                      <TableHead className="text-blue-900 font-semibold" >
                        Payment Slip
                      </TableHead>
                      <TableHead className="text-blue-900 font-semibold" >
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={fixedColumns.length + 4} className="text-center py-8">
                          Loading records...
                        </TableCell>
                      </TableRow>
                    ) : currentRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={fixedColumns.length + 4} className="text-center py-8 text-gray-500">
                          No records found for the selected project.
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentRecords.map((record) => (
                        <TableRow key={record.id}>
                          {fixedColumns.map((column) => (
                            <TableCell key={column} className="text-blue-800">
                              {column === 'compensation_distribution_status' ? (
                                getStatusBadge(record[column] || 'PENDING')
                              ) : [
                                'total_land_area_ha', 
                                'acquired_land_area_ha', 
                                'approved_rate_per_hectare', 
                                'market_value', 
                                'factor', 
                                'land_compensation', 
                                'structures_amount', 
                                'forest_trees_amount', 
                                'fruit_trees_amount', 
                                'wells_amount', 
                                'solatium', 
                                'interest_12percent', 
                                'total_compensation', 
                                'deduction', 
                                'net_payable'
                              ].includes(column) ? (
                                safeNumericConversion(record[column])
                              ) : (
                                String(record[column] || '')
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            {(() => {
                              const badge = getKycStatusBadge(record.kyc_status);
                              return (
                                <Badge className={badge.className}>
                                  {badge.text}
                                </Badge>
                              );
                            })()}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const badge = getDocumentStatusBadge(record.documents_uploaded, record.document_verified);
                              return (
                                <Badge className={badge.className}>
                                  {badge.text}
                                </Badge>
                              );
                            })()}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const badge = getPaymentSlipStatusBadge(record.payment_slip_generated, record.payment_slip_generate);
                              return (
                                <Badge className={badge.className}>
                                  {badge.text}
                                </Badge>
                              );
                            })()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setIsKycDialogOpen(true);
                                }}
                                disabled={!record.kyc_assigned || record.kycCompleted}
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                {record.kycCompleted ? 'KYC Done' : record.documents_uploaded ? 'Update' : 'Upload'}
                              </Button>
                              {!record.document_verified && record.documents_uploaded && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedRecord(record);
                                      setIsViewDialogOpen(true);
                                    }}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleDocumentVerification(record, true)}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verify
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} records
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {!selectedProject && (
            <div className="text-center py-8 text-gray-500">
              Please select a project to manage documents.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Upload documents for {selectedRecord?.owner_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="docType">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Select Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileSelect}
              />
              <p className="text-xs text-gray-500">
                Supported formats: PDF, JPG, PNG, DOC, DOCX
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files:</Label>
                <div className="space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDocumentUpload} 
                disabled={uploading || !documentType || selectedFiles.length === 0}
              >
                <Upload className="h-4 w-4 mr-1" />
                {uploading ? 'Uploading...' : 'Upload Documents'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document View Dialog - Show existing documents */}
      {selectedRecord && selectedRecord.documents && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Documents for {selectedRecord.owner_name}</DialogTitle>
              <DialogDescription>
                View and manage uploaded documents
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedRecord.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {getDocumentTypeLabel(doc.type)} • 
                        {doc.uploadedAt && new Date(doc.uploadedAt.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDocumentView(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* KYC Document Dialog */}
      {selectedRecord && (
        <KycDocumentDialog
          isOpen={isKycDialogOpen}
          onClose={() => {
            setIsKycDialogOpen(false);
            loadLandRecords(); // Refresh data after KYC dialog closes
          }}
          record={selectedRecord}
          onDocumentsUpdated={loadLandRecords} // Callback to refresh data
        />
      )}
    </div>
  );
};

export default DocumentManagementSection;