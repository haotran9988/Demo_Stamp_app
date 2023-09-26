import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Colors from './colors';

type TextButtonProp = {
  title: string;
  onPress: () => void;
  bgColor?: string;
  fgColor?: string;
  textSize?: number;
};
const TextButton: React.FC<TextButtonProp> = ({
  title,
  onPress,
  bgColor,
  fgColor,
  textSize,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          {backgroundColor: bgColor ? bgColor : Colors.primary},
        ]}>
        <Text
          style={[
            styles.title,
            {
              color: fgColor ? fgColor : Colors.white,
              fontSize: textSize ? textSize : 28,
            },
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default TextButton;
