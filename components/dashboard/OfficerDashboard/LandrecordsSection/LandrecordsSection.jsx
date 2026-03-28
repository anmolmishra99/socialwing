// src/components/saral/officer/LandRecordsManager2.jsx

import React, { useState, useEffect } from 'react';
// import { UserAuth } from '@/app/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Search,
  Clock
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { cn } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { db } from '@/app/firebase';
import { CSVUploadTab } from './sections/CSVUploadTab';
import { toast } from 'react-hot-toast';
import { auth } from '@/app/firebase';

// Utility function to safely convert string values to numeric data types
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

// Default English Land Record Form structure
const createDefaultEnglishForm = () => ({
  serial_number: 0,
  owner_name: '',
  old_survey_number: '',
  new_survey_number: '',
  group_number: '',
  cts_number: '',
  village: '',
  taluka: '',
  district: '',
  land_area_as_per_7_12: 0,
  acquired_land_area: 0,
  land_type: '',
  land_classification: '',
  approved_rate_per_hectare: 0,
  market_value_as_per_acquired_area: 0,
  factor_as_per_section_26_2: 1,
  land_compensation_as_per_section_26: 0,
  structures: 0,
  forest_trees: 0,
  fruit_trees: 0,
  wells_borewells: 0,
  total_structures_amount: 0,
  total_amount_14_23: 0,
  determined_compensation_26: 0,
  total_compensation_26_27: 0,
  deduction_amount: 0,
  final_payable_compensation: 0,
  remarks: '',
  compensation_distribution_status: 'PENDING',
  notice_number: ''
});

