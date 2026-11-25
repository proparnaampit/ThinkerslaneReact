import type {Variant} from '../../context/MerchandiseContext';
import {TOP_LEVEL_SLUGS, slugify} from '../shared/merchandiseConstants';

const BASE_URL = 'https://thinkerslane.com/';

const toUrl = (p?: string | null) =>
  !p ? '' : /^https?:/i.test(p) ? p : BASE_URL + p.replace(/^\//, '');

// Builds the wizard's starting data from a product of the list API (edit mode).
export const buildInitialValues = (item: any) => {
  const images: any[] = Array.isArray(item.images) ? item.images : [];

  console.log('edit image', item);
  const rows: any[] = Array.isArray(item.variants) ? item.variants : [];
  const seo = item.seo || {};

  const variants: Variant[] = rows.map((v, idx) => {
    const own = images.filter(
      im =>
        (im.variant_id != null && String(im.variant_id) === String(v.id)) ||
        (im.variant_sku && im.variant_sku === v.sku),
    );
    // Images that belong to no variant are shown on the first one.
    const orphan =
      idx === 0
        ? images.filter(
            im =>
              !rows.some(
                r =>
                  (im.variant_id != null &&
                    String(im.variant_id) === String(r.id)) ||
                  (im.variant_sku && im.variant_sku === r.sku),
              ),
          )
        : [];
    return {
      id: String(v.id),
      serverId: Number(v.id),
      attributes: {},
      raw: v,
      sku: v.sku || '',
      price: v.variant_price != null ? String(v.variant_price) : '',
      stock: v.quantity != null ? String(v.quantity) : '',
      barcode: v.barcode || '',
      weight: Number(v.weight) || 0,
      images: [...own, ...orphan].map(im => ({
        id: `srv_${im.id}`,
        serverId: Number(im.id),
        name: im.image_url,
        mimeType: 'image/jpeg',
        base64: toUrl(im.full_image_url || im.image_url),
      })),
    };
  });

  return {
    information: {
      productName: item.name || '',
      productType: String(item.category_id ?? ''),
      productTypeName: item.category_name || '',
      subType: item.product_type || '',
      subTypeId: (() => {
        const sid = item.subcategory_id ?? item.sub_category_id;
        return Number(sid) > 0 ? String(sid) : '';
      })(),
      shortDescription: item.short_description || '',
      longDescription: item.long_description || '',
      price: item.price != null ? String(item.price) : '',
      offeredPrice:
        Number(item.offered_price) > 0 ? String(item.offered_price) : '',
      isActive: String(item.status ?? 'active').toLowerCase() !== 'inactive',
    },
    // Some fields are stored as top-level columns (gender, age_group, ...) and
    // may not come back inside `attributes`, so merge them in. Keys are matched
    // loosely against the category fields on the Product Information step.
    productInfo: (() => {
      const info: Record<string, any> = {};
      TOP_LEVEL_SLUGS.forEach(slug => {
        const v = item[slug.replace(/-/g, '_')];
        if (v != null && v !== '') {
          info[slug] = v;
        }
      });
      const yn = (v: any) =>
        v == null
          ? undefined
          : Number(v) === 1 || v === true || v === 'yes'
          ? 'yes'
          : 'no';
      if (yn(item.is_customizable)) {
        info['is-customizable'] = yn(item.is_customizable);
        info.customizable = yn(item.is_customizable);
      }
      if (yn(item.is_limited_edition)) {
        info['limited-edition'] = yn(item.is_limited_edition);
        info['is-limited-edition'] = yn(item.is_limited_edition);
      }
      let attrs = item.attributes;
      if (Array.isArray(attrs)) {
        const obj: Record<string, any> = {};
        attrs.forEach((a: any) => {
          const k = a?.slug ?? a?.key ?? a?.name ?? a?.label;
          if (k != null) {
            obj[k] = a?.value ?? a?.attribute_value;
          }
        });
        attrs = obj;
      }
      if (attrs && typeof attrs === 'object') {
        Object.keys(attrs).forEach(k => {
          if (attrs[k] != null && attrs[k] !== '') {
            info[k] = attrs[k];
          }
        });
      }
      return info;
    })(),
    // Edit mode: start from the chart saved with the product.
    sizeChartRows:
      Array.isArray(item.size_chart) && item.size_chart.length > 0
        ? item.size_chart.map((r: any) => {
            const {
              id,
              merchandise_product_id,
              created_at,
              updated_at,
              ...rest
            } = r;
            return rest;
          })
        : undefined,
    seo: {
      seoTitle: seo.seo_title || '',
      seoDescription: seo.seo_description || '',
      slug: slugify(item.name || ''),
      ogTitle: seo.og_title || '',
      ogDescription: seo.og_description || '',
      keywords: seo.keywords || seo.keyword || '',
      promotionUrl: seo.promotion_url || '',
    },
    variants,
  };
};

// Saved text can be HTML-encoded and wrapped in tags
// ("<div>&lt;strong&gt;..."), so decode it and strip the tags for the inputs.
export const cleanText = (s: any) => {
  if (s == null) {
    return '';
  }
  let t = String(s);
  for (let i = 0; i < 3; i++) {
    t = t
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;|&apos;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(div|p)>/gi, '\n')
      .replace(/<[^>]+>/g, '');
  }
  return t.trim();
};

