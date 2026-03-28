// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { 
//   Database, 
//   RefreshCw, 
//   Search,
//   Clock,
//   CheckCircle, 
//   XCircle,
//   MapPin,
//   Users,
//   DollarSign
// } from 'lucide-react';
// import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// import { db } from '@/app/firebase';
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
// import { cn } from '@/lib/utils';
// import { toast } from 'react-hot-toast';

// // Utility function to safely convert string values to numeric data types
// const safeNumericConversion = (value) => {
//   if (value === null || value === undefined || value === '') {
//     return '0';
//   }
  
//   if (typeof value === 'number') {
//     return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   }
  
//   if (typeof value === 'string') {
//     const cleanedValue = value.replace(/[^\d.-]/g, '');
//     const numericValue = parseFloat(cleanedValue);
//     if (!isNaN(numericValue)) {
//       return numericValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//     }
//   }
  
//   return String(value);
// };

// // Utility to parse Ha.Are string to decimal hectares (assuming input like "1.23" means 1.23 ha)
// const parseHaAreToDecimalHa = (value) => {
//   if (!value) return 0;
//   const num = parseFloat(value.toString().replace(/[^\d.]/g, ''));
//   return isNaN(num) ? 0 : num;
// };

// // Utility to convert sq.m to decimal ha (1 ha = 10000 sq.m)
// const convertSqmToHa = (sqm) => {
//   const num = parseFloat(sqm);
//   return isNaN(num) ? 0 : num / 10000;
// };

// // Parsing function for each template
// const parseRecord = (record) => {
//   const templateName = record.templateName || '';
//   let parsed = {
//     serial_number: '',
//     owner_name: '',
//     old_survey_number: '',
//     new_survey_number: '',
//     survey_number: '',
//     gat_number: '',
//     cts_number: '',
//     total_land_area_ha: 0,
//     acquired_land_area_ha: 0,
//     land_type: '',
//     land_class: '',
//     approved_rate_per_hectare: 0,
//     market_value: 0,
//     factor: 1,
//     land_compensation: 0,
//     structures_count: 0,
//     structures_amount: 0,
//     forest_trees_count: 0,
//     forest_trees_amount: 0,
//     fruit_trees_count: 0,
//     fruit_trees_amount: 0,
//     wells_count: 0,
//     wells_amount: 0,
//     total_assets_amount: 0,
//     solatium: 0,
//     interest_12percent: 0,
//     subsistence_allowance: 0,
//     additional_allowance_st_sc: 0,
//     resettlement_assistance: 0,
//     total_compensation: 0,
//     deduction: 0,
//     net_payable: 0,
//     remarks: '',
//     compensation_distribution: '',
//     arbitration_remark: '',
//     compensation_distribution_status: 'PENDING',
//   };

