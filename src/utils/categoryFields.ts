import type {
  InfoField,
  InfoFieldType,
  VariantField,
} from '../screens/merchandise/shared/merchandiseOptions';

// Parses the `get-category-fields` response:
//   specification_fields -> product information fields
//   variant_attributes   -> variant fields (saved under key `attr_<id>`)
//   size_chart_*         -> size chart table

export interface SizeChartColumn {
  key: string;
  label: string;
  unit: string;
}

export interface SizeChart {
  columns: SizeChartColumn[];
  rows: Array<Record<string, any>>;
}

export interface CategoryConfig {
  infoFields: InfoField[];
  variantFields: VariantField[];
  sizeChart: SizeChart | null;
}

export const EMPTY_CONFIG: CategoryConfig = {
  infoFields: [],
  variantFields: [],
  sizeChart: null,
};

const toBool = (v: any) => v === true || v === 1 || v === '1' || v === 'true';

const byOrder = (a: any, b: any) =>
  Number(a.display_order || 0) - Number(b.display_order || 0);

const toOptionItems = (raw: any): {value: string; label: string}[] => {
  if (Array.isArray(raw)) {
    return raw
      .map((o: any) =>
        typeof o === 'object' && o !== null
          ? {
              value: String(o.option_value ?? o.value ?? o.option_label ?? ''),
              label: String(o.option_label ?? o.label ?? o.option_value ?? ''),
            }
          : {value: String(o), label: String(o)},
      )
      .filter(o => o.label);
  }
  // { "1": "Yes", "0": "No" }
  if (raw && typeof raw === 'object') {
    return Object.keys(raw).map(k => ({value: k, label: String(raw[k])}));
  }
  return [];
};

const toType = (fieldType: any, hasOptions: boolean): InfoFieldType => {
  const t = String(fieldType || 'text').toLowerCase();
  if (['dropdown', 'select', 'list'].includes(t) || hasOptions) {
    return 'select';
  }
  if (['textarea', 'longtext'].includes(t)) {
    return 'textarea';
  }
  if (['yesno', 'boolean', 'radio', 'checkbox'].includes(t)) {
    return 'yesno';
  }
  return 'text';
};

const toField = (f: any) => {
  const optionItems = toOptionItems(f.options);
  const type = toType(f.field_type ?? f.type, optionItems.length > 0);
  return {
    label: String(f.label || f.slug || ''),
    type,
    required: toBool(f.is_required),
    optionItems: optionItems.length ? optionItems : undefined,
    options: optionItems.length ? optionItems.map(o => o.label) : undefined,
  };
};

export const parseCategoryConfig = (response: any): CategoryConfig => {
  if (!response || response.status === 'error') {
    return EMPTY_CONFIG;
  }

  const active = (list: any) =>
    (Array.isArray(list) ? list : [])
      .filter(f => f && toBool(f.is_active ?? 1))
      .sort(byOrder);

  const infoFields: InfoField[] = active(response.specification_fields).map(
    (f: any) => ({...toField(f), key: String(f.slug || f.id)}),
  );

  const variantFields: VariantField[] = active(response.variant_attributes).map(
    (f: any, i: number) => {
      const base = toField(f);
      return {
        ...base,
        type: base.type === 'select' ? 'select' : 'text',
        key: `attr_${f.id}`,
        slug: String(f.slug || f.id),
        // first two attributes build the variant title, e.g. "6 / Red"
        inTitle: i < 2,
      } as VariantField;
    },
  );

  let sizeChart: SizeChart | null = null;
  const hasChart =
    toBool(response.has_size_chart) &&
    Array.isArray(response.size_chart_matrix) &&
    response.size_chart_matrix.length > 0;
  if (hasChart) {
    const columns: SizeChartColumn[] = active(response.size_chart_fields).map(
      (c: any) => ({
        key: String(c.field_slug),
        label: String(c.field_label || c.field_slug),
        unit: String(c.unit || ''),
      }),
    );
    sizeChart = {columns, rows: response.size_chart_matrix};
  }

  return {infoFields, variantFields, sizeChart};
};