const LandRecordsManager2 = () => {
  const { user } = auth.currentUser;
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [projectName, setProjectName] = useState('');
  const [landRecords, setLandRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('records');
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  // Fetch projects function
  const fetchProjects = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const querySnapshot = await getDocs(projectsRef);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    }
  };

  // Load projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Load land records function
  const loadLandRecords = async () => {
    if (!selectedProject) {
      toast.error('Please select a project first');
      return;
    }

    console.log("selectedProject", selectedProject)

    setLoading(true);
    setLandRecords([]);
    
    try {
      console.log("searcing in landrecord collection", selectedProject)
      const q = query(collection(db, "landRecord"), where("project_id", "==", selectedProject));
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setLandRecords(records);
      
      if (records.length > 0) {
        const allKeys = new Set();
        records.forEach(r => Object.keys(r).forEach(key => allKeys.add(key)));
        setDynamicColumns(Array.from(allKeys).filter(k => 
          k !== 'id' && k !== '_id' && k !== '__v' && 
          k !== 'createdAt' && k !== 'updatedAt' && k !== 'templateName'
        ));
      }
      
      toast.success(`Loaded ${records.length} land records`);
    } catch (error) {
      console.error('Error loading land records:', error);
      toast.error('Failed to load land records');
      setLandRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Set default project
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
      setProjectName(projects[0].projectName);
    }
  }, [projects, selectedProject]);

  // Load records when project changes
  useEffect(() => {
    if (selectedProject) {
      loadLandRecords();
    }
  }, [selectedProject]);

  // Filter land records
  const filteredLandRecords = landRecords.filter(record => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      String(record.owner_name || record.खातेदाराचे_नांव || '').toLowerCase().includes(searchLower) ||
      String(record.village || record.VillageDb || '').toLowerCase().includes(searchLower) ||
      String(record.taluka || record.TalukaDb || '').toLowerCase().includes(searchLower) ||
      String(record.district || record.DistrictDb || '').toLowerCase().includes(searchLower) ||
      String(record.serial_number || record.अ_क्र || '').toLowerCase().includes(searchLower) ||
      String(record.old_survey_number || record.जुना_स_नं || '').toLowerCase().includes(searchLower) ||
      String(record.new_survey_number || record.नविन_स_नं || '').toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLandRecords.length / recordsPerPage);
  const paginatedRecords = filteredLandRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleEdit = (record) => {
    setEditingRecord(record.id || record._id?.toString() || '');
    setEditForm(record);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord || !editForm) return;
    
    setLoading(true);
    try {
      const sanitizedEditForm = { ...editForm };
      delete sanitizedEditForm.id;
      delete sanitizedEditForm._id;
      delete sanitizedEditForm.__v;
      if (sanitizedEditForm.project_id && typeof sanitizedEditForm.project_id === 'object') {
        sanitizedEditForm.project_id = sanitizedEditForm.project_id.id || sanitizedEditForm.project_id;
      }
      
      await updateDoc(doc(db, "landRecord", editingRecord), sanitizedEditForm);
      toast.success('Land record updated successfully');
      setEditingRecord(null);
      setEditForm({});
      loadLandRecords();
    } catch (error) {
      console.error('Error updating land record:', error);
      toast.error('Error updating land record');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditForm({});
  };

  const handleEnglishInputChange = (field, value) => {
    setEnglishLandRecordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEnglishSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProject) {
      toast.error('Please select a project first');
      return;
    }

    setLoading(true);
    
    try {
      const formData = {
        ...englishLandRecordForm,
        project_id: selectedProject
      };
      
      await addDoc(collection(db, "landRecord"), formData);
      toast.success('English land record created successfully');
      setEnglishLandRecordForm(createDefaultEnglishForm());
      loadLandRecords();
    } catch (error) {
      console.error('Error creating English land record:', error);
      toast.error('Error creating English land record');
    } finally {
      setLoading(false);
    }
  };



  const exportToExcel = () => {
    if (filteredLandRecords.length === 0) {
      toast.error('No records to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredLandRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Land Records');
    
    const filename = `land_records_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
    toast.success(`Exported ${filteredLandRecords.length} records to ${filename}`);
  };

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

  const stats = {
    totalRecords: landRecords.length,
    pending: landRecords.filter(r => r.compensation_distribution_status === 'PENDING').length,
    paid: landRecords.filter(r => r.compensation_distribution_status === 'PAID').length,
    unpaid: landRecords.filter(r => r.compensation_distribution_status === 'UNPAID').length
  };

  // English Land record form state
  const [englishLandRecordForm, setEnglishLandRecordForm] = useState(createDefaultEnglishForm());

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ 
              
              fontWeight: 700,
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>Land Records Management</h1>
            <p className="text-blue-100 mt-1" style={{ 
              
              fontWeight: 500,
              letterSpacing: '0.2px'
            }}>Manage and track land acquisition records</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium" style={{ 
              
              fontWeight: 600,
              letterSpacing: '0.2px'
            }}>Officer Portal</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800" style={{ 
              
              fontWeight: 600,
              letterSpacing: '0.2px'
            }}>Total Records</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalRecords}</div>
            <p className="text-xs text-blue-600 mt-1">All land records</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800" style={{ 
              
              fontWeight: 600,
              letterSpacing: '0.2px'
            }}>Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.pending}</div>
            <p className="text-xs text-orange-600 mt-1">Compensation pending</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800" style={{ 
              
              fontWeight: 600,
              letterSpacing: '0.2px'
            }}>Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.paid}</div>
            <p className="text-xs text-green-600 mt-1">Compensation paid</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800" style={{ 
              
              fontWeight: 600,
              letterSpacing: '0.2px'
            }}>Unpaid</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.unpaid}</div>
            <p className="text-xs text-red-600 mt-1">Compensation unpaid</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center space-x-2" style={{ 
            
            fontWeight: 600,
            letterSpacing: '0.2px'
          }}>
            <Database className="h-5 w-5" />
            <span>Land Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="project-select" className="text-blue-800 font-medium" style={{ 
                
                fontWeight: 600
              }}>Select Project</Label>
              <Select
  value={selectedProject}
  onValueChange={(value) => {
    const selected = projects.find((project) => project.id === value);
    if (selected) {
      setSelectedProject(selected.id);
      setProjectName(selected.projectName);
    }
  }}
>
  <SelectTrigger className="border-blue-200">
    <SelectValue placeholder="Select a project" />
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
            <div>
              <Label htmlFor="search-input" className="text-blue-800 font-medium" style={{ 
                
                fontWeight: 600
              }}>Search Records</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                <Input
                  id="search-input"
                  type="text"
                  placeholder="Search by name, village, survey number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-end gap-2">
              <Button onClick={loadLandRecords} disabled={loading || !selectedProject} className="bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportToExcel} disabled={filteredLandRecords.length === 0} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="text-sm text-blue-600" >
              Showing {filteredLandRecords.length} records{searchTerm && ` (filtered by "${searchTerm}")`}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-blue-50">
              {/* <TabsTrigger value="english-form">Create Record</TabsTrigger> */}
              <TabsTrigger value="upload">Upload CSV</TabsTrigger>
              <TabsTrigger value="list">View Records</TabsTrigger>
            </TabsList>

            <TabsContent value="english-form" className="space-y-4">
              <form onSubmit={handleEnglishSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="serial_number" className="text-blue-800 font-medium" >Serial Number</Label>
                    <Input
                      id="serial_number"
                      type="number"
                      value={englishLandRecordForm.serial_number}
                      onChange={(e) => handleEnglishInputChange('serial_number', parseInt(e.target.value) || 0)}
                      required
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner_name" className="text-blue-800 font-medium" >Owner Name</Label>
                    <Input
                      id="owner_name"
                      value={englishLandRecordForm.owner_name}
                      onChange={(e) => handleEnglishInputChange('owner_name', e.target.value)}
                      required
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="old_survey_number" className="text-blue-800 font-medium" >Old Survey Number</Label>
                    <Input
                      id="old_survey_number"
                      value={englishLandRecordForm.old_survey_number}
                      onChange={(e) => handleEnglishInputChange('old_survey_number', e.target.value)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new_survey_number" className="text-blue-800 font-medium" >New Survey Number</Label>
                    <Input
                      id="new_survey_number"
                      value={englishLandRecordForm.new_survey_number}
                      onChange={(e) => handleEnglishInputChange('new_survey_number', e.target.value)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="group_number" className="text-blue-800 font-medium" >Group Number</Label>
                    <Input
                      id="group_number"
                      value={englishLandRecordForm.group_number}
                      onChange={(e) => handleEnglishInputChange('group_number', e.target.value)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cts_number" className="text-blue-800 font-medium" >CTS Number</Label>
                    <Input
                      id="cts_number"
                      value={englishLandRecordForm.cts_number}
                      onChange={(e) => handleEnglishInputChange('cts_number', e.target.value)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="village" className="text-blue-800 font-medium" >Village</Label>
                    <Input
                      id="village"
                      value={englishLandRecordForm.village}
                      onChange={(e) => handleEnglishInputChange('village', e.target.value)}
                      required
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taluka" className="text-blue-800 font-medium" >Taluka</Label>
                    <Input
                      id="taluka"
                      value={englishLandRecordForm.taluka}
                      onChange={(e) => handleEnglishInputChange('taluka', e.target.value)}
                      required
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="district" className="text-blue-800 font-medium" >District</Label>
                    <Input
                      id="district"
                      value={englishLandRecordForm.district}
                      onChange={(e) => handleEnglishInputChange('district', e.target.value)}
                      required
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="land_area_as_per_7_12" className="text-blue-800 font-medium" >Land Area as per 7/12 (Hectares)</Label>
                    <Input
                      id="land_area_as_per_7_12"
                      type="number"
                      step="0.0001"
                      value={englishLandRecordForm.land_area_as_per_7_12}
                      onChange={(e) => handleEnglishInputChange('land_area_as_per_7_12', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="acquired_land_area" className="text-blue-800 font-medium" >Acquired Land Area (Hectares)</Label>
                    <Input
                      id="acquired_land_area"
                      type="number"
                      step="0.0001"
                      value={englishLandRecordForm.acquired_land_area}
                      onChange={(e) => handleEnglishInputChange('acquired_land_area', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="land_type" className="text-blue-800 font-medium" >Land Type</Label>
                    <Input
                      id="land_type"
                      value={englishLandRecordForm.land_type}
                      onChange={(e) => handleEnglishInputChange('land_type', e.target.value)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="land_classification" className="text-blue-800 font-medium" >Land Classification</Label>
                    <Input
                      id="land_classification"
                      value={englishLandRecordForm.land_classification}
                      onChange={(e) => handleEnglishInputChange('land_classification', e.target.value)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="approved_rate_per_hectare" className="text-blue-800 font-medium" >Approved Rate per Hectare (₹)</Label>
                    <Input
                      id="approved_rate_per_hectare"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.approved_rate_per_hectare}
                      onChange={(e) => handleEnglishInputChange('approved_rate_per_hectare', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="market_value_as_per_acquired_area" className="text-blue-800 font-medium" >Market Value as per Acquired Area (₹)</Label>
                    <Input
                      id="market_value_as_per_acquired_area"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.market_value_as_per_acquired_area}
                      onChange={(e) => handleEnglishInputChange('market_value_as_per_acquired_area', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="factor_as_per_section_26_2" className="text-blue-800 font-medium" >Factor as per Section 26(2)</Label>
                    <Input
                      id="factor_as_per_section_26_2"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.factor_as_per_section_26_2}
                      onChange={(e) => handleEnglishInputChange('factor_as_per_section_26_2', parseFloat(e.target.value) || 1)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="land_compensation_as_per_section_26" className="text-blue-800 font-medium" >Land Compensation as per Section 26 (₹)</Label>
                    <Input
                      id="land_compensation_as_per_section_26"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.land_compensation_as_per_section_26}
                      onChange={(e) => handleEnglishInputChange('land_compensation_as_per_section_26', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="structures" className="text-blue-800 font-medium" >Structures (₹)</Label>
                    <Input
                      id="structures"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.structures}
                      onChange={(e) => handleEnglishInputChange('structures', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="forest_trees" className="text-blue-800 font-medium" >Forest Trees (₹)</Label>
                    <Input
                      id="forest_trees"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.forest_trees}
                      onChange={(e) => handleEnglishInputChange('forest_trees', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fruit_trees" className="text-blue-800 font-medium" >Fruit Trees (₹)</Label>
                    <Input
                      id="fruit_trees"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.fruit_trees}
                      onChange={(e) => handleEnglishInputChange('fruit_trees', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wells_borewells" className="text-blue-800 font-medium" >Wells/Borewells (₹)</Label>
                    <Input
                      id="wells_borewells"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.wells_borewells}
                      onChange={(e) => handleEnglishInputChange('wells_borewells', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_structures_amount" className="text-blue-800 font-medium" >Total Structures Amount (₹)</Label>
                    <Input
                      id="total_structures_amount"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.total_structures_amount}
                      onChange={(e) => handleEnglishInputChange('total_structures_amount', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_amount_14_23" className="text-blue-800 font-medium" >Total Amount (14+23) (₹)</Label>
                    <Input
                      id="total_amount_14_23"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.total_amount_14_23}
                      onChange={(e) => handleEnglishInputChange('total_amount_14_23', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="determined_compensation_26" className="text-blue-800 font-medium" >Determined Compensation 26 (₹)</Label>
                    <Input
                      id="determined_compensation_26"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.determined_compensation_26}
                      onChange={(e) => handleEnglishInputChange('determined_compensation_26', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_compensation_26_27" className="text-blue-800 font-medium" >Total Compensation (26+27) (₹)</Label>
                    <Input
                      id="total_compensation_26_27"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.total_compensation_26_27}
                      onChange={(e) => handleEnglishInputChange('total_compensation_26_27', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deduction_amount" className="text-blue-800 font-medium" >Deduction Amount (₹)</Label>
                    <Input
                      id="deduction_amount"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.deduction_amount}
                      onChange={(e) => handleEnglishInputChange('deduction_amount', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="final_payable_compensation" className="text-blue-800 font-medium" >Final Payable Compensation (₹)</Label>
                    <Input
                      id="final_payable_compensation"
                      type="number"
                      step="0.01"
                      value={englishLandRecordForm.final_payable_compensation}
                      onChange={(e) => handleEnglishInputChange('final_payable_compensation', parseFloat(e.target.value) || 0)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="compensation_distribution_status" className="text-blue-800 font-medium" >Compensation Distribution Status</Label>
                    <Select 
                      value={englishLandRecordForm.compensation_distribution_status} 
                      onValueChange={(value) => handleEnglishInputChange('compensation_distribution_status', value)}
                    >
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="PAID">PAID</SelectItem>
                        <SelectItem value="UNPAID">UNPAID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notice_number" className="text-blue-800 font-medium" >Notice Number</Label>
                    <Input
                      id="notice_number"
                      value={englishLandRecordForm.notice_number}
                      onChange={(e) => handleEnglishInputChange('notice_number', e.target.value)}
                      className="border-blue-200"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label htmlFor="remarks" className="text-blue-800 font-medium" >Remarks</Label>
                    <Textarea
                      id="remarks"
                      value={englishLandRecordForm.remarks}
                      onChange={(e) => handleEnglishInputChange('remarks', e.target.value)}
                      rows={3}
                      className="border-blue-200"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading || !selectedProject} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? 'Creating...' : 'Create Land Record'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <CSVUploadTab 
                selectedProject={selectedProject}
                projectName={projectName}
                onUploadComplete={() => {
                  toast.success("Records uploaded successfully");
                  loadLandRecords();
                }}
              />
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              {paginatedRecords.length === 0 ? (
                <div className="text-center py-8 text-blue-600">
                  {searchTerm ? `No land records found matching "${searchTerm}"` : "No land records found for this project"}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-50">
                          <TableHead className="text-blue-900 font-semibold" >Serial</TableHead>
                          {dynamicColumns.map(col => (
                            <TableHead key={col} className="text-blue-900 font-semibold" >
                              {col.replace(/_/g, ' ').toUpperCase()}
                            </TableHead>
                          ))}
                          <TableHead className="text-blue-900 font-semibold" >Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedRecords.map((record, index) => (
                          <TableRow key={record.id || record._id?.toString() || index} className="hover:bg-blue-50/50">
                            <TableCell className="text-blue-800">{(currentPage - 1) * recordsPerPage + index + 1}</TableCell>
                            {dynamicColumns.map((column) => (
                              <TableCell key={column} className="text-blue-800">
                                {editingRecord === (record.id || record._id?.toString()) ? (
                                  column === 'compensation_distribution_status' ? (
                                    <Select
                                      value={editForm[column] || 'PENDING'}
                                      onValueChange={(value) => handleEditInputChange(column, value)}
                                    >
                                      <SelectTrigger className="border-blue-200">
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="PENDING">PENDING</SelectItem>
                                        <SelectItem value="PAID">PAID</SelectItem>
                                        <SelectItem value="UNPAID">UNPAID</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : ['land_area_as_per_7_12', 'acquired_land_area', 'approved_rate_per_hectare', 'market_value_as_per_acquired_area', 'factor_as_per_section_26_2', 'land_compensation_as_per_section_26', 'structures', 'forest_trees', 'fruit_trees', 'wells_borewells', 'total_structures_amount', 'total_amount_14_23', 'determined_compensation_26', 'total_compensation_26_27', 'deduction_amount', 'final_payable_compensation'].includes(column) ? (
                                    <Input
                                      type="number"
                                      step={['land_area_as_per_7_12', 'acquired_land_area'].includes(column) ? '0.0001' : '0.01'}
                                      value={editForm[column] || ''}
                                      onChange={(e) => handleEditInputChange(column, parseFloat(e.target.value) || 0)}
                                      className="border-blue-200"
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
                                      className="border-blue-200"
                                    />
                                  )
                                ) : column === 'compensation_distribution_status' ? (
                                  getStatusBadge(record[column] || 'PENDING')
                                ) : ['land_area_as_per_7_12', 'acquired_land_area', 'approved_rate_per_hectare', 'market_value_as_per_acquired_area', 'factor_as_per_section_26_2', 'land_compensation_as_per_section_26', 'structures', 'forest_trees', 'fruit_trees', 'wells_borewells', 'total_structures_amount', 'total_amount_14_23', 'determined_compensation_26', 'total_compensation_26_27', 'deduction_amount', 'final_payable_compensation'].includes(column) ? (
                                  safeNumericConversion(record[column])
                                ) : (
                                  String(record[column] || '')
                                )}
                              </TableCell>
                            ))}
                            <TableCell>
                              {editingRecord === (record.id || record._id?.toString()) ? (
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={handleSaveEdit} disabled={loading} className="border-green-200 text-green-700 hover:bg-green-50">
                                    <CheckCircle className="h-4 w-4 mr-1" /> Save
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={handleCancelEdit} className="border-red-200 text-red-700 hover:bg-red-50">
                                    <XCircle className="h-4 w-4 mr-1" /> Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="outline" size="sm" onClick={() => handleEdit(record)} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandRecordsManager2;

// Helper functions to calculate solatium and enhanced compensation
const calculateSolatiumAmount = (record) => {
  const determinedCompensation = Number(record.determined_compensation_26) || 0;
  const landCompensation = Number(record.land_compensation_as_per_section_26) || 0;
  return determinedCompensation - landCompensation;
};

const calculateEnhancedCompensation = (record) => {
  const totalCompensation = Number(record.total_compensation_26_27) || 0;
  const determinedCompensation = Number(record.determined_compensation_26) || 0;
  return totalCompensation - determinedCompensation;
};