//   if (templateName.includes('LARR 2013')) {
//     // Map LARR 2013 fields
//     parsed.serial_number = record['अ.क्र'] || '';
//     parsed.owner_name = record['खातेदाराचे नांव'] || '';
//     parsed.old_survey_number = record['जुना स.नं.'] || '';
//     parsed.new_survey_number = record['नविन स.नं.'] || '';
//     parsed.survey_number = record['स.नं./हि.नं./ग.नं.'] || '';
//     parsed.gat_number = record['गट नंबर'] || '';
//     parsed.cts_number = record['सी.टी.एस. नंबर'] || '';
//     parsed.total_land_area_ha = parseHaAreToDecimalHa(record['गांव नमुना 7/12 नुसार जमिनीचे क्षेत्र हे.आर']);
//     parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record['संपादित जमिनीचे क्षेत्र हेक्टर आर']);
//     parsed.land_type = record['जमिनीचा प्रकार'] || '';
//     parsed.land_class = record['जमिनीचा प्रकार शेती/ बिनशेती/ धारणाधिकार'] || '';
//     parsed.approved_rate_per_hectare = parseFloat(record['मंजुर केलेला दर (प्रति हेक्टर) रक्कम रुपये']) || 0;
//     parsed.market_value = parseFloat(record['संपादीत होणाऱ्या जमिनीच्या क्षेत्रानुसार येणारे बाजारमुल्य र.रू']) || 0;
//     parsed.factor = parseFloat(record['कलम 26 (2) नुसार गावास लागु असलेले गणक Factor']) || 1;
//     parsed.land_compensation = parseFloat(record['कलम 26 नुसार जमिनीचा मोबदला']) || 0;
//     parsed.structures_count = parseFloat(record['संख्या बांधकामे']) || 0;
//     parsed.structures_amount = parseFloat(record['संख्या रक्कम रुपये']) || 0; // Assuming this is structures amount
//     parsed.forest_trees_count = parseFloat(record['वनझाडे झाडांची संख्या']) || 0;
//     parsed.forest_trees_amount = parseFloat(record['वनझाडे झाडांची रक्कम रु.']) || 0;
//     parsed.fruit_trees_count = parseFloat(record['फळझाडे झाडांची संख्या']) || 0;
//     parsed.fruit_trees_amount = parseFloat(record['फळझाडे झाडांची रक्कम रु.']) || 0;
//     parsed.wells_count = parseFloat(record['विहिरी/बोअरवेल संख्या']) || 0;
//     parsed.wells_amount = parseFloat(record['विहिरी/बोअरवेल रक्कम रुपये']) || 0;
//     parsed.total_assets_amount = parseFloat(record['एकुण रक्कम रुपये']) || 0;
//     parsed.total_compensation = parseFloat(record['एकुण रक्कम']) || 0; // Adjust as needed
//     parsed.solatium = parseFloat(record['100 %  सोलेशियम (दिलासा रक्कम) सेक्शन 30 (1)  RFCT-LARR 2013 अनुसूचि 1 अ.नं. 5']) || 0;
//     parsed.determined_compensation = parseFloat(record['निर्धारित मोबदला']) || 0;
//     parsed.additional_25percent = parseFloat(record['एकूण रक्कमेवर  25%  वाढीव मोबदला (अ.क्र. 26 नुसार येणाऱ्या रक्कमेवर)']) || 0;
//     parsed.total_compensation = parseFloat(record['एकुण मोबदला']) || 0;
//     parsed.deduction = parseFloat(record['वजावट रक्कम रुपये']) || 0;
//     parsed.net_payable = parseFloat(record['हितसंबंधिताला अदा करावयाची एकुण मोबदला रक्कम रुपये (अ.क्र. 25 वजा 26)']) || 0;
//     parsed.remarks = record['शेरा'] || '';
//     parsed.compensation_distribution = record['मोबदला वाटप तपशिल'] || '';
//     parsed.arbitration_remark = record['मध्यस्थी संबंधी टिप्पणी (Arbitration Remark)'] || '';
//     parsed.compensation_distribution_status = record['मोबदला वाटप तपशिल'] || 'PENDING'; // Assuming status is here, like 'PAID'
//   } else if (templateName.includes('NHAI 1956')) {
//     // Map NHAI 1956 fields
//     parsed.serial_number = record['अ.क्र'] || '';
//     parsed.owner_name = record['खातेदाराचे नांव'] || '';
//     parsed.survey_number = record['स.नं./हि.नं./ग.नं.'] || '';
//     parsed.total_land_area_ha = parseHaAreToDecimalHa(record['गांव नमुना 7/12 नुसार जमिनीचे क्षेत्र हे.आर']);
//     parsed.acquired_land_area_ha = convertSqmToHa(record['संपादित जमिनीचे क्षेत्र चौ.मी']);
//     parsed.land_type = record['जमिनीचा प्रकार'] || '';
//     parsed.land_class = record['जमिनीचा प्रकार शेती/ बिनशेती'] || '';
//     parsed.approved_rate_per_hectare = (parseFloat(record['सक्षम प्राधिकारी यांनी निश्चित केलेला दर (प्रति चौ.मी.)']) || 0) * 10000; // Convert per sq.m to per ha
//     parsed.market_value = parseFloat(record['जमिनीच्या गणकानुसार येणारा मोबदला']) || 0;
//     parsed.deduction = parseFloat(record['10 % अनर्जित रक्कम (वजावट)']) || 0;
//     parsed.land_compensation = parseFloat(record['एकुण मोबदला']) || 0;
//     parsed.factor = parseFloat(record['गावास लागु असलेले गणक FACTOR 2']) || 1;
//     parsed.payable_compensation = parseFloat(record['देय मोबदला']) || 0;
//     parsed.structures_count = parseFloat(record['बांधकामे संख्या']) || 0;
//     parsed.structures_amount = parseFloat(record['बांधकामे रक्कम रुपये']) || 0;
//     parsed.forest_trees_count = parseFloat(record['वनझाडे झाडांची संख्या']) || 0;
//     parsed.forest_trees_amount = parseFloat(record['वनझाडे झाडांची रक्कम रु.']) || 0;
//     parsed.fruit_trees_count = parseFloat(record['फळझाडे झाडांची संख्या']) || 0;
//     parsed.fruit_trees_amount = parseFloat(record['फळझाडे झाडांची रक्कम रु.']) || 0;
//     parsed.wells_count = parseFloat(record['विहिरी/बोअरवेल संख्या']) || 0;
//     parsed.wells_amount = parseFloat(record['विहिरी/बोअरवेल रक्कम रुपये']) || 0;
//     parsed.total_assets_amount = parseFloat(record['रक्कम रुपये']) || 0;
//     parsed.total_compensation = parseFloat(record['एकुण रक्कम']) || 0;
//     parsed.interest_12percent = parseFloat(record['कलम 3 (अ) ची अधिसूचना प्रसिध्द झालेल्या दिनांकापासुन ते निवाडा घोषित दिनांकापर्यत 12 % जमिनीचा वाढीव मोबदला प्रमाणे प्रतिवर्ष सेक्शन 30 (3) RFCT-LARR 2013 च्या कलम 26 (1) व 26 (2) मधील तरतुदीनुसार दि.03/07/2023 ते दि.15/04/2025 पर्यंत 652 दिवसाचे व्याज']) || 0;
//     parsed.solatium = parseFloat(record['100 %  सोलेटीएम (दिलासा रक्कम) सेक्शन 30 (1)  RFCT-LARR 2013 अनुसूचि 1 अ.नं. 5']) || 0;
//     parsed.total_compensation = parseFloat(record['एकुण मोबदला']) || 0;
//     parsed.additional_nazrana = parseFloat(record['(+) नजराणा रक्कम 10 %']) || 0;
//     parsed.net_payable = parseFloat(record['एकुण मोबदला निवाडयाची एकुण रक्कम']) || 0;
//     parsed.remarks = record['शेरा'] || '';
//     parsed.compensation_distribution = record['मोबदला वाटप तपशिल'] || '';
//     parsed.arbitration_remark = record['मध्यस्थी संबंधी टिप्पणी (Arbitration Remark)'] || '';
//     parsed.compensation_distribution_status = record['मोबदला वाटप तपशिल'] || 'PENDING';
//   } else if (templateName.includes('RAA 2008')) {
//     // Map RAA 2008 fields
//     parsed.serial_number = record['अ.क्र'] || '';
//     parsed.owner_name = record['संयुक्त मोजणी विवरण पत्रानुसार खातेदारांची नावे'] || '';
//     parsed.survey_number = record['संयुक्त मोजणी विवरणपत्रानुसार ग.नं.'] || '';
//     parsed.land_type = record['जमिनीचा प्रकार'] || '';
//     parsed.total_land_area_ha = parseHaAreToDecimalHa(record['संयुक्त मोजणी विवरण पत्रानुसार एकूण क्षेत्र (हे.आर)']);
//     parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record['संयुक्त मोजणी विवरणपत्रा नुसार संपादित जमिनीचे क्षेत्र (हे.आर)']);
//     parsed.approved_rate_per_hectare = parseFloat(record['संपादित जमिनीचे निश्चित केलेले दर प्रति हेक्टरी (र.रू)']) || 0;
//     parsed.market_value = parseFloat(record['संपादित जमिनीचे येणारे मुल्य (र.रू)']) || 0;
//     parsed.factor_value = parseFloat(record['सहायक संचालक नगर रचना पालघर यांचेकडील पत्र दि. 23/02/2024 रोजीचे पत्रान्वये गांवास येणारा घटक - 2 हिशोबित करून येणारे मुल्यांकन र.रू.']) || 0;
//     parsed.forest_trees_count = parseFloat(record['वनझाडे संख्या']) || 0;
//     parsed.forest_trees_amount = parseFloat(record['वनझाडे किंमत रू.']) || 0;
//     parsed.fruit_trees_count = parseFloat(record['फळझाडे संख्या']) || 0;
//     parsed.fruit_trees_amount = parseFloat(record['फळझाडे किंमत रू.']) || 0;
//     parsed.solatium = parseFloat(record['100% सोलेशियम (दिलासा रक्कम) (सेक्शन 30 (1) RFCT-LARR 2013 अनुसूची 1 अ.क्र. 5)']) || 0;
//     parsed.interest_12percent = parseFloat(record['20 A अधिसूचना दिनांका पासुन ते निवाडा घोषित दिनांकापर्यत जमिनीचे वाढीव मोबदला 12% प्रमाणे प्रति वर्ष (सेक्शन 30 (3) RFCT-LARR - 2013 अनुसूची 1 अ.क्र. 8, कलम 26 (1) व 26 (2) मधील तरतुदीनुसार) (दि. 10/10/2023 ते दि. 05/02/2025 पर्यत ) (कालावधी 484 दिवस)']) || 0;
//     parsed.subsistence_allowance = parseFloat(record['प्रति महा रक्कम रुपये 3000/- प्रमाणे एक वर्षाकरिता निर्वाह भत्ता (कलम 3 RFCT-LARR 2013 अनुसूचि 2 अ.क्र. 5)']) || 0;
//     parsed.additional_allowance_st_sc = parseFloat(record['अनुसूचित जमाती व अनुसूचित जाती करिता अतिरिक्त निर्वाह भत्ता (कलम 3 RFCT-LARR 2013 अनुसूचि 2 अ.क्र. 5)']) || 0;
//     parsed.resettlement_assistance = parseFloat(record['बाधित कुटुंबास पुनर्वसनाकरिता आर्थिक सहाय प्रति कुटुबास रु. 50,000 (कलम 3 RFCT-LARR 2013 अनुसुचि 2 अ.क्र. 10)']) || 0;
//     parsed.total_compensation = parseFloat(record['एकूण मोबदला']) || 0;
//     parsed.deduction = parseFloat(record['वजाती']) || 0;
//     parsed.net_payable = parseFloat(record['निव्वळ देय रक्कम']) || 0;
//     parsed.remarks = record['शेरा'] || ''; // Multiple, but combine if needed
//     parsed.compensation_distribution = record['मोबदला वाटप तपशिल'] || '';
//     parsed.arbitration_remark = record['मध्यस्थी संबंधी टिप्पणी (Arbitration Remark)'] || '';
//     parsed.compensation_distribution_status = record['मोबदला वाटप तपशिल'] || 'PENDING';
//   } else {
//     // Default mapping if no template match (use English keys if present)
//     Object.keys(parsed).forEach(key => {
//       parsed[key] = record[key] || parsed[key];
//     });
//     parsed.total_land_area_ha = parseHaAreToDecimalHa(record.total_land_area_ha || record['गांव नमुना 7/12 नुसार जमिनीचे क्षेत्र हे.आर']);
//     parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record.acquired_land_area_ha || record['संपादित जमिनीचे क्षेत्र हेक्टर आर']) || convertSqmToHa(record['संपादित जमिनीचे क्षेत्र चौ.मी']);
//   }

