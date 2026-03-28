// JavaScript types definitions for LandrecordsSection components

// Default templates for land record processing
export const DEFAULT_TEMPLATES = [
  {
    id: 'default-english',
    templateName: 'English Land Record Template',
    actName: 'Land Acquisition Act 1894',
    fields: [
      { name: 'serial_number', displayName: 'Serial Number', dataType: 'number', isRequired: true },
      { name: 'owner_name', displayName: 'Owner Name', dataType: 'string', isRequired: true },
      { name: 'old_survey_number', displayName: 'Old Survey Number', dataType: 'string', isRequired: false },
      { name: 'new_survey_number', displayName: 'New Survey Number', dataType: 'string', isRequired: false },
      { name: 'group_number', displayName: 'Group Number', dataType: 'string', isRequired: false },
      { name: 'cts_number', displayName: 'CTS Number', dataType: 'string', isRequired: false },
      { name: 'village', displayName: 'Village', dataType: 'string', isRequired: true },
      { name: 'taluka', displayName: 'Taluka', dataType: 'string', isRequired: true },
      { name: 'district', displayName: 'District', dataType: 'string', isRequired: true },
      { name: 'land_area_as_per_7_12', displayName: 'Land Area as per 7/12', dataType: 'number', isRequired: false },
      { name: 'acquired_land_area', displayName: 'Acquired Land Area', dataType: 'number', isRequired: false },
      { name: 'land_type', displayName: 'Land Type', dataType: 'string', isRequired: false },
      { name: 'land_classification', displayName: 'Land Classification', dataType: 'string', isRequired: false },
      { name: 'approved_rate_per_hectare', displayName: 'Approved Rate per Hectare', dataType: 'number', isRequired: false },
      { name: 'market_value_as_per_acquired_area', displayName: 'Market Value as per Acquired Area', dataType: 'number', isRequired: false },
      { name: 'factor_as_per_section_26_2', displayName: 'Factor as per Section 26(2)', dataType: 'number', isRequired: false },
      { name: 'land_compensation_as_per_section_26', displayName: 'Land Compensation as per Section 26', dataType: 'number', isRequired: false },
      { name: 'structures', displayName: 'Structures', dataType: 'number', isRequired: false },
      { name: 'forest_trees', displayName: 'Forest Trees', dataType: 'number', isRequired: false },
      { name: 'fruit_trees', displayName: 'Fruit Trees', dataType: 'number', isRequired: false },
      { name: 'wells_borewells', displayName: 'Wells/Borewells', dataType: 'number', isRequired: false },
      { name: 'total_structures_amount', displayName: 'Total Structures Amount', dataType: 'number', isRequired: false },
      { name: 'total_amount_14_23', displayName: 'Total Amount 14-23', dataType: 'number', isRequired: false },
      { name: 'determined_compensation_26', displayName: 'Determined Compensation 26', dataType: 'number', isRequired: false },
      { name: 'total_compensation_26_27', displayName: 'Total Compensation 26-27', dataType: 'number', isRequired: false },
      { name: 'deduction_amount', displayName: 'Deduction Amount', dataType: 'number', isRequired: false },
      { name: 'final_payable_compensation', displayName: 'Final Payable Compensation', dataType: 'number', isRequired: false },
      { name: 'remarks', displayName: 'Remarks', dataType: 'string', isRequired: false },
      { name: 'compensation_distribution_status', displayName: 'Compensation Distribution Status', dataType: 'string', isRequired: false },
      { name: 'notice_number', displayName: 'Notice Number', dataType: 'string', isRequired: false }
    ],
    uploadedHeaders: [],
    createdBy: 'system',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// CSV Upload State constants
export const CSV_UPLOAD_STATE = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  MAPPING: 'mapping',
  VALIDATING: 'validating',
  IMPORTING: 'importing',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Template field structure
export const createTemplateField = (name, displayName, dataType = 'string', isRequired = false) => ({
  name,
  displayName,
  dataType,
  isRequired
});

// Land record template structure
export const createLandRecordTemplate = (templateName, actName, fields = [], uploadedHeaders = []) => ({
  id: '',
  templateName,
  actName,
  fields,
  uploadedHeaders,
  createdBy: '',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// CSV upload state structure
export const createCSVUploadState = () => ({
  status: CSV_UPLOAD_STATE.IDLE,
  file: null,
  headers: [],
  data: [],
  mappedData: [],
  validationErrors: [],
  progress: 0,
  totalRecords: 0,
  processedRecords: 0,
  errorRecords: [],
  selectedTemplate: null,
  fieldMapping: {},
  locationData: {
    village: '',
    taluka: '',
    district: ''
  }
});

// Component prop structures (for documentation purposes)
export const componentPropTypes = {
  CSVUploadTabProps: {
    selectedProject: 'string',
    onDataImported: 'function'
  },
  
  TemplateSelectionProps: {
    templates: 'array',
    selectedTemplate: 'object',
    onTemplateSelect: 'function',
    onTemplateCreate: 'function'
  },
  
  FieldMappingProps: {
    csvHeaders: 'array',
    templateFields: 'array',
    mapping: 'object',
    onMappingChange: 'function'
  },
  
  LocationInputProps: {
    village: 'string',
    taluka: 'string',
    district: 'string',
    onLocationChange: 'function'
  },
  
  UploadProgressProps: {
    progress: 'number',
    status: 'string',
    totalRecords: 'number',
    processedRecords: 'number',
    errorRecords: 'array'
  },
  
  CSVFileUploadProps: {
    onFileSelect: 'function',
    acceptedFormats: 'array',
    maxFileSize: 'number'
  },
  
  TemplateCreationDialogProps: {
    open: 'boolean',
    onOpenChange: 'function',
    onTemplateCreate: 'function',
    initialHeaders: 'array'
  }
};

// Validation helpers
export const validateTemplateField = (field) => {
  const errors = [];
  
  if (!field.name || field.name.trim() === '') {
    errors.push('Field name is required');
  }
  
  if (!field.displayName || field.displayName.trim() === '') {
    errors.push('Display name is required');
  }
  
  if (!['string', 'number', 'boolean', 'date'].includes(field.dataType)) {
    errors.push('Invalid data type');
  }
  
  return errors;
};

export const validateLandRecordTemplate = (template) => {
  const errors = [];
  
  if (!template.templateName || template.templateName.trim() === '') {
    errors.push('Template name is required');
  }
  
  if (!template.actName || template.actName.trim() === '') {
    errors.push('Act name is required');
  }
  
  if (!template.fields || template.fields.length === 0) {
    errors.push('At least one field is required');
  }
  
  template.fields?.forEach((field, index) => {
    const fieldErrors = validateTemplateField(field);
    fieldErrors.forEach(error => {
      errors.push(`Field ${index + 1}: ${error}`);
    });
  });
  
  return errors;
};

// Data conversion utilities
export const safeNumericConversion = (value) => {
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

export const convertDataType = (value, dataType) => {
  switch (dataType) {
    case 'number':
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    case 'boolean':
      return Boolean(value);
    case 'date':
      return new Date(value);
    case 'string':
    default:
      return String(value);
  }
};