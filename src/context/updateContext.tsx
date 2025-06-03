import React, {createContext, useContext, useState} from 'react';

// Define the structure of the form data
interface FormData {
  information: {
    isbnNumber?: string;
    productName?: string;
    shortDescription?: string;
    longDescription?: string;
    resourceType?: string;
    language?: string;
    publisher?: string;
    status?: string;
    category?: string;
    subCategory?: string;
    authorName?: string;
  };
  pricing: {
    price?: string;
    offered_price?: string;
  };
  product: {
    quantity?: string;
    width?: string;
    height?: string;
    length?: string;
    binding?: string;
    weight?: string;
  };
  seo: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string;
    promotionUrl?: string;
  };
  images: Array<{
    id: string;
    name: string;
    mimeType: string;
    base64: string;
  }>;
}

// Define the context type
interface FormContextType {
  formData: FormData;
  updateFormData: (
    section: keyof FormData,
    data: Partial<FormData[keyof FormData]>,
  ) => void;
  addImage: (
    newImages: Array<{
      id: string;
      name: string;
      mimeType: string;
      base64: string;
    }>,
  ) => void;
  removeImage: (id: string) => void;
  replaceImage: (
    id: string,
    newImage: {id: string; name: string; mimeType: string; base64: string},
  ) => void;
  currentStep: number;
  nextStep: () => void;
  previousStep: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  resetFormData: () => void;
}

// Create the context with an undefined default value
const FormContext = createContext<FormContextType | undefined>(undefined);

// FormProvider component
export const UpdateProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>({
    information: {},
    pricing: {},
    product: {},
    seo: {},
    images: [],
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const updateFormData = (
    section: keyof FormData,
    data: Partial<FormData[keyof FormData]>,
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const addImage = (
    newImages: Array<{
      id: string;
      name: string;
      mimeType: string;
      base64: string;
    }>,
  ) => {
    setFormData(prev => {
      const currentImages = Array.isArray(prev.images) ? prev.images : [];
      const uniqueImages = newImages.filter(
        newImg =>
          !currentImages.some(existingImg => existingImg.id === newImg.id),
      );
      const updatedImages = [...currentImages, ...uniqueImages];
      return {...prev, images: updatedImages};
    });
  };

  const removeImage = (id: string) => {
    setFormData(prev => {
      const updatedImages = prev.images.filter(img => img.id !== id);
      return {...prev, images: updatedImages};
    });
  };

  const replaceImage = (
    id: string,
    newImage: {id: string; name: string; mimeType: string; base64: string},
  ) => {
    setFormData(prev => {
      const updatedImages = prev.images.map(img =>
        img.id === id ? newImage : img,
      );
      return {...prev, images: updatedImages};
    });
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const previousStep = () => setCurrentStep(prev => prev - 1);

  const resetFormData = () => {
    setFormData({
      information: {},
      pricing: {},
      product: {},
      seo: {},
      images: [],
    });
    setCurrentStep(1);
    setLoading(false);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        addImage,
        removeImage,
        replaceImage,
        currentStep,
        nextStep,
        previousStep,
        loading,
        setLoading,
        resetFormData,
      }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the context
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
