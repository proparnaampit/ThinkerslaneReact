import {StyleSheet, Dimensions} from 'react-native';

const galleryStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'white',
    padding: 50,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  fileList: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  imageWrapper: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  crossButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  coverBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  coverText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  fileName: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  noFilesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  replaceButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 3,
  },
  replaceButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  noteText: {
    fontSize: 10,
    color: 'gray',
    marginBottom: 10,
  },
  noteTextCenter: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 10,
  },
  addMoreButton: {
    backgroundColor: 'black',
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 6,
    marginTop: 20,
  },
  addMoreButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default galleryStyles;
