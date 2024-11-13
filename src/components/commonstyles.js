import {StyleSheet} from 'react-native';

const commonstyles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
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
    color: '#a92737',
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
  expenseButton: {
    backgroundColor: '#a92737',
  },
  orderButton: {
    borderColor: '#8e2334',
    borderWidth: 1,
  },
  thinkerslane: {
    color: '#a92737',
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
