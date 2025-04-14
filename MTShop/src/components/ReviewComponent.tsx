import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import 'moment/locale/vi';

const ReviewComponent = ({
  avt,
  fullName,
  rating,
  comment,
  createdAt,
}: {
  avt: any;
  fullName: any;
  rating: any;
  comment: any;
  createdAt: any;
}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: avt}} style={styles.avatar} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.date}>{moment(createdAt).fromNow()}</Text>
        </View>

        <View style={styles.ratingRow}>
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name="star"
              type="font-awesome"
              size={12}
              color={index < rating ? '#FFD700' : '#ccc'}
              containerStyle={{marginRight: 2}}
            />
          ))}
        </View>

        <Text style={styles.comment}>{comment}</Text>
      </View>
    </View>
  );
};

export default ReviewComponent;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  comment: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});
