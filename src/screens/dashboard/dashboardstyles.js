import {StyleSheet} from 'react-native';

const dashboardstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfdfe',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
    color: 'black',
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
