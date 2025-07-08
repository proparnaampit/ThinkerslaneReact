import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import informationStyles from '../../screens/product/css/information';

const CustomPicker = ({
  label,
  selectedValue,
  onValueChange,
  data,
  valueKey = 'id',
  labelKey = 'description',
  placeholder = 'Select...',
}: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const openDropdown = () => {
    setFilteredData(data);
    setModalVisible(true);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = data.filter(item =>
      item[labelKey].toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const handleSelect = (value: any) => {
    onValueChange(value);
    setModalVisible(false);
    setSearch('');
  };

  const selectedLabel =
    data.find(item => item[valueKey] === selectedValue)?.[labelKey] ||
    placeholder;

  return (
    <>
      {label ? <Text style={informationStyles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={openDropdown}
        activeOpacity={0.8}>
        <Text style={styles.dropdownButtonText}>{selectedLabel}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Search..."
              value={search}
              onChangeText={handleSearch}
              style={styles.searchInput}
            />
            <FlatList
              data={filteredData}
              keyExtractor={item => item[valueKey].toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item[valueKey])}
                  style={styles.item}>
                  <Text>{item[labelKey]}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResults}>No results found</Text>
              }
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  closeButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
});

export default CustomPicker;
