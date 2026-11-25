import React, {createContext, useContext, useState} from 'react';

export interface VariantImage {
  id: string;
  name: string;
  mimeType: string;
  base64: string;
  /** Set for images already saved on the server (edit mode). */
  serverId?: number;
}

export interface Variant {
  id: string;
  /** Dynamic fields, depend on the product type (color, size, capacity...). */
  attributes: Record<string, string>;
  sku: string;
  price: string;
  stock: string;
  images: VariantImage[];
  /** Edit mode: id of the saved variant on the server. */
  serverId?: number;
  barcode?: string;
  weight?: number;
  /** Edit mode: raw server row, mapped to `attributes` once the fields load. */
  raw?: Record<string, any>;
}

const MerchandiseContext = createContext<any | undefined>(undefined);

const initialData = {
  information: {},
  productInfo: {} as Record<string, string>,
  seo: {} as Record<string, string>,
  variants: [] as Variant[],
};

export const MerchandiseProvider: React.FC<{
  children: React.ReactNode;
  initialValues?: any;
}> = ({children, initialValues}) => {
  const startData = initialValues || initialData;
  const [formData, setFormData] = useState<any>(startData);
  const [currentStep, setCurrentStep] = useState(1);
  // null = variant list, 'new' = adding, <id> = editing that variant
  const [variantEditor, setVariantEditor] = useState<string | null>(null);

  const updateInformation = (data: any) =>
    setFormData((prev: any) => ({
      ...prev,
      information: {...prev.information, ...data},
    }));

  const updateProductInfo = (data: Record<string, string>) =>
    setFormData((prev: any) => ({
      ...prev,
      productInfo: {...prev.productInfo, ...data},
    }));

  const updateSeo = (data: Record<string, string>) =>
    setFormData((prev: any) => ({...prev, seo: {...prev.seo, ...data}}));

  // Also drops the edited size chart: it belongs to the previous category.
  const clearProductInfo = () =>
    setFormData((prev: any) => ({
      ...prev,
      productInfo: {},
      sizeChartRows: undefined,
    }));

  const setSizeChartRows = (rows: Array<Record<string, any>>) =>
    setFormData((prev: any) => ({...prev, sizeChartRows: rows}));

  const saveVariant = (variant: Variant) =>
    setFormData((prev: any) => {
      const exists = prev.variants.some((v: Variant) => v.id === variant.id);
      return {
        ...prev,
        variants: exists
          ? prev.variants.map((v: Variant) =>
              v.id === variant.id ? variant : v,
            )
          : [...prev.variants, variant],
      };
    });

  const removeVariant = (id: string) =>
    setFormData((prev: any) => ({
      ...prev,
      variants: prev.variants.filter((v: Variant) => v.id !== id),
    }));

  const setVariants = (variants: Variant[]) =>
    setFormData((prev: any) => ({...prev, variants}));

  const clearVariants = () =>
    setFormData((prev: any) => ({...prev, variants: []}));

  const goToStep = (step: number) => setCurrentStep(step);
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const previousStep = () => setCurrentStep(prev => Math.max(1, prev - 1));

  const resetFormData = () => {
    setFormData(startData);
    setCurrentStep(1);
    setVariantEditor(null);
  };

  return (
    <MerchandiseContext.Provider
      value={{
        formData,
        updateInformation,
        updateProductInfo,
        clearProductInfo,
        setSizeChartRows,
        updateSeo,
        goToStep,
        saveVariant,
        removeVariant,
        clearVariants,
        setVariants,
        currentStep,
        nextStep,
        previousStep,
        variantEditor,
        setVariantEditor,
        resetFormData,
      }}>
      {children}
    </MerchandiseContext.Provider>
  );
};

export const useMerchandiseContext = () => {
  const context = useContext(MerchandiseContext);
  if (!context) {
    throw new Error(
      'useMerchandiseContext must be used inside MerchandiseProvider',
    );
  }
  return context;
};
