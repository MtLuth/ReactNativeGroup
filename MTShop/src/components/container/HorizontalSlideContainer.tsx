import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface HorizontalSlideContainerProps<T> {
  title?: string;
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: ({item, index}: {item: T; index: number}) => React.ReactElement;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  horizontalSpacing?: number;
}

function HorizontalSlideContainer<T>({
  title,
  data,
  keyExtractor,
  renderItem,
  containerStyle,
  titleStyle,
  horizontalSpacing = 16,
}: HorizontalSlideContainerProps<T>) {
  return (
    <View style={[styles.container, containerStyle]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      <FlatList
        horizontal
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingLeft: horizontalSpacing}}
        ItemSeparatorComponent={() => (
          <View style={{width: horizontalSpacing}} />
        )}
      />
    </View>
  );
}

export default HorizontalSlideContainer;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
