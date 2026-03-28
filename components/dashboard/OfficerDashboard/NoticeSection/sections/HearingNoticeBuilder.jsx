import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { FileText, Download, Eye, Copy, Send } from 'lucide-react';

const HearingNoticeBuilder = ({ selectedProject, selectedRecords, landRecords, loading, loadLandRecords }) => {
  const [hearingRecipients, setHearingRecipients] = useState([{ name: '' }]);
  const [hearingPhones, setHearingPhones] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hearingForm, setHearingForm] = useState({
    officeName: 'उपजिल्हाधिकारी (भूसंपादन) सुर्या प्रकल्प, दहाणू',
    officeAddress: 'इराणी रोड, आय.डी.बी.आय. बँकेच्या समोर, ता. दहाणू, जि. पालघर',
    officeEmail: 'desplandacquisition@gmail.com',
    officePhone: '02528-220180',
    refNo: '',
    noticeDate: new Date().toISOString().slice(0, 10),
    projectName: 'रेल्वे उड्डाणपूल प्रकल्प',
    village: '',
    taluka: '',
    district: '',
    surveyNumbers: '',
    ccRecipients: '',
    hearingDate: new Date().toISOString().slice(0, 10),
    hearingTime: '12:30',
    venue: 'उपजिल्हाधिकारी (भूसंपादन) सुर्या प्रकल्प, दहाणू कार्यालय',
    signatoryName: 'संजय सावंत',
    designation: 'उपजिल्हाधिकारी (भूसंपादन)',
    officeFooter: 'सुर्या प्रकल्प, दहाणू',
    required7x12: true,
    requiredId: true,
    requiredPassbook: true,
    linkForSMS: ''
  });

  const updateRecipient = (idx, key, value) => {
    setHearingRecipients(prev => prev.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  };

  const addRecipient = () => setHearingRecipients(prev => [...prev, { name: '' }]);
  
  const removeRecipient = (idx) => setHearingRecipients(prev => prev.filter((_, i) => i !== idx));

  const buildHearingNoticeHTML = () => {
    const recipientsHtml = hearingRecipients
      .filter(r => r.name.trim())
      .map(r => `<div>${r.name}${r.relation ? ` (${r.relation})` : ''}${r.address ? `, ${r.address}` : ''}</div>`)
      .join('');
    const ccHtml = (hearingForm.ccRecipients || '')
      .split(/\n|,/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(name => `<div>${name}</div>`)
      .join('');
    const docs = [];
    if (hearingForm.required7x12) docs.push('जमिनीचा ७/१२ उतारा');
    if (hearingForm.requiredId) docs.push('ओळखपत्र (आधार/मतदार ओळखपत्र/पॅन)');
    if (hearingForm.requiredPassbook) docs.push('राष्ट्रीयकृत बँक पासबुक');
    const docsHtml = docs.map(d => `<li>${d}</li>`).join('');
    const surveyList = (hearingForm.surveyNumbers || '')
      .split(/\n|,/)
      .map(s => s.trim())
      .filter(Boolean)
      .join(', ');

    return `
      <div style="text-align:center; font-weight:700;">महाराष्ट्र शासन</div>
      <div style="text-align:center; margin-top:4px;">${hearingForm.officeName}</div>
      <div style="text-align:center; font-size:12px;">${hearingForm.officeAddress}<br/>Email: ${hearingForm.officeEmail} | दूरध्वनी: ${hearingForm.officePhone}</div>
      <hr/>
      <div style="display:flex; justify-content:space-between; font-size:13px;">
        <div>जा.क्र./भूसंपादन/${hearingForm.projectName}/${hearingForm.refNo || '—'}</div>
        <div>दिनांक: ${hearingForm.noticeDate}</div>
      </div>
      <h3 style="text-align:center; margin:8px 0;">सूचना नोटीस</h3>
      <div style="margin:8px 0;">
        <div style="font-weight:600;">प्रति,</div>
        ${recipientsHtml || '<div>—</div>'}
      </div>
      ${ccHtml ? `<div style="margin:8px 0;"><div style="font-weight:600;">प्रतिलिपी सादरांसाठी:</div>${ccHtml}</div>` : ''}
      <div style="margin:12px 0;">
        विषय: गाव – ${hearingForm.village || '—'}, तालुका – ${hearingForm.taluka || '—'}, जिल्हा – ${hearingForm.district || '—'} येथील स.नं./गट क्र. ${surveyList || '—'} वरील ${hearingForm.projectName} संदर्भात.
      </div>
      <div style="margin:12px 0;">
        वरील विषयानुसार नमूद प्रकरण हे, ${hearingForm.projectName} अंमलबजावणी संदर्भाने भूसंपादन, पुनर्वसन व पुनर्स्थापना कायदा, 2013 चे तरतुदी लागू होत असून संबंधित खातेदारांकडून आक्षेप/मागण्या/कागदपत्रे पडताळणे आवश्यक आहे.
      </div>
      <div style="margin:12px 0; font-weight:600;">
        त्यानुसार, आपण/आपले प्रतिनिधी यांनी दि. ${hearingForm.hearingDate} रोजी वेळ ${hearingForm.hearingTime} वाजता, ${hearingForm.venue} येथे होणाऱ्या सुनावणीस उपस्थित राहावे. अनुपस्थित राहिल्यास, उपलब्ध दाखल्यांच्या आधारे निर्णय घेण्यात येईल व तीच अंतिम मानली जाईल.
      </div>
      ${docsHtml ? `<div style="margin:12px 0;">कृपया खालील कागदपत्रे सोबत आणावीत:<ul>${docsHtml}</ul></div>` : ''}
      <div style="margin-top:24px; text-align:right;">
        <div>(${hearingForm.signatoryName})</div>
        <div>${hearingForm.designation}</div>
        <div>${hearingForm.officeFooter}</div>
      </div>
    `;
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

  const previewHearingNotice = () => {
    setPreviewContent(buildHearingNoticeHTML());
    setIsPreviewOpen(true);
  };

  const downloadHearingNotice = () => {
    const projectName = hearingForm.projectName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const villageName = hearingForm.village.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const surveyNumbers = hearingForm.surveyNumbers.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().replace(/\s+/g, '_');
    
    const filename = `${projectName}_${villageName}_${surveyNumbers}`;
    const htmlContent = buildHearingNoticeHTML();
    const html = generatePDFReadyHTML(htmlContent, 'Hearing Notice');
    
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.info('Hearing notice downloaded as HTML. Use your browser\'s Print function to save as PDF.');
  };

  const saveHearingNoticeToServer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notices/save-custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject,
          landownerId: selectedRecords[0] || undefined,
          noticeNumber: `HEARING-${Date.now()}`,
          noticeDate: hearingForm.noticeDate,
          noticeContent: buildHearingNoticeHTML()
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to save');

      setHearingForm(prev => ({ ...prev, linkForSMS: data.data?.url || prev.linkForSMS }));
      await navigator.clipboard.writeText(data.data?.url || '');
      toast.success('Notice saved. Link copied to clipboard');
    } catch (e) {
      toast.error(e?.message || 'Failed to save notice');
    }
  };

  const copySmsText = async () => {
    const numbers = (hearingPhones || '')
      .split(/\n|,/)
      .map(s => s.trim())
      .filter(Boolean)
      .join(', ');
    const msg = `सूचना: दि. ${hearingForm.hearingDate} रोजी वेळ ${hearingForm.hearingTime} वाजता, ${hearingForm.venue} येथे सुनावणी आहे. कृपया वेळेत उपस्थित रहा. तपशील व नोटीस: ${hearingForm.linkForSMS || ''}`;
    try {
      await navigator.clipboard.writeText(`To: ${numbers}\n${msg}`);
      toast.success('SMS text copied to clipboard');
    } catch {
      toast.error('Failed to copy SMS text');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hearing Notice Builder</CardTitle>
        <CardDescription>Create custom hearing notices for land acquisition proceedings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Office Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="officeName">Office Name</Label>
            <Input
              id="officeName"
              value={hearingForm.officeName}
              onChange={(e) => setHearingForm(prev => ({ ...prev, officeName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="officeAddress">Office Address</Label>
            <Input
              id="officeAddress"
              value={hearingForm.officeAddress}
              onChange={(e) => setHearingForm(prev => ({ ...prev, officeAddress: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="officeEmail">Office Email</Label>
            <Input
              id="officeEmail"
              value={hearingForm.officeEmail}
              onChange={(e) => setHearingForm(prev => ({ ...prev, officeEmail: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="officePhone">Office Phone</Label>
            <Input
              id="officePhone"
              value={hearingForm.officePhone}
              onChange={(e) => setHearingForm(prev => ({ ...prev, officePhone: e.target.value }))}
            />
          </div>
        </div>

        {/* Notice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="refNo">Reference Number</Label>
            <Input
              id="refNo"
              value={hearingForm.refNo}
              onChange={(e) => setHearingForm(prev => ({ ...prev, refNo: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="noticeDate">Notice Date</Label>
            <Input
              id="noticeDate"
              type="date"
              value={hearingForm.noticeDate}
              onChange={(e) => setHearingForm(prev => ({ ...prev, noticeDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={hearingForm.projectName}
              onChange={(e) => setHearingForm(prev => ({ ...prev, projectName: e.target.value }))}
            />
          </div>
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              value={hearingForm.village}
              onChange={(e) => setHearingForm(prev => ({ ...prev, village: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="taluka">Taluka</Label>
            <Input
              id="taluka"
              value={hearingForm.taluka}
              onChange={(e) => setHearingForm(prev => ({ ...prev, taluka: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={hearingForm.district}
              onChange={(e) => setHearingForm(prev => ({ ...prev, district: e.target.value }))}
            />
          </div>
        </div>

        {/* Survey Numbers */}
        <div>
          <Label htmlFor="surveyNumbers">Survey Numbers (comma or newline separated)</Label>
          <Textarea
            id="surveyNumbers"
            value={hearingForm.surveyNumbers}
            onChange={(e) => setHearingForm(prev => ({ ...prev, surveyNumbers: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Recipients */}
        <div>
          <Label>Recipients</Label>
          {hearingRecipients.map((recipient, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <Input
                placeholder="Name"
                value={recipient.name}
                onChange={(e) => updateRecipient(idx, 'name', e.target.value)}
              />
              <Input
                placeholder="Relation (optional)"
                value={recipient.relation || ''}
                onChange={(e) => updateRecipient(idx, 'relation', e.target.value)}
              />
              <Input
                placeholder="Address (optional)"
                value={recipient.address || ''}
                onChange={(e) => updateRecipient(idx, 'address', e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeRecipient(idx)}
                disabled={hearingRecipients.length === 1}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addRecipient}>
            Add Recipient
          </Button>
        </div>

        {/* CC Recipients */}
        <div>
          <Label htmlFor="ccRecipients">CC Recipients (comma or newline separated)</Label>
          <Textarea
            id="ccRecipients"
            value={hearingForm.ccRecipients}
            onChange={(e) => setHearingForm(prev => ({ ...prev, ccRecipients: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Hearing Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="hearingDate">Hearing Date</Label>
            <Input
              id="hearingDate"
              type="date"
              value={hearingForm.hearingDate}
              onChange={(e) => setHearingForm(prev => ({ ...prev, hearingDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="hearingTime">Hearing Time</Label>
            <Input
              id="hearingTime"
              type="time"
              value={hearingForm.hearingTime}
              onChange={(e) => setHearingForm(prev => ({ ...prev, hearingTime: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={hearingForm.venue}
              onChange={(e) => setHearingForm(prev => ({ ...prev, venue: e.target.value }))}
            />
          </div>
        </div>

        {/* Required Documents */}
        <div>
          <Label>Required Documents</Label>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required7x12"
                checked={hearingForm.required7x12}
                onCheckedChange={(checked) => setHearingForm(prev => ({ ...prev, required7x12: checked }))}
              />
              <Label htmlFor="required7x12">7/12 Extract</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiredId"
                checked={hearingForm.requiredId}
                onCheckedChange={(checked) => setHearingForm(prev => ({ ...prev, requiredId: checked }))}
              />
              <Label htmlFor="requiredId">ID Proof (Aadhar/Voter ID/PAN)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiredPassbook"
                checked={hearingForm.requiredPassbook}
                onCheckedChange={(checked) => setHearingForm(prev => ({ ...prev, requiredPassbook: checked }))}
              />
              <Label htmlFor="requiredPassbook">Bank Passbook</Label>
            </div>
          </div>
        </div>

        {/* Signatory Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="signatoryName">Signatory Name</Label>
            <Input
              id="signatoryName"
              value={hearingForm.signatoryName}
              onChange={(e) => setHearingForm(prev => ({ ...prev, signatoryName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              value={hearingForm.designation}
              onChange={(e) => setHearingForm(prev => ({ ...prev, designation: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="officeFooter">Office Footer</Label>
          <Input
            id="officeFooter"
            value={hearingForm.officeFooter}
            onChange={(e) => setHearingForm(prev => ({ ...prev, officeFooter: e.target.value }))}
          />
        </div>

        {/* SMS Section */}
        <div>
          <Label htmlFor="hearingPhones">Phone Numbers for SMS (comma or newline separated)</Label>
          <Textarea
            id="hearingPhones"
            value={hearingPhones}
            onChange={(e) => setHearingPhones(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="linkForSMS">SMS Link</Label>
          <Input
            id="linkForSMS"
            value={hearingForm.linkForSMS}
            onChange={(e) => setHearingForm(prev => ({ ...prev, linkForSMS: e.target.value }))}
            placeholder="Link will be generated after saving notice"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button onClick={previewHearingNotice}>
                <Eye className="w-4 h-4 mr-2" />
                Preview Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Hearing Notice Preview</DialogTitle>
                <DialogDescription>Preview of the generated hearing notice</DialogDescription>
              </DialogHeader>
              <div 
                className="border p-4 bg-white text-black"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </DialogContent>
          </Dialog>

          <Button onClick={downloadHearingNotice}>
            <Download className="w-4 h-4 mr-2" />
            Download HTML
          </Button>

          <Button onClick={saveHearingNoticeToServer}>
            <FileText className="w-4 h-4 mr-2" />
            Save to Server
          </Button>

          <Button onClick={copySmsText}>
            <Copy className="w-4 h-4 mr-2" />
            Copy SMS Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HearingNoticeBuilder;