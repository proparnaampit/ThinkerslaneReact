import React, {useEffect} from 'react';
import {View, Text, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import {useMerchandiseContext} from '../../context/MerchandiseContext';
import styles from '../shared/css/seoDetails';
import uploadStyles from '../shared/css/merchandiseUpload';

const TITLE_MAX = 60;
const DESC_MAX = 160;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const SeoDetails: React.FC = () => {
  const {formData, updateSeo, nextStep} = useMerchandiseContext();
  const info = formData.information || {};
  const seo: Record<string, string> = formData.seo || {};

  // Prefill once from the product basics so the user only tweaks them.
  useEffect(() => {
    if (Object.keys(seo).length === 0) {
      const title = (info.productName || '').slice(0, TITLE_MAX);
      const description = (info.shortDescription || '').slice(0, DESC_MAX);
      updateSeo({
        seoTitle: title,
        seoDescription: description,
        slug: slugify(info.productName || ''),
        ogTitle: title,
        ogDescription: description,
        keywords: [info.productName, info.subType]
          .filter(Boolean)
          .join(', ')
          .toLowerCase(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLabel = (text: string, value?: string, max?: number) => (
    <View style={styles.labelRow}>
      <Text style={styles.label}>{text}</Text>
      {max ? (
        <Text
          style={[
            styles.counter,
            (value || '').length >= max && styles.counterOver,
          ]}>
          {(value || '').length}/{max}
        </Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.note}>
          Helps customers find this product in search. All fields are optional
          and prefilled from your product details.
        </Text>

        {renderLabel('SEO Title', seo.seoTitle, TITLE_MAX)}
        <TextInput
          style={styles.input}
          placeholder="Title shown in search results"
          placeholderTextColor="#9ca3af"
          maxLength={TITLE_MAX}
          value={seo.seoTitle || ''}
          onChangeText={text => updateSeo({seoTitle: text})}
        />

        {renderLabel('Meta Description', seo.seoDescription, DESC_MAX)}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Short summary shown in search results"
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={DESC_MAX}
          value={seo.seoDescription || ''}
          onChangeText={text => updateSeo({seoDescription: text})}
        />

        {renderLabel('URL Slug')}
        <TextInput
          style={styles.input}
          placeholder="e.g. mens-cotton-t-shirt"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
          value={seo.slug || ''}
          onChangeText={text => updateSeo({slug: slugify(text)})}
        />
        <Text style={styles.hint}>Lowercase letters, numbers and dashes only</Text>

        {renderLabel('Keywords (comma-separated)')}
        <TextInput
          style={styles.input}
          placeholder="e.g. t-shirt, cotton, men"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          value={seo.keywords || ''}
          onChangeText={text => updateSeo({keywords: text})}
        />

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Social Sharing & Promotion</Text>

        {renderLabel('OG Title', seo.ogTitle, TITLE_MAX)}
        <TextInput
          style={styles.input}
          placeholder="Title when shared on social media"
          placeholderTextColor="#9ca3af"
          maxLength={TITLE_MAX}
          value={seo.ogTitle || ''}
          onChangeText={text => updateSeo({ogTitle: text})}
        />

        {renderLabel('OG Description', seo.ogDescription, DESC_MAX)}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description when shared on social media"
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={DESC_MAX}
          value={seo.ogDescription || ''}
          onChangeText={text => updateSeo({ogDescription: text})}
        />

        {renderLabel('Promotion URL')}
        <TextInput
          style={styles.input}
          placeholder="https://"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="url"
          value={seo.promotionUrl || ''}
          onChangeText={text => updateSeo({promotionUrl: text})}
        />
        <View style={styles.bottomSpace} />
      </ScrollView>

      <TouchableOpacity style={uploadStyles.primaryButton} onPress={nextStep}>
        <Text style={uploadStyles.primaryButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SeoDetails;
