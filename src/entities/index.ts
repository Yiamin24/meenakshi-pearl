/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: contactformsubmissions
 * Interface for ContactFormSubmissions
 */
export interface ContactFormSubmissions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  message?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
}


/**
 * Collection ID: gatedlivingbenefits
 * Interface for GatedLivingBenefits
 */
export interface GatedLivingBenefits {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  benefitTitle?: string;
  /** @wixFieldType text */
  benefitDescription?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  benefitVisual?: string;
  /** @wixFieldType number */
  displayOrder?: number;
  /** @wixFieldType boolean */
  isActive?: boolean;
}


/**
 * Collection ID: infrastructuredetails
 * Interface for InfrastructureDetails
 */
export interface InfrastructureDetails {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  featureName?: string;
  /** @wixFieldType text */
  featureDescription?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  featureIcon?: string;
  /** @wixFieldType number */
  displayOrder?: number;
  /** @wixFieldType boolean */
  isAvailable?: boolean;
}


/**
 * Collection ID: investmenthighlights
 * Interface for InvestmentHighlights
 */
export interface InvestmentHighlights {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  highlightTitle?: string;
  /** @wixFieldType text */
  highlightQuote?: string;
  /** @wixFieldType text */
  emphasizedPhrase?: string;
  /** @wixFieldType number */
  displayOrder?: number;
  /** @wixFieldType text */
  additionalContext?: string;
}


/**
 * Collection ID: legalapprovals
 * Interface for LegalApprovals
 */
export interface LegalApprovals {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  approvalName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType url */
  documentUrl?: string;
  /** @wixFieldType date */
  approvalDate?: Date | string;
  /** @wixFieldType text */
  issuingAuthority?: string;
  /** @wixFieldType boolean */
  isVerified?: boolean;
}


/**
 * Collection ID: plotconfigurations
 * Interface for PlotConfigurations
 */
export interface PlotConfigurations {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  plotName?: string;
  /** @wixFieldType number */
  areaSqFt?: number;
  /** @wixFieldType text */
  dimensions?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  plotImage?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  availabilityStatus?: string;
}


/**
 * Collection ID: projectamenities
 * Interface for ProjectAmenities
 */
export interface ProjectAmenities {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  amenityName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  galleryImage?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType number */
  displayOrder?: number;
}
