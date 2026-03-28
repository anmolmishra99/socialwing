import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/app/firebase';

// Collection name for notice templates
const NOTICE_TEMPLATES_COLLECTION = 'noticeTemplates';

/**
 * Save a new notice template to Firebase
 * @param {Object} templateData - The template data to save
 * @param {string} userId - The user ID who is creating the template
 * @returns {Promise<string>} - The ID of the created template
 */
export const saveNoticeTemplate = async (templateData, userId) => {
  try {
    const template = {
      ...templateData,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    };

    const docRef = await addDoc(collection(db, NOTICE_TEMPLATES_COLLECTION), template);
    return docRef.id;
  } catch (error) {
    console.error('Error saving notice template:', error);
    throw new Error('Failed to save notice template');
  }
};

/**
 * Load all notice templates from Firebase
 * @param {string} userId - Optional user ID to filter templates by creator
 * @returns {Promise<Array>} - Array of notice templates
 */
export const loadNoticeTemplates = async (userId = null) => {
  try {
    let q = query(
      collection(db, NOTICE_TEMPLATES_COLLECTION),
    );

    if (userId) {
      q = query(
        collection(db, NOTICE_TEMPLATES_COLLECTION),
      );
    }

    const querySnapshot = await getDocs(q);
    const templates = [];
    
    querySnapshot.forEach((doc) => {
      templates.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return templates;
  } catch (error) {
    console.error('Error loading notice templates:', error);
    throw new Error('Failed to load notice templates');
  }
};

/**
 * Update an existing notice template
 * @param {string} templateId - The ID of the template to update
 * @param {Object} updateData - The data to update
 * @param {string} userId - The user ID who is updating the template
 * @returns {Promise<void>}
 */
export const updateNoticeTemplate = async (templateId, updateData, userId) => {
  try {
    const templateRef = doc(db, NOTICE_TEMPLATES_COLLECTION, templateId);
    
    const updatedData = {
      ...updateData,
      updatedBy: userId,
      updatedAt: serverTimestamp()
    };

    await updateDoc(templateRef, updatedData);
  } catch (error) {
    console.error('Error updating notice template:', error);
    throw new Error('Failed to update notice template');
  }
};

/**
 * Delete a notice template (soft delete by setting isActive to false)
 * @param {string} templateId - The ID of the template to delete
 * @param {string} userId - The user ID who is deleting the template
 * @returns {Promise<void>}
 */
export const deleteNoticeTemplate = async (templateId, userId) => {
  try {
    const templateRef = doc(db, NOTICE_TEMPLATES_COLLECTION, templateId);
    
    await updateDoc(templateRef, {
      isActive: false,
      deletedBy: userId,
      deletedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting notice template:', error);
    throw new Error('Failed to delete notice template');
  }
};

/**
 * Load land record templates from Firebase
 * @returns {Promise<Array>} - Array of land record templates
 */
export const loadLandRecordTemplates = async () => {
  try {
    const q = query(
      collection(db, 'landRecordTemplate'),
      where("isActive", "==", true)
    );

    const querySnapshot = await getDocs(q);
    const templates = [];
    
    querySnapshot.forEach((doc) => {
      templates.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log("Template", templates)

    return templates;
  } catch (error) {
    console.error('Error loading land record templates:', error);
    throw new Error('Failed to load land record templates');
  }
};

/**
 * Get available fields from land records
 * @param {Array} landRecords - Array of land record documents
 * @returns {Array} - Array of unique field names
 */
export const extractAvailableFields = (landRecords) => {
  if (!landRecords || landRecords.length === 0) {
    return [];
  }

  const fieldSet = new Set();
  
  landRecords.forEach(record => {
    Object.keys(record).forEach(key => {
      // Exclude system fields
      if (!['id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'].includes(key)) {
        fieldSet.add(key);
      }
    });
  });

  return Array.from(fieldSet).sort();
};

/**
 * Validate notice template data
 * @param {Object} templateData - The template data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateNoticeTemplate = (templateData) => {
  const errors = [];

  if (!templateData.templateName || templateData.templateName.trim() === '') {
    errors.push('Template name is required');
  }

  if (!templateData.landRecordTemplateId) {
    errors.push('Land record template selection is required');
  }

  if (!templateData.selectedFields || templateData.selectedFields.length === 0) {
    errors.push('At least one field selection is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};