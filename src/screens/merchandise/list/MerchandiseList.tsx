import React, {useMemo, useState} from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FeatherIcon} from '../../../components/common/Icons';
import Toast from 'react-native-toast-message';
import {
  useGetAllMerchandiseProductsQuery,
  useDeleteMerchandiseMutation,
} from '../../../services/merchandiseService';
import {PRIMARY, BORDER} from '../shared/css/merchandiseUpload';

// The API response shape may be a bare array or wrapped in data/products/result.
const extractList = (res: any): any[] => {
  if (Array.isArray(res)) {
    return res;
  }
  const candidates = [
    res?.data,
    res?.products,
    res?.result,
    res?.data?.products,
  ];
  return candidates.find(Array.isArray) || [];
};

const pickImage = (item: any): string | null => {
  const first = Array.isArray(item?.images) ? item.images[0] : null;
  return (
    item?.full_image_url ||
    item?.primary_image_url ||
    item?.primary_image ||
    item?.image_url ||
    item?.image ||
    first?.full_image_url ||
    first?.image_url ||
    (typeof first === 'string' ? first : null) ||
    null
  );
};

const MerchandiseList: React.FC = () => {
  const navigation: any = useNavigation();
  const {data, isLoading, isFetching, isError, refetch} =
    useGetAllMerchandiseProductsQuery(undefined);

  console.log('joy ma', JSON.stringify(data));
  const [deleteMerchandise] = useDeleteMerchandiseMutation();

  const [search, setSearch] = useState('');
  const allItems = useMemo(() => extractList(data), [data]);

  const submitSearch = () => Keyboard.dismiss();
  const clearSearch = () => setSearch('');

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return allItems;
    }
    return allItems.filter((it: any) =>
      [
        it?.name,
        it?.category_name,
        it?.subcategory_name,
        it?.product_type,
        it?.status,
        ...(Array.isArray(it?.variants)
          ? it.variants.map((v: any) => v?.sku)
          : []),
      ]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q)),
    );
  }, [allItems, search]);

  const confirmDelete = (item: any) => {
    Alert.alert(
      'Delete product',
      `Delete "${item?.name || 'this product'}"? This cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const payload = {
                product_id: Number(item?.product_id ?? item?.id),
              };
              const res: any = await deleteMerchandise(payload).unwrap();
              Toast.show({
                type: 'success',
                text1: 'Product Deleted',
                text2: res?.message || 'The product has been deleted.',
              });
            } catch (error: any) {
              console.log('delete merchandise error', JSON.stringify(error));
              Toast.show({
                type: 'error',
                text1: 'Failed to Delete Product',
                text2: error?.data?.message || 'Something went wrong.',
              });
            }
          },
        },
      ],
    );
  };

  const renderItem = ({item}: {item: any}) => {
    const uri = pickImage(item);
    const price = item?.price ?? item?.variant_price;
    const active = String(item?.status).toLowerCase() === 'active';
    return (
      <View style={styles.card}>
        {uri ? (
          <Image source={{uri}} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={[styles.thumb, styles.thumbEmpty]}>
            <FeatherIcon name="image" size={22} color="#9ca3af" />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {item?.name || item?.product_name || 'Untitled product'}
          </Text>
          {!!(item?.category_name || item?.product_type) && (
            <Text style={styles.sub} numberOfLines={1}>
              {[item?.category_name, item?.subcategory_name]
                .filter(Boolean)
                .join(' • ') || item?.product_type}
            </Text>
          )}
          <Text style={styles.sub} numberOfLines={1}>
            {item?.variants_count ?? 0} variant
            {item?.variants_count === 1 ? '' : 's'} • Stock{' '}
            {item?.total_stock ?? 0}
          </Text>
          <View style={styles.row}>
            {price != null && <Text style={styles.price}>${price}</Text>}
            {item?.status != null && (
              <Text style={[styles.badge, active ? styles.on : styles.off]}>
                {String(item.status)}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => navigation.navigate('MerchandiseEdit', {item})}>
            <FeatherIcon name="edit-2" size={14} color={PRIMARY} />
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.eye}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            onPress={() => navigation.navigate('MerchandiseDetails', {item})}>
            <FeatherIcon name="eye" size={20} color={PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.remove}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            onPress={() => confirmDelete(item)}>
            <FeatherIcon name="trash-2" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Merchandise</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('MerchandiseAdd')}>
          <FeatherIcon name="plus" size={18} color="#fff" />
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <FeatherIcon name="search" size={18} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, category or SKU"
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          onSubmitEditing={submitSearch}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={clearSearch}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <FeatherIcon name="x" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.enterBtn} onPress={submitSearch}>
          <Text style={styles.enterText}>Enter</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.sub}>Failed to load products.</Text>
          <TouchableOpacity onPress={refetch}>
            <Text style={styles.retry}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, i) => String(item?.id ?? item?.product_id ?? i)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <Text style={[styles.sub, styles.empty]}>
              {search ? 'No matching products.' : 'No products yet.'}
            </Text>
          }
          contentContainerStyle={{paddingBottom: 16}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 14},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {fontSize: 18, fontWeight: '700', color: '#111'},
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addText: {color: '#fff', fontWeight: '600', marginLeft: 4},
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  searchInput: {flex: 1, paddingVertical: 8, marginLeft: 8, color: '#111'},
  enterBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  enterText: {color: '#fff', fontWeight: '600', fontSize: 13},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  thumb: {width: 64, height: 64, borderRadius: 8, backgroundColor: '#f3f4f6'},
  thumbEmpty: {alignItems: 'center', justifyContent: 'center'},
  actions: {justifyContent: 'center', alignItems: 'center'},
  eye: {paddingLeft: 8, paddingBottom: 14},
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 6,
  },
  updateButtonText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY,
  },
  remove: {paddingLeft: 8, paddingTop: 14},
  info: {flex: 1, marginLeft: 10, justifyContent: 'center'},
  name: {fontSize: 15, fontWeight: '600', color: '#111'},
  sub: {fontSize: 13, color: '#6b7280', marginTop: 2},
  row: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  price: {fontSize: 14, fontWeight: '700', color: PRIMARY, marginRight: 10},
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
  retry: {color: PRIMARY, fontWeight: '600', marginTop: 8},
  empty: {textAlign: 'center', marginTop: 40},
});

export default MerchandiseList;