//   return parsed;
// };

// const OverviewSection = () => {
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState('');
//   const [projectName, setProjectName] = useState('');
//   const [landRecords, setLandRecords] = useState([]);
//   const [parsedRecords, setParsedRecords] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   // Fixed columns for display (based on common parsed fields)
//   const fixedColumns = [
//     'serial_number',
//     'owner_name',
//     'survey_number',
//     'total_land_area_ha',
//     'acquired_land_area_ha',
//     'land_type',
//     'approved_rate_per_hectare',
//     'market_value',
//     'factor',
//     'land_compensation',
//     'structures_amount',
//     'forest_trees_amount',
//     'fruit_trees_amount',
//     'wells_amount',
//     'solatium',
//     'interest_12percent',
//     'total_compensation',
//     'deduction',
//     'net_payable',
//     'compensation_distribution_status',
//     'arbitration_remark'
//   ];

//   // Fetch projects function
//   const fetchProjects = async () => {
//     try {
//       const projectsRef = collection(db, 'projects');
//       const querySnapshot = await getDocs(projectsRef);
//       const projectsData = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setProjects(projectsData);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//       toast.error('Failed to load projects');
//     }
//   };

//   // Load projects when component mounts
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // Load land records function
//   const loadLandRecords = async () => {
//     if (!selectedProject) {
//       toast.error('Please select a project first');
//       return;
//     }

