import {StyleSheet} from 'react-native';

const commonstyles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    // borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.6)',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 6,
    width: '50%',
    // elevation: 5,
    zIndex: 2,
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

  // 'brick-red': {
  //   50: '#fdf4f3',
  //   100: '#fce8e7',
  //   200: '#f8d3d4',
  //   300: '#f2afaf',
  //   400: '#ea8285',
  //   500: '#de555d',
  //   600: '#be3240',
  //   700: '#a92737',
  //   800: '#8e2334',
  //   900: '#7a2131',
  //   950: '#430e17',
  // },
});

export default commonstyles;
