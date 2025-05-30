import {StyleSheet, Dimensions} from 'react-native';

const informationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noteText: {
    fontSize: 10,
    color: 'gray',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#223d79',
  },
  picker: {
    fontSize: 13,
  },
  input: {
    height: 40,
    borderWidth: 1,
    fontSize: 13,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  ISBNinput: {
    height: 40,
    borderWidth: 1,
    fontSize: 13,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fetchButton: {
    backgroundColor: '#223d79',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  fetchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 22,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#223d79',
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#223d79',
  },
  radioText: {
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default informationStyles;
