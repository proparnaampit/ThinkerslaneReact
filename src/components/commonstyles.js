import {StyleSheet} from 'react-native';

const commonstyles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: '50%',
    elevation: 5,
    zIndex: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  saveButton: {
    backgroundColor: '#0f963a',
  },
  normalButton: {
    backgroundColor: '#BE3240',
  },
  cancelButton: {
    backgroundColor: '#ba0719',
  },
});

export default commonstyles;
