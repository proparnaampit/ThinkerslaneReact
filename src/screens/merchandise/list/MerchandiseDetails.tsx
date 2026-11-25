import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {FeatherIcon} from '../../../components/common/Icons';
import {PRIMARY, BORDER} from '../shared/css/merchandiseUpload';

const BASE_URL = 'https://thinkerslane.com/';

const toUrl = (p?: string | null) =>
  !p ? null : /^https?:/i.test(p) ? p : BASE_URL + p.replace(/^\//, '');

const label = (k: string) =>
  k.replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase());

const Section: React.FC<{title: string; children: React.ReactNode}> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Row: React.FC<{k: string; v: any}> = ({k, v}) =>
  v === null || v === undefined || v === '' ? null : (
    <View style={styles.kv}>
      <Text style={styles.k}>{k}</Text>
      <Text style={styles.v}>{String(v)}</Text>
    </View>
  );

const MerchandiseDetails: React.FC = () => {
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const item: any = route.params?.item;

  console.log('dfdhf', item);

  const goBack = () => navigation.navigate('Merchandise');

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.k}>Product not found.</Text>
      </View>
    );
  }

  const images: any[] = Array.isArray(item.images) ? item.images : [];

  console.log('image', images);
  const variants: any[] = Array.isArray(item.variants) ? item.variants : [];
  const sizeChart: any[] = Array.isArray(item.size_chart)
    ? item.size_chart
    : [];
  const attrs = item.attributes || {};
  const hero = toUrl(item.primary_image_url || item.primary_image);
  const active = String(item.status).toLowerCase() === 'active';

  const chartCols = sizeChart.length
    ? Object.keys(sizeChart[0]).filter(
        c =>
          ![
            'id',
            'merchandise_product_id',
            'unit',
            'created_at',
            'updated_at',
            'size',
          ].includes(c) && sizeChart.some(r => Number(r[c]) > 0),
      )
    : [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{padding: 14, paddingBottom: 30}}>
      <TouchableOpacity
        style={styles.back}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={goBack}>
        <FeatherIcon name="arrow-left" size={24} color="#111" />
      </TouchableOpacity>
      {hero && <Image source={{uri: hero}} style={styles.hero} />}

      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>${item.price}</Text>
        {Number(item.offered_price) > 0 && (
          <Text style={styles.offer}>Offer: ${item.offered_price}</Text>
        )}
        <Text style={[styles.badge, active ? styles.on : styles.off]}>
          {String(item.status)}
        </Text>
      </View>

      <Section title="General">
        <Row k="Product ID" v={item.product_id} />
        <Row k="Type" v={item.product_type} />
        <Row k="Category" v={item.category_name} />
        <Row k="Subcategory" v={item.subcategory_name} />
        <Row k="Total stock" v={item.total_stock} />
        <Row k="Variants" v={item.variants_count} />
        <Row k="Images" v={item.images_count} />
        <Row k="Short description" v={item.short_description} />
        <Row k="Description" v={item.long_description} />
      </Section>

      {Object.keys(attrs).length > 0 && (
        <Section title="Attributes">
          {Object.entries(attrs).map(([k, v]) => (
            <Row key={k} k={label(k)} v={v} />
          ))}
        </Section>
      )}

      {images.length > 0 && (
        <Section title="Images">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((im, i) => (
              <Image
                key={im.id ?? i}
                source={{
                  uri: toUrl(im.full_image_url || im.image_url) || undefined,
                }}
                style={styles.gallery}
              />
            ))}
          </ScrollView>
        </Section>
      )}

      {variants.length > 0 && (
        <Section title="Variants">
          {variants.map((v, i) => (
            <View key={v.id ?? i} style={styles.card}>
              <Row k="SKU" v={v.sku} />
              <Row k="Size" v={v.size} />
              <Row k="Color" v={v.color} />
              <Row k="Price" v={v.variant_price} />
              <Row k="Quantity" v={v.quantity} />
              <Row k="Barcode" v={v.barcode} />
              <Row k="Weight" v={Number(v.weight) > 0 ? v.weight : null} />
            </View>
          ))}
        </Section>
      )}

      {sizeChart.length > 0 && (
        <Section title="Size chart">
          <ScrollView horizontal>
            <View>
              <View style={styles.tr}>
                <Text style={[styles.th, styles.td]}>Size</Text>
                {chartCols.map(c => (
                  <Text key={c} style={[styles.th, styles.td]}>
                    {label(c)}
                  </Text>
                ))}
              </View>
              {sizeChart.map((r, i) => (
                <View key={r.id ?? i} style={styles.tr}>
                  <Text style={[styles.td, styles.bold]}>{r.size}</Text>
                  {chartCols.map(c => (
                    <Text key={c} style={styles.td}>
                      {r[c]}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </Section>
      )}

      {item.seo && (
        <Section title="SEO">
          <Row k="Title" v={item.seo.seo_title} />
          <Row k="Description" v={item.seo.seo_description} />
          <Row k="Keyword" v={item.seo.keyword} />
          <Row k="Promotion URL" v={item.seo.promotion_url} />
        </Section>
      )}

      <Section title="Dates">
        <Row k="Created" v={item.created_at} />
        <Row k="Updated" v={item.updated_at} />
      </Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  back: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  hero: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  name: {fontSize: 20, fontWeight: '700', color: '#111', marginTop: 12},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  price: {fontSize: 18, fontWeight: '700', color: PRIMARY, marginRight: 10},
  offer: {fontSize: 14, color: '#6b7280', marginRight: 10},
  badge: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    textTransform: 'capitalize',
  },
  on: {backgroundColor: '#dcfce7', color: '#166534'},
  off: {backgroundColor: '#f3f4f6', color: '#6b7280'},
  section: {marginTop: 18},
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  kv: {flexDirection: 'row', paddingVertical: 4},
  k: {width: 130, fontSize: 13, color: '#6b7280'},
  v: {flex: 1, fontSize: 13, color: '#111'},
  gallery: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
  },
  card: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  tr: {flexDirection: 'row', borderBottomWidth: 1, borderColor: BORDER},
  th: {fontWeight: '700', backgroundColor: '#f9fafb'},
  td: {width: 90, padding: 8, fontSize: 12, color: '#111'},
  bold: {fontWeight: '700'},
});

export default MerchandiseDetails;
