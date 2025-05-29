import {StyleSheet} from 'react-native';

const commonstyles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '40%',
    zIndex: 2,
  },
  errorText: {
    color: 'grey', // changed from red to grey
    fontSize: 16,
    textAlign: 'center', // center align the text
    marginTop: 10, // optional for spacing
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  saveButton: {
    backgroundColor: '#0f963a',
  },
  normalButton: {
    backgroundColor: '#223d79',
  },
  cancelButton: {
    backgroundColor: '#ba0719',
  },
  expenseButton: {
    backgroundColor: '#223d79',
  },
  orderButton: {
    backgroundColor: '#972831',
  },
  thinkerslane: {
    color: '#223d79',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(118, 118, 118, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure the loader appears on top
  },
  // 'brick-red': {
  //   50: '#fdf4f3',
  //   100: '#fce8e7',
  //   200: '#f8d3d4',
  //   300: '#f2afaf',
  //   400: '#ea8285',
  //   500: '#de555d',
  //   600: '#be3240',
  //   700: '#a92737', //main
  //   800: '#8e2334',
  //   900: '#7a2131',
  //   950: '#430e17',
  // },
});

export default commonstyles;