//     setLoading(true);
//     setLandRecords([]);
//     setParsedRecords([]);
    
//     try {
//       const q = query(collection(db, "landRecord"), where("project_id", "==", selectedProject));
//       const querySnapshot = await getDocs(q);
//       const records = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
//       setLandRecords(records);
      
//       // Parse records
//       const parsed = records.map(parseRecord);
//       setParsedRecords(parsed);
      
//       toast.success(`Loaded ${records.length} land records`);
//     } catch (error) {
//       console.error('Error loading land records:', error);
//       toast.error('Failed to load land records');
//       setLandRecords([]);
//       setParsedRecords([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Set default project
//   useEffect(() => {
//     if (projects.length > 0 && !selectedProject) {
//       setSelectedProject(projects[0].id);
//       setProjectName(projects[0].projectName);
//     }
//   }, [projects, selectedProject]);

//   // Load records when project changes
//   useEffect(() => {
//     if (selectedProject) {
//       loadLandRecords();
//     }
//   }, [selectedProject]);

//   // Filter parsed records
//   const filteredParsedRecords = parsedRecords.filter(record => {
//     if (!searchTerm) return true;
    
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       String(record.owner_name || '').toLowerCase().includes(searchLower) ||
//       String(record.survey_number || '').toLowerCase().includes(searchLower) ||
//       String(record.old_survey_number || '').toLowerCase().includes(searchLower) ||
//       String(record.new_survey_number || '').toLowerCase().includes(searchLower)
//       // Add more if needed
//     );
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(filteredParsedRecords.length / recordsPerPage);
//   const paginatedRecords = filteredParsedRecords.slice(
//     (currentPage - 1) * recordsPerPage,
//     currentPage * recordsPerPage
//   );

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'PENDING':
//         return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">PENDING</Badge>;
//       case 'PAID':
//         return <Badge variant="secondary" className="bg-green-100 text-green-800">PAID</Badge>;
//       case 'UNPAID':
//         return <Badge variant="secondary" className="bg-red-100 text-red-800">UNPAID</Badge>;
//       default:
//         return <Badge variant="secondary" className="bg-gray-100 text-gray-800">{status}</Badge>;
//     }
//   };

