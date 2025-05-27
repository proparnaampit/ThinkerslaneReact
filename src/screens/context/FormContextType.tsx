import React, {createContext, useContext, useState} from 'react';

const FormContext = createContext<any | undefined>(undefined);

export const FormProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [formData, setFormData] = useState<any>({images: []});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const updateFormData = (section: string, data: any) => {
    setFormData((prev: any) => {
      const existingSection = prev[section] || {};
      return {
        ...prev,
        [section]: {
          ...existingSection,
          ...data,
        },
      };
    });
  };

  const resetFormData = () => {
    setFormData({images: []});
    setCurrentStep(1);
  };

  const addImage = (newImages: any[]) => {
    setFormData((prev: any) => {
      const currentImages = Array.isArray(prev.images) ? prev.images : [];
      const uniqueImages = newImages.filter(
        newImg =>
          !currentImages.some(
            (existingImg: any) => existingImg.id === newImg.id,
          ),
      );
      const updatedImages = [...currentImages, ...uniqueImages];

      return {...prev, images: updatedImages};
    });
  };

  const removeImage = (id: string) => {
    setFormData((prev: any) => {
      const currentImages = Array.isArray(prev.images) ? prev.images : [];
      const updatedImages = currentImages.filter((img: any) => img.id !== id);
      return {...prev, images: updatedImages};
    });
  };

  const replaceImage = (id: string, newImage: any) => {
    setFormData((prev: any) => {
      const currentImages = Array.isArray(prev.images) ? prev.images : [];
      const updatedImages = currentImages.map((img: any) =>
        img.id === id ? newImage : img,
      );
      return {...prev, images: updatedImages};
    });
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const previousStep = () => setCurrentStep(prev => prev - 1);

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

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used inside FormProvider');
  }
  return context;
};
