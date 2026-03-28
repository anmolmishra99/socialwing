import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/app/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Gavel, Award, Users } from 'lucide-react';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '@/app/firebase';
import { toast } from 'react-hot-toast';

import HearingNoticeBuilder from './sections/HearingNoticeBuilder';
import ExistingNoticesManager from './sections/ExistingNoticesManager';
import JmrAwardManager from './sections/JmrAwardManager';

const NoticeSection = () => {
    const user = auth.currentUser;
//   const { user } = auth.currentUser;
  const [projects, setProjects] = useState([]);
  const [landRecords, setLandRecords] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('existing');
  const [loading, setLoading] = useState(false);

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

      console.log("pd", projectsData)
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    }
  };

  // Load land records from Firebase for selected project
  const loadLandRecords = async () => {
    if (!selectedProject) {
      setLandRecords([]);
      setFilteredRecords([]);
      return;
    }

    try {
      setLoading(true);

      console.log("project_id", selectedProject);
      const landRecordsRef = collection(db, 'landRecord');
      const q = query(
        landRecordsRef, 
        where('project_id', '==', selectedProject),
      );
      const querySnapshot = await getDocs(q);
      
      const recordsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLandRecords(recordsData);
      console.log("recordsData", recordsData);
      setFilteredRecords(recordsData);
    } catch (error) {
      console.error('Error fetching land records:', error);
      toast.error('Failed to fetch land records');
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    console.log("user", user);
    loadProjects();
  }, [user]);

  // Load land records when project changes
  useEffect(() => {
    loadLandRecords();
  }, [selectedProject, user]);

  // Filter records based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecords(landRecords);
      return;
    }

    const filtered = landRecords.filter(record => 
      record.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.old_survey_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.new_survey_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.village?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredRecords(filtered);
  }, [searchTerm, landRecords]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notice Management System
          </CardTitle>
          <CardDescription>
            Generate notices, manage KYC assignments, and handle JMR/Award processes
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

          {/* Tab Navigation */}
          {selectedProject && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Existing Notices
                </TabsTrigger>
                <TabsTrigger value="hearing" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Hearing Notices
                </TabsTrigger>
                {/* <TabsTrigger value="jmr-award" className="flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  JMR & Award
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="existing" className="mt-6">
                <ExistingNoticesManager
                  selectedProject={selectedProject}
                  selectedRecords={selectedRecords}
                  setSelectedRecords={setSelectedRecords}
                  filteredRecords={filteredRecords}
                  landRecords={landRecords}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  loading={loading}
                  loadLandRecords={loadLandRecords}
                />
              </TabsContent>

              <TabsContent value="hearing" className="mt-6">
                <HearingNoticeBuilder
                  selectedProject={selectedProject}
                  filteredRecords={filteredRecords}
                  landRecords={landRecords}
                  loadLandRecords={loadLandRecords}
                />
              </TabsContent>

              <TabsContent value="jmr-award" className="mt-6">
                <JmrAwardManager
                  selectedProject={selectedProject}
                  selectedRecords={selectedRecords}
                  setSelectedRecords={setSelectedRecords}
                  filteredRecords={filteredRecords}
                  landRecords={landRecords}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  loadLandRecords={loadLandRecords}
                />
              </TabsContent>
            </Tabs>
          )}

          {!selectedProject && (
            <div className="text-center py-8 text-gray-500">
              Please select a project to begin managing notices.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoticeSection;