//   // Calculate statistics using parsed records
//   const stats = {
//     totalRecords: parsedRecords.length,
//     pending: parsedRecords.filter(r => r.compensation_distribution_status === 'PENDING').length,
//     paid: parsedRecords.filter(r => r.compensation_distribution_status === 'PAID').length,
//     unpaid: parsedRecords.filter(r => r.compensation_distribution_status === 'UNPAID').length,
//     totalCompensation: parsedRecords.reduce((sum, record) => sum + (record.net_payable || 0), 0)
//   };

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold" style={{ 
//               
//               fontWeight: 700,
//               letterSpacing: '0.5px',
//               textShadow: '0 1px 2px rgba(0,0,0,0.3)'
//             }}>Project Overview Dashboard</h1>
//             <p className="text-blue-100 mt-1" style={{ 
//               
//               fontWeight: 500,
//               letterSpacing: '0.2px'
//             }}>Select a project to view land records and compensation details</p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <MapPin className="h-5 w-5" />
//             <span className="text-sm font-medium" style={{ 
//               
//               fontWeight: 600,
//               letterSpacing: '0.2px'
//             }}>Officer Portal</span>
//           </div>
//         </div>
//       </div>

//       {/* Project Selection */}
//       <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-blue-900 flex items-center space-x-2" style={{ 
//             
//             fontWeight: 600,
//             letterSpacing: '0.2px'
//           }}>
//             <Database className="h-5 w-5" />
//             <span>Project Selection</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="project-select" className="text-blue-800 font-medium" style={{ 
//                 
//                 fontWeight: 600
//               }}>Select Project</Label>
//               <Select
//                 value={selectedProject}
//                 onValueChange={(value) => {
//                   const selected = projects.find((project) => project.id === value);
//                   if (selected) {
//                     setSelectedProject(selected.id);
//                     setProjectName(selected.projectName);
//                   }
//                 }}
//               >
//                 <SelectTrigger className="border-blue-200">
//                   <SelectValue placeholder="Select a project" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {projects.map((project) => (
//                     <SelectItem key={project.id} value={project.id}>
//                       {project.projectName}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="search-input" className="text-blue-800 font-medium" style={{ 
//                 
//                 fontWeight: 600
//               }}>Search Records</Label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
//                 <Input
//                   id="search-input"
//                   type="text"
//                   placeholder="Search by name, village, survey number..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 border-blue-200"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center justify-between mt-4">
//             <Button onClick={loadLandRecords} disabled={loading || !selectedProject} className="bg-blue-600 hover:bg-blue-700 text-white">
//               <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
//               Refresh Records
//             </Button>
//             <div className="text-sm text-blue-600" >
//               {selectedProject ? `Showing ${filteredParsedRecords.length} records for ${projectName}` : 'Please select a project'}
//               {searchTerm && ` (filtered by "${searchTerm}")`}
//             </div>
            