// Overlays the `editMarchentProduct` response onto the list item, giving the
// same shape buildInitialValues / onSubmit already use. Anything the edit API
// does not return (variants, images, seo, size chart) stays from the list item.
export const mergeEditDetails = (item: any, d: any) => {
  if (!d) {
    return item;
  }
  const p = d.product || {};
  const m = d.merchandise || {};

  const attributes: Record<string, any> = {};
  let custom: any = m.custom_attributes;
  if (typeof custom === 'string') {
    try {
      custom = JSON.parse(custom);
    } catch {
      custom = null;
    }
  }
  if (custom && typeof custom === 'object') {
    Object.assign(attributes, custom);
  }
  (Array.isArray(d.specification_fields) ? d.specification_fields : []).forEach(
    (f: any) => {
      const v = f.current_option_value ?? f.current_value;
      if (f.slug && v != null && v !== '') {
        attributes[f.slug] = v;
      }
    },
  );

  // Older products have no specification_fields; their values are in
  // `attribute_values` (keyed by slug, e.g. age_group).
  if (d.attribute_values && typeof d.attribute_values === 'object') {
    Object.keys(d.attribute_values).forEach(k => {
      const v = d.attribute_values[k];
      if (v != null && v !== '' && attributes[k] === undefined) {
        attributes[k] = v;
      }
    });
  }
  Object.keys(attributes).forEach(k => {
    if (typeof attributes[k] === 'string') {
      attributes[k] = cleanText(attributes[k]);
    }
  });

  const pick = (key: string) =>
    Array.isArray(d[key]) && d[key].length > 0 ? {[key]: d[key]} : {};

  // Category: use the saved ids. Some products only carry the subcategory as
  // `product_type` (e.g. "t-shirt" or "tshirt"), with subcategory_id = 0 and
  // sometimes no category either, so look it up in the category tree.
  let categoryId = Number(d.category_id) > 0 ? Number(d.category_id) : 0;
  let categoryName = d.category_name || '';
  let subId = Number(d.subcategory_id ?? m.subcategory_id) || 0;
  let subName = d.subcategory_name || '';
  if (!subId) {
    const flat = (s: any) =>
      String(s ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
    const wanted = flat(d.product_type ?? m.product_type);
    const map = d.categories?.subcategories_map || {};
    const parents: any[] = d.categories?.parents || [];
    // Known category: only its own subcategories. Unknown: search them all.
    const parentIds = categoryId ? [String(categoryId)] : Object.keys(map);
    parentIds.forEach(parentId => {
      (map[parentId] || []).forEach((s: any) => {
        if (
          !subId &&
          wanted &&
          (flat(s.slug) === wanted || flat(s.name) === wanted)
        ) {
          subId = Number(s.id);
          subName = s.name;
          if (!categoryId) {
            categoryId = Number(parentId);
            categoryName =
              parents.find(c => String(c.id) === String(parentId))?.name || '';
          }
        }
      });
    });
  }
  if (!categoryId) {
    categoryId = Number(item.category_id) || 0;
    categoryName = categoryName || item.category_name || '';
    subId = subId || Number(item.subcategory_id ?? item.sub_category_id) || 0;
    subName = subName || item.subcategory_name || '';
  }

  return {
    ...item,
    product_id: d.product_id ?? item.product_id ?? item.id,
    name: p.name ?? item.name,
    short_description: cleanText(p.short_description ?? item.short_description),
    long_description: cleanText(p.description ?? item.long_description),
    price: p.price ?? item.price,
    offered_price: p.offered_price ?? item.offered_price,
    category_id: categoryId,
    category_name: categoryName,
    subcategory_id: subId,
    subcategory_name: subName,
    gender: m.gender,
    age_group: m.age_group,
    material: m.material,
    fabric: m.fabric,
    fit_type: m.fit_type,
    care_instructions: cleanText(m.care_instructions),
    country_of_origin: m.country_of_origin,
    manufacturer: m.manufacturer,
    personalization_info: cleanText(m.personalization_info),
    is_customizable: m.is_customizable,
    is_limited_edition: m.is_limited_edition,
    attributes,
    ...pick('variants'),
    ...pick('images'),
    ...pick('size_chart'),
    ...(d.seo && typeof d.seo === 'object' ? {seo: d.seo} : {}),
  };
};
