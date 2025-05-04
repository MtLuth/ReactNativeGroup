import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CheckBox, Icon} from 'react-native-elements';
import {appColors} from '../../themes/appColors';
import {appFonts} from '../../themes/appFont';

interface CartItemProps {
  image: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  selected: boolean;
  onSelect: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  image,
  name,
  price,
  salePrice,
  quantity,
  selected,
  onSelect,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <CheckBox
        checked={selected}
        onPress={onSelect}
        containerStyle={styles.checkbox}
      />

      <Image source={{uri: image}} style={styles.productImage} />

      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>

          {salePrice ? (
            <View style={styles.priceRow}>
              <Text style={styles.oldPrice}>{price.toLocaleString()} VND</Text>
              <Text style={styles.salePrice}>
                {(((100 - salePrice) / 100) * price).toLocaleString()} VND
              </Text>
            </View>
          ) : (
            <Text style={styles.salePrice}>{price.toLocaleString()} VND</Text>
          )}
        </View>

        <View style={styles.actionRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={onDecrease}
              disabled={quantity <= 1}>
              <Text
                style={[
                  styles.qtyText,
                  quantity <= 1 && styles.qtyTextDisabled,
                ]}>
                -
              </Text>
            </TouchableOpacity>

            <Text style={styles.qtyNumber}>{quantity}</Text>

            <TouchableOpacity style={styles.qtyButton} onPress={onIncrease}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Icon name="trash-2" type="feather" size={20} color="#f33" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CartItemComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
    alignItems: 'center',
  },
  checkbox: {
    padding: 0,
    marginRight: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  infoContainer: {
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontFamily: appFonts.MontserratMedium,
    color: appColors.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  oldPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: 16,
    fontFamily: appFonts.MontserratBold,
    color: appColors.primary,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: appColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  qtyText: {
    fontSize: 18,
    color: appColors.textPrimary,
  },
  qtyNumber: {
    fontSize: 16,
    marginHorizontal: 12,
    fontFamily: appFonts.MontserratMedium,
  },
  removeButton: {
    padding: 6,
    marginLeft: 12,
  },
  qtyTextDisabled: {
    color: appColors.textInactive,
  },
});
