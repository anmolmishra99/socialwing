import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  RefreshCw, 
  Search,
  MapPin,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity
} from 'lucide-react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/app/firebase';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart as RechartsPieChart, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  Pie
} from 'recharts';

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

// Parsing function for each template
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
    project_id: record.project_id || '',
    project_name: record.project_name || '',
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
    parsed.additional_allowance_st_sc = parseFloat(record['अनुसूचित जमाती व अनुसूचित जाती करिता अतिरिक्त निर्वाह भत्ता (कलम 3 RFCT-LARR 2013 अनुसूचि 2 अ.क्र. 5)']) || 0;
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

// Chart color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

const OverviewSection = () => {
  const [projects, setProjects] = useState([]);
  const [landRecords, setLandRecords] = useState([]);
  const [parsedRecords, setParsedRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Statistics
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalLandRecords: 0,
    totalCompensation: 0,
    totalLandArea: 0,
    totalAcquiredArea: 0,
    pendingCompensations: 0,
    paidCompensations: 0
  });

  // Chart data
  const [chartData, setChartData] = useState({
    projectWiseCompensation: [],
    landAreaDistribution: [],
    compensationStatus: [],
    landTypeDistribution: [],
    compensationTrends: []
  });

  // Fixed columns for display (based on common parsed fields)
  const fixedColumns = [
    'serial_number',
    'owner_name',
    'project_name',
    'survey_number',
    'total_land_area_ha',
    'acquired_land_area_ha',
    'land_type',
    'approved_rate_per_hectare',
    'market_value',
    'total_compensation',
    'net_payable',
    'compensation_distribution_status'
  ];

  // Fetch all projects and land records
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch projects
      const projectsRef = collection(db, 'projects');
      const projectsSnapshot = await getDocs(projectsRef);
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);

      // Fetch all land records
      const landRecordsRef = collection(db, 'landRecord');
      const landRecordsSnapshot = await getDocs(landRecordsRef);
      const landRecordsData = landRecordsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Merge project names with land records
      const enrichedLandRecords = landRecordsData.map(record => {
        const project = projectsData.find(p => p.id === record.project_id);
        return {
          ...record,
          project_name: project?.projectName || 'Unknown Project'
        };
      });

      setLandRecords(enrichedLandRecords);
      
      // Parse records
      const parsed = enrichedLandRecords.map(parseRecord);
      setParsedRecords(parsed);
      
      // Calculate statistics and chart data
      calculateStatistics(parsed, projectsData);
      generateChartData(parsed, projectsData);
      
      toast.success(`Loaded ${projectsData.length} projects and ${enrichedLandRecords.length} land records`);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStatistics = (parsedRecords, projectsData) => {
    const totalCompensation = parsedRecords.reduce((sum, record) => sum + (record.total_compensation || 0), 0);
    const totalLandArea = parsedRecords.reduce((sum, record) => sum + (record.total_land_area_ha || 0), 0);
    const totalAcquiredArea = parsedRecords.reduce((sum, record) => sum + (record.acquired_land_area_ha || 0), 0);
    
    const paidRecords = parsedRecords.filter(record => 
      record.compensation_distribution_status && 
      record.compensation_distribution_status.toLowerCase().includes('paid')
    );
    const pendingRecords = parsedRecords.filter(record => 
      !record.compensation_distribution_status || 
      record.compensation_distribution_status.toLowerCase().includes('pending')
    );

    setStats({
      totalProjects: projectsData.length,
      totalLandRecords: parsedRecords.length,
      totalCompensation,
      totalLandArea,
      totalAcquiredArea,
      pendingCompensations: pendingRecords.length,
      paidCompensations: paidRecords.length
    });
  };

  // Generate chart data
  const generateChartData = (parsedRecords, projectsData) => {
    // Project-wise compensation distribution
    const projectWiseData = projectsData.map(project => {
      const projectRecords = parsedRecords.filter(record => record.project_id === project.id);
      const totalCompensation = projectRecords.reduce((sum, record) => sum + (record.total_compensation || 0), 0);
      const totalArea = projectRecords.reduce((sum, record) => sum + (record.acquired_land_area_ha || 0), 0);
      
      return {
        name: project.projectName || 'Unknown',
        compensation: totalCompensation,
        area: totalArea,
        records: projectRecords.length
      };
    });

    // Land area distribution (Total vs Acquired)
    const totalLandArea = parsedRecords.reduce((sum, record) => sum + (record.total_land_area_ha || 0), 0);
    const totalAcquiredArea = parsedRecords.reduce((sum, record) => sum + (record.acquired_land_area_ha || 0), 0);
    const landAreaData = [
      { name: 'Total Land Area', value: totalLandArea, color: '#0088FE' },
      { name: 'Acquired Land Area', value: totalAcquiredArea, color: '#00C49F' },
      { name: 'Remaining Land Area', value: totalLandArea - totalAcquiredArea, color: '#FFBB28' }
    ];

    // Compensation status distribution
    const paidCount = parsedRecords.filter(record => 
      record.compensation_distribution_status && 
      record.compensation_distribution_status.toLowerCase().includes('paid')
    ).length;
    const pendingCount = parsedRecords.length - paidCount;
    
    const compensationStatusData = [
      { name: 'Paid', value: paidCount, color: '#00C49F' },
      { name: 'Pending', value: pendingCount, color: '#FF8042' }
    ];

    // Land type distribution
    const landTypeMap = {};
    parsedRecords.forEach(record => {
      const landType = record.land_type || 'Unknown';
      landTypeMap[landType] = (landTypeMap[landType] || 0) + 1;
    });
    
    const landTypeData = Object.entries(landTypeMap).map(([type, count], index) => ({
      name: type,
      value: count,
      color: COLORS[index % COLORS.length]
    }));

    // Compensation trends (simplified - by project)
    const compensationTrends = projectWiseData.map((project, index) => ({
      project: project.name.substring(0, 10) + '...',
      compensation: project.compensation / 1000000, // Convert to millions
      area: project.area
    }));

    // Land class distribution (Agricultural, Residential, Commercial, etc.)
    const landClassMap = {};
    parsedRecords.forEach(record => {
      const landClass = record.land_class || 'Unknown';
      landClassMap[landClass] = (landClassMap[landClass] || 0) + 1;
    });
    
    const landClassData = Object.entries(landClassMap).map(([type, count], index) => ({
      name: type,
      value: count,
      color: COLORS[index % COLORS.length]
    }));

    // Compensation per hectare analysis
    const compensationPerHaData = projectWiseData.map(project => ({
      name: project.name.substring(0, 15) + '...',
      compensationPerHa: project.area > 0 ? (project.compensation / project.area) : 0,
      totalArea: project.area,
      totalCompensation: project.compensation
    }));

    // Asset type distribution (Structures, Trees, Wells)
    const assetTypeData = [
      {
        name: 'Structures',
        value: parsedRecords.reduce((sum, record) => sum + (record.structures_amount || 0), 0),
        count: parsedRecords.reduce((sum, record) => sum + (record.structures_count || 0), 0),
        color: '#0088FE'
      },
      {
        name: 'Forest Trees',
        value: parsedRecords.reduce((sum, record) => sum + (record.forest_trees_amount || 0), 0),
        count: parsedRecords.reduce((sum, record) => sum + (record.forest_trees_count || 0), 0),
        color: '#00C49F'
      },
      {
        name: 'Fruit Trees',
        value: parsedRecords.reduce((sum, record) => sum + (record.fruit_trees_amount || 0), 0),
        count: parsedRecords.reduce((sum, record) => sum + (record.fruit_trees_count || 0), 0),
        color: '#FFBB28'
      },
      {
        name: 'Wells',
        value: parsedRecords.reduce((sum, record) => sum + (record.wells_amount || 0), 0),
        count: parsedRecords.reduce((sum, record) => sum + (record.wells_count || 0), 0),
        color: '#FF8042'
      }
    ].filter(asset => asset.value > 0); // Only show assets with value

    // Compensation component breakdown
    const compensationComponents = [
      {
        name: 'Land Compensation',
        value: parsedRecords.reduce((sum, record) => sum + (record.land_compensation || 0), 0),
        color: '#0088FE'
      },
      {
        name: 'Solatium',
        value: parsedRecords.reduce((sum, record) => sum + (record.solatium || 0), 0),
        color: '#00C49F'
      },
      {
        name: 'Interest (12%)',
        value: parsedRecords.reduce((sum, record) => sum + (record.interest_12percent || 0), 0),
        color: '#FFBB28'
      },
      {
        name: 'Assets',
        value: parsedRecords.reduce((sum, record) => sum + (record.total_assets_amount || 0), 0),
        color: '#FF8042'
      },
      {
        name: 'Other Allowances',
        value: parsedRecords.reduce((sum, record) => 
          sum + (record.subsistence_allowance || 0) + 
          (record.additional_allowance_st_sc || 0) + 
          (record.resettlement_assistance || 0), 0),
        color: '#8884D8'
      }
    ].filter(component => component.value > 0);

    // Village-wise distribution (if village data is available)
    const villageMap = {};
    parsedRecords.forEach(record => {
      const village = record.village || 'Unknown';
      if (!villageMap[village]) {
        villageMap[village] = {
          records: 0,
          totalCompensation: 0,
          totalArea: 0
        };
      }
      villageMap[village].records += 1;
      villageMap[village].totalCompensation += (record.total_compensation || 0);
      villageMap[village].totalArea += (record.acquired_land_area_ha || 0);
    });

    const villageData = Object.entries(villageMap).map(([village, data]) => ({
      name: village.substring(0, 15) + (village.length > 15 ? '...' : ''),
      records: data.records,
      compensation: data.totalCompensation,
      area: data.totalArea
    })).sort((a, b) => b.compensation - a.compensation).slice(0, 10); // Top 10 villages

    // Project Timeline Analysis
    const projectTimeline = projectsData.map(project => ({
      name: project.project_name || `Project ${project.id}`,
      startDate: project.start_date || 'N/A',
      endDate: project.end_date || 'N/A',
      duration: project.start_date && project.end_date ? 
        Math.ceil((new Date(project.end_date) - new Date(project.start_date)) / (1000 * 60 * 60 * 24)) : 0,
      status: project.status || 'Active',
      progress: Math.random() * 100 // Mock progress data
    }));

    // Land Acquisition Progress by Project
    const acquisitionProgress = projectsData.map(project => {
      const projectRecords = parsedRecords.filter(record => record.project_id === project.id);
      const totalLand = projectRecords.reduce((sum, record) => sum + record.total_land_area_ha, 0);
      const acquiredLand = projectRecords.reduce((sum, record) => sum + record.acquired_land_area_ha, 0);
      const progressPercentage = totalLand > 0 ? (acquiredLand / totalLand) * 100 : 0;
      
      return {
        name: project.project_name || `Project ${project.id}`,
        totalLand: totalLand,
        acquiredLand: acquiredLand,
        progress: progressPercentage,
        records: projectRecords.length
      };
    });

    // Compensation Amount Distribution (Histogram)
    const compensationRanges = [
      { range: '0-1L', min: 0, max: 100000, count: 0 },
      { range: '1-5L', min: 100000, max: 500000, count: 0 },
      { range: '5-10L', min: 500000, max: 1000000, count: 0 },
      { range: '10-25L', min: 1000000, max: 2500000, count: 0 },
      { range: '25-50L', min: 2500000, max: 5000000, count: 0 },
      { range: '50L+', min: 5000000, max: Infinity, count: 0 }
    ];

    parsedRecords.forEach(record => {
      const compensation = record.total_compensation;
      compensationRanges.forEach(range => {
        if (compensation >= range.min && compensation < range.max) {
          range.count++;
        }
      });
    });

    // Monthly/Yearly Acquisition Trends
    const monthlyTrends = {};
    parsedRecords.forEach(record => {
      // Mock date data - in real scenario, use actual acquisition dates
      const date = new Date();
      date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      
      if (!monthlyTrends[monthKey]) {
        monthlyTrends[monthKey] = {
          month: monthKey,
          records: 0,
          area: 0,
          compensation: 0
        };
      }
      
      monthlyTrends[monthKey].records++;
      monthlyTrends[monthKey].area += record.acquired_land_area_ha;
      monthlyTrends[monthKey].compensation += record.total_compensation / 1000000; // in millions
    });

    const monthlyTrendsArray = Object.values(monthlyTrends)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months

    setChartData({
      projectWiseCompensation: projectWiseData,
      landAreaDistribution: landAreaData,
      compensationStatus: compensationStatusData,
      landTypeDistribution: landTypeData,
      landClassDistribution: landClassData,
      compensationTrends: compensationTrends,
      compensationPerHa: compensationPerHaData,
      assetTypeDistribution: assetTypeData,
      compensationComponents: compensationComponents,
      villageDistribution: villageData,
      projectTimeline: projectTimeline,
      acquisitionProgress: acquisitionProgress,
      compensationDistribution: compensationRanges,
      monthlyTrends: monthlyTrendsArray
    });
  };

  // Filter parsed records
  const filteredParsedRecords = parsedRecords.filter(record => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      String(record.owner_name || '').toLowerCase().includes(searchLower) ||
      String(record.survey_number || '').toLowerCase().includes(searchLower) ||
      String(record.old_survey_number || '').toLowerCase().includes(searchLower) ||
      String(record.new_survey_number || '').toLowerCase().includes(searchLower)
      // Add more if needed
    );
  });

  // Load all data when component mounts
  useEffect(() => {
    fetchAllData();
  }, []);

  // Pagination logic
  const filteredRecords = parsedRecords.filter(record => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return Object.values(record).some(value => 
      value && value.toString().toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Land Records Analytics Dashboard</h1>
            <p className="text-blue-100 mt-1">Comprehensive overview of all projects and land compensation data</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={fetchAllData}
              disabled={loading}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Projects</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalProjects}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Land Records</p>
                <p className="text-3xl font-bold text-green-900">{stats.totalLandRecords}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Compensation</p>
                <p className="text-2xl font-bold text-purple-900">₹{(stats.totalCompensation / 10000000).toFixed(2)}Cr</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Land Area (Ha)</p>
                <p className="text-2xl font-bold text-orange-900">{stats.totalAcquiredArea?.toFixed(2)}</p>
                <p className="text-xs text-orange-500">of {stats.totalLandArea?.toFixed(2)} total</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project-wise Compensation Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Project-wise Compensation Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.projectWiseCompensation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'compensation' ? `₹${(value / 1000000).toFixed(2)}M` : value,
                    name === 'compensation' ? 'Compensation' : name === 'area' ? 'Area (Ha)' : 'Records'
                  ]}
                />
                <Legend />
                <Bar dataKey="compensation" fill="#0088FE" name="Compensation" />
                <Bar dataKey="records" fill="#00C49F" name="Records Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Land Area Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-green-600" />
              Land Area Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData.landAreaDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.landAreaDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toFixed(2)} Ha`, 'Area']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compensation Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Compensation Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData.compensationStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.compensationStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Land Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-orange-600" />
              Land Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.landTypeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Land Class Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-teal-600" />
              Land Class Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData.landClassDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.landClassDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compensation Per Hectare Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-emerald-600" />
              Compensation Per Hectare by Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.compensationPerHa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M/Ha`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `₹${(value / 1000000).toFixed(2)}M per Ha`,
                    'Compensation per Hectare'
                  ]}
                />
                <Bar dataKey="compensationPerHa" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-amber-600" />
              Asset Type Distribution (Value)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData.assetTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.assetTypeDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${(value / 1000000).toFixed(2)}M`, 'Asset Value']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compensation Components Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-rose-600" />
              Compensation Components Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.compensationComponents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${(value / 1000000).toFixed(2)}M`, 'Amount']}
                />
                <Bar dataKey="value" fill="#F43F5E" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* More Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Timeline Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Project Timeline & Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.projectTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `${value} days`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'duration' ? `${value} days` : `${value.toFixed(1)}%`,
                    name === 'duration' ? 'Duration' : 'Progress'
                  ]}
                />
                <Legend />
                <Bar dataKey="duration" fill="#3B82F6" name="Duration (days)" />
                <Bar dataKey="progress" fill="#10B981" name="Progress %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Land Acquisition Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Land Acquisition Progress by Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.acquisitionProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => `${value.toFixed(1)} Ha`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'progress' ? `${value.toFixed(1)}%` : 
                    name === 'records' ? value : `${value.toFixed(2)} Ha`,
                    name === 'progress' ? 'Progress' : 
                    name === 'records' ? 'Records' : 'Area'
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="totalLand" fill="#94A3B8" name="Total Land (Ha)" />
                <Bar yAxisId="left" dataKey="acquiredLand" fill="#10B981" name="Acquired Land (Ha)" />
                <Bar yAxisId="right" dataKey="progress" fill="#F59E0B" name="Progress %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compensation Distribution Histogram */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Compensation Amount Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.compensationDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'Number of Records']}
                />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Acquisition Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              Monthly Acquisition Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(value) => value.slice(5)} // Show MM only
                />
                <YAxis 
                  yAxisId="left"
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tickFormatter={(value) => `₹${value.toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'compensation' ? `₹${value.toFixed(2)}M` : 
                    name === 'area' ? `${value.toFixed(2)} Ha` : value,
                    name === 'compensation' ? 'Compensation' : 
                    name === 'area' ? 'Area' : 'Records'
                  ]}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="records" stroke="#3B82F6" name="Records" />
                <Line yAxisId="left" type="monotone" dataKey="area" stroke="#10B981" name="Area (Ha)" />
                <Line yAxisId="right" type="monotone" dataKey="compensation" stroke="#F59E0B" name="Compensation (₹M)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Village-wise Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-violet-600" />
            Top Villages by Compensation Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.villageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'compensation' ? `₹${(value / 1000000).toFixed(2)}M` : 
                  name === 'area' ? `${value.toFixed(2)} Ha` : value,
                  name === 'compensation' ? 'Compensation' : 
                  name === 'area' ? 'Area' : 'Records'
                ]}
              />
              <Legend />
              <Bar dataKey="compensation" fill="#8B5CF6" name="Compensation" />
              <Bar dataKey="records" fill="#06B6D4" name="Records Count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Compensation Trends Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
            Project-wise Compensation Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData.compensationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="project" />
              <YAxis tickFormatter={(value) => `₹${value.toFixed(1)}M`} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'compensation' ? `₹${value.toFixed(2)}M` : `${value.toFixed(2)} Ha`,
                  name === 'compensation' ? 'Compensation' : 'Area'
                ]}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="compensation" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Compensation (₹M)"
              />
              <Area 
                type="monotone" 
                dataKey="area" 
                stackId="2" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Area (Ha)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Land Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-blue-600" />
              Land Records Data ({parsedRecords.length} records)
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading data...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {fixedColumns.map((column) => (
                        <TableHead key={column} className="whitespace-nowrap">
                          {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRecords.map((record, index) => (
                      <TableRow key={index}>
                        {fixedColumns.map((column) => (
                          <TableCell key={column} className="whitespace-nowrap">
                            {column === 'compensation_distribution_status' ? (
                              <Badge 
                                variant={
                                  record[column]?.toLowerCase().includes('paid') ? 'default' : 
                                  record[column]?.toLowerCase().includes('pending') ? 'secondary' : 
                                  'destructive'
                                }
                              >
                                {record[column] || 'N/A'}
                              </Badge>
                            ) : column.includes('amount') || column.includes('compensation') || column.includes('payable') ? (
                              record[column] ? `₹${Number(record[column]).toLocaleString('en-IN')}` : 'N/A'
                            ) : column.includes('area') && column.includes('ha') ? (
                              record[column] ? `${Number(record[column]).toFixed(4)} Ha` : 'N/A'
                            ) : (
                              record[column] || 'N/A'
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={cn(
                            "cursor-pointer",
                            currentPage === 1 && "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={cn(
                            "cursor-pointer",
                            currentPage === totalPages && "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewSection;