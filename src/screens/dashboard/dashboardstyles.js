import {StyleSheet} from 'react-native';

const dashboardstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
    color: '#565656',
  },
  dashboard: {},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 15,
  },
});

export default dashboardstyles;
