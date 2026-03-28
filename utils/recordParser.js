// Utility functions for parsing land records based on templates

// Utility to parse हे.आर (hectare-are) format to decimal hectares
const parseHaAreToDecimalHa = (value) => {
  if (!value) return 0;
  
  // Handle different formats: "2-15-00", "2.15", "2.15.00", etc.
  const str = value.toString().trim();
  
  // If it's already a simple decimal number
  if (/^\d+(\.\d+)?$/.test(str)) {
    return parseFloat(str) || 0;
  }
  
  // Split by dash or dot
  const parts = str.split(/[-.]/);
  if (parts.length >= 2) {
    const hectares = parseFloat(parts[0]) || 0;
    const ares = parseFloat(parts[1]) || 0;
    return hectares + (ares / 100); // 1 hectare = 100 ares
  }
  
  return parseFloat(str) || 0;
};

// Normalize Unicode digits (e.g., Devanagari ०-९) to ASCII 0-9
const normalizeDigits = (str) => {
  if (!str) return '';
  const map = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  return str.replace(/[०-९]/g, (ch) => map[ch] || ch);
};

// Utility to parse numeric values safely
const parseNumeric = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const str = value.toString();
  const normalized = normalizeDigits(str);
  const cleaned = normalized.replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

// Utility to convert sq.m to decimal ha (1 ha = 10000 sq.m)
const convertSqmToHa = (sqm) => {
  const num = parseFloat(sqm);
  return isNaN(num) ? 0 : num / 10000;
};

// Main parsing function for land records based on template
export const parseRecord = (record) => {
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
    village: '',
    taluka: '',
    district: '',
    notice_generated: record.notice_generated || false,
    notice_date: record.notice_date || null,
    notice_number: record.notice_number || '',
    kycCompleted: record.kycCompleted || false,
    status: record.status || '',
    id: record.id || ''
  };

  if (templateName.includes('LARR 2013')) {
    // Map LARR 2013 fields
    parsed.serial_number = record['अ.क्र'] || record.serial_number || '';
    parsed.owner_name = record['खातेदाराचे नांव'] || record.owner_name || '';
    parsed.old_survey_number = record['जुना स.नं.'] || record.old_survey_number || '';
    parsed.new_survey_number = record['नविन स.नं.'] || record.new_survey_number || '';
    parsed.survey_number = record['स.नं./हि.नं./ग.नं.'] || record.survey_number || '';
    parsed.gat_number = record['गट नंबर'] || record.gat_number || '';
    parsed.cts_number = record['सी.टी.एस. नंबर'] || record.cts_number || '';
    parsed.village = record['गांव'] || record.village || '';
    parsed.taluka = record['तालुका'] || record.taluka || '';
    parsed.district = record['जिल्हा'] || record.district || '';
    parsed.total_land_area_ha = parseHaAreToDecimalHa(record['गांव नमुना 7/12 नुसार जमिनीचे क्षेत्र हे.आर']);
    parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record['संपादित जमिनीचे क्षेत्र हेक्टर आर']);
    parsed.land_type = record['जमिनीचा प्रकार'] || record.land_type || '';
    parsed.land_class = record['जमिनीचा प्रकार शेती/ बिनशेती/ धारणाधिकार'] || record.land_class || '';
    parsed.approved_rate_per_hectare = parseNumeric(record['मंजुर केलेला दर (प्रति हेक्टर) रक्कम रुपये']);
    parsed.market_value = parseNumeric(record['संपादीत होणाऱ्या जमिनीच्या क्षेत्रानुसार येणारे बाजारमुल्य र.रू']);
    parsed.factor = parseNumeric(record['कलम 26 (2) नुसार गावास लागु असलेले गणक Factor']);
    parsed.land_compensation = parseNumeric(record['कलम 26 नुसार जमिनीचा मोबदला']);
    parsed.structures_count = parseNumeric(record['संख्या बांधकामे']);
    parsed.structures_amount = parseNumeric(record['संख्या रक्कम रुपये']);
    parsed.forest_trees_count = parseNumeric(record['वनझाडे झाडांची संख्या']);
    parsed.forest_trees_amount = parseNumeric(record['वनझाडे झाडांची रक्कम रु.']);
    parsed.fruit_trees_count = parseNumeric(record['फळझाडे झाडांची संख्या']);
    parsed.fruit_trees_amount = parseNumeric(record['फळझाडे झाडांची रक्कम रु.']);
    parsed.wells_count = parseNumeric(record['विहिरी/बोअरवेल संख्या']);
    parsed.wells_amount = parseNumeric(record['विहिरी/बोअरवेल रक्कम रुपये']);
    parsed.total_assets_amount = parseNumeric(record['एकुण रक्कम रुपये']);
    parsed.total_compensation = parseNumeric(record['एकुण रक्कम']);
    parsed.solatium = parseNumeric(record['100 %  सोलेशियम (दिलासा रक्कम) सेक्शन 30 (1)  RFCT-LARR 2013 अनुसूचि 1 अ.नं. 5']);
    parsed.determined_compensation = parseNumeric(record['निर्धारित मोबदला']);
    parsed.additional_25percent = parseNumeric(record['एकूण रक्कमेवर  25%  वाढीव मोबदला (अ.क्र. 26 नुसार येणाऱ्या रक्कमेवर)']);
    parsed.total_compensation = parseNumeric(record['एकुण मोबदला']);
    parsed.deduction = parseNumeric(record['वजावट रक्कम रुपये']);
    parsed.net_payable = parseNumeric(record['हितसंबंधिताला अदा करावयाची एकुण मोबदला रक्कम रुपये (अ.क्र. 25 वजा 26)']);
    parsed.remarks = record['शेरा'] || record.remarks || '';
    parsed.compensation_distribution = record['मोबदला वाटप तपशिल'] || record.compensation_distribution || '';
    parsed.arbitration_remark = record['मध्यस्थी संबंधी टिप्पणी (Arbitration Remark)'] || record.arbitration_remark || '';
    parsed.compensation_distribution_status = record['मोबदला वाटप तपशिल'] || record.compensation_distribution_status || 'PENDING';
  } else if (templateName.includes('NHAI 1956')) {
    // Map NHAI 1956 fields
    parsed.serial_number = record['अ.क्र'] || record.serial_number || '';
    parsed.owner_name = record['खातेदाराचे नांव'] || record.owner_name || '';
    parsed.survey_number = record['स.नं./हि.नं./ग.नं.'] || record.survey_number || '';
    parsed.village = record['गांव'] || record.village || '';
    parsed.taluka = record['तालुका'] || record.taluka || '';
    parsed.district = record['जिल्हा'] || record.district || '';
    parsed.total_land_area_ha = parseHaAreToDecimalHa(record['गांव नमुना 7/12 नुसार जमिनीचे क्षेत्र हे.आर']);
    parsed.acquired_land_area_ha = convertSqmToHa(record['संपादित जमिनीचे क्षेत्र चौ.मी']);
    parsed.land_type = record['जमिनीचा प्रकार'] || record.land_type || '';
    parsed.land_class = record['जमिनीचा प्रकार शेती/ बिनशेती'] || record.land_class || '';
    parsed.approved_rate_per_hectare = (parseNumeric(record['सक्षम प्राधिकारी यांनी निश्चित केलेला दर (प्रति चौ.मी.)']) || 0) * 10000;
    parsed.market_value = parseNumeric(record['जमिनीच्या गणकानुसार येणारा मोबदला']);
    parsed.deduction = parseNumeric(record['10 % अनर्जित रक्कम (वजावट)']);
    parsed.land_compensation = parseNumeric(record['एकुण मोबदला']);
    parsed.factor = parseNumeric(record['गावास लागु असलेले गणक FACTOR 2']);
    parsed.payable_compensation = parseNumeric(record['देय मोबदला']);
    parsed.structures_count = parseNumeric(record['बांधकामे संख्या']);
    parsed.structures_amount = parseNumeric(record['बांधकामे रक्कम रुपये']);
    parsed.forest_trees_count = parseNumeric(record['वनझाडे झाडांची संख्या']);
    parsed.forest_trees_amount = parseNumeric(record['वनझाडे झाडांची रक्कम रु.']);
    parsed.fruit_trees_count = parseNumeric(record['फळझाडे झाडांची संख्या']);
    parsed.fruit_trees_amount = parseNumeric(record['फळझाडे झाडांची रक्कम रु.']);
    parsed.wells_count = parseNumeric(record['विहिरी/बोअरवेल संख्या']);
    parsed.wells_amount = parseNumeric(record['विहिरी/बोअरवेल रक्कम रुपये']);
    parsed.total_assets_amount = parseNumeric(record['रक्कम रुपये']);
    parsed.total_compensation = parseNumeric(record['एकुण मोबदला']);
    parsed.interest_12percent = parseNumeric(record['कलम 3 (अ) ची अधिसूचना प्रसिध्द झालेल्या दिनांकापासुन ते निवाडा घोषित दिनांकापर्यत 12 % जमिनीचा वाढीव मोबदला प्रमाणे प्रतिवर्ष सेक्शन 30 (3) RFCT-LARR 2013 च्या कलम 26 (1) व 26 (2) मधील तरतुदीनुसार']);
    parsed.solatium = parseNumeric(record['100 %  सोलेटीएम (दिलासा रक्कम) सेक्शन 30 (1)  RFCT-LARR 2013 अनुसूचि 1 अ.नं. 5']);
    parsed.total_compensation = parseNumeric(record['एकुण मोबदला']);
    parsed.additional_nazrana = parseNumeric(record['(+) नजराणा रक्कम 10 %']);
    parsed.net_payable = parseNumeric(record['एकुण मोबदला निवाडयाची एकुण रक्कम (26+27)']);
    parsed.remarks = record['शेरा'] || record.remarks || '';
    parsed.compensation_distribution = record['मोबदला वाटप तपशिल'] || record.compensation_distribution || '';
    parsed.arbitration_remark = record['मध्यस्थी संबंधी टिप्पणी (Arbitration Remark)'] || record.arbitration_remark || '';
    parsed.compensation_distribution_status = record['मोबदला वाटप तपशिल'] || record.compensation_distribution_status || 'PENDING';
  } else if (templateName.includes('RAA 2008')) {
    // Map RAA 2008 fields
    parsed.serial_number = record['अ.क्र'] || record.serial_number || '';
    parsed.owner_name = record['संयुक्त मोजणी विवरण पत्रानुसार खातेदारांची नावे'] || record.owner_name || '';
    parsed.survey_number = record['संयुक्त मोजणी विवरणपत्रानुसार ग.नं.'] || record.survey_number || '';
    parsed.old_survey_number = record['जुने सर्वे नंबर'] || record.old_survey_number || '';
    parsed.new_survey_number = record['नवीन सर्वे नंबर'] || record.new_survey_number || '';
    parsed.village = record['गांव'] || record.village || '';
    parsed.taluka = record['तालुका'] || record.taluka || '';
    parsed.district = record['जिल्हा'] || record.district || '';
    parsed.land_type = record['जमिनीचा प्रकार'] || record.land_type || '';
    parsed.total_land_area_ha = parseHaAreToDecimalHa(record['संयुक्त मोजणी विवरण पत्रानुसार एकूण क्षेत्र (हे.आर)']);
    parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record['संयुक्त मोजणी विवरणपत्रा नुसार संपादित जमिनीचे क्षेत्र (हे.आर)']);
    parsed.approved_rate_per_hectare = parseNumeric(record['संपादित जमिनीचे निश्चित केलेले दर प्रति हेक्टरी (र.रू)']);
    parsed.market_value = parseNumeric(record['संपादित जमिनीचे येणारे मुल्य (र.रू)']);
    parsed.factor_value = parseNumeric(record['सहायक संचालक नगर रचना पालघर यांचेकडील पत्र दि. 23/02/2024 रोजीचे पत्रान्वये गांवास येणारा घटक - 2 हिशोबित करून येणारे मुल्यांकन र.रू.']);
    parsed.forest_trees_count = parseNumeric(record['वनझाडे संख्या']);
    parsed.forest_trees_amount = parseNumeric(record['वनझाडे किंमत रू.']);
    parsed.fruit_trees_count = parseNumeric(record['फळझाडे संख्या']);
    parsed.fruit_trees_amount = parseNumeric(record['फळझाडे किंमत रू.']);
    parsed.solatium = parseNumeric(record['100% सोलेशियम (दिलासा रक्कम) (सेक्शन 30 (1) RFCT-LARR 2013 अनुसूची 1 अ.क्र. 5']);
    parsed.interest_12percent = parseNumeric(record['20 A अधिसूचना दिनांका पासुन ते निवाडा घोषित दिनांकापर्यत जमिनीचे वाढीव मोबदला 12% प्रमाणे प्रति वर्ष (सेक्शन 30 (3) RFCT-LARR - 2013 अनुसूची 1 अ.क्र. 8, कलम 26 (1) व 26 (2) मधील तरतुदीनुसार) (दि. 10/10/2023 ते दि. 05/02/2025 पर्यत ) (कालावधी 484 दिवस)']);
    parsed.subsistence_allowance = parseNumeric(record['प्रति महा रक्कम रुपये 3000/- प्रमाणे एक वर्षाकरिता निर्वाह भत्ता (कलम 3 RFCT-LARR 2013 अनुसुचि 2 अ.क्र. 5)']);
    parsed.additional_allowance_st_sc = parseNumeric(record['अनुसूचित जमाती व अनुसूचित जाती करिता अतिरिक्त निर्वाह भत्ता (कलम 3 RFCT-LARR 2013 अनुसुचि 2 अ.क्र. 5)']);
    parsed.resettlement_assistance = parseNumeric(record['बाधित कुटुंबास पुनर्वसनाकरिता आर्थिक सहाय प्रति कुटुबास रु. 50,000 (कलम 3 RFCT-LARR 2013 अनुसुचि 2 अ.क्र. 10)']);
    parsed.total_compensation = parseNumeric(record['एकूण मोबदला']);
    parsed.deduction = parseNumeric(record['वजाती']);
    parsed.net_payable = parseNumeric(record['निव्वळ देय रक्कम']);
    parsed.remarks = record['शेरा'] || record.remarks || '';
    parsed.compensation_distribution = record['मोबदला वाटप तपशिल'] || record.compensation_distribution || '';
    parsed.arbitration_remark = record['मध्यस्थी संबंधी टिप्पणी (Arbitration Remark)'] || record.arbitration_remark || '';
    parsed.compensation_distribution_status = record['मोबदला वाटप तपशिल'] || record.compensation_distribution_status || 'PENDING';
  } else {
    // Default mapping if no template match (use English keys if present)
    Object.keys(parsed).forEach(key => {
      parsed[key] = record[key] || parsed[key];
    });
    parsed.total_land_area_ha = parseHaAreToDecimalHa(record.total_land_area_ha || record['गांव नमुना 7/12 नुसार जमिनीचे क्षेत्र हे.आर']);
    parsed.acquired_land_area_ha = parseHaAreToDecimalHa(record.acquired_land_area_ha || record['संपादित जमिनीचे क्षेत्र हेक्टर आर']) || convertSqmToHa(record['संपादित जमिनीचे क्षेत्र चौ.मी']);
    parsed.village = record['गांव'] || record.village || '';
    parsed.taluka = record['तालुका'] || record.taluka || '';
    parsed.district = record['जिल्हा'] || record.district || '';
  }

  // Fallback: derive net_payable if missing using total_compensation - deduction
  if ((parsed.net_payable === 0 || parsed.net_payable === undefined) && parsed.total_compensation && parsed.deduction) {
    const np = parseNumeric(parsed.total_compensation) - parseNumeric(parsed.deduction);
    if (!isNaN(np)) parsed.net_payable = np;
  }

  return parsed;
};

export default {
  parseRecord,
  parseHaAreToDecimalHa,
  parseNumeric,
  convertSqmToHa
};