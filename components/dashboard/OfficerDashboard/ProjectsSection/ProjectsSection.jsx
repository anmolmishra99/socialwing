import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/app/context/AuthContext';
import { auth, db } from '@/app/firebase';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FolderPlus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload,
  FileText,
  MapPin,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, serverTimestamp, setDoc } from 'firebase/firestore';


const ProjectsSection = () => {
  const { user } = UserAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useUserStore();
  const [currentUser, setCurrentUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    schemeName: '',
    landRequired: '',
    landAvailable: '',
    landToBeAcquired: '',
    forestLand: '',
    agriculturalLand: '',
    nonAgriculturalLand: '',
    type: 'greenfield',
    videoUrl: '',
    description: '',
    ministry: '',
    applicableLaws: [],
    projectAim: '',
    village: '',
    taluka: '',
    distict: ''
  });

  const LAND_ACQUISITION_LAWS = [
    { value: 'LARR_2013', label: 'Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013' },
    { value: 'MH_LandRevenue_Code_1966', label: 'Maharashtra Land Revenue Code, 1966' },
    { value: 'NH_Act_1956', label: 'National Highways Act, 1956' },
    { value: 'Railways_Act_1989', label: 'Railways Act, 1989' },
    { value: 'Metro_Railways_Act', label: 'Metro Railways (Construction of Works) Act' },
    { value: 'MH_Highway_Act_1955', label: 'Maharashtra Highway Act, 1955' },
    { value: 'MH_PWD_Act_1951', label: 'Maharashtra Public Works Department Act, 1951' },
    { value: 'MH_Road_Development_Act_2001', label: 'Maharashtra Road Development Corporation Act, 2001' },
    { value: 'State_Specific_R&R', label: 'State-specific R&R / Notifications' },
  ];
  const [customLaw, setCustomLaw] = useState('');

  const translations = {
    marathi: {
      title: 'प्रकल्प व्यवस्थापन',
      createProject: 'नवीन प्रकल्प तयार करा',
      projectNumber: 'प्रकल्प क्रमांक',
      projectName: 'प्रकल्पाचे नाव',
      schemeName: 'योजनेचे नाव',
      landRequired: 'आवश्यक जमीन (हेक्टर)',
      landAvailable: 'उपलब्ध जमीन (हेक्टर)',
      landToBeAcquired: 'संपादन करायची जमीन (हेक्टर)',
      forestLand: 'वन जमीन (हेक्टर)',
      agriculturalLand: 'शेतीची जमीन (हेक्टर)',
      nonAgriculturalLand: 'गैर-शेती जमीन (हेक्टर)',
      type: 'प्रकल्प प्रकार',
      greenfield: 'ग्रीनफील्ड',
      brownfield: 'ब्राउनफील्ड',
      videoUrl: 'व्हिडिओ URL',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      description: 'प्रकल्पाचे वर्णन',
      descriptionDetails: 'सविस्तर माहिती',
      billPassedDate: 'बिल मंजुरीची तारीख',
      ministry: 'मंत्रालय/विभाग',
      applicableLaws: 'लागू कायदे',
      projectAim: 'प्रकल्पाचा उद्देश',
      village: 'गाव',
      taluka: 'तालुका',
      distict: 'जिल्हा',
      edit: 'संपादन करा',
      delete: 'हटवा',
      view: 'पाहा',
      status: 'स्थिती',
      created: 'तयार केले',
      updated: 'अपडेट केले',
      actions: 'कृती',
      noProjects: 'कोणतेही प्रकल्प नाहीत',
      hectares: 'हेक्टर',
      stage3A: '3A टप्पा',
      stage3D: '3D टप्पा',
      corrigendum: 'दुरुस्ती',
      award: 'बक्षीस',
      pending: 'प्रलंबित',
      approved: 'मंजूर',
      rejected: 'नाकारले'
    },
    english: {
      title: 'Project Management',
      createProject: 'Create New Project',
      projectNumber: 'Project Number',
      projectName: 'Project Name',
      schemeName: 'Scheme Name',
      landRequired: 'Land Required (Hectares)',
      landAvailable: 'Land Available (Hectares)',
      landToBeAcquired: 'Land to be Acquired (Hectares)',
      forestLand: 'Forest Land (Hectares)',
      agriculturalLand: 'Agricultural Land (Hectares)',
      nonAgriculturalLand: 'Non-Agricultural Land (Hectares)',
      type: 'Project Type',
      greenfield: 'Greenfield',
      brownfield: 'Brownfield',
      videoUrl: 'Video URL',
      save: 'Save',
      cancel: 'Cancel',
      description: 'Project Description',
      descriptionDetails: 'Description Details',
      billPassedDate: 'Date of Bill Passing',
      ministry: 'Ministry',
      applicableLaws: 'Applicable Laws',
      projectAim: 'Project Aim',
      village: 'Village',
      taluka: 'Taluka',
      distict: 'District',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      status: 'Status',
      created: 'Created',
      updated: 'Updated',
      actions: 'Actions',
      noProjects: 'No projects found',
      hectares: 'Hectares',
      stage3A: 'Stage 3A',
      stage3D: 'Stage 3D',
      corrigendum: 'Corrigendum',
      award: 'Award',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    },
    hindi: {
      title: 'परियोजना प्रबंधन',
      createProject: 'नई परियोजना बनाएं',
      projectNumber: 'परियोजना संख्या',
      projectName: 'परियोजना का नाम',
      schemeName: 'योजना का नाम',
      landRequired: 'आवश्यक भूमि (हेक्टेयर)',
      landAvailable: 'उपलब्ध भूमि (हेक्टेयर)',
      landToBeAcquired: 'अधिग्रहण की जाने वाली भूमि (हेक्टेयर)',
      type: 'परियोजना प्रकार',
      greenfield: 'ग्रीनफील्ड',
      brownfield: 'ब्राउनफील्ड',
      videoUrl: 'वीडियो URL',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      description: 'परियोजना विवरण',
      descriptionDetails: 'विवरण विवरण',
      billPassedDate: 'विधेयक पारित होने की तिथि',
      ministry: 'मंत्रालय',
      applicableLaws: 'लागू कानून',
      projectAim: 'परियोजना का उद्देश्य',
      village: 'गाँव',
      taluka: 'तालुका',
      distict: 'जिल्हा',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      view: 'देखें',
      status: 'स्थिति',
      created: 'बनाया गया',
      updated: 'अपडेट किया गया',
      actions: 'कार्रवाई',
      noProjects: 'कोई परियोजना नहीं मिली',
      hectares: 'हेक्टेयर',
      stage3A: 'चरण 3A',
      stage3D: 'चरण 3D',
      corrigendum: 'संशोधन',
      award: 'पुरस्कार',
      pending: 'लंबित',
      approved: 'अनुमोदित',
      rejected: 'अस्वीकृत'
    }
  };

  const t = translations[user?.language || 'marathi'];

  // Fetch user details from Firebase
  const fetchUserDetails = async () => {
    if (!user?.uid) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        setCurrentUser(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(projectsData)
        
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchProjects();
  }, [user]);

  // Create project in Firebase
  const createProject = async (projectData) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const projectRef = doc(db, 'projects', projectId);
      
      const projectWithMetadata = {
        ...projectData,
        userId: user.uid,
        projectId: projectId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: {
          stage3A: 'pending',
          stage3D: 'pending',
          corrigendum: 'pending',
          award: 'pending'
        }
      };
      
      await setDoc(projectRef, projectWithMetadata);
      
      // Add to local state
      setProjects(prev => [...prev, { id: projectId, ...projectWithMetadata }]);
      
      return projectId;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  // Update project in Firebase
  const updateProject = async (projectId, projectData) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const projectRef = doc(db, 'projects', projectId);
      
      const updatedData = {
        ...projectData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(projectRef, updatedData);
      
      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updatedData }
          : project
      ));
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  // Delete project from Firebase
  const deleteProject = async (projectId) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);
      
      // Remove from local state
      setProjects(prev => prev.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  // Safely handle projects without a status object
  const getProjectStatus = (project) => {
    const status = project?.status || {};
    return {
      stage3A: status.stage3A || 'pending',
      stage3D: status.stage3D || 'pending',
    } ;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">{t.approved}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">{t.pending}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">{t.rejected}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Numeric validation for land fields
    const lr = parseFloat(formData.landRequired);
    const la = parseFloat(formData.landAvailable);
    const lta = parseFloat(formData.landToBeAcquired);
    
    if ([lr, la, lta].some((n) => Number.isNaN(n))) {
      toast.error('Please enter valid numeric values for Land Required, Land Available, and Land To Be Acquired');
      return;
    }
    if (lr < 0 || la < 0 || lta < 0) {
      toast.error('Land values cannot be negative');
      return;
    }
    if (la > lr) {
      toast.error('Available land cannot exceed required land');
      return;
    }
    if (lta > lr) {
      toast.error('Land to be acquired cannot exceed required land');
      return;
    }
    if (la + lta > lr + 1e-6) {
      toast.error('Available + To Be Acquired cannot exceed Required land');
      return;
    }
    
    try {
      // Process comma-separated fields into lowercase arrays
      const processCommaSeparatedField = (field) => {
        if (!field || typeof field !== 'string') return [];
        return field
          .split(',')
          .map(item => item.trim().toLowerCase())
          .filter(item => item.length > 0);
      };

      const baseData= {
        projectName: formData.projectName,
        schemeName: formData.schemeName,
        landRequired: lr,
        landAvailable: la,
        landToBeAcquired: lta,
        type: formData.type,
        videoUrl: formData.videoUrl,
        description: formData.description,
        descriptionDetails: {
          ministry: formData.ministry || undefined,
          applicableLaws: (formData.applicableLaws || []).filter(Boolean),
          projectAim: formData.projectAim || undefined,
          village: processCommaSeparatedField(formData.village),
          taluka: processCommaSeparatedField(formData.taluka),
          distict: processCommaSeparatedField(formData.distict),
        },
        // Add additional fields for Firebase
        forestLand: parseFloat(formData.forestLand) || 0,
        agriculturalLand: parseFloat(formData.agriculturalLand) || 0,
        nonAgriculturalLand: parseFloat(formData.nonAgriculturalLand) || 0,
        projectNumber: formData.projectNumber || `PRJ-${Date.now().toString().slice(-6)}`,
      };
  
      if (editingProject) {
        await updateProject(editingProject.id, baseData);
        toast.success('Project updated successfully');
      } else {
        await createProject(baseData);
        toast.success('Project created successfully');
      }
  
      setIsDialogOpen(false);
      setEditingProject(null);
      setFormData({
        projectName: '',
        schemeName: '',
        landRequired: '',
        landAvailable: '',
        landToBeAcquired: '',
        forestLand: '',
        agriculturalLand: '',
        nonAgriculturalLand: '',
        type: 'greenfield',
        videoUrl: '',
        description: '',
        ministry: '',
        applicableLaws: [],
        projectAim: '',
        village: '',
        taluka: '',
        distict: ''
      });
    } catch (error) {
      toast.error(`Failed to save project${error?.message ? `: ${error.message}` : ''}`);
    }
  };

  const handleEdit = () => {
    setEditingProject(project);
    setFormData({
      projectNumber: project.projectNumber,
      projectName: project.projectName,
      schemeName: project.schemeName,
      landRequired: project.landRequired.toString(),
      landAvailable: project.landAvailable.toString(),
      landToBeAcquired: project.landToBeAcquired.toString(),
      forestLand: project.forestLand?.toString() || '',
      agriculturalLand: project.agriculturalLand?.toString() || '',
      nonAgriculturalLand: project.nonAgriculturalLand?.toString() || '',
      type: project.type,
      videoUrl: project.videoUrl || '',
      description: project.description || '',
      billPassedDate: project.descriptionDetails?.billPassedDate ? String(project.descriptionDetails.billPassedDate).slice(0,10) : '',
      ministry: project.descriptionDetails?.ministry || '',
      applicableLaws: (project.descriptionDetails?.applicableLaws || []) ,
      projectAim: project.descriptionDetails?.projectAim || '',
      village: (project.descriptionDetails?.village || []).join(', '),
      taluka: (project.descriptionDetails?.taluka || []).join(', '),
      distict: (project.descriptionDetails?.distict || []).join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
          <p className="text-gray-600">Manage land acquisition projects</p>
          {currentUser && (
            <p className="text-sm text-gray-500 mt-1">
              Welcome, {currentUser.name || currentUser.email} ({currentUser.role})
            </p>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" onClick={() => setIsDialogOpen(true)} className="bg-orange-600 hover:bg-orange-700">
              <FolderPlus className="h-4 w-4 mr-2" />
              {t.createProject}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FolderPlus className="h-5 w-5 text-orange-600" />
                <span>{editingProject ? 'Edit Project' : t.createProject}</span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">{t.projectName}</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schemeName">{t.schemeName}</Label>
                  <Input
                    id="schemeName"
                    value={formData.schemeName}
                    onChange={(e) => setFormData({...formData, schemeName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">{t.type}</Label>
                  <Select value={formData.type} onValueChange={() => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="greenfield">{t.greenfield}</SelectItem>
                      <SelectItem value="brownfield">{t.brownfield}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landRequired">{t.landRequired}</Label>
                  <Input
                    id="landRequired"
                    type="number"
                    step="0.01"
                    value={formData.landRequired}
                    onChange={(e) => setFormData({...formData, landRequired: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landAvailable">{t.landAvailable}</Label>
                  <Input
                    id="landAvailable"
                    type="number"
                    step="0.01"
                    value={formData.landAvailable}
                    onChange={(e) => setFormData({...formData, landAvailable: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landToBeAcquired">{t.landToBeAcquired}</Label>
                  <Input
                    id="landToBeAcquired"
                    type="number"
                    step="0.01"
                    value={formData.landToBeAcquired}
                    onChange={(e) => setFormData({...formData, landToBeAcquired: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forestLand">{t.forestLand}</Label>
                  <Input
                    id="forestLand"
                    type="number"
                    step="0.01"
                    value={formData.forestLand}
                    onChange={(e) => setFormData({...formData, forestLand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agriculturalLand">{t.agriculturalLand}</Label>
                  <Input
                    id="agriculturalLand"
                    type="number"
                    step="0.01"
                    value={formData.agriculturalLand}
                    onChange={(e) => setFormData({...formData, agriculturalLand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonAgriculturalLand">{t.nonAgriculturalLand}</Label>
                  <Input
                    id="nonAgriculturalLand"
                    type="number"
                    step="0.01"
                    value={formData.nonAgriculturalLand}
                    onChange={(e) => setFormData({...formData, nonAgriculturalLand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">{t.videoUrl}</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">{t.description}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>{t.descriptionDetails}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Removed bill passed date as requested */}
                    <div className="hidden">
                      <Label htmlFor="billPassedDate">{t.billPassedDate}</Label>
                      <Input id="billPassedDate" disabled />
                    </div>
                    <div>
                      <Label htmlFor="ministry">{t.ministry}</Label>
                      <Input
                        id="ministry"
                        placeholder="उदा. महसूल व वन विभाग"
                        value={formData.ministry}
                        onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="applicableLaws">{t.applicableLaws}</Label>
                      <div className="grid grid-cols-1 gap-2 p-2 border rounded-md">
                        {LAND_ACQUISITION_LAWS.map((law) => (
                          <label key={law.value} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={formData.applicableLaws?.includes(law.value)}
                              onCheckedChange={(checked) => {
                                const set = new Set(formData.applicableLaws || []);
                                if (checked) set.add(law.value); else set.delete(law.value);
                                setFormData({ ...formData, applicableLaws: Array.from(set) });
                              }}
                            />
                            <span>{law.label}</span>
                          </label>
                        ))}
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Add custom act"
                            value={customLaw}
                            onChange={(e) => setCustomLaw(e.target.value)}
                          />
                          <Button type="button" variant="outline" onClick={() => {
                            const v = customLaw.trim();
                            if (!v) return;
                            const next = new Set(formData.applicableLaws || []);
                            next.add(v);
                            setFormData({ ...formData, applicableLaws: Array.from(next) });
                            setCustomLaw('');
                          }}>Add</Button>
                        </div>
                        {formData.applicableLaws && formData.applicableLaws.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.applicableLaws.map((law) => (
                              <Badge key={law} variant="secondary" className="cursor-pointer" onClick={() => {
                                const next = (formData.applicableLaws || []).filter(x => x !== law);
                                setFormData({ ...formData, applicableLaws: next });
                              }}>{law}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="projectAim">{t.projectAim}</Label>
                      <Textarea
                        id="projectAim"
                        value={formData.projectAim}
                        onChange={(e) => setFormData({ ...formData, projectAim: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="village">{t.village}</Label>
                      <Input
                        id="village"
                        placeholder="Enter village separated by commas (e.g., Government, Local Community, NGOs)"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="taluka">{t.taluka}</Label>
                      <Input
                        id="taluka"
                        placeholder="Enter taluka separated by commas (e.g., Farmers, Local Residents, Industries)"
                        value={formData.taluka}
                        onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="distict">{t.distict}</Label>
                      <Input
                        id="distict"
                        placeholder="Enter distict separated by commas (e.g., Land Disputes, Environmental Concerns, Funding)"
                        value={formData.distict}
                        onChange={(e) => setFormData({ ...formData, distict: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  {t.save}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-orange-600" />
            <span>Projects ({projects.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t.noProjects}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.projectName}</TableHead>
                  <TableHead>{t.landToBeAcquired} ({t.hectares})</TableHead>
                  <TableHead>{t.type}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead>{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.projectName}</TableCell>
                    <TableCell>{project.landToBeAcquired} {t.hectares}</TableCell>
                    <TableCell>
                      <Badge variant={project.type === 'greenfield' ? 'default' : 'secondary'}>
                        {project.type === 'greenfield' ? t.greenfield : t.brownfield}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">{t.stage3A}:</span>
                          {getStatusBadge(getProjectStatus(project).stage3A)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">{t.stage3D}:</span>
                          {getStatusBadge(getProjectStatus(project).stage3D)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          title={t.view}
                          onClick={() => { setViewingProject(project); setIsViewOpen(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Project Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-orange-600" />
              <span>{t.view}</span>
            </DialogTitle>
          </DialogHeader>
          {viewingProject && (
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-600">{t.projectName}:</span> <span className="font-medium">{viewingProject.projectName}</span></div>
                <div><span className="text-gray-600">{t.schemeName}:</span> <span className="font-medium">{viewingProject.schemeName}</span></div>
                <div><span className="text-gray-600">{t.type}:</span> <span className="font-medium">{viewingProject.type}</span></div>
              </div>
              <div className="space-y-1">
                <Label>{t.description}</Label>
                <div className="p-3 rounded border bg-gray-50 whitespace-pre-wrap text-sm">
                  {viewingProject.description || '—'}
                </div>
              </div>
              <div className="space-y-1">
                <Label>{t.descriptionDetails}</Label>
                <div className="p-3 rounded border bg-gray-50 text-sm">
                  <div className="grid md:grid-cols-2 gap-2">
                    <div><span className="text-gray-600">{t.billPassedDate}:</span> <span className="font-medium">{viewingProject.descriptionDetails?.billPassedDate ? String(viewingProject.descriptionDetails.billPassedDate).slice(0,10) : '—'}</span></div>
                    <div><span className="text-gray-600">{t.ministry}:</span> <span className="font-medium">{viewingProject.descriptionDetails?.ministry || '—'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-600">{t.applicableLaws}:</span> <span className="font-medium">{(viewingProject.descriptionDetails?.applicableLaws || []).join(', ') || '—'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-600">{t.projectAim}:</span> <span className="font-medium whitespace-pre-wrap">{viewingProject.descriptionDetails?.projectAim || '—'}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsSection;
