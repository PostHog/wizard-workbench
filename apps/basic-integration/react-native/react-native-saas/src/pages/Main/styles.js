import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

const styles = StyleSheet.create({
  backgroundWrapper: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    backgroundColor: colors.backgroundDarker,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkTransparent,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },

  drawerContainer: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
    paddingTop: 20,
  },
});

export default styles;