//           </div>
//         </CardContent>
//       </Card>

//       {/* Statistics Cards */}
//       {selectedProject && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//           <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-blue-800" style={{ 
//                 
//                 fontWeight: 600,
//                 letterSpacing: '0.2px'
//               }}>Total Records</CardTitle>
//               <Database className="h-4 w-4 text-blue-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-blue-900">{stats.totalRecords}</div>
//               <p className="text-xs text-blue-600 mt-1">All land records</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-orange-800" style={{ 
//                 
//                 fontWeight: 600,
//                 letterSpacing: '0.2px'
//               }}>Pending</CardTitle>
//               <Clock className="h-4 w-4 text-orange-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-orange-900">{stats.pending}</div>
//               <p className="text-xs text-orange-600 mt-1">Compensation pending</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-green-800" style={{ 
//                 
//                 fontWeight: 600,
//                 letterSpacing: '0.2px'
//               }}>Paid</CardTitle>
//               <CheckCircle className="h-4 w-4 text-green-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-green-900">{stats.paid}</div>
//               <p className="text-xs text-green-600 mt-1">Compensation paid</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-red-800" style={{ 
//                 
//                 fontWeight: 600,
//                 letterSpacing: '0.2px'
//               }}>Unpaid</CardTitle>
//               <XCircle className="h-4 w-4 text-red-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-red-900">{stats.unpaid}</div>
//               <p className="text-xs text-red-600 mt-1">Compensation unpaid</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-purple-800" style={{ 
//                 
//                 fontWeight: 600,
//                 letterSpacing: '0.2px'
//               }}>Total Compensation</CardTitle>
//               <DollarSign className="h-4 w-4 text-purple-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-purple-900">₹{stats.totalCompensation.toLocaleString('en-IN')}</div>
//               <p className="text-xs text-purple-600 mt-1">Net payable amount</p>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Land Records Table */}
//       {selectedProject && (
//         <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-blue-900 flex items-center space-x-2" style={{ 
//               
//               fontWeight: 600,
//               letterSpacing: '0.2px'
//             }}>
//               <Users className="h-5 w-5" />
//               <span>Land Records - {projectName}</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {paginatedRecords.length === 0 ? (
//               <div className="text-center py-8 text-blue-600">
//                 {searchTerm ? `No land records found matching "${searchTerm}"` : "No land records found for this project"}
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-blue-50">
//                         <TableHead className="text-blue-900 font-semibold" >Serial</TableHead>
//                         {fixedColumns.map(col => (
//                           <TableHead key={col} className="text-blue-900 font-semibold" >
//                             {col.replace(/_/g, ' ').toUpperCase()}
//                           </TableHead>
//                         ))}
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {paginatedRecords.map((record, index) => (
//                         <TableRow key={index} className="hover:bg-blue-50/50">
//                           <TableCell className="text-blue-800">{(currentPage - 1) * recordsPerPage + index + 1}</TableCell>
//                           {fixedColumns.map((column) => (
//                             <TableCell key={column} className="text-blue-800">
//                               {column === 'compensation_distribution_status' ? (
//                                 getStatusBadge(record[column] || 'PENDING')
//                               ) : [
//                                 'total_land_area_ha', 
//                                 'acquired_land_area_ha', 
//                                 'approved_rate_per_hectare', 
//                                 'market_value', 
//                                 'factor', 
//                                 'land_compensation', 
//                                 'structures_amount', 
//                                 'forest_trees_amount', 
//                                 'fruit_trees_amount', 
//                                 'wells_amount', 
//                                 'solatium', 
//                                 'interest_12percent', 
//                                 'total_compensation', 
//                                 'deduction', 
//                                 'net_payable'
//                               ].includes(column) ? (
//                                 safeNumericConversion(record[column])
//                               ) : (
//                                 String(record[column] || '')
//                               )}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//                 {totalPages > 1 && (
//                   <Pagination>
//                     <PaginationContent>
//                       <PaginationItem>
//                         <PaginationPrevious 
//                           href="#" 
//                           onClick={(e) => {
//                             e.preventDefault();
//                             if (currentPage > 1) setCurrentPage(currentPage - 1);
//                           }} 
//                           className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
//                         />
//                       </PaginationItem>
//                       {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                         <PaginationItem key={page}>
//                           <PaginationLink 
//                             href="#" 
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setCurrentPage(page);
//                             }} 
//                             isActive={currentPage === page}
//                           >
//                             {page}
//                           </PaginationLink>
//                         </PaginationItem>
//                       ))}
//                       <PaginationItem>
//                         <PaginationNext 
//                           href="#" 
//                           onClick={(e) => {
//                             e.preventDefault();
//                             if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//                           }} 
//                           className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
//                         />
//                       </PaginationItem>
//                     </PaginationContent>
//                   </Pagination>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default OverviewSection;