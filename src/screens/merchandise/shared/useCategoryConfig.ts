import {useMemo} from 'react';
import {useMerchandiseContext} from '../../context/MerchandiseContext';
import {
  useGetCategoryFieldsQuery,
  useGetAllMerchantCategoryQuery,
} from '../../../services/merchandiseService';
import {parseCategoryConfig} from '../../../utils/categoryFields';

/**
 * Dynamic fields + size chart for the category/subcategory picked on step 1.
 * Same query args on every step, so the result is cached after the first load.
 */
export const useCategoryConfig = () => {
  const {formData} = useMerchandiseContext();
  const {productType, subTypeId, subType} = formData.information || {};

  // Fields depend on the category AND the subcategory (e.g. Belts vs Caps).
  // Edit mode: the subcategory id is resolved from its name a moment after
  // load, so wait for it instead of fetching (and hydrating from) the
  // category-level fields.
  // Only wait when that category really has subcategories (a stray name like
  // "clothing" on a category without any must not block loading the fields).
  const {data: tree} = useGetAllMerchantCategoryQuery({});
  const categories: any[] = Array.isArray(tree) ? tree : tree?.data || [];
  const category = categories.find(c => String(c.id) === String(productType));
  const hasSubcategories = (category?.subcategories || []).some(
    (s: any) => s.is_active === '1',
  );
  const waitingForSubId =
    !!subType && !subTypeId && (!tree || hasSubcategories);

  const {data, isFetching, isError, refetch} = useGetCategoryFieldsQuery(
    {categoryId: productType || 0, subcategoryId: subTypeId || 0},
    {skip: !productType || waitingForSubId},
  );

  // The size chart may only be defined on the category, so also load the
  // category-level config (same cached request when there is no subcategory).
  const {data: categoryData} = useGetCategoryFieldsQuery(
    {categoryId: productType || 0, subcategoryId: 0},
    {skip: !productType},
  );

  const config = useMemo(() => parseCategoryConfig(data), [data]);
  const categoryConfig = useMemo(
    () => parseCategoryConfig(categoryData),
    [categoryData],
  );
  const defaultChart = config.sizeChart || categoryConfig.sizeChart;

  // Rows the user added/edited replace the category's default chart rows.
  const editedRows = formData.sizeChartRows;
  const sizeChart = useMemo(() => {
    if (!defaultChart || !editedRows) {
      return defaultChart;
    }
    // Saved rows use underscores (front_length) while the chart columns use
    // slugs with hyphens (front-length). Move each value onto the column key,
    // otherwise those columns show empty.
    const rows = editedRows.map((r: Record<string, any>) => {
      const out = {...r};
      defaultChart.columns.forEach(c => {
        const alt = c.key.replace(/-/g, '_');
        if (alt !== c.key && alt in out) {
          if (out[c.key] == null || out[c.key] === '') {
            out[c.key] = out[alt];
          }
          delete out[alt];
        }
      });
      return out;
    });
    return {...defaultChart, rows};
  }, [defaultChart, editedRows]);
  const sizeChartDefaultCount = defaultChart?.rows.length || 0;
  return {
    ...config,
    sizeChart: sizeChart ?? null,
    sizeChartDefaultCount,
    isFetching,
    isError,
    refetch,
  };
};
