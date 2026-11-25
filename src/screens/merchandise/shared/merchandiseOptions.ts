// Static config for the merchandise flow.
// Product types (categories) + sub types, and the variant fields each
// type/sub type needs. Replace with API data when the backend is ready.

export type FieldType = 'select' | 'text' | 'number';

export interface VariantField {
  key: string;
  /** API slug (dynamic fields), used as the key in the upload payload. */
  slug?: string;
  label: string;
  type: FieldType;
  options?: string[];
  /** Dynamic (API) options: `value` is stored, `label` is shown. */
  optionItems?: {value: string; label: string}[];
  required?: boolean;
  placeholder?: string;
  /** Show this value in the variant title (e.g. "Black / M"). */
  inTitle?: boolean;
}

export const DESCRIPTION_MAX = 500;

export const PRODUCT_TYPES = [
  {
    id: 'clothing',
    name: 'Clothing / Wear',
    subTypes: [
      'T-shirts',
      'Shirts',
      'Pants / Trousers',
      'Jeans',
      'Shorts',
      'Jackets',
      'Hoodies',
      'Sweatshirts',
      'Dresses',
      'Skirts',
      'Traditional Wear',
    ],
  },
  {
    id: 'footwear',
    name: 'Footwear',
    subTypes: [
      'Sneakers',
      'Sports Shoes',
      'Formal Shoes',
      'Casual Shoes',
      'Sandals',
      'Slippers',
      'Boots',
      'Heels',
      'Flats',
    ],
  },
  {
    id: 'bags',
    name: 'Bags',
    subTypes: [
      'Backpacks',
      'Handbags',
      'Shoulder Bags',
      'Sling Bags',
      'Tote Bags',
      'Laptop Bags',
      'Travel Bags',
      'Wallets',
      'Clutches',
      'Gym Bags',
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subTypes: [
      'Belts',
      'Caps',
      'Sunglasses',
      'Watches',
      'Wallets',
      'Scarves',
      'Gloves',
      'Jewellery',
    ],
  },
  {
    id: 'innerwear',
    name: 'Innerwear',
    subTypes: ['Underwear', 'Boxers', 'Bras', 'Vests', 'Socks', 'Thermals'],
  },
  {
    id: 'sportswear',
    name: 'Sportswear',
    subTypes: [
      'Sports T-shirts',
      'Track Pants',
      'Sports Shorts',
      'Jerseys',
      'Gym Wear',
      'Yoga Wear',
    ],
  },
];

const COLORS = [
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Grey',
  'Brown',
  'Pink',
  'Navy',
  'Multicolor',
];

const color: VariantField = {
  key: 'color',
  label: 'Color',
  type: 'select',
  options: COLORS,
  required: true,
  inTitle: true,
};

const apparelSize: VariantField = {
  key: 'size',
  label: 'Size',
  type: 'select',
  options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  required: true,
  inTitle: true,
};

const footwearSize: VariantField = {
  key: 'size',
  label: 'Size (UK/India)',
  type: 'select',
  options: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  required: true,
  inTitle: true,
};

// Default variant fields per product type.
const TYPE_FIELDS: Record<string, VariantField[]> = {
  clothing: [color, apparelSize],
  footwear: [color, footwearSize],
  bags: [
    color,
    {
      key: 'bagSize',
      label: 'Bag Size',
      type: 'select',
      options: ['Small', 'Medium', 'Large'],
      required: true,
      inTitle: true,
    },
    {
      key: 'capacity',
      label: 'Capacity (Litres)',
      type: 'number',
      placeholder: 'e.g. 25',
    },
  ],
  accessories: [color],
  innerwear: [
    color,
    {...apparelSize, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']},
  ],
  sportswear: [color, apparelSize],
};

// Sub type overrides where the generic type fields do not fit.
const SUB_TYPE_FIELDS: Record<string, VariantField[]> = {
  'bags:Wallets': [color],
  'bags:Clutches': [color],
  'accessories:Belts': [
    color,
    {
      key: 'size',
      label: 'Waist Size (inches)',
      type: 'select',
      options: ['28', '30', '32', '34', '36', '38', '40', '42'],
      required: true,
      inTitle: true,
    },
  ],
  'accessories:Caps': [
    color,
    {
      key: 'size',
      label: 'Size',
      type: 'select',
      options: ['Free Size', 'S', 'M', 'L'],
      required: true,
      inTitle: true,
    },
  ],
  'accessories:Sunglasses': [
    color,
    {
      key: 'frameType',
      label: 'Frame Type',
      type: 'select',
      options: ['Aviator', 'Wayfarer', 'Round', 'Square', 'Cat-eye'],
      inTitle: true,
    },
  ],
  'accessories:Watches': [
    color,
    {
      key: 'strapMaterial',
      label: 'Strap Material',
      type: 'select',
      options: ['Leather', 'Metal', 'Silicone', 'Fabric'],
      required: true,
      inTitle: true,
    },
  ],
  'accessories:Wallets': [color],
  'accessories:Scarves': [color],
  'accessories:Gloves': [
    color,
    {
      key: 'size',
      label: 'Size',
      type: 'select',
      options: ['S', 'M', 'L', 'XL'],
      required: true,
      inTitle: true,
    },
  ],
  'accessories:Jewellery': [
    {
      key: 'metal',
      label: 'Metal / Material',
      type: 'select',
      options: ['Gold', 'Silver', 'Rose Gold', 'Platinum', 'Brass', 'Stainless Steel', 'Other'],
      required: true,
      inTitle: true,
    },
    {
      key: 'size',
      label: 'Size (optional)',
      type: 'text',
      placeholder: 'e.g. 7 (ring), 18" (chain)',
    },
  ],
  'innerwear:Bras': [
    color,
    {
      key: 'size',
      label: 'Band / Cup Size',
      type: 'text',
      placeholder: 'e.g. 34B',
      required: true,
      inTitle: true,
    },
  ],
  'innerwear:Socks': [
    color,
    {
      key: 'size',
      label: 'Size',
      type: 'select',
      options: ['Free Size', 'S', 'M', 'L'],
      required: true,
      inTitle: true,
    },
  ],
  'innerwear:Underwear': [
    color,
    {
      key: 'size',
      label: 'Waist Size (inches)',
      type: 'select',
      options: ['28', '30', '32', '34', '36', '38', '40'],
      required: true,
      inTitle: true,
    },
  ],
  'innerwear:Boxers': [
    color,
    {
      key: 'size',
      label: 'Waist Size (inches)',
      type: 'select',
      options: ['28', '30', '32', '34', '36', '38', '40'],
      required: true,
      inTitle: true,
    },
  ],
  'clothing:Pants / Trousers': [
    color,
    {
      key: 'size',
      label: 'Waist Size (inches)',
      type: 'select',
      options: ['28', '30', '32', '34', '36', '38', '40', '42'],
      required: true,
      inTitle: true,
    },
  ],
  'clothing:Jeans': [
    color,
    {
      key: 'size',
      label: 'Waist Size (inches)',
      type: 'select',
      options: ['28', '30', '32', '34', '36', '38', '40', '42'],
      required: true,
      inTitle: true,
    },
  ],
  'clothing:Traditional Wear': [
    color,
    apparelSize,
  ],
};

export const getVariantFields = (
  productType?: string,
  subType?: string,
): VariantField[] => {
  if (!productType) {
    return [color];
  }
  return (
    SUB_TYPE_FIELDS[`${productType}:${subType}`] ||
    TYPE_FIELDS[productType] || [color]
  );
};

export const getSubTypes = (productType?: string): string[] =>
  PRODUCT_TYPES.find(t => t.id === productType)?.subTypes || [];

export const getProductTypeName = (productType?: string) =>
  PRODUCT_TYPES.find(t => t.id === productType)?.name || '-';

/** "Black / M" style title built from the fields flagged inTitle. */
export const getVariantTitle = (
  attributes: Record<string, string>,
  fields: VariantField[],
) => {
  const parts = fields
    .filter(f => f.inTitle && attributes[f.key])
    .map(f => attributes[f.key]);
  return parts.length ? parts.join(' / ') : 'Variant';
};

// ---------------------------------------------------------------------------
// Information page (step 2): product details that differ per product type.
// ---------------------------------------------------------------------------

export type InfoFieldType = 'select' | 'text' | 'textarea' | 'yesno';

export interface InfoField {
  key: string;
  label: string;
  type: InfoFieldType;
  options?: string[];
  /** Dynamic (API) options: `value` is stored, `label` is shown. */
  optionItems?: {value: string; label: string}[];
  placeholder?: string;
  required?: boolean;
}

const gender: InfoField = {
  key: 'gender',
  label: 'Gender',
  type: 'select',
  options: ['Men', 'Women', 'Unisex', 'Boys', 'Girls'],
};
const ageGroup: InfoField = {
  key: 'ageGroup',
  label: 'Age Group',
  type: 'select',
  options: ['Adults', 'Teens', 'Kids', 'Infants'],
};
const material: InfoField = {
  key: 'material',
  label: 'Material',
  type: 'text',
  placeholder: 'e.g. 100% Cotton',
};
const fabric: InfoField = {
  key: 'fabric',
  label: 'Fabric',
  type: 'text',
  placeholder: 'e.g. Combed Cotton / Bio-washed',
};
const fitType: InfoField = {
  key: 'fitType',
  label: 'Fit Type',
  type: 'select',
  options: ['Regular', 'Slim', 'Relaxed', 'Oversized', 'Skinny', 'Tapered'],
};
const country: InfoField = {
  key: 'countryOfOrigin',
  label: 'Country of Origin',
  type: 'text',
  placeholder: 'e.g. India',
};
const manufacturer: InfoField = {
  key: 'manufacturer',
  label: 'Manufacturer',
  type: 'text',
  placeholder: 'e.g. ABC Apparel',
};
const careInstructions: InfoField = {
  key: 'careInstructions',
  label: 'Care Instructions',
  type: 'textarea',
  placeholder: 'e.g. Machine wash cold, do not bleach, tumble dry low',
};
const isCustomizable: InfoField = {
  key: 'isCustomizable',
  label: 'Is Customizable?',
  type: 'yesno',
  required: true,
};
const limitedEdition: InfoField = {
  key: 'limitedEdition',
  label: 'Limited Edition?',
  type: 'yesno',
  required: true,
};
const personalization: InfoField = {
  key: 'personalizationInfo',
  label: 'Personalization Information',
  type: 'textarea',
  placeholder: 'e.g. Name printing available on back, custom text up to 15 characters',
};

const closingFields = [
  careInstructions,
  isCustomizable,
  limitedEdition,
  personalization,
];

const TYPE_INFO_FIELDS: Record<string, InfoField[]> = {
  clothing: [
    gender,
    ageGroup,
    material,
    fabric,
    fitType,
    country,
    manufacturer,
    ...closingFields,
  ],
  footwear: [
    gender,
    ageGroup,
    {...material, label: 'Upper Material', placeholder: 'e.g. Genuine Leather'},
    {
      key: 'soleMaterial',
      label: 'Sole Material',
      type: 'text',
      placeholder: 'e.g. Rubber',
    },
    {
      key: 'closureType',
      label: 'Closure Type',
      type: 'select',
      options: ['Lace-up', 'Slip-on', 'Velcro', 'Buckle', 'Zip'],
    },
    country,
    manufacturer,
    ...closingFields,
  ],
  bags: [
    gender,
    material,
    {
      key: 'closureType',
      label: 'Closure Type',
      type: 'select',
      options: ['Zip', 'Flap', 'Magnetic Snap', 'Drawstring', 'Buckle'],
    },
    {
      key: 'compartments',
      label: 'Number of Compartments',
      type: 'text',
      placeholder: 'e.g. 3',
    },
    {key: 'waterResistant', label: 'Water Resistant?', type: 'yesno'},
    country,
    manufacturer,
    ...closingFields,
  ],
  accessories: [
    gender,
    ageGroup,
    material,
    country,
    manufacturer,
    ...closingFields,
  ],
  innerwear: [
    gender,
    ageGroup,
    material,
    fabric,
    fitType,
    country,
    manufacturer,
    ...closingFields,
  ],
  sportswear: [
    gender,
    ageGroup,
    material,
    fabric,
    fitType,
    {
      key: 'sportType',
      label: 'Sport / Activity',
      type: 'text',
      placeholder: 'e.g. Running, Yoga, Football',
    },
    country,
    manufacturer,
    ...closingFields,
  ],
};

const SUB_TYPE_INFO_FIELDS: Record<string, InfoField[]> = {
  'accessories:Watches': [
    gender,
    ageGroup,
    {
      key: 'displayType',
      label: 'Display Type',
      type: 'select',
      options: ['Analog', 'Digital', 'Analog-Digital', 'Smart'],
    },
    {
      key: 'movement',
      label: 'Movement',
      type: 'select',
      options: ['Quartz', 'Automatic', 'Mechanical', 'Solar'],
    },
    {
      key: 'caseMaterial',
      label: 'Case Material',
      type: 'text',
      placeholder: 'e.g. Stainless Steel',
    },
    {key: 'waterResistant', label: 'Water Resistant?', type: 'yesno'},
    country,
    manufacturer,
    ...closingFields,
  ],
  'accessories:Sunglasses': [
    gender,
    ageGroup,
    {
      key: 'lensType',
      label: 'Lens Type',
      type: 'select',
      options: ['Polarized', 'UV Protected', 'Mirrored', 'Gradient', 'Photochromic'],
    },
    {
      key: 'frameMaterial',
      label: 'Frame Material',
      type: 'text',
      placeholder: 'e.g. Acetate',
    },
    country,
    manufacturer,
    ...closingFields,
  ],
};

export const getInfoFields = (
  productType?: string,
  subType?: string,
): InfoField[] =>
  SUB_TYPE_INFO_FIELDS[`${productType}:${subType}`] ||
  TYPE_INFO_FIELDS[productType || ''] || [
    material,
    country,
    manufacturer,
    ...closingFields,
  ];
