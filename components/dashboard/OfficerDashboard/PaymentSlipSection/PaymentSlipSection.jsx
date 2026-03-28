import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import JSZip from 'jszip';

import { auth, db } from '@/app/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { FileText, Download, Search, Calendar, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

const PaymentSlipSection = () => {
  const  user  = auth.currentUser;
  const [landRecords, setLandRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'generated'

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

  // Parse record function to align with DocumentManagementSection
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

  // Load land records that are ready for payment slip generation
  const loadLandRecords = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      let recordsQuery;
      
      if (activeTab === 'pending') {
        // Records that are verified and ready for payment slip generation
        recordsQuery = query(
          collection(db, 'landRecord'),
          where('project_id', '==', selectedProject),
          where('document_verified', '==', true),
          where('payment_slip_generate', '==', true),
        );
      } else {
        // Records that already have payment slips generated
        recordsQuery = query(
          collection(db, 'landRecord'),
          where('project_id', '==', selectedProject),
          where('payment_slip_generated', '==', true)
        );
      }

      const querySnapshot = await getDocs(recordsQuery);
      const recordsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        payment_slip_generated: doc.data().payment_slip_generated || false,
        payment_slip_generate: doc.data().payment_slip_generate || false,
        slip_generated_at: doc.data().slip_generated_at || null,
        slip_generated_by: doc.data().slip_generated_by || null
      }));
      
      setLandRecords(recordsData);
      setFilteredRecords(recordsData);
    } catch (error) {
      console.error('Error loading land records:', error);
      toast.error('Failed to load land records');
    } finally {
      setLoading(false);
    }
  };

  // Filter records based on search term
  useEffect(() => {
    const filtered = landRecords.filter(record => {
      const parsedRecord = parseRecord(record);
      const searchLower = searchTerm.toLowerCase();
      return (
        parsedRecord.owner_name?.toLowerCase().includes(searchLower) ||
        parsedRecord.survey_number?.toString().includes(searchLower) ||
        parsedRecord.village?.toLowerCase().includes(searchLower) ||
        parsedRecord.district?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredRecords(filtered);
  }, [searchTerm, landRecords]);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Load land records when project or tab changes
  useEffect(() => {
    if (selectedProject) {
      loadLandRecords();
    }
  }, [selectedProject, activeTab]);

  // Generate payment slip with proper data handling
  const generatePaymentSlip = async (record) => {
    try {
      setLoading(true);
      
      // Parse the record to get standardized data
      const parsedRecord = parseRecord(record);
      
      // Calculate compensation using parsed data
      const compensationData = calculateCompensation(record);
      
      // Generate PDF
      const pdfDoc = generatePaymentSlipPDF(parsedRecord, compensationData);
      const pdfBlob = pdfDoc.output('blob');
      
      // Create payment slip data with safe defaults to prevent undefined values
      const paymentSlipData = {
        generated_date: new Date().toISOString(),
        generated_by: user?.email || 'system',
        owner_name: parsedRecord.owner_name || 'N/A',
        survey_number: parsedRecord.survey_number || 'N/A',
        village: parsedRecord.village || 'N/A',
        taluka: parsedRecord.taluka || 'N/A',
        district: parsedRecord.district || 'N/A',
        land_area: parsedRecord.acquired_land_area_ha || 0,
        approved_rate: compensationData.approvedRate || 0,
        compensation_breakdown: {
          land_compensation: compensationData.landCompensation || 0,
          structures_amount: compensationData.structuresAmount || 0,
          trees_amount: compensationData.treesAmount || 0,
          wells_amount: compensationData.wellsAmount || 0,
          solatium: compensationData.solatium || 0,
          interest: compensationData.interest || 0,
          subsistence_allowance: compensationData.subsistenceAllowance || 0,
          additional_allowance: compensationData.additionalAllowance || 0,
          resettlement_assistance: compensationData.resettlementAssistance || 0,
          additional_nazrana: compensationData.additionalNazrana || 0
        },
        total_compensation: compensationData.totalCompensation || 0,
        pdf_generated: true,
        pdf_size: pdfBlob.size || 0
      };

      // Update the record in Firebase
      const recordRef = doc(db, 'landRecord', record.id);
      await updateDoc(recordRef, {
        payment_slip_generated: true,
        payment_slip_generate: false, // Reset this since slip is now generated
        slip_generated_at: new Date(),
        slip_generated_by: user?.uid,
        payment_slip_data: paymentSlipData
      });

      toast.success('Payment slip generated successfully!');
      loadLandRecords(); // Refresh the data
      
    } catch (error) {
      console.error('Error generating payment slip:', error);
      toast.error(`Error generating payment slip: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced compensation calculation function using parsed record
  const calculateCompensation = (record) => {
    // Parse the record first to get standardized data
    const parsedRecord = parseRecord(record);
    
    // Use parsed values with fallbacks to prevent undefined
    const landArea = parsedRecord.acquired_land_area_ha || 0;
    const approvedRate = parsedRecord.approved_rate_per_hectare || 0;
    
    // Calculate basic land compensation
    const landCompensation = landArea * approvedRate;
    
    // Get other compensation components with safe defaults
    const structuresAmount = parsedRecord.structures_amount || 0;
    const treesAmount = (parsedRecord.forest_trees_amount || 0) + (parsedRecord.fruit_trees_amount || 0);
    const wellsAmount = parsedRecord.wells_amount || 0;
    const solatium = parsedRecord.solatium || 0;
    const interest = parsedRecord.interest_12percent || 0;
    const subsistenceAllowance = parsedRecord.subsistence_allowance || 0;
    const additionalAllowance = parsedRecord.additional_allowance_st_sc || 0;
    const resettlementAssistance = parsedRecord.resettlement_assistance || 0;
    const additionalNazrana = parsedRecord.additional_nazrana || 0;
    
    // Calculate total compensation
    const totalCompensation = landCompensation + structuresAmount + treesAmount + wellsAmount + 
                             solatium + interest + subsistenceAllowance + additionalAllowance + 
                             resettlementAssistance + additionalNazrana;
    
    return {
      landArea,
      approvedRate,
      landCompensation,
      structuresAmount,
      treesAmount,
      wellsAmount,
      solatium,
      interest,
      subsistenceAllowance,
      additionalAllowance,
      resettlementAssistance,
      additionalNazrana,
      totalCompensation
    };
  };

  // Generate PDF payment slip
  const generatePaymentSlipPDF = (record, compensationData) => {
    const doc = new jsPDF();
    
    // Set font and colors
    doc.setFont('helvetica');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 128); // Dark blue
    
    // Header
    doc.text('GOVERNMENT OF MAHARASHTRA', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Land Acquisition Compensation Payment Slip', 105, 30, { align: 'center' });
    
    // Add decorative line
    doc.setDrawColor(0, 0, 128);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Reset font size and color for content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let yPosition = 45;
    
    // Payment Slip Details
    doc.setFont(undefined, 'bold');
    doc.text('Payment Slip Details', 20, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 8;
    
    doc.text(`Slip Number: ${record.id}`, 20, yPosition);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 120, yPosition);
    yPosition += 6;
    doc.text(`Generated By: ${user?.email || 'System'}`, 20, yPosition);
    yPosition += 10;
    
    // Land Owner Details
    doc.setFont(undefined, 'bold');
    doc.text('Land Owner Details', 20, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 8;
    
    doc.text(`Owner Name: ${record.owner_name || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Survey Number: ${record.survey_no || 'N/A'}`, 20, yPosition);
    doc.text(`Old Survey Number: ${record.old_survey_number || 'N/A'}`, 120, yPosition);
    yPosition += 6;
    doc.text(`New Survey Number: ${record.new_survey_number || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Village: ${record.village || 'N/A'}`, 20, yPosition);
    doc.text(`Taluka: ${record.taluka || 'N/A'}`, 120, yPosition);
    yPosition += 6;
    doc.text(`District: ${record.district || 'N/A'}`, 20, yPosition);
    yPosition += 10;
    
    // Land Details
    doc.setFont(undefined, 'bold');
    doc.text('Land Details', 20, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 8;
    
    doc.text(`Land Type: ${record.land_type || 'N/A'}`, 20, yPosition);
    doc.text(`Total Land Area: ${(compensationData.landArea || 0).toFixed(4)} hectares`, 120, yPosition);
    yPosition += 6;
    doc.text(`Acquired Land Area: ${(record.acquired_land_area_ha || 0).toFixed(4)} hectares`, 20, yPosition);
    doc.text(`Rate per Hectare: ₹${(compensationData.approvedRate || 0).toLocaleString()}`, 120, yPosition);
    yPosition += 10;
    
    // Compensation Breakdown Table
    doc.setFont(undefined, 'bold');
    doc.text('Compensation Breakdown', 20, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 8;
    
    // Table headers and data
    const headers = [['Component', 'Amount (₹)']];
    const data = [
      ['Base Land Compensation', (compensationData.landCompensation || 0).toLocaleString()],
      ['Structures/Buildings', (compensationData.structuresAmount || 0).toLocaleString()],
      ['Trees (Forest & Fruit)', (compensationData.treesAmount || 0).toLocaleString()],
      ['Wells/Borewells', (compensationData.wellsAmount || 0).toLocaleString()],
      ['Solatium (100%)', (compensationData.solatium || 0).toLocaleString()],
      ['Interest (12% p.a.)', (compensationData.interest || 0).toLocaleString()],
      ['Additional Nazrana (10%)', (compensationData.additionalNazrana || 0).toLocaleString()],
      ['Subsistence Allowance', (compensationData.subsistenceAllowance || 0).toLocaleString()],
      ['ST/SC Additional Allowance', (compensationData.additionalAllowance || 0).toLocaleString()],
      ['Resettlement Assistance', (compensationData.resettlementAssistance || 0).toLocaleString()]
    ].filter(item => parseFloat(item[1].replace(/,/g, '')) > 0); // Remove zero amounts
    
    doc.autoTable({
      head: headers,
      body: data,
      startY: yPosition,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 128], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 50, halign: 'right' }
      }
    });
    
    // Get the final Y position after the table
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Total Compensation
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text(`Total Compensation: ₹${(compensationData.totalCompensation || 0).toLocaleString()}`, 20, finalY);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    
    // Terms and Conditions
    let termsY = finalY + 15;
    doc.setFont(undefined, 'bold');
    doc.text('Terms and Conditions:', 20, termsY);
    doc.setFont(undefined, 'normal');
    termsY += 6;
    
    const terms = [
      '1. This payment slip is generated based on the land acquisition records.',
      '2. The compensation amount is calculated as per RFCTLARR Act 2013.',
      '3. Payment will be processed after verification of all documents.',
      '4. This slip is valid for 90 days from the date of generation.',
      '5. For any queries, please contact the Land Acquisition Office.'
    ];
    
    terms.forEach(term => {
      if (termsY > 270) { // Check if we need a new page
        doc.addPage();
        termsY = 20;
      }
      doc.text(term, 25, termsY);
      termsY += 5;
    });
    
    // Footer
    const footerY = Math.max(termsY + 10, 260);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('This is a computer-generated document. No signature required.', 105, footerY, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, footerY + 5, { align: 'center' });
    
    return doc;
  };

  // Download payment slip
  const downloadPaymentSlip = async (record) => {
    try {
      // Calculate compensation details
      const compensationData = calculateCompensation(record);
      
      // Generate PDF
      const pdfDoc = generatePaymentSlipPDF(record, compensationData);
      
      // Save the PDF
      const fileName = `payment_slip_${record.id}_${record.owner_name?.replace(/\s+/g, '_') || 'owner'}.pdf`;
      pdfDoc.save(fileName);
      
      toast.success('Payment slip downloaded successfully!');
      
    } catch (error) {
      console.error('Error downloading payment slip:', error);
      toast.error('Failed to download payment slip');
    }
  };

  // Test PDF generation
  const testPDFGeneration = () => {
    try {
      const testRecord = {
        id: 'test-123',
        owner_name: 'Test Owner',
        survey_no: '123/456',
        village: 'Test Village',
        district: 'Test District',
        land_area: '2.5',
        land_type: 'Agricultural',
        approved_rate_per_hectare: 2500000
      };
      
      const compensationData = calculateCompensation(testRecord);
      const pdfDoc = generatePaymentSlipPDF(testRecord, compensationData);
      pdfDoc.save('test_payment_slip.pdf');
      
      toast.success('Test PDF generated successfully!');
    } catch (error) {
      console.error('Test PDF generation failed:', error);
      toast.error('Test PDF generation failed');
    }
  };

  // Bulk download payment slips
  const bulkDownloadPaymentSlips = async () => {
    if (filteredRecords.length === 0) {
      toast.error('No payment slips available for download');
      return;
    }

    try {
      setLoading(true);
      const zip = new JSZip();
      const slipsFolder = zip.folder('payment_slips');

      // Generate PDF for each record
      for (const record of filteredRecords) {
        const compensationData = calculateCompensation(record);
        const pdfDoc = generatePaymentSlipPDF(record, compensationData);
        const pdfBlob = pdfDoc.output('blob');
        const fileName = `payment_slip_${record.id}_${record.owner_name?.replace(/\s+/g, '_') || 'owner'}.pdf`;
        slipsFolder.file(fileName, pdfBlob);
      }

      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Download the ZIP file
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment_slips_${selectedProject}_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Bulk download completed: ${filteredRecords.length} payment slips`);
      
    } catch (error) {
      console.error('Error in bulk download:', error);
      toast.error('Failed to bulk download payment slips');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Slip Management
          </CardTitle>
          
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by owner, survey no, village..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {!selectedProject ? (
            <div className="text-center py-8 text-gray-500">
              Please select a project to manage payment slips.
            </div>
          ) : (
            <>
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Pending Generation ({filteredRecords.length})
                  </TabsTrigger>
                  <TabsTrigger value="generated" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Generated Slips
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                  ) : filteredRecords.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No land records are ready for payment slip generation.
                      <br />
                      <small>Records must have verified documents to be eligible.</small>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Owner Name</TableHead>
                            <TableHead>Survey No.</TableHead>
                            <TableHead>Village</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead>Land Area</TableHead>
                            <TableHead>Compensation</TableHead>
                            <TableHead>Documents</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRecords.map((record) => {
                            const parsedRecord = parseRecord(record);
                            const compensation = calculateCompensation(record);
                            
                            return (
                              <TableRow key={record.id}>
                                <TableCell className="font-medium">{parsedRecord.owner_name}</TableCell>
                                <TableCell>{parsedRecord.survey_number}</TableCell>
                                <TableCell>{parsedRecord.village}</TableCell>
                                <TableCell>{parsedRecord.district}</TableCell>
                                <TableCell>{parsedRecord.acquired_land_area_ha?.toFixed(4) || '0.0000'} hectares</TableCell>
                                <TableCell className="font-semibold text-blue-600">
                                  ₹{compensation.totalCompensation.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    onClick={() => generatePaymentSlip(record)}
                                    className="flex items-center gap-1"
                                  >
                                    <FileText className="h-3 w-3" />
                                    Generate Slip
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="generated" className="mt-6">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                  ) : (
                    <>
                      <div className="flex justify-end mb-4">
                        <Button 
                          onClick={bulkDownloadPaymentSlips}
                          disabled={loading || filteredRecords.length === 0}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {loading ? 'Downloading...' : 'Download All Slips'}
                        </Button>
                      </div>
                      <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Owner Name</TableHead>
                            <TableHead>Survey No.</TableHead>
                            <TableHead>Village</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead>Land Area</TableHead>
                            <TableHead>Compensation</TableHead>
                            <TableHead>Generated Date</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRecords.map((record) => {
                          const parsedRecord = parseRecord(record);
                          
                          return (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">{parsedRecord.owner_name || 'N/A'}</TableCell>
                              <TableCell>{parsedRecord.survey_number || 'N/A'}</TableCell>
                              <TableCell>{parsedRecord.village || 'N/A'}</TableCell>
                              <TableCell>{parsedRecord.district || 'N/A'}</TableCell>
                              <TableCell>{parsedRecord.acquired_land_area_ha?.toFixed(4) || '0.0000'} hectares</TableCell>
                              <TableCell className="font-semibold text-green-600">
                                ₹{(record.payment_slip_data?.total_compensation || 0).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {record.payment_slip_generate_date ? (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                    {new Date(record.payment_slip_generate_date).toLocaleDateString()}
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-sm">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadPaymentSlip(record)}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="h-3 w-3" />
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        </TableBody>
                      </Table>
                      </div>
                    </>
                  )}
                </TabsContent>

              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSlipSection;
