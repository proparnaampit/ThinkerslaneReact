import React, {createContext, useContext, useState} from 'react';

const UpdateContext = createContext(undefined);

export const UpdateProvider = ({children}) => {
  const [formData, setFormData] = useState({images: []});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const updateFormData = (section, data) => {
    setFormData(prev => {
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

  const addImage = newImages => {
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

  const removeImage = id => {
    setFormData(prev => {
      const currentImages = Array.isArray(prev.images) ? prev.images : [];
      const updatedImages = currentImages.filter(img => img.id !== id);
      return {...prev, images: updatedImages};
    });
  };

  const replaceImage = (id, newImage) => {
    setFormData(prev => {
      const currentImages = Array.isArray(prev.images) ? prev.images : [];
      const updatedImages = currentImages.map(img =>
        img.id === id ? newImage : img,
      );
      return {...prev, images: updatedImages};
    });
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const previousStep = () => setCurrentStep(prev => prev - 1);

  return (
    <UpdateContext.Provider
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
    </UpdateContext.Provider>
  );
};

export const useUpdateContext = () => {
  const context = useContext(UpdateContext);
  if (!context) {
    throw new Error('useUpdateContext must be used inside UpdateProvider');
  }
  return context;
};
