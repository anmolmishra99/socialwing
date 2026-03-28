import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Download, 
  Eye,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { storage, db } from '@/app/firebase';
import { toast } from 'react-hot-toast';

const KycDocumentDialog = ({ isOpen, onClose, record, onDocumentsUpdated }) => {
  const [uploadingDocuments, setUploadingDocuments] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState(record?.documents || []);
  const [documentVerified, setDocumentVerified] = useState(record?.document_verified || false);
  const [documentTypeUploading, setDocumentTypeUploading] = useState({});
  const fileInputRefs = useRef({});

  // List of required documents in both Marathi and English
  const requiredDocuments = [
    {
      id: 'land_record_7_12',
      marathi: 'संबंधित जमिनीचा ७/१२ उतारा',
      english: '7/12 Extract (Land Record) of the concerned land',
      required: false
    },
    {
      id: 'identity_proof',
      marathi: 'अर्जदाराचा ओळखपत्र (प्रमाणित प्रत) – मतदान कार्ड / पॅनकार्ड / आधारकार्ड / ड्रायव्हिंग लायसन्स इ.',
      english: 'Applicant\'s Identity Proof (attested copy) – Voter ID / PAN Card / Aadhaar Card / Driving License, etc.',
      required: false
    },
    {
      id: '8a_extract',
      marathi: '८अ उतारा (जर लागू असेल तर)',
      english: '8A Extract (if applicable)',
      required: false
    },
    {
      id: 'consent_letter',
      marathi: '७/१२ वर असलेल्या इतर हक्कधारकांची सहमतीपत्र / बँक संस्थेचे ना हरकत प्रमाणपत्र (NOC)',
      english: 'Consent Letter from other co-holders on 7/12 or No Objection Certificate (NOC) from concerned bank/institution',
      required: false
    },
    {
      id: 'consistent_map',
      marathi: '७/१२ शी सुसंगत नकाशा (बदल अथवा नवीन नोंदीसाठी)',
      english: 'Map consistent with 7/12 (for name change or new entry)',
      required: false
    },
    {
      id: 'request_letter',
      marathi: 'विनंती पत्र (Letter of Request / Application)',
      english: 'Application / Request Letter',
      required: false
    },
    {
      id: 'bank_details',
      marathi: 'राष्ट्रकृत बँकेचा (Nationalized Bank) मुख्य शाखेचा छायाप्रत (Cancelled Cheque किंवा Passbook ची प्रत)',
      english: 'Copy of Nationalized Bank\'s passbook or cancelled cheque',
      required: false
    },
    {
      id: 'co_owner_consent',
      marathi: 'इतर हक्कधारकांकडून मिळालेले लेखी संमतीपत्र (Written Consent of Co-holders)',
      english: 'Written Consent Letter from other co-owners (if any)',
      required: false
    },
    {
      id: 'survey_report',
      marathi: 'सर्वेक्षण विभागाने नोंदवलेले निरीक्षण अहवाल (Survey/Inspection Report, if applicable)',
      english: 'Survey or Inspection Report (if applicable)',
      required: false
    },
    {
      id: 'applicant_photo',
      marathi: 'अर्जदाराचा पासपोर्ट साईज फोटो',
      english: 'Passport-size photograph of the applicant',
      required: false
    },
    {
      id: 'address_proof',
      marathi: 'अर्जदाराचा पत्ता पुरावा (Address Proof)',
      english: 'Address proof of the applicant',
      required: false
    },
    {
      id: 'death_certificate',
      marathi: 'लागू असल्यास मृत व्यक्तीचा मृत्यू दाखला (Death Certificate, if applicable)',
      english: 'Death Certificate (if the applicant is successor of deceased person)',
      required: false
    },
    {
      id: 'department_certificate',
      marathi: '८अ फॉर्मसाठी आवश्यक असल्यास संबंधित खात्याचे प्रमाणपत्र (Concerned Department Certificate for 8A form)',
      english: 'Certificate from concerned department (if required for 8A form)',
      required: false
    },
    {
      id: 'notarized_affidavit',
      marathi: 'नोटरीकृत हलफनामा (Notarized Affidavit, wherever required)',
      english: 'Notarized Affidavit (as required)',
      required: false
    }
  ];

  const handleFileUpload = async (documentType, files) => {
    if (!files || files.length === 0) return;

    // Mark this document type as uploading
    setDocumentTypeUploading(prev => ({ ...prev, [documentType]: true }));
    
    const newUploadingDocs = { ...uploadingDocuments };
    const newProgress = { ...uploadProgress };

    Array.from(files).forEach(file => {
      newUploadingDocs[file.name] = true;
      newProgress[file.name] = 0;
    });

    setUploadingDocuments(newUploadingDocs);
    setUploadProgress(newProgress);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          const fileName = `${Date.now()}_${file.name}`;
          const storageRef = ref(storage, `kyc-documents/${record.id}/${documentType}/${fileName}`);
          
          // Create upload task with progress tracking
          const uploadTask = uploadBytes(storageRef, file);
          
          // Simulate progress (Firebase doesn't provide upload progress easily)
          let progress = 0;
          const progressInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 90) {
              clearInterval(progressInterval);
            }
            setUploadProgress(prev => ({ ...prev, [file.name]: Math.min(progress, 90) }));
          }, 200);

          await uploadTask;
          clearInterval(progressInterval);
          
          const downloadURL = await getDownloadURL(storageRef);
          
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

          return {
            name: file.name,
            type: documentType,
            url: downloadURL,
            uploadedAt: new Date(),
            uploadedBy: record.id,
            size: file.size,
            documentId: documentType
          };
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          throw error;
        }
      });

      const uploadedDocs = await Promise.all(uploadPromises);
      
      // Update Firebase with new documents immediately
      const recordRef = doc(db, 'landRecord', record.id);
      await updateDoc(recordRef, {
        documents: arrayUnion(...uploadedDocs),
        document_verified: false, // Reset verification when new documents are uploaded
        last_document_upload: new Date(),
        documents_uploaded: true
      });

      // Update local state
      setUploadedDocuments(prev => [...prev, ...uploadedDocs]);
      
      // Clear uploading state
      const clearedUploading = { ...uploadingDocuments };
      const clearedProgress = { ...uploadProgress };
      
      Array.from(files).forEach(file => {
        delete clearedUploading[file.name];
        delete clearedProgress[file.name];
      });
      
      setUploadingDocuments(clearedUploading);
      setUploadProgress(clearedProgress);
      
      // Clear document type uploading state
      setDocumentTypeUploading(prev => ({ ...prev, [documentType]: false }));

      toast.success('Documents uploaded successfully!');
      
      // Notify parent component
      if (onDocumentsUpdated) {
        onDocumentsUpdated();
      }
      
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Failed to upload documents');
      
      // Clear uploading state on error
      const clearedUploading = { ...uploadingDocuments };
      const clearedProgress = { ...uploadProgress };
      
      Array.from(files).forEach(file => {
        delete clearedUploading[file.name];
        delete clearedProgress[file.name];
      });
      
      setUploadingDocuments(clearedUploading);
      setUploadProgress(clearedProgress);
      
      // Clear document type uploading state on error
      setDocumentTypeUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const handleDocumentVerifiedToggle = async () => {
    try {
      const newVerifiedStatus = !documentVerified;
      setDocumentVerified(newVerifiedStatus);
      
      const recordRef = doc(db, 'landRecord', record.id);
      await updateDoc(recordRef, {
        document_verified: newVerifiedStatus,
        payment_slip_generate: false // Reset payment slip generation when verification changes
      });

      toast.success(`Documents ${newVerifiedStatus ? 'verified' : 'unverified'} successfully!`);
      
      // Notify parent component
      if (onDocumentsUpdated) {
        onDocumentsUpdated();
      }
      
    } catch (error) {
      console.error('Error updating document verification status:', error);
      toast.error('Failed to update verification status');
      // Revert state on error
      setDocumentVerified(!documentVerified);
    }
  };

  const handleSaveAndClose = async () => {
    try {
      // Update kycCompleted status when saving
      const recordRef = doc(db, 'landRecord', record.id);
      await updateDoc(recordRef, {
        kycCompleted: true,
        document_verified: false, // Reset verification for officer review
        payment_slip_generate: false // Ensure payment slip generation is false initially
      });

      toast.success('KYC documents saved successfully! Documents sent for verification.');
      
      // Notify parent component
      if (onDocumentsUpdated) {
        onDocumentsUpdated();
      }
      
      // Close dialog
      onClose();
      
    } catch (error) {
      console.error('Error saving KYC documents:', error);
      toast.error('Failed to save KYC documents');
    }
  };

  const getDocumentsByType = (documentType) => {
    return uploadedDocuments.filter(doc => doc.documentId === documentType);
  };

  const handleViewDocument = (url) => {
    window.open(url, '_blank');
  };

  const handleDeleteDocument = async (document) => {
    try {
      // Delete from Firebase Storage
      const storageRef = ref(storage, document.url);
      await deleteObject(storageRef);

      // Remove from Firestore
      const recordRef = doc(db, 'landRecord', record.id);
      const updatedDocuments = uploadedDocuments.filter(doc => doc.url !== document.url);
      
      await updateDoc(recordRef, {
        documents: updatedDocuments
      });

      // Update local state
      setUploadedDocuments(updatedDocuments);
      
      toast.success('Document deleted successfully!');
      
      // Notify parent component
      if (onDocumentsUpdated) {
        onDocumentsUpdated();
      }
      
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl">KYC Document Upload</DialogTitle>
              <DialogDescription>
                Upload required documents for {record?.owner_name || 'Land Owner'}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Verification Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Document Verification Status</h3>
                <p className="text-sm text-gray-600">
                  Mark documents as verified once all required documents are uploaded and reviewed
                </p>
              </div>
              <Button
                variant={documentVerified ? "default" : "outline"}
                onClick={handleDocumentVerifiedToggle}
                className={documentVerified ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {documentVerified ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Documents Verified
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Mark as Verified
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Documents</h3>
            
            {requiredDocuments.map((docType) => {
              const existingDocs = getDocumentsByType(docType.id);
              const isUploading = Object.keys(uploadingDocuments).some(fileName => 
                existingDocs.some(doc => doc.name === fileName)
              );

              return (
                <div key={docType.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{docType.marathi}</h4>
                      <p className="text-sm text-gray-600">{docType.english}</p>
                      {!docType.required && (
                        <Badge variant="secondary" className="mt-1">Optional</Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRefs.current[docType.id]?.click()}
                      disabled={documentTypeUploading[docType.id]}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {documentTypeUploading[docType.id] ? 'Uploading...' : 'Upload'}
                    </Button>
                    <Input
                      ref={el => fileInputRefs.current[docType.id] = el}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      multiple
                      onChange={(e) => handleFileUpload(docType.id, e.target.files)}
                    />
                  </div>

                  {/* Upload Progress */}
                  {Object.keys(uploadingDocuments).map(fileName => (
                    uploadingDocuments[fileName] && (
                      <div key={fileName} className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{fileName}</span>
                          <span>{Math.round(uploadProgress[fileName] || 0)}%</span>
                        </div>
                        <Progress value={uploadProgress[fileName] || 0} className="h-2" />
                      </div>
                    )
                  ))}

                  {/* Existing Documents */}
                  {existingDocs.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Uploaded Documents:</h5>
                      {existingDocs.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(doc.uploadedAt).toLocaleDateString()} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDocument(doc.url)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteDocument(doc)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSaveAndClose} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save & Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KycDocumentDialog;