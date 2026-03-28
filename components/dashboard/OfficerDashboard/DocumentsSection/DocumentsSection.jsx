
import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/app/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Upload, 
  Search, 
  Download, 
  Eye,
  FileText,
  MapPin,
  Calendar,
  X,
  CheckCircle,
  Clock,
  Building2,
  Trash2
} from 'lucide-react';
import { getDocs, collection, writeBatch, doc, serverTimestamp, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '@/app/firebase';
import { toast } from 'react-hot-toast';

const DocumentsSection = () => {
  const { user, language, switchLanguage } = UserAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Upload form state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadData, setUploadData] = useState({
    projectId: '',
    selectedVillages: [],
    selectedDistricts: [],
    selectedTalukas: []
  });

  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    category: 'all',
    projectId: 'all',
    district: 'all',
    taluka: 'all',
    village: 'all'
  });

  // Multi-language translations
  const translations = {
    marathi: {
      title: 'दस्तऐवज व्यवस्थापन प्रणाली',
      uploadDocuments: 'दस्तऐवज अपलोड करा',
      viewRecords: 'रेकॉर्ड पहा',
      documentCategory: 'दस्तऐवज श्रेणी',
      selectCategory: 'श्रेणी निवडा',
      notification: 'अधिसूचना',
      jmr: 'संयुक्त मोजमाप रेकॉर्ड',
      finalNotification: 'अंतिम अधिसूचना',
      notice: 'नोटीस',
      locationDetails: 'स्थान तपशील',
      project: 'प्रकल्प',
      selectProject: 'प्रकल्प निवडा',
      villages: 'गावे',
      districts: 'जिल्हे',
      talukas: 'तालुके',
      selectMultiple: 'अनेक निवडा',
      uploadFiles: 'फायली अपलोड करा',
      selectedFiles: 'निवडलेल्या फायली',
      upload: 'अपलोड',
      searchFilters: 'शोध फिल्टर',
      allCategories: 'सर्व श्रेणी',
      allProjects: 'सर्व प्रकल्प',
      allDistricts: 'सर्व जिल्हे',
      allTalukas: 'सर्व तालुके',
      allVillages: 'सर्व गावे',
      view: 'पहा',
      download: 'डाउनलोड',
      delete: 'हटवा',
      noDocuments: 'कोणतेही दस्तऐवज नाहीत',
      totalDocuments: 'एकूण दस्तऐवज',
      jmrRecords: 'JMR रेकॉर्ड',
      notifications: 'अधिसूचना',
      notices: 'नोटीस',
      switchLanguage: 'भाषा'
    },
    english: {
      title: 'Document Management System',
      uploadDocuments: 'Upload Documents',
      viewRecords: 'View Records',
      documentCategory: 'Document Category',
      selectCategory: 'Select Category',
      notification: 'Notification',
      jmr: 'Joint Measurement Record',
      finalNotification: 'Final Notification',
      notice: 'Notice',
      locationDetails: 'Location Details',
      project: 'Project',
      selectProject: 'Select Project',
      villages: 'Villages',
      districts: 'Districts',
      talukas: 'Talukas',
      selectMultiple: 'Select Multiple',
      uploadFiles: 'Upload Files',
      selectedFiles: 'Selected Files',
      upload: 'Upload',
      searchFilters: 'Search Filters',
      allCategories: 'All Categories',
      allProjects: 'All Projects',
      allDistricts: 'All Districts',
      allTalukas: 'All Talukas',
      allVillages: 'All Villages',
      view: 'View',
      download: 'Download',
      delete: 'Delete',
      noDocuments: 'No documents found',
      totalDocuments: 'Total Documents',
      jmrRecords: 'JMR Records',
      notifications: 'Notifications',
      notices: 'Notices',
      switchLanguage: 'Language'
    },
    hindi: {
      title: 'दस्तावेज़ प्रबंधन प्रणाली',
      uploadDocuments: 'दस्तावेज़ अपलोड करें',
      viewRecords: 'रिकॉर्ड देखें',
      documentCategory: 'दस्तावेज़ श्रेणी',
      selectCategory: 'श्रेणी चुनें',
      notification: 'अधिसूचना',
      jmr: 'संयुक्त माप रिकॉर्ड',
      finalNotification: 'अंतिम अधिसूचना',
      notice: 'नोटिस',
      locationDetails: 'स्थान विवरण',
      project: 'परियोजना',
      selectProject: 'परियोजना चुनें',
      villages: 'गाँव',
      districts: 'जिले',
      talukas: 'तालुका',
      selectMultiple: 'कई चुनें',
      uploadFiles: 'फाइलें अपलोड करें',
      selectedFiles: 'चयनित फाइलें',
      upload: 'अपलोड',
      searchFilters: 'खोज फिल्टर',
      allCategories: 'सभी श्रेणियां',
      allProjects: 'सभी परियोजनाएं',
      allDistricts: 'सभी जिले',
      allTalukas: 'सभी तालुका',
      allVillages: 'सभी गाँव',
      view: 'देखें',
      download: 'डाउनलोड',
      delete: 'हटाएं',
      noDocuments: 'कोई दस्तावेज़ नहीं मिला',
      totalDocuments: 'कुल दस्तावेज़',
      jmrRecords: 'JMR रिकॉर्ड',
      notifications: 'अधिसूचनाएं',
      notices: 'नोटिस',
      switchLanguage: 'भाषा'
    }
  };

  const t = translations[user?.language || 'marathi'];

  // Document categories
  const categories = ['Notification', 'JMR', 'Final Notification', 'Notice'];

  // Load projects and documents on component mount
  useEffect(() => {
    if (user?.uid) {
      loadProjects();
      loadDocuments();
    }
  }, [user]);

  // Filter documents when search filters change
  useEffect(() => {
    filterDocuments();
  }, [searchFilters, documents]);

  // Load projects from Firebase
  const loadProjects = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where('userId', '==', user.uid));
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

  // Load documents from Firebase
  const loadDocuments = async () => {
    try {
      const q = query(
        collection(db, 'documents'), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const docsData = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        uploadDate: d.data().createdAt?.toDate()?.toLocaleDateString() || 'Unknown'
      }));
      
      setDocuments(docsData);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    }
  };

  // Filter documents based on search criteria
  const filterDocuments = () => {
    let filtered = documents;

    if (searchFilters.category !== 'all') {
      filtered = filtered.filter(doc => doc.category === searchFilters.category);
    }
    if (searchFilters.projectId !== 'all') {
      filtered = filtered.filter(doc => doc.projectId === searchFilters.projectId);
    }
    if (searchFilters.district !== 'all') {
      filtered = filtered.filter(doc => {
        const project = getProjectById(doc.projectId);
        return project?.descriptionDetails?.distict?.includes(searchFilters.district);
      });
    }
    if (searchFilters.taluka !== 'all') {
      filtered = filtered.filter(doc => {
        const project = getProjectById(doc.projectId);
        return project?.descriptionDetails?.taluka?.includes(searchFilters.taluka);
      });
    }
    if (searchFilters.village !== 'all') {
      filtered = filtered.filter(doc => {
        const project = getProjectById(doc.projectId);
        return project?.descriptionDetails?.village?.includes(searchFilters.village);
      });
    }

    setFilteredDocuments(filtered);
  };

  // Get unique values for filter dropdowns from project data
  const getUniqueValues = (field) => {
    const values = new Set();
    
    // Get unique values from all projects' descriptionDetails
    projects.forEach(project => {
      if (project.descriptionDetails) {
        let projectValues = [];
        
        switch(field) {
          case 'districts':
            projectValues = project.descriptionDetails.distict || [];
            break;
          case 'talukas':
            projectValues = project.descriptionDetails.taluka || [];
            break;
          case 'villages':
            projectValues = project.descriptionDetails.village || [];
            break;
          default:
            return [];
        }
        
        projectValues.forEach(value => values.add(value));
      }
    });
    
    return Array.from(values).sort();
  };

  // Get project data for location selection
  const getSelectedProject = () => {
    return projects.find(p => p.id === uploadData.projectId);
  };

  // Get project by ID helper function
  const getProjectById = (projectId) => {
    return projects.find(p => p.id === projectId);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle location selection (multiple)
  const handleLocationSelection = (type, value, checked) => {
    setUploadData(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }));
  };

  // Handle document upload
  const handleUpload = async () => {
    if (!selectedCategory || selectedFiles.length === 0) {
      toast.error('Please select category and at least one file');
      return;
    }

    if (!uploadData.projectId) {
      toast.error('Please select a project');
      return;
    }

    if (uploadData.selectedVillages.length === 0 || 
        uploadData.selectedDistricts.length === 0 || 
        uploadData.selectedTalukas.length === 0) {
      toast.error('Please select at least one village, district, and taluka');
      return;
    }

    setLoading(true);
    try {
      // Upload files to Firebase Storage
      const uploadPromises = selectedFiles.map(async (file) => {
        const storageRef = ref(storage, `documents/${selectedCategory}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return { fileName: file.name, fileUrl: downloadURL };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      // Save metadata to Firestore
      const batch = writeBatch(db);
      const selectedProject = getSelectedProject();
      
      uploadedFiles.forEach(({ fileName, fileUrl }) => {
        const docRef = doc(collection(db, 'documents'));
        batch.set(docRef, {
          category: selectedCategory,
          fileName,
          fileUrl,
          projectId: uploadData.projectId,
          projectName: selectedProject?.projectName || '',
          villages: uploadData.selectedVillages,
          districts: uploadData.selectedDistricts,
          talukas: uploadData.selectedTalukas,
          status: 'completed',
          userId: user.uid,
          createdAt: serverTimestamp()
        });
      });

      await batch.commit();
      
      // Reset form
      setSelectedFiles([]);
      setSelectedCategory('');
      setUploadData({
        projectId: '',
        selectedVillages: [],
        selectedDistricts: [],
        selectedTalukas: []
      });
      console.log(uploadData)
      
      toast.success('Documents uploaded successfully!');
      setActiveTab('view');
      loadDocuments(); // Reload documents
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload documents');
    } finally {
      setLoading(false);
    }
  };

  // Handle document deletion
  const handleDelete = async (docToDelete) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDoc(doc(db, 'documents', docToDelete.id));
        
        // Delete from storage
        try {
          const storageRef = ref(storage, docToDelete.fileUrl);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.warn('Could not delete file from storage:', storageError);
        }
        
        setDocuments(prev => prev.filter(d => d.id !== docToDelete.id));
        toast.success('Document deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete document');
      }
    }
  };

  // Get category badge styling
  const getCategoryBadge = (category) => {
    const colors = {
      'Notification': 'bg-blue-100 text-blue-800 border-blue-200',
      'JMR': 'bg-green-100 text-green-800 border-green-200',
      'Final Notification': 'bg-purple-100 text-purple-800 border-purple-200',
      'Notice': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-3xl font-bold" style={{ 
                  
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}>
                  {t.title}
                </h1>
                <p className="text-blue-100 mt-2" style={{ 
                  
                  fontWeight: 500
                }}>
                  Document Management System
                </p>
              </div>
              <div className="flex items-center gap-6">
               
                 
                <FileText className="h-14 w-14 text-blue-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              {t.totalDocuments}
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{documents.length}</div>
            <p className="text-xs text-blue-600 mt-1">All uploaded files</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              {t.jmrRecords}
            </CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {documents.filter(d => d.category === 'JMR').length}
            </div>
            <p className="text-xs text-green-600 mt-1">Joint Measurement</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              {t.notifications}
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {documents.filter(d => d.category === 'Notification' || d.category === 'Final Notification').length}
            </div>
            <p className="text-xs text-purple-600 mt-1">All notifications</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              {t.notices}
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {documents.filter(d => d.category === 'Notice').length}
            </div>
            <p className="text-xs text-orange-600 mt-1">Legal notices</p>
          </CardContent>
        </Card>
      </div>

        {/* Main Content */}
        <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-blue-900 flex items-center space-x-3 text-xl">
              <FileText className="h-6 w-6" />
              <span>Document Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-blue-50 p-1 h-12">
                <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium py-2">
                  <Upload className="h-4 w-4" />
                  {t.uploadDocuments}
                </TabsTrigger>
                <TabsTrigger value="view" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium py-2">
                  <Search className="h-4 w-4" />
                  {t.viewRecords}
                </TabsTrigger>
              </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-8 mt-8">
              <div className="space-y-6">
                {/* Category Selection */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">
                      {t.documentCategory}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder={t.selectCategory} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Notification">{t.notification}</SelectItem>
                        <SelectItem value="JMR">{t.jmr}</SelectItem>
                        <SelectItem value="Final Notification">{t.finalNotification}</SelectItem>
                        <SelectItem value="Notice">{t.notice}</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Project Selection */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">
                      {t.project}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={uploadData.projectId} onValueChange={(value) => 
                      setUploadData(prev => ({ 
                        ...prev, 
                        projectId: value,
                        selectedVillages: [],
                        selectedDistricts: [],
                        selectedTalukas: []
                      }))
                    }>
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder={t.selectProject} />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{project.projectName}</span>
                              <span className="text-xs text-gray-500">
                                {project.schemeName} • {project.descriptionDetails?.village?.length || 0} villages
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Multi-Location Selection */}
                {uploadData.projectId && getSelectedProject() && (
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-900">
                        {t.locationDetails}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Villages */}
                        <div>
                          <Label className="text-blue-800 font-medium mb-3 block">
                            {t.villages} ({t.selectMultiple})
                          </Label>
                          <div className="space-y-2 max-h-40 overflow-y-auto border border-blue-200 rounded-md p-3">
                            {getSelectedProject()?.descriptionDetails?.village?.map(village => (
                              <div key={village} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`village-${village}`}
                                  checked={uploadData.selectedVillages.includes(village)}
                                  onCheckedChange={(checked) => 
                                    handleLocationSelection('selectedVillages', village, checked)
                                  }
                                />
                                <Label htmlFor={`village-${village}`} className="text-sm">
                                  {village}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Districts */}
                        <div>
                          <Label className="text-blue-800 font-medium mb-3 block">
                            {t.districts} ({t.selectMultiple})
                          </Label>
                          <div className="space-y-2 max-h-40 overflow-y-auto border border-blue-200 rounded-md p-3">
                            {getSelectedProject()?.descriptionDetails?.distict?.map(district => (
                              <div key={district} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`district-${district}`}
                                  checked={uploadData.selectedDistricts.includes(district)}
                                  onCheckedChange={(checked) => 
                                    handleLocationSelection('selectedDistricts', district, checked)
                                  }
                                />
                                <Label htmlFor={`district-${district}`} className="text-sm">
                                  {district}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Talukas */}
                        <div>
                          <Label className="text-blue-800 font-medium mb-3 block">
                            {t.talukas} ({t.selectMultiple})
                          </Label>
                          <div className="space-y-2 max-h-40 overflow-y-auto border border-blue-200 rounded-md p-3">
                            {getSelectedProject()?.descriptionDetails?.taluka?.map(taluka => (
                              <div key={taluka} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`taluka-${taluka}`}
                                  checked={uploadData.selectedTalukas.includes(taluka)}
                                  onCheckedChange={(checked) => 
                                    handleLocationSelection('selectedTalukas', taluka, checked)
                                  }
                                />
                                <Label htmlFor={`taluka-${taluka}`} className="text-sm">
                                  {taluka}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* File Upload */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">
                      {t.uploadFiles}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Input
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <p className="text-blue-900 font-medium mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-blue-600 text-sm">
                          PDF files only (Multiple files supported)
                        </p>
                      </label>
                    </div>

                    {/* Selected Files List */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-blue-800">
                          {t.selectedFiles} ({selectedFiles.length})
                        </Label>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span className="text-sm text-blue-900">{file.name}</span>
                                <span className="text-xs text-blue-600">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleUpload}
                      disabled={loading || selectedFiles.length === 0 || !selectedCategory || !uploadData.projectId}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? 'Uploading...' : `${t.upload} ${selectedFiles.length} File(s)`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* View Tab */}
            <TabsContent value="view" className="space-y-8 mt-8">
              {/* Search Filters */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">
                    {t.searchFilters}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                      <Label className="text-blue-800">Category</Label>
                      <Select value={searchFilters.category} onValueChange={(value) => 
                        setSearchFilters(prev => ({ ...prev, category: value }))
                      }>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder={t.allCategories} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t.allCategories}</SelectItem>
                          {categories.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-blue-800">Project</Label>
                      <Select value={searchFilters.projectId} onValueChange={(value) => 
                        setSearchFilters(prev => ({ ...prev, projectId: value }))
                      }>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder={t.allProjects} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t.allProjects}</SelectItem>
                          {projects.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{p.projectName}</span>
                                <span className="text-xs text-gray-500">
                                  {p.schemeName} • {p.type} • {p.landRequired} hectares
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-blue-800">District</Label>
                      <Select value={searchFilters.district} onValueChange={(value) => 
                        setSearchFilters(prev => ({ ...prev, district: value }))
                      }>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder={t.allDistricts} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t.allDistricts}</SelectItem>
                          {getUniqueValues('districts').map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-blue-800">Taluka</Label>
                      <Select value={searchFilters.taluka} onValueChange={(value) => 
                        setSearchFilters(prev => ({ ...prev, taluka: value }))
                      }>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder={t.allTalukas} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t.allTalukas}</SelectItem>
                          {getUniqueValues('talukas').map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-blue-800">Village</Label>
                      <Select value={searchFilters.village} onValueChange={(value) => 
                        setSearchFilters(prev => ({ ...prev, village: value }))
                      }>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder={t.allVillages} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t.allVillages}</SelectItem>
                          {getUniqueValues('villages').map(v => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Table */}
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                  <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents ({filteredDocuments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b-2 border-blue-200">
                          <TableHead className="font-semibold text-gray-700 py-4">Category</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4">File Name</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4">Project</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4 min-w-[300px]">Locations</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4">Upload Date</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4">Status</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDocuments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-12">
                              <div className="flex flex-col items-center space-y-4">
                                <FileText className="h-16 w-16 text-gray-300" />
                                <div>
                                  <p className="text-lg font-medium text-gray-500 mb-2">{t.noDocuments}</p>
                                  <p className="text-sm text-gray-400">Upload some documents to get started</p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredDocuments.map((doc, index) => (
                            <TableRow key={doc.id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                              <TableCell className="py-4">
                                <Badge className={`${getCategoryBadge(doc.category)} font-medium`}>
                                  {doc.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium text-blue-900 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <span className="font-medium">{doc.fileName}</span>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {(doc.fileSize && `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`) || 'Size unknown'}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Building2 className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-blue-900">
                                      {getProjectById(doc.projectId)?.projectName || 'Unknown Project'}
                                    </span>
                                  </div>
                                  {getProjectById(doc.projectId)?.schemeName && (
                                    <div className="text-xs text-gray-600 ml-6">
                                      Scheme: {getProjectById(doc.projectId).schemeName}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="space-y-3 max-w-sm">
                                  {/* Get project data for location information */}
                                  {(() => {
                                    const project = getProjectById(doc.projectId);
                                    const villages = project?.descriptionDetails?.village || [];
                                    const districts = project?.descriptionDetails?.distict || [];
                                    const talukas = project?.descriptionDetails?.taluka || [];
                                    
                                    return (
                                      <>
                                        {/* Villages */}
                                        {villages.length > 0 && (
                                          <div className="space-y-1">
                                            <div className="flex items-center space-x-1 text-xs font-medium text-green-700">
                                              <MapPin className="h-3 w-3" />
                                              <span>Villages:</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                              {villages.map((village, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 px-2 py-1">
                                                  {village}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Districts */}
                                        {districts.length > 0 && (
                                          <div className="space-y-1">
                                            <div className="flex items-center space-x-1 text-xs font-medium text-blue-700">
                                              <MapPin className="h-3 w-3" />
                                              <span>Districts:</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                              {districts.map((district, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-2 py-1">
                                                  {district}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Talukas */}
                                        {talukas.length > 0 && (
                                          <div className="space-y-1">
                                            <div className="flex items-center space-x-1 text-xs font-medium text-purple-700">
                                              <MapPin className="h-3 w-3" />
                                              <span>Talukas:</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                              {talukas.map((taluka, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 px-2 py-1">
                                                  {taluka}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Show message if no location data */}
                                        {villages.length === 0 && districts.length === 0 && talukas.length === 0 && (
                                          <div className="text-xs text-gray-500 italic">
                                            No location data available
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm text-gray-600">
                                  <div className="font-medium text-gray-800">
                                    {new Date(doc.uploadDate?.seconds * 1000 || doc.uploadDate).toLocaleDateString('en-IN', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {new Date(doc.uploadDate?.seconds * 1000 || doc.uploadDate).toLocaleTimeString('en-IN', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(doc.status)}
                                  <Badge variant="outline" className="border-green-200 text-green-800 font-medium px-3 py-1">
                                    {doc.status}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                                    onClick={() => window.open(doc.fileUrl, '_blank')}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    {t.view}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = doc.fileUrl;
                                      link.download = doc.fileName;
                                      link.click();
                                    }}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    {t.download}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                                    onClick={() => handleDelete(doc)}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentsSection;