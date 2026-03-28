import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { parseRecord } from './recordParser';

// Generate notice content for a land record with template-based field selection
export const generateNoticeContent = (record, selectedFields = [], template = null) => {
  // Parse the record using the utility function
  const parsedRecord = parseRecord(record);
  
  // Helper function to get field value from parsed record
  const getFieldValue = (fieldName) => {
    if (!fieldName || !parsedRecord) return 'N/A';
    
    // Handle nested object properties
    if (fieldName.includes('.')) {
      const keys = fieldName.split('.');
      let value = parsedRecord;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined || value === null) return 'N/A';
      }
      return value;
    }
    
    // Try both original field name and parsed field name
    return parsedRecord[fieldName] || record[fieldName] || 'N/A';
  };

  // Extract key information for header - prioritize owner name
  const ownerName = parsedRecord.owner_name || getFieldValue('खातेदाराचे_नांव') || getFieldValue('ownerName') || 'N/A';
  const village = parsedRecord.village || getFieldValue('गांव') || getFieldValue('village') || 'N/A';
  const surveyNumber = parsedRecord.survey_number || getFieldValue('स.नं./हि.नं./ग.नं.') || getFieldValue('surveyNumber') || 'N/A';
  const acquiredArea = parsedRecord.acquired_land_area_ha || getFieldValue('संपादित_जमिनीचे_क्षेत्र') || 'N/A';
  const landClass = parsedRecord.land_class || getFieldValue('जमिनीचा_प्रकार') || 'कृषी';
  const remarks = parsedRecord.remarks || getFieldValue('शेरा') || '-';

  return `
    <div style="font-family: 'Noto Sans Devanagari', Arial, sans-serif; max-width: 210mm; margin: 0 auto; padding: 15mm; background: white; font-size: 12px; line-height: 1.4;">
      <!-- Header Section -->
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
          <div style="width: 50px; height: 50px; margin-right: 15px;">
            <!-- Government Emblem Placeholder -->
            <div style="width: 50px; height: 50px; border: 1px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px;">
              महाराष्ट्र
            </div>
          </div>
          <div>
            <h1 style="font-size: 18px; font-weight: bold; margin: 0; color: #000;">महाराष्ट्र शासन</h1>
            <h2 style="font-size: 14px; font-weight: bold; margin: 5px 0; color: #000;">उपजिल्हाधिकारी (भूसंपादन) सदर भूसंपादन पालघर यांचे कार्यालय</h2>
          </div>
        </div>
        <div style="font-size: 11px; margin-top: 10px;">
          <p style="margin: 2px 0;">कार्यालयीन पत्ता: जिल्हा कलेक्टर कार्यालय, पालघर - ४०१४०४</p>
          <p style="margin: 2px 0;">दूरध्वनी: ०२५२५-२५२५२५ | ई-मेल: collectorate.palghar@maharashtra.gov.in</p>
        </div>
      </div>

      <!-- Notice Title -->
      <div style="text-align: center; margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: bold; margin: 0; text-decoration: underline;">
          भूमि संपादन अधिनियम १८९४ चे कलम ४ अन्वये सूचना
        </h3>
        <p style="font-size: 12px; margin: 5px 0;">(भूमि संपादन अधिनियम १८९४ चे कलम ४ अन्वये प्रकाशित सूचना क्रमांक ११/२०२३)</p>
      </div>

      <!-- Owner Name Prominently Displayed -->
      <div style="text-align: center; margin-bottom: 20px; padding: 10px; border: 2px solid #000; background-color: #f9f9f9;">
        <h3 style="font-size: 16px; font-weight: bold; margin: 0; color: #000;">
          प्रिय श्री/श्रीमती ${ownerName}
        </h3>
        <p style="font-size: 12px; margin: 5px 0;">गाव: ${village}, सर्वे नं: ${surveyNumber}</p>
      </div>

      <!-- Main Content -->
      <div style="margin-bottom: 20px;">
        <p style="margin-bottom: 15px; text-align: justify;">
          प्रिय भूमिधारक, सरकारी कामासाठी खालील नमूद केलेल्या भूमीचे संपादन करण्याचा प्रस्ताव आहे. 
          या संदर्भात भूमि संपादन अधिनियम १८९४ चे कलम ४ अन्वये ही सूचना प्रकाशित करण्यात येत आहे.
        </p>
      </div>

      <!-- Land Details Table -->
      <div style="margin-bottom: 25px;">
        <h4 style="font-size: 14px; font-weight: bold; margin-bottom: 10px; text-align: center; text-decoration: underline;">
          भूमि विवरण तक्ता
        </h4>
        
        <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 11px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">अ.क्र.</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">गाव</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">सर्वे नं./हिस्सा नं./गट नं.</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">खातेदाराचे नाव</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">क्षेत्रफळ (हेक्टर)</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">वर्गीकरण</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">शेरा</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">१</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${village}</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${surveyNumber}</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${ownerName}</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${acquiredArea}</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${landClass}</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${remarks}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Selected Fields Table (if template is used) -->
      ${selectedFields && selectedFields.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h4 style="font-size: 14px; font-weight: bold; margin-bottom: 10px; text-align: center; text-decoration: underline;">
            संपूर्ण तपशील
          </h4>
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 10px;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">अ.क्र.</th>
                <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">तपशील</th>
                <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">माहिती</th>
              </tr>
            </thead>
            <tbody>
              ${selectedFields.map((field, index) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 6px; text-align: center;">${index + 1}</td>
                  <td style="border: 1px solid #000; padding: 6px; font-weight: bold;">${field}</td>
                  <td style="border: 1px solid #000; padding: 6px;">${getFieldValue(field)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- Instructions Section -->
      <div style="margin-bottom: 25px;">
        <h4 style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">सूचना:</h4>
        <ol style="margin-left: 20px; line-height: 1.6;">
          <li>वरील भूमीच्या संपादनास कोणताही हरकत असल्यास तो कारणासह लिखित स्वरूपात या कार्यालयात सादर करावा.</li>
          <li>हरकत दाखल करण्याची मुदत या सूचनेच्या प्रकाशनापासून ३० दिवस आहे.</li>
          <li>मुदतीनंतर प्राप्त झालेल्या हरकती विचारात घेतल्या जाणार नाहीत.</li>
          <li>संबंधित भूमिधारकांनी आवश्यक कागदपत्रांसह या कार्यालयात संपर्क साधावा.</li>
          <li>या सूचनेची प्रत संबंधित गावातील ग्रामपंचायत कार्यालयात उपलब्ध आहे.</li>
        </ol>
      </div>

      <!-- Project Details -->
      <div style="margin-bottom: 25px; border: 1px solid #000; padding: 15px;">
        <h4 style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">प्रकल्पाचे तपशील:</h4>
        <p><strong>प्रकल्पाचे नाव:</strong> ${getFieldValue('प्रकल्पाचे_नाव') || 'सार्वजनिक विकास प्रकल्प'}</p>
        <p><strong>प्रकल्पाचा उद्देश:</strong> ${getFieldValue('प्रकल्पाचा_उद्देश') || 'सार्वजनिक सुविधा विकास'}</p>
        <p><strong>अंदाजित खर्च:</strong> ${getFieldValue('अंदाजित_खर्च') || 'निर्धारित केले जाईल'}</p>
      </div>

      <!-- Footer Section -->
      <div style="margin-top: 40px;">
        <div style="display: flex; justify-content: space-between; align-items: end;">
          <div>
            <p style="margin: 0;"><strong>दिनांक:</strong> ${new Date().toLocaleDateString('hi-IN')}</p>
            <p style="margin: 5px 0 0 0;"><strong>स्थान:</strong> पालघर</p>
          </div>
          <div style="text-align: center;">
            <div style="margin-bottom: 60px;">
              <p style="margin: 0; font-size: 10px;">(सही)</p>
            </div>
            <p style="margin: 0; font-weight: bold;">उपजिल्हाधिकारी</p>
            <p style="margin: 0;">भूमि संपादन विभाग, पालघर</p>
            <p style="margin: 0;">जिल्हा पालघर</p>
          </div>
        </div>
      </div>

      <!-- Reference Number -->
      <div style="margin-top: 20px; text-align: center; border-top: 1px solid #000; padding-top: 10px;">
        <p style="margin: 0; font-size: 10px;">
          <strong>संदर्भ क्रमांक:</strong> भूसं/पाल/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
        </p>
      </div>
    </div>
  `;
};

// Generate complete HTML document for PDF conversion with improved styling
export const generatePDFReadyHTML = (content, title) => {
  return `
    <!DOCTYPE html>
    <html lang="hi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        
        body { 
          font-family: 'Noto Sans Devanagari', Arial, sans-serif; 
          margin: 0; 
          padding: 0;
          line-height: 1.4; 
          color: #000;
          background: white;
          font-size: 12px;
        }
        
        .notice-container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          padding: 0;
        }
        
        .header-section {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
        }
        
        .government-emblem {
          width: 50px;
          height: 50px;
          border: 1px solid #000;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          margin-right: 15px;
          vertical-align: middle;
        }
        
        .header-text {
          display: inline-block;
          vertical-align: middle;
        }
        
        .main-title {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
          color: #000;
        }
        
        .sub-title {
          font-size: 14px;
          font-weight: bold;
          margin: 5px 0;
          color: #000;
        }
        
        .contact-info {
          font-size: 11px;
          margin-top: 10px;
        }
        
        .notice-title {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .notice-heading {
          font-size: 16px;
          font-weight: bold;
          margin: 0;
          text-decoration: underline;
        }
        
        .notice-reference {
          font-size: 12px;
          margin: 5px 0;
        }
        
        .content-section {
          margin-bottom: 20px;
          text-align: justify;
        }
        
        .table-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
          text-decoration: underline;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #000;
          font-size: 11px;
          margin-bottom: 25px;
        }
        
        .data-table th,
        .data-table td {
          border: 1px solid #000;
          padding: 8px;
          text-align: center;
        }
        
        .data-table th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        
        .instructions-section {
          margin-bottom: 25px;
        }
        
        .instructions-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .instructions-list {
          margin-left: 20px;
          line-height: 1.6;
        }
        
        .project-details {
          margin-bottom: 25px;
          border: 1px solid #000;
          padding: 15px;
        }
        
        .footer-section {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          align-items: end;
        }
        
        .signature-area {
          text-align: center;
        }
        
        .signature-space {
          margin-bottom: 60px;
        }
        
        .reference-number {
          margin-top: 20px;
          text-align: center;
          border-top: 1px solid #000;
          padding-top: 10px;
          font-size: 10px;
        }
        
        @media print { 
          body { 
            margin: 0; 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .notice-container {
            max-width: none;
            margin: 0;
          }
          
          .data-table th {
            background-color: #f0f0f0 !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="notice-container">
        ${content}
      </div>
    </body>
    </html>
  `;
};

// Download single notice as PDF file
export const downloadSingleNotice = (record, selectedFields = [], template = null) => {
  try {
    const content = generateNoticeContent(record, selectedFields, template);
    
    // Create new jsPDF instance with A4 size
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Create a temporary div to render HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(tempDiv);

    // Use html2canvas to convert HTML to canvas, then to PDF
    import('html2canvas').then(html2canvas => {
      html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if content is longer than one page
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Clean up
        document.body.removeChild(tempDiv);

        // Download the PDF
        const ownerName = record.owner_name || record['खातेदाराचे_नांव'] || 'notice';
        const fileName = `notice_${ownerName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
        pdf.save(fileName);
      }).catch(error => {
        console.error('Error generating PDF:', error);
        document.body.removeChild(tempDiv);
        // Fallback to HTML download
        fallbackToHTMLDownload(record, selectedFields, template);
      });
    }).catch(error => {
      console.error('Error loading html2canvas:', error);
      document.body.removeChild(tempDiv);
      // Fallback to HTML download
      fallbackToHTMLDownload(record, selectedFields, template);
    });

  } catch (error) {
    console.error('Error in downloadSingleNotice:', error);
    // Fallback to HTML download
    fallbackToHTMLDownload(record, selectedFields, template);
  }
};

// Fallback function for HTML download
const fallbackToHTMLDownload = (record, selectedFields = [], template = null) => {
  const content = generateNoticeContent(record, selectedFields, template);
  const html = generatePDFReadyHTML(content, 'भूमि संपादन सूचना');
  
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notice_${record.id || Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Download multiple notices as ZIP file containing PDFs
export const downloadBulkNoticesAsZip = async (records, projectName = 'project', selectedFields = [], template = null) => {
  try {
    const zip = new JSZip();
    const folder = zip.folder(`${projectName}_notices`);
    
    // Process each record and generate PDF
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const content = generateNoticeContent(record, selectedFields, template);
      
      try {
        // Create PDF for each record
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Create temporary div for HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = '210mm';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(tempDiv);

        // Convert HTML to canvas and then to PDF
        const html2canvas = await import('html2canvas');
        const canvas = await html2canvas.default(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Clean up
        document.body.removeChild(tempDiv);

        // Get PDF as blob and add to ZIP
        const pdfBlob = pdf.output('blob');
        const ownerName = record.owner_name || record['खातेदाराचे_नांव'] || `record_${i + 1}`;
        const fileName = `notice_${ownerName.replace(/[^a-zA-Z0-9]/g, '_')}_${i + 1}.pdf`;
        folder.file(fileName, pdfBlob);

      } catch (error) {
        console.error(`Error generating PDF for record ${i + 1}:`, error);
        // Fallback to HTML for this record
        const html = generatePDFReadyHTML(content, 'भूमि संपादन सूचना');
        const fileName = `notice_${record.id || i + 1}.html`;
        folder.file(fileName, html);
      }
    }
    
    // Generate and download ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}_notices_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error generating bulk notices:', error);
    // Fallback to HTML ZIP
    await downloadBulkNoticesAsHTMLZip(records, projectName, selectedFields, template);
  }
};

// Fallback function for HTML ZIP download
const downloadBulkNoticesAsHTMLZip = async (records, projectName = 'project', selectedFields = [], template = null) => {
  const zip = new JSZip();
  const folder = zip.folder(`${projectName}_notices`);
  
  records.forEach((record, index) => {
    const content = generateNoticeContent(record, selectedFields, template);
    const html = generatePDFReadyHTML(content, 'भूमि संपादन सूचना');
    const fileName = `notice_${record.id || index + 1}.html`;
    folder.file(fileName, html);
  });
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName}_notices_${Date.now()}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Print single notice (updated for new format)
export const printNotice = (record, selectedFields = [], template = null) => {
  const content = generateNoticeContent(record, selectedFields, template);
  const html = generatePDFReadyHTML(content, `Notice ${record.id || 'Document'}`);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};