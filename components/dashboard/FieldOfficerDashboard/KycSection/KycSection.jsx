import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/app/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  UserCheck, 
  FileText, 
  CheckCircle, 
  Clock, 
  Search,
  Edit,
  Save,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Database,
  DollarSign,
  XCircle,
  Upload,
  Eye
} from 'lucide-react';
import { getDocs, collection, query, where, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/app/firebase';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import KycDocumentDialog from '../KycDocumentDialog/KycDocumentDialog';

const KycSection = () => {
  const user = auth.currentUser;
  const [projects, setProjects] = useState([]);
  const [landRecords, setLandRecords] = useState([]);
  const [parsedRecords, setParsedRecords] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [kycData, setKycData] = useState({
    phone: '',
    email: '',
    address: '',
    aadhar_number: '',
    pan_number: '',
    bank_account: '',
    ifsc_code: '',
    notes: '',
    status: 'pending'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  // Filter states
  const [villageFilter, setVillageFilter] = useState('all');
  const [talukaFilter, setTalukaFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [surveyNumberFilter, setSurveyNumberFilter] = useState('');
  const [availableVillages, setAvailableVillages] = useState([]);
  const [availableTalukas, setAvailableTalukas] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);

  // Utility functions aligned with OverviewSection
  const safeNumericConversion = (value) => {
    if (value === null || value === undefined || value === '') {
      return '0';
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    if (typeof value === 'string') {
      const cleanedValue = value.replace(/[^\d.-]/g, '');
      const numericValue = parseFloat(cleanedValue);
      if (!isNaN(numericValue)) {
        return numericValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
    
    return String(value);
  };

  // Utility to parse Ha.Are string to decimal hectares (assuming input like "1.23" means 1.23 ha)
  const parseHaAreToDecimalHa = (value) => {
    if (!value) return 0;
    const num = parseFloat(value.toString().replace(/[^\d.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Utility to convert sq.m to decimal ha (1 ha = 10000 sq.m)
  const convertSqmToHa = (sqm) => {
    const num = parseFloat(sqm);
    return isNaN(num) ? 0 : num / 10000;
  };

  // Parsing function aligned with OverviewSection
  const parseRecord = (record) => {
    const templateName = record.templateName || '';
    let parsed = {
      serial_number: '',
      owner_name: '',
      old_survey_number: '',
      new_survey_number: '',
      survey_number: '',
      gat_number: '',
      cts_number: '',
      total_land_area_ha: 0,
      acquired_land_area_ha: 0,
      land_type: '',
      land_class: '',
      approved_rate_per_hectare: 0,
      market_value: 0,
      factor: 1,
      land_compensation: 0,
      structures_count: 0,
      structures_amount: 0,
      forest_trees_count: 0,
      forest_trees_amount: 0,
      fruit_trees_count: 0,
      fruit_trees_amount: 0,
      wells_count: 0,
      wells_amount: 0,
      total_assets_amount: 0,
      solatium: 0,
      interest_12percent: 0,
      subsistence_allowance: 0,
      additional_allowance_st_sc: 0,
      resettlement_assistance: 0,
      total_compensation: 0,
      deduction: 0,
      net_payable: 0,
      remarks: '',
      compensation_distribution: '',
      arbitration_remark: '',
      compensation_distribution_status: 'PENDING',
      id: record.id,
      kyc_status: record.kyc_status || 'pending',
      kyc_data: record.kyc_data || {},
      documents_uploaded: record.documents_uploaded || false,
      notice_generated: record.notice_generated || false,
      kycCompleted: record.kycCompleted || false,
      created_at: record.created_at,
      updated_at: record.updated_at,
      created_by: record.created_by,
      updated_by: record.updated_by
    };

    if (templateName.includes('LARR 2013')) {
      // Map LARR 2013 fields
      parsed.serial_number = record['अ.क्र'] || '';
      parsed.owner_name = record['खातेदाराचे नांव'] || '';
      parsed.old_survey_number = record['जुना स.नं.'] || '';
      parsed.new_survey_number = record['नविन स.नं.'] || '';
      parsed.survey_number = record['स.नं./हि.नं./ग.नं.'] || '';
      parsed.gat_number = record['गट नंबर'] || '';
      parsed.cts_number = record['सी.टी.एस. नंबर'] || '';
      parsed.total_land_area_ha = parseHaAreToDecimalHa(record['गांव नमुना 7/12 नुसार जमिनीचे क्षेत्र हे.आर']);
      parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record['संपादित जमिनीचे क्षेत्र हेक्टर आर']);
      parsed.land_type = record['जमिनीचा प्रकार'] || '';
      parsed.land_class = record['जमिनीचा प्रकार शेती/ बिनशेती/ धारणाधिकार'] || '';
      parsed.approved_rate_per_hectare = parseFloat(record['मंजुर केलेला दर (प्रति हेक्टर) रक्कम रुपये']) || 0;
      parsed.market_value = parseFloat(record['संपादीत होणाऱ्या जमिनीच्या क्षेत्रानुसार येणारे बाजारमुल्य र.रू']) || 0;
      parsed.factor = parseFloat(record['कलम 26 (2) नुसार गावास लागु असलेले गणक Factor']) || 1;
      parsed.land_compensation = parseFloat(record['कलम 26 नुसार जमिनीचा मोबदला']) || 0;
      parsed.structures_count = parseFloat(record['संख्या बांधकामे']) || 0;
      parsed.structures_amount = parseFloat(record['संख्या रक्कम रुपये']) || 0; // Assuming this is structures amount
      parsed.forest_trees_count = parseFloat(record['वनझाडे झाडांची संख्या']) || 0;
      parsed.forest_trees_amount = parseFloat(record['वनझाडे झाडांची रक्कम रु.']) || 0;
      parsed.fruit_trees_count = parseFloat(record['फळझाडे झाडांची संख्या']) || 0;
      parsed.fruit_trees_amount = parseFloat(record['फळझाडे झाडांची रक्कम रु.']) || 0;
      parsed.wells_count = parseFloat(record['विहिरी/बोअरवेल संख्या']) || 0;
      parsed.wells_amount = parseFloat(record['विहिरी/बोअरवेल रक्कम रुपये']) || 0;
      parsed.total_assets_amount = parseFloat(record['एकुण रक्कम रुपये']) || 0;
      parsed.total_compensation = parseFloat(record['एकुण रक्कम']) || 0; // Adjust as needed
      parsed.solatium = parseFloat(record['100 %  सोलेशियम (दिलासा रक्कम) सेक्शन 30 (1)  RFCT-LARR 2013 अनुसूचि 1 अ.नं. 5']) || 0;
      parsed.determined_compensation = parseFloat(record['निर्धारित मोबदला']) || 0;
      parsed.additional_25percent = parseFloat(record['एकूण रक्कमेवर  25%  वाढीव मोबदला (अ.क्र. 26 नुसार येणाऱ्या रक्कमेवर)']) || 0;
      parsed.total_compensation = parseFloat(record['एकुण मोबदला']) || 0;
      parsed.deduction = parseFloat(record['वजावट रक्कम रुपये']) || 0;
      parsed.net_payable = parseFloat(record['हितसंबंधिताला अदा करावयाची एकुण मोबदला रक्कम रुपये (अ.क्र. 25 वजा 26)']) || 0;
      parsed.remarks = record['शेरा'] || '';
      parsed.compensation_distribution = record['मोबदला वाटप तपशिल'] || '';
      parsed.arbitration_remark = record['मध्यस्थी संबंधी टिप्पणी (Arbitration Remark)'] || '';
      parsed.compensation_distribution_status = record['मोबदला वाटप तपशिल'] || 'PENDING'; // Assuming status is here, like 'PAID'
    } else if (templateName.includes('NHAI 1956')) {
      // Map NHAI 1956 fields
      parsed.serial_number = record['अ.क्र'] || '';
      parsed.owner_name = record['खातेदाराचे नांव'] || '';
      parsed.survey_number = record['स.नं./हि.नं./ग.नं.'] || '';
      parsed.total_land_area_ha = parseHaAreToDecimalHa(record['गांव नमुना 7/12 नुसार जमिनीचे क्षेत्र हे.आर']);
      parsed.acquired_land_area_ha = convertSqmToHa(record['संपादित जमिनीचे क्षेत्र चौ.मी']);
      parsed.land_type = record['जमिनीचा प्रकार'] || '';
      parsed.land_class = record['जमिनीचा प्रकार शेती/ बिनशेती'] || '';
      parsed.approved_rate_per_hectare = (parseFloat(record['सक्षम प्राधिकारी यांनी निश्चित केलेला दर (प्रति चौ.मी.)']) || 0) * 10000; // Convert per sq.m to per ha
      parsed.market_value = parseFloat(record['जमिनीच्या गणकानुसार येणारा मोबदला']) || 0;
      parsed.deduction = parseFloat(record['10 % अनर्जित रक्कम (वजावट)']) || 0;
      parsed.land_compensation = parseFloat(record['एकुण मोबदला']) || 0;
      parsed.factor = parseFloat(record['गावास लागु असलेले गणक FACTOR 2']) || 1;
      parsed.payable_compensation = parseFloat(record['देय मोबदला']) || 0;
      parsed.structures_count = parseFloat(record['बांधकामे संख्या']) || 0;
      parsed.structures_amount = parseFloat(record['बांधकामे रक्कम रुपये']) || 0;
      parsed.forest_trees_count = parseFloat(record['वनझाडे झाडांची संख्या']) || 0;
      parsed.forest_trees_amount = parseFloat(record['वनझाडे झाडांची रक्कम रु.']) || 0;
      parsed.fruit_trees_count = parseFloat(record['फळझाडे झाडांची संख्या']) || 0;
      parsed.fruit_trees_amount = parseFloat(record['फळझाडे झाडांची रक्कम रु.']) || 0;
      parsed.wells_count = parseFloat(record['विहिरी/बोअरवेल संख्या']) || 0;
      parsed.wells_amount = parseFloat(record['विहिरी/बोअरवेल रक्कम रुपये']) || 0;
      parsed.total_assets_amount = parseFloat(record['रक्कम रुपये']) || 0;
      parsed.total_compensation = parseFloat(record['एकुण रक्कम']) || 0;
      parsed.interest_12percent = parseFloat(record['कलम 3 (अ) ची अधिसूचना प्रसिध्द झालेल्या दिनांकापासुन ते निवाडा घोषित दिनांकापर्यत 12 % जमिनीचा वाढीव मोबदला प्रमाणे प्रतिवर्ष सेक्शन 30 (3) RFCT-LARR 2013 च्या कलम 26 (1) व 26 (2) मधील तरतुदीनुसार दि.03/07/2023 ते दि.15/04/2025 पर्यंत 652 दिवसाचे व्याज']) || 0;
      parsed.solatium = parseFloat(record['100 %  सोलेटीएम (दिलासा रक्कम) सेक्शन 30 (1)  RFCT-LARR 2013 अनुसूचि 1 अ.नं. 5']) || 0;
      parsed.total_compensation = parseFloat(record['एकुण मोबदला']) || 0;
      parsed.additional_nazrana = parseFloat(record['(+) नजराणा रक्कम 10 %']) || 0;
      parsed.net_payable = parseFloat(record['एकुण मोबदला निवाडयाची एकुण रक्कम']) || 0;
      parsed.remarks = record['शेरा'] || '';
      parsed.compensation_distribution = record['मोबदला वाटप तपशिल'] || '';
      parsed.arbitration_remark = record['मध्यस्थी संबंधी टिप्पणी (Arbitration Remark)'] || '';
      parsed.compensation_distribution_status = record['मोबदला वाटप तपशिल'] || 'PENDING';
    } else if (templateName.includes('RAA 2008')) {
      // Map RAA 2008 fields
      parsed.serial_number = record['अ.क्र'] || '';
      parsed.owner_name = record['संयुक्त मोजणी विवरण पत्रानुसार खातेदारांची नावे'] || '';
      parsed.survey_number = record['संयुक्त मोजणी विवरणपत्रानुसार ग.नं.'] || '';
      parsed.land_type = record['जमिनीचा प्रकार'] || '';
      parsed.total_land_area_ha = parseHaAreToDecimalHa(record['संयुक्त मोजणी विवरण पत्रानुसार एकूण क्षेत्र (हे.आर)']);
      parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record['संयुक्त मोजणी विवरणपत्रा नुसार संपादित जमिनीचे क्षेत्र (हे.आर)']);
      parsed.approved_rate_per_hectare = parseFloat(record['संपादित जमिनीचे निश्चित केलेले दर प्रति हेक्टरी (र.रू)']) || 0;
      parsed.market_value = parseFloat(record['संपादित जमिनीचे येणारे मुल्य (र.रू)']) || 0;
      parsed.factor_value = parseFloat(record['सहायक संचालक नगर रचना पालघर यांचेकडील पत्र दि. 23/02/2024 रोजीचे पत्रान्वये गांवास येणारा घटक - 2 हिशोबित करून येणारे मुल्यांकन र.रू.']) || 0;
      parsed.forest_trees_count = parseFloat(record['वनझाडे संख्या']) || 0;
      parsed.forest_trees_amount = parseFloat(record['वनझाडे किंमत रू.']) || 0;
      parsed.fruit_trees_count = parseFloat(record['फळझाडे संख्या']) || 0;
      parsed.fruit_trees_amount = parseFloat(record['फळझाडे किंमत रू.']) || 0;
      parsed.solatium = parseFloat(record['100% सोलेशियम (दिलासा रक्कम) (सेक्शन 30 (1) RFCT-LARR 2013 अनुसूची 1 अ.क्र. 5)']) || 0;
      parsed.interest_12percent = parseFloat(record['20 A अधिसूचना दिनांका पासुन ते निवाडा घोषित दिनांकापर्यत जमिनीचे वाढीव मोबदला 12% प्रमाणे प्रति वर्ष (सेक्शन 30 (3) RFCT-LARR - 2013 अनुसूची 1 अ.क्र. 8, कलम 26 (1) व 26 (2) मधील तरतुदीनुसार) (दि. 10/10/2023 ते दि. 05/02/2025 पर्यत ) (कालावधी 484 दिवस)']) || 0;
      parsed.subsistence_allowance = parseFloat(record['प्रति महा रक्कम रुपये 3000/- प्रमाणे एक वर्षाकरिता निर्वाह भत्ता (कलम 3 RFCT-LARR 2013 अनुसूचि 2 अ.क्र. 5)']) || 0;
      parsed.additional_allowance_st_sc = parseFloat(record['अनुसूचित जमाती व अनुसूचित जाती करिता अतिरिक्त निर्वाह भत्ता (कलम 3 RFCT-LARR 2013 अनुसुचि 2 अ.क्र. 5)']) || 0;
      parsed.resettlement_assistance = parseFloat(record['बाधित कुटुंबास पुनर्वसनाकरिता आर्थिक सहाय प्रति कुटुबास रु. 50,000 (कलम 3 RFCT-LARR 2013 अनुसुचि 2 अ.क्र. 10)']) || 0;
      parsed.total_compensation = parseFloat(record['एकूण मोबदला']) || 0;
      parsed.deduction = parseFloat(record['वजाती']) || 0;
      parsed.net_payable = parseFloat(record['निव्वळ देय रक्कम']) || 0;
      parsed.remarks = record['शेरा'] || ''; // Multiple, but combine if needed
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

  // Status badge function aligned with OverviewSection
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

  // Load projects from Firebase
  const loadProjects = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef);
      const querySnapshot = await getDocs(q);
      
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    }
  };

  // Load land records from Firebase for selected project
  const loadLandRecords = async () => {
    if (!selectedProject) {
      setLandRecords([]);
      setParsedRecords([]);
      setFilteredRecords([]);
      return;
    }

    try {
      setLoading(true);

      const landRecordsRef = collection(db, 'landRecord');
      const q = query(
        landRecordsRef, 
        where('project_id', '==', selectedProject),
        where('kycCompleted', '==', false),
        where('notice_generated', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const recordsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Parse records using aligned function
      const parsedData = recordsData.map(record => parseRecord(record));
      
      setLandRecords(recordsData);
      setParsedRecords(parsedData);
      setFilteredRecords(parsedData);
      setCurrentPage(1); // Reset pagination
      
      // Extract unique values for filters
      const villages = [...new Set(parsedData.map(record => record.village).filter(Boolean))].sort();
      const talukas = [...new Set(parsedData.map(record => record.taluka).filter(Boolean))].sort();
      const districts = [...new Set(parsedData.map(record => record.district).filter(Boolean))].sort();
      
      setAvailableVillages(villages);
      setAvailableTalukas(talukas);
      setAvailableDistricts(districts);
      
    } catch (error) {
      console.error('Error fetching land records:', error);
      toast.error('Failed to fetch land records');
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, [user]);

  // Load land records when project changes
  useEffect(() => {
    loadLandRecords();
  }, [selectedProject, user]);

  // Filter records based on search term and filters
  useEffect(() => {
    let filtered = parsedRecords;

    // Apply district filter
    if (districtFilter && districtFilter !== 'all') {
          filtered = filtered.filter(record => record.district === districtFilter);
        }

    // Apply taluka filter
    if (talukaFilter && talukaFilter !== 'all') {
          filtered = filtered.filter(record => record.taluka === talukaFilter);
        }

    // Apply village filter
    if (villageFilter && villageFilter !== 'all') {
          filtered = filtered.filter(record => record.village === villageFilter);
        }

    // Apply survey number filter
    if (surveyNumberFilter) {
      filtered = filtered.filter(record =>
        String(record.survey_number || '').toLowerCase().includes(surveyNumberFilter.toLowerCase()) ||
        String(record.old_survey_number || '').toLowerCase().includes(surveyNumberFilter.toLowerCase()) ||
        String(record.new_survey_number || '').toLowerCase().includes(surveyNumberFilter.toLowerCase())
      );
    }

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(record =>
        String(record.owner_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(record.survey_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(record.old_survey_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(record.new_survey_number || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, parsedRecords, villageFilter, talukaFilter, districtFilter, surveyNumberFilter]);

  const getKycStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>;
    }
  };

  // Fixed columns aligned with OverviewSection
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

  // Pagination logic
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handleKycEdit = (record) => {
    setSelectedRecord(record);
    setKycData({
      phone: record.kyc_data?.phone || '',
      email: record.kyc_data?.email || '',
      address: record.kyc_data?.address || '',
      aadhar_number: record.kyc_data?.aadhar_number || '',
      pan_number: record.kyc_data?.pan_number || '',
      bank_account: record.kyc_data?.bank_account || '',
      ifsc_code: record.kyc_data?.ifsc_code || '',
      notes: record.kyc_data?.notes || '',
      status: record.kyc_status || 'pending'
    });
    setIsDialogOpen(true);
  };

  const handleKycSave = async () => {
    if (!selectedRecord) return;

    try {
      setSaving(true);
      const recordRef = doc(db, 'landRecord', selectedRecord.id);
      
      await updateDoc(recordRef, {
        kyc_phone: kycData.phone,
        kyc_email: kycData.email,
        kyc_address: kycData.address,
        kyc_aadhar: kycData.aadhar_number,
        kyc_pan: kycData.pan_number,
        kyc_bank: kycData.bank_account,
        kyc_ifsc: kycData.ifsc_code,
        kyc_notes: kycData.notes,
        kyc_status: kycData.status,
        kyc_completed: kycData.status === 'completed',
        kyc_updated_at: new Date()
      });

      // Refresh the records
      await loadLandRecords();
      setIsDialogOpen(false);
      toast.success('KYC data updated successfully!');
    } catch (error) {
      console.error('Error updating KYC data:', error);
      toast.error('Failed to update KYC data');
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentUpload = (record) => {
    setSelectedRecord(record);
    setIsDocumentDialogOpen(true);
  };

  const handleDocumentsUpdated = async () => {
    // Refresh the records when documents are updated
    await loadLandRecords();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center space-x-2" style={{ 
            
            fontWeight: 600,
            letterSpacing: '0.2px'
          }}>
            <UserCheck className="h-5 w-5" />
            <span>KYC Management - {selectedProject ? projects.find(p => p.id === selectedProject)?.projectName : 'Select Project'}</span>
          </CardTitle>
          <CardDescription >
            Complete KYC verification for assigned land records
            {selectedProject && (
              <div className="text-sm text-blue-600 mt-2">
                Showing {filteredRecords.length} KYC assignments{searchTerm && ` (filtered by "${searchTerm}")`}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project" style={{ 
              
              fontWeight: 500
            }}>Select Project</Label>
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
                    placeholder="Search by owner name or survey number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead className="text-blue-900 font-semibold" >Serial</TableHead>
                      {fixedColumns.map(col => (
                        <TableHead key={col} className="text-blue-900 font-semibold" >
                          {col.replace(/_/g, ' ').toUpperCase()}
                        </TableHead>
                      ))}
                      <TableHead className="text-blue-900 font-semibold" >KYC STATUS</TableHead>
                      <TableHead className="text-blue-900 font-semibold" >CONTACT INFO</TableHead>
                      <TableHead className="text-blue-900 font-semibold" >ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={fixedColumns.length + 3} className="text-center py-8 text-blue-600">
                          Loading KYC assignments...
                        </TableCell>
                      </TableRow>
                    ) : paginatedRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={fixedColumns.length + 3} className="text-center py-8 text-blue-600">
                          {searchTerm ? `No KYC assignments found matching "${searchTerm}"` : "No KYC assignments found for this project."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRecords.map((record, index) => (
                        <TableRow key={record.id} className="hover:bg-blue-50/50">
                          <TableCell className="text-blue-800">{(currentPage - 1) * recordsPerPage + index + 1}</TableCell>
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
                            {getKycStatusBadge(record.kyc_status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              {record.kyc_data?.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-gray-500" />
                                  {record.kyc_data.phone}
                                </div>
                              )}
                              {record.kyc_data?.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-gray-500" />
                                  {record.kyc_data.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleKycEdit(record)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit KYC
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleDocumentUpload(record)}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Do KYC
                          </Button>
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

          {!selectedProject && (
            <div className="text-center py-8 text-blue-600">
              Please select a project to manage KYC records.
            </div>
          )}
        </CardContent>
      </Card>

      {/* KYC Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit KYC Information</DialogTitle>
            <DialogDescription>
              Update KYC details for {selectedRecord?.owner_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={kycData.phone}
                  onChange={(e) => setKycData({...kycData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={kycData.email}
                  onChange={(e) => setKycData({...kycData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={kycData.address}
                onChange={(e) => setKycData({...kycData, address: e.target.value})}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Number</Label>
                <Input
                  id="aadhar"
                  value={kycData.aadhar_number}
                  onChange={(e) => setKycData({...kycData, aadhar_number: e.target.value})}
                  placeholder="Enter Aadhar number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  value={kycData.pan_number}
                  onChange={(e) => setKycData({...kycData, pan_number: e.target.value})}
                  placeholder="Enter PAN number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank">Bank Account Number</Label>
                <Input
                  id="bank"
                  value={kycData.bank_account}
                  onChange={(e) => setKycData({...kycData, bank_account: e.target.value})}
                  placeholder="Enter bank account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input
                  id="ifsc"
                  value={kycData.ifsc_code}
                  onChange={(e) => setKycData({...kycData, ifsc_code: e.target.value})}
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">KYC Status</Label>
              <Select value={kycData.status} onValueChange={(value) => setKycData({...kycData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={kycData.notes}
                onChange={(e) => setKycData({...kycData, notes: e.target.value})}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleKycSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                {saving ? 'Saving...' : 'Save KYC Data'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* KYC Document Upload Dialog */}
      <KycDocumentDialog
        isOpen={isDocumentDialogOpen}
        onClose={() => setIsDocumentDialogOpen(false)}
        record={selectedRecord}
        onDocumentsUpdated={handleDocumentsUpdated}
      />
    </div>
  );
};

export default KycSection;