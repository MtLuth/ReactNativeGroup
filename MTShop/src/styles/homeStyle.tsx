import {StyleSheet} from 'react-native';
import {appColors} from '../themes/appColors';

export const HomeStyle = StyleSheet.create({
  productList: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    gap: 12,
  },
  header: {
    padding: 16,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: appColors.primary,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
