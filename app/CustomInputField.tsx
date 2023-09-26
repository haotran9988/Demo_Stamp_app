import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';

type CustomInputFieldProps = {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  secureText: boolean;
  borColor?: string;
  bgColor?: string;
};

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  value,
  setValue,
  placeholder,
  secureText,
  borColor,
  bgColor,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor && bgColor,
          borderColor: borColor && borColor,
        },
      ]}>
      <TextInput
        style={styles.inputfield}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secureText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  inputfield: {
    //
  },
});

export default CustomInputField;
