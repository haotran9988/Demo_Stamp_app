import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import Colors from './colors';
import TextButton from './TextButton';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';

const ReadCSV = () => {
  const [csvData, setCSVData] = useState([]);
  const navigation = useNavigation<any>();
  // useEffect(() => {

  //   RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  //     .then(result => {
  //       console.log('GOT RESULT', result);
  //       const fileDetail = result.find(e => e.name === 'testCsv.csv');
  //       console.log('file path: ', fileDetail)
  //       if (fileDetail) {
  //         const content = RNFS.readFile(fileDetail.path, 'utf8');
  //         console.log('data: ', content);
  //       }

  //       // stat the first file
  //       return Promise.all([RNFS.stat(result[0].path), result[0].path]);
  //     })
  //     .catch(err => {
  //       console.log(err.message, err.code);
  //     });
  // }, []);
  useEffect(() => {
    RNFS.readFileAssets('app/testCsv.csv', 'utf8')
      .then(content => {
        console.log(content)

        // Thực hiện xử lý dữ liệu CSV ở đây (ví dụ: phân tích CSV)
      })
      .catch(error => {
        console.error('Lỗi khi đọc tệp CSV:', error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {csvData.map((row, index) => (
          <View key={index}>
            {/* <Text>{row.Name}</Text>
            <Text>{row.url}</Text> */}
          </View>
        ))}
      </View>
      <View style={styles.btns}>
        <View style={styles.btn}>
          <TextButton
            title="Back"
            onPress={() => {
              navigation.goBack();
            }}></TextButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReadCSV;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBlue,
  },
  btns: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  btn: {
    marginHorizontal: 20,
    marginTop: 10,
  },
});
function csvtojson() {
  throw new Error('Function not implemented.');
}
