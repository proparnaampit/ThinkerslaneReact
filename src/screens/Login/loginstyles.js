import {StyleSheet, Dimensions} from 'react-native';
const {height} = Dimensions.get('window');

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    zIndex: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'red',
    marginBottom: 15,
    width: '100%',
  },
  input: {
    height: 50,
    width: '90%',
    paddingHorizontal: 10,
    borderRadius: 10,
    zIndex: 2,
    fontFamily: 'monospace',
    fontSize: 16,
    left: 30,
  },
  icon: {
    position: 'absolute',
    left: 10,
    zIndex: 2,
  },
  gap: {
    marginTop: 20,
  },
  logoContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 40,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    width: '100%',
    height: height / 2,
    zIndex: 2,
  },
  logo: {
    width: 250,
    top: '10%',
    left: -10,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
    zIndex: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  signInText: {
    alignSelf: 'flex-start', // Align the text to the left
    fontSize: 22,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#000', // Adjust to match your theme
    marginBottom: 10,
  },
});

export default loginStyles;
