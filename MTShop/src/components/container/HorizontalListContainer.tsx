import React, {JSX, useRef} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props<T> {
  title: string;
  data: T[];
  renderItem: ({item}: {item: T}) => JSX.Element;
  itemWidth: number;
}

function HorizontalListContainer<T>({
  title,
  data,
  renderItem,
  itemWidth,
}: Props<T>) {
  const flatListRef = useRef<FlatList<T>>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!flatListRef.current) return;
    flatListRef.current.scrollToOffset({
      offset: direction === 'right' ? itemWidth : 0,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => scroll('left')}>
            <Icon name="chevron-left" size={16} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => scroll('right')}
            style={{marginLeft: 12}}>
            <Icon name="chevron-right" size={16} color="#444" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        horizontal
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 12}}
      />
    </View>
  );
}

export default HorizontalListContainer;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
  },
});
