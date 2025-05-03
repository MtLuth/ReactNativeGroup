import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';

interface IconWithBadgeProps {
  iconName: string;
  iconType: string;
  iconColor?: string;
  iconSize?: number;
  badgeCount: any;
  iconStyle?: any;
}

const IconWithBadge: React.FC<IconWithBadgeProps> = ({
  iconName,
  iconType,
  badgeCount,
  iconColor = '#fff',
  iconSize = 26,
  iconStyle,
}) => {
  return (
    <View>
      <Icon
        name={iconName}
        type={iconType}
        color={iconColor}
        size={iconSize}
        style={iconStyle || {}}
      />
      {Number(badgeCount) > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {Number(badgeCount) > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

export default IconWithBadge;

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
