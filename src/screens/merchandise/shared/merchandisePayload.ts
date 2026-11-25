import type {Variant} from '../../context/MerchandiseContext';
import {TOP_LEVEL_SLUGS, slugify} from './merchandiseConstants';

// The API may report success as 200/201, true, or "success".
export const isSuccessResult = (result: any) => {
  const code = Number(result?.status);
  return (
    (code >= 200 && code < 300) ||
    result?.success === true ||
    result?.status === true ||
    String(result?.status).toLowerCase() === 'success'
  );
};

// Payload fields shared by "add" and "update". Update adds product_id and
// delete_images on top. `keptIds` = saved image ids still present in the form.
export const buildBasePayload = (
  formData: any,
  variantFields: any[],
  sizeChart: any,
) => {
  const info = formData.information || {};
  // Dynamic category fields (keyed by API slug), filled on the Product Information step.
  const attributes: Record<string, string> = {...formData.productInfo};

  // Known slugs are also sent as top-level columns (gender -> gender, age-group -> age_group).
  const topLevel: Record<string, any> = {};
  Object.keys(attributes).forEach(slug => {
    if (TOP_LEVEL_SLUGS.includes(slug)) {
      topLevel[slug.replace(/-/g, '_')] = attributes[slug];
    }
  });
  const yesNo = (slugs: string[]) =>
    slugs.some(s => attributes[s] === 'yes') ? 1 : 0;

  const variants = formData.variants.map((v: Variant) => {
    const row: Record<string, any> = {sku: v.sku};
    // attr_<id> -> slug, e.g. { size: "S", colour: "Black" }
    variantFields.forEach(f => {
      row[f.slug || f.key] = v.attributes[f.key] || '';
    });
    return {
      ...(v.serverId ? {id: v.serverId} : {}),
      ...row,
      variant_price: parseFloat(v.price) || 0,
      quantity: parseInt(v.stock, 10) || 0,
      barcode: v.barcode || '',
      weight: v.weight || 0,
      is_active: 1,
      images: [],
    };
  });

  // Product images come from the variants; the first one is primary.
  // Images already saved on the server (serverId) are not uploaded again.
  const keptIds: number[] = formData.variants.flatMap((v: Variant) =>
    v.images.filter(img => img.serverId).map(img => img.serverId as number),
  );
  const hasSaved = keptIds.length > 0;
  let imageIndex = 0;
  const images = formData.variants.flatMap((v: Variant) =>
    v.images
      .filter(img => !img.serverId)
      .map(img => ({
        image_url: img.name,
        image_data: img.base64,
        mime_type: img.mimeType,
        variant_sku: v.sku,
        alt_text: info.productName || '',
        image_type: 'product',
        is_primary: !hasSaved && imageIndex++ === 0 ? 1 : 0,
      })),
  );

  const prices = formData.variants
    .map((v: Variant) => parseFloat(v.price))
    .filter((p: number) => !isNaN(p));

  const payload = {
    offered_price: parseFloat(info.offeredPrice) || 0,
    name: info.productName || '',
    short_description: info.shortDescription || '',
    long_description: info.longDescription || '',
    price: parseFloat(info.price) || (prices.length ? Math.min(...prices) : 0),
    status: info.isActive === false ? 'inactive' : 'active',
    is_active: info.isActive === false ? 0 : 1,
    category_id: Number(info.productType) || 0,
    subcategory_id: Number(info.subTypeId) || 0,
    product_type: slugify(info.subType || info.productTypeName || ''),
    ...topLevel,
    is_customizable: yesNo(['is-customizable', 'customizable']),
    is_limited_edition: yesNo(['limited-edition', 'is-limited-edition']),
    attributes,
    variants,
    size_chart: (sizeChart?.rows || []).filter(
      (r: any) => String(r.size ?? '').trim() !== '',
    ),
    images,
    seo: {
      seo_title: formData.seo?.seoTitle || '',
      seo_description: formData.seo?.seoDescription || '',
      og_title: formData.seo?.ogTitle || '',
      og_description: formData.seo?.ogDescription || '',
      keywords: formData.seo?.keywords || '',
      promotion_url: formData.seo?.promotionUrl || '',
    },
  };
  return {payload, keptIds};
};
