import { StyleSheet } from 'react-native';
import { colors, general } from '~/styles';

const styles = StyleSheet.create({
  ...general.formStyles,
  ...general.buttonStyles,

  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 30,
  },

  title: {
    fontSize: 28,
    marginBottom: 20,
    color: colors.white,
    textAlign: 'center',
  },

  demoHint: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },

  demoHintText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.8,
  },

  demoCredentials: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default styles;
