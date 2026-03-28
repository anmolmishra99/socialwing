import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { FileText, Download, Eye, Printer, Calendar, MapPin, Users, Award, Gavel } from 'lucide-react';

const JmrAwardManager = ({ 
  selectedProject, 
  selectedRecords, 
  setSelectedRecords,
  filteredRecords, 
  searchTerm, 
  setSearchTerm,
  landRecords,
  loading,
  loadLandRecords
}) => {
  const [jmrData, setJmrData] = useState({
    jmrNumber: '',
    jmrDate: '',
    projectName: '',
    location: '',
    totalArea: '',
    totalCompensation: '',
    affectedPersons: '',
    rehabilitationDetails: '',
    environmentalClearance: '',
    publicHearingDate: '',
    objections: '',
    recommendations: '',
    approvalAuthority: '',
    approvalDate: '',
    conditions: ''
  });

  const [awardData, setAwardData] = useState({
    awardNumber: '',
    awardDate: '',
    projectName: '',
    location: '',
    totalLandArea: '',
    totalCompensation: '',
    numberOfLandowners: '',
    acquisitionPurpose: '',
    urgencyClause: '',
    compensationDetails: '',
    rehabilitationPackage: '',
    timelineForPayment: '',
    appealProcedure: '',
    collectorate: '',
    collectorName: '',
    collectorSignature: ''
  });

  const [generatedJmrs, setGeneratedJmrs] = useState([]);
  const [generatedAwards, setGeneratedAwards] = useState([]);
  const [previewContent, setPreviewContent] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');

  const handleJmrInputChange = (field, value) => {
    setJmrData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAwardInputChange = (field, value) => {
    setAwardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateJMR = async () => {
    if (selectedRecords.length === 0) {
      toast.error('Please select at least one record');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/jmr/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject,
          landownerIds: selectedRecords,
          jmrData: jmrData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedJmrs(prev => [...prev, data.data]);
        setSelectedRecords([]);
        toast.success('JMR generated successfully');
        
        // Reset form
        setJmrData({
          jmrNumber: '',
          jmrDate: '',
          projectName: '',
          location: '',
          totalArea: '',
          totalCompensation: '',
          affectedPersons: '',
          rehabilitationDetails: '',
          environmentalClearance: '',
          publicHearingDate: '',
          objections: '',
          recommendations: '',
          approvalAuthority: '',
          approvalDate: '',
          conditions: ''
        });
      } else {
        toast.error(data.message || 'Failed to generate JMR');
      }
    } catch (error) {
      console.error('Error generating JMR:', error);
      toast.error('Failed to generate JMR');
    }
  };

  const generateAward = async () => {
    if (selectedRecords.length === 0) {
      toast.error('Please select at least one record');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/award/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject,
          landownerIds: selectedRecords,
          awardData: awardData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedAwards(prev => [...prev, data.data]);
        setSelectedRecords([]);
        toast.success('Award generated successfully');
        
        // Reset form
        setAwardData({
          awardNumber: '',
          awardDate: '',
          projectName: '',
          location: '',
          totalLandArea: '',
          totalCompensation: '',
          numberOfLandowners: '',
          acquisitionPurpose: '',
          urgencyClause: '',
          compensationDetails: '',
          rehabilitationPackage: '',
          timelineForPayment: '',
          appealProcedure: '',
          collectorate: '',
          collectorName: '',
          collectorSignature: ''
        });
      } else {
        toast.error(data.message || 'Failed to generate Award');
      }
    } catch (error) {
      console.error('Error generating Award:', error);
      toast.error('Failed to generate Award');
    }
  };

  const previewDocument = (document, title) => {
    setPreviewContent(document.content || document.jmrContent || document.awardContent || 'Content not available');
    setPreviewTitle(title);
    setIsPreviewOpen(true);
  };

  const downloadDocument = (document, filename) => {
    const content = document.content || document.jmrContent || document.awardContent || 'Content not available';
    const html = generatePDFReadyHTML(content, filename);
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.info('Document downloaded as HTML. Use your browser\'s Print function to save as PDF.');
  };

  const generatePDFReadyHTML = (content, title) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `;
  };

  const printDocument = (document, title) => {
    const content = document.content || document.jmrContent || document.awardContent || 'Content not available';
    const printWindow = window.open('', '_blank');
    const html = generatePDFReadyHTML(content, title);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredLandRecords = filteredRecords.filter(record => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      String(record['खातेदाराचे_नांव'] || '').toLowerCase().includes(searchLower) ||
      String(record['गांव'] || '').toLowerCase().includes(searchLower) ||
      String(record['स.नं./हि.नं./ग.नं.'] || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="jmr" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jmr" className="flex items-center gap-2">
            <Gavel className="w-4 h-4" />
            JMR (Joint Measurement Report)
          </TabsTrigger>
          <TabsTrigger value="award" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Award
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jmr" className="space-y-6">
          {/* JMR Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Joint Measurement Report (JMR)</CardTitle>
              <CardDescription>Create JMR for selected land records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jmrNumber">JMR Number</Label>
                  <Input
                    id="jmrNumber"
                    value={jmrData.jmrNumber}
                    onChange={(e) => handleJmrInputChange('jmrNumber', e.target.value)}
                    placeholder="Enter JMR number"
                  />
                </div>
                <div>
                  <Label htmlFor="jmrDate">JMR Date</Label>
                  <Input
                    id="jmrDate"
                    type="date"
                    value={jmrData.jmrDate}
                    onChange={(e) => handleJmrInputChange('jmrDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={jmrData.projectName}
                    onChange={(e) => handleJmrInputChange('projectName', e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={jmrData.location}
                    onChange={(e) => handleJmrInputChange('location', e.target.value)}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label htmlFor="totalArea">Total Area</Label>
                  <Input
                    id="totalArea"
                    value={jmrData.totalArea}
                    onChange={(e) => handleJmrInputChange('totalArea', e.target.value)}
                    placeholder="Enter total area"
                  />
                </div>
                <div>
                  <Label htmlFor="totalCompensation">Total Compensation</Label>
                  <Input
                    id="totalCompensation"
                    value={jmrData.totalCompensation}
                    onChange={(e) => handleJmrInputChange('totalCompensation', e.target.value)}
                    placeholder="Enter total compensation"
                  />
                </div>
                <div>
                  <Label htmlFor="affectedPersons">Affected Persons</Label>
                  <Input
                    id="affectedPersons"
                    value={jmrData.affectedPersons}
                    onChange={(e) => handleJmrInputChange('affectedPersons', e.target.value)}
                    placeholder="Number of affected persons"
                  />
                </div>
                <div>
                  <Label htmlFor="publicHearingDate">Public Hearing Date</Label>
                  <Input
                    id="publicHearingDate"
                    type="date"
                    value={jmrData.publicHearingDate}
                    onChange={(e) => handleJmrInputChange('publicHearingDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="rehabilitationDetails">Rehabilitation Details</Label>
                <Textarea
                  id="rehabilitationDetails"
                  value={jmrData.rehabilitationDetails}
                  onChange={(e) => handleJmrInputChange('rehabilitationDetails', e.target.value)}
                  placeholder="Enter rehabilitation details"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="objections">Objections & Suggestions</Label>
                <Textarea
                  id="objections"
                  value={jmrData.objections}
                  onChange={(e) => handleJmrInputChange('objections', e.target.value)}
                  placeholder="Enter objections and suggestions"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="recommendations">Recommendations</Label>
                <Textarea
                  id="recommendations"
                  value={jmrData.recommendations}
                  onChange={(e) => handleJmrInputChange('recommendations', e.target.value)}
                  placeholder="Enter recommendations"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="approvalAuthority">Approval Authority</Label>
                  <Input
                    id="approvalAuthority"
                    value={jmrData.approvalAuthority}
                    onChange={(e) => handleJmrInputChange('approvalAuthority', e.target.value)}
                    placeholder="Enter approval authority"
                  />
                </div>
                <div>
                  <Label htmlFor="approvalDate">Approval Date</Label>
                  <Input
                    id="approvalDate"
                    type="date"
                    value={jmrData.approvalDate}
                    onChange={(e) => handleJmrInputChange('approvalDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="conditions">Conditions</Label>
                <Textarea
                  id="conditions"
                  value={jmrData.conditions}
                  onChange={(e) => handleJmrInputChange('conditions', e.target.value)}
                  placeholder="Enter conditions"
                  rows={3}
                />
              </div>

              <Button 
                onClick={generateJMR}
                disabled={selectedRecords.length === 0}
                className="w-full"
              >
                <Gavel className="w-4 h-4 mr-2" />
                Generate JMR ({selectedRecords.length} records)
              </Button>
            </CardContent>
          </Card>

          {/* Generated JMRs */}
          <Card>
            <CardHeader>
              <CardTitle>Generated JMRs</CardTitle>
              <CardDescription>Manage generated Joint Measurement Reports</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedJmrs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No JMRs generated yet.
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>JMR Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generatedJmrs.map((jmr) => (
                        <TableRow key={jmr._id}>
                          <TableCell className="font-medium">{jmr.jmrNumber}</TableCell>
                          <TableCell>{new Date(jmr.jmrDate).toLocaleDateString()}</TableCell>
                          <TableCell>{jmr.projectName}</TableCell>
                          <TableCell>{jmr.location}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">Generated</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => previewDocument(jmr, `JMR ${jmr.jmrNumber}`)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadDocument(jmr, `jmr_${jmr.jmrNumber}`)}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => printDocument(jmr, `JMR ${jmr.jmrNumber}`)}
                              >
                                <Printer className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="award" className="space-y-6">
          {/* Award Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Award</CardTitle>
              <CardDescription>Create Award for selected land records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="awardNumber">Award Number</Label>
                  <Input
                    id="awardNumber"
                    value={awardData.awardNumber}
                    onChange={(e) => handleAwardInputChange('awardNumber', e.target.value)}
                    placeholder="Enter award number"
                  />
                </div>
                <div>
                  <Label htmlFor="awardDate">Award Date</Label>
                  <Input
                    id="awardDate"
                    type="date"
                    value={awardData.awardDate}
                    onChange={(e) => handleAwardInputChange('awardDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="awardProjectName">Project Name</Label>
                  <Input
                    id="awardProjectName"
                    value={awardData.projectName}
                    onChange={(e) => handleAwardInputChange('projectName', e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="awardLocation">Location</Label>
                  <Input
                    id="awardLocation"
                    value={awardData.location}
                    onChange={(e) => handleAwardInputChange('location', e.target.value)}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label htmlFor="totalLandArea">Total Land Area</Label>
                  <Input
                    id="totalLandArea"
                    value={awardData.totalLandArea}
                    onChange={(e) => handleAwardInputChange('totalLandArea', e.target.value)}
                    placeholder="Enter total land area"
                  />
                </div>
                <div>
                  <Label htmlFor="awardTotalCompensation">Total Compensation</Label>
                  <Input
                    id="awardTotalCompensation"
                    value={awardData.totalCompensation}
                    onChange={(e) => handleAwardInputChange('totalCompensation', e.target.value)}
                    placeholder="Enter total compensation"
                  />
                </div>
                <div>
                  <Label htmlFor="numberOfLandowners">Number of Landowners</Label>
                  <Input
                    id="numberOfLandowners"
                    value={awardData.numberOfLandowners}
                    onChange={(e) => handleAwardInputChange('numberOfLandowners', e.target.value)}
                    placeholder="Enter number of landowners"
                  />
                </div>
                <div>
                  <Label htmlFor="collectorate">Collectorate</Label>
                  <Input
                    id="collectorate"
                    value={awardData.collectorate}
                    onChange={(e) => handleAwardInputChange('collectorate', e.target.value)}
                    placeholder="Enter collectorate"
                  />
                </div>
                <div>
                  <Label htmlFor="collectorName">Collector Name</Label>
                  <Input
                    id="collectorName"
                    value={awardData.collectorName}
                    onChange={(e) => handleAwardInputChange('collectorName', e.target.value)}
                    placeholder="Enter collector name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="acquisitionPurpose">Acquisition Purpose</Label>
                <Textarea
                  id="acquisitionPurpose"
                  value={awardData.acquisitionPurpose}
                  onChange={(e) => handleAwardInputChange('acquisitionPurpose', e.target.value)}
                  placeholder="Enter acquisition purpose"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="compensationDetails">Compensation Details</Label>
                <Textarea
                  id="compensationDetails"
                  value={awardData.compensationDetails}
                  onChange={(e) => handleAwardInputChange('compensationDetails', e.target.value)}
                  placeholder="Enter compensation details"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="rehabilitationPackage">Rehabilitation Package</Label>
                <Textarea
                  id="rehabilitationPackage"
                  value={awardData.rehabilitationPackage}
                  onChange={(e) => handleAwardInputChange('rehabilitationPackage', e.target.value)}
                  placeholder="Enter rehabilitation package details"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="timelineForPayment">Timeline for Payment</Label>
                <Textarea
                  id="timelineForPayment"
                  value={awardData.timelineForPayment}
                  onChange={(e) => handleAwardInputChange('timelineForPayment', e.target.value)}
                  placeholder="Enter timeline for payment"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="appealProcedure">Appeal Procedure</Label>
                <Textarea
                  id="appealProcedure"
                  value={awardData.appealProcedure}
                  onChange={(e) => handleAwardInputChange('appealProcedure', e.target.value)}
                  placeholder="Enter appeal procedure"
                  rows={3}
                />
              </div>

              <Button 
                onClick={generateAward}
                disabled={selectedRecords.length === 0}
                className="w-full"
              >
                <Award className="w-4 h-4 mr-2" />
                Generate Award ({selectedRecords.length} records)
              </Button>
            </CardContent>
          </Card>

          {/* Generated Awards */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Awards</CardTitle>
              <CardDescription>Manage generated Awards</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedAwards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No Awards generated yet.
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Award Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generatedAwards.map((award) => (
                        <TableRow key={award._id}>
                          <TableCell className="font-medium">{award.awardNumber}</TableCell>
                          <TableCell>{new Date(award.awardDate).toLocaleDateString()}</TableCell>
                          <TableCell>{award.projectName}</TableCell>
                          <TableCell>{award.location}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">Generated</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => previewDocument(award, `Award ${award.awardNumber}`)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadDocument(award, `award_${award.awardNumber}`)}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => printDocument(award, `Award ${award.awardNumber}`)}
                              >
                                <Printer className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Land Records Selection (shared between JMR and Award) */}
      <Card>
        <CardHeader>
          <CardTitle>Select Land Records</CardTitle>
          <CardDescription>Choose landowner records for JMR/Award generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="search">Search Records</Label>
            <Input
              id="search"
              placeholder="Search by owner name, village, or survey number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRecords.length === filteredLandRecords.length && filteredLandRecords.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRecords(filteredLandRecords.map(r => r.id));
                        } else {
                          setSelectedRecords([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Survey No.</TableHead>
                  <TableHead>Owner Name</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Compensation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLandRecords.map((record) => (
                  <TableRow key={record.id}>
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
                    <TableCell>{record['स.नं./हि.नं./ग.नं.'] || 'N/A'}</TableCell>
                    <TableCell>{record['खातेदाराचे_नांव'] || 'N/A'}</TableCell>
                    <TableCell>{record['गांव'] || 'N/A'}</TableCell>
                    <TableCell>{record['नमुना_7_12_नुसार_जमिनीचे_क्षेत्र'] || 'N/A'}</TableCell>
                    <TableCell>₹{record['हितसंबंधिताला_अदा_करावयाची_एकुण_मोबदला_रक्कम'] || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {selectedRecords.length} of {filteredLandRecords.length} records selected
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewTitle} Preview</DialogTitle>
            <DialogDescription>Preview of the generated document</DialogDescription>
          </DialogHeader>
          <div 
            className="border p-4 bg-white text-black"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JmrAwardManager;