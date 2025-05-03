import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {appColors} from '../../themes/appColors';
import {appFonts} from '../../themes/appFont';

interface MTShopSearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSubmit: (text: string) => void;
}

const MTShopSearchBar: React.FC<MTShopSearchBarProps> = ({
  placeholder = 'Search...',
  defaultValue = '',
  onSubmit,
}) => {
  const [text, setText] = useState(defaultValue || '');

  const handleSubmit = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    onSubmit(e.nativeEvent.text);
  };

  return (
    <View style={styles.container}>
      <Icon
        name="search"
        type="feather"
        color={appColors.textSecondary}
        size={18}
        style={styles.icon}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        returnKeyType="search"
        value={text}
        defaultValue={defaultValue}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
      />
    </View>
  );
};

export default MTShopSearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.white,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 14,
    color: appColors.textPrimary,
    fontFamily: appFonts.MontserratRegular,
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
