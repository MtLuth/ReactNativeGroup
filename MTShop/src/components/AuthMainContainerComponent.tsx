import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {appColors} from '../themes/appColors';
import {appFonts} from '../themes/appFont';

interface AuthMainContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const AuthMainContainerComponent: React.FC<AuthMainContainerProps> = ({
  title,
  children,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
};

export default AuthMainContainerComponent;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 29,
    paddingTop: 63,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 36,
    fontFamily: appFonts.MontserratBold,
    color: appColors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5F6C7B',
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    width: 192,
  },
});
