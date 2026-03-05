export interface WidgetCustomization {
  primaryColor: string;
  secondaryColor?: string;
  buttonText: string;
  logoUrl?: string;
  headerText?: string;
  footerText?: string;
}

export interface Widget {
  id: string;
  name: string;
  templateId: string;
  apiKey: string;
  allowedDomains: string[];
  customization: WidgetCustomization;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
