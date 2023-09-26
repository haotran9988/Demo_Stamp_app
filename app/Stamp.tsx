import {
  View,
  Text,
  Platform,
  SafeAreaView,
  StyleSheet,
  Image,
  PermissionsAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  RewardedAd,
  BannerAd,
  BannerAdSize,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import Colors from './colors';
import TextButton from './TextButton';
import {useNavigation} from '@react-navigation/native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFetchBlob from 'rn-fetch-blob';

const banner_UnitId =
  Platform.OS === 'ios'
    ? 'ca-app-pub-9711240182969577/9019448199'
    : 'ca-app-pub-9711240182969577/7007512462';

const reward_UnitId =
  Platform.OS === 'ios'
    ? 'ca-app-pub-9711240182969577/8958353614'
    : 'ca-app-pub-9711240182969577/4468444265';

const Stamp = () => {
  const navigation = useNavigation<any>();

  function showRewardAds() {
    const rewarded = RewardedAd.createForAdRequest(reward_UnitId);
    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewarded.show();
    });

    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
      console.log('User earned reward of ', reward);
    });

    rewarded.load();
  }
  async function hasAndroidPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download Photos',
          buttonNegative: 'Cancel',
          buttonNeutral: 'Ask me later',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage Permission Granted.');
        return true;
      } else {
        console.log('Storage Permission Not Granted');
        return false;
      }
    } catch (err) {
      // To handle permission related exception
      console.warn(err);
      return false;
    }
  }

  async function downloadImage(image_url) {
    let ext = getExtention(image_url);
    console.log('ext', ext);
    console.log('downloadImage ' + ' - ' + image_url);

    if (Platform.OS === 'ios') {
      console.log('DL Stamp IOS');
      CameraRoll.save(image_url, 'photo');
      return;
    }
    if (Platform.OS === 'android') {
      console.log('DL Stamp Android');
      //DL Stamp Android
      let date = new Date();
      const {config, fs} = RNFetchBlob;
      let PictureDir = fs.dirs.PictureDir;
      config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path:
            PictureDir +
            '/image_' +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            ext,
          description: 'Image',
        },
      })
        .fetch('GET', image_url, {
          //some headers ..
        })
        .then(res => {
          // the temp file path
          console.log('res -> ', JSON.stringify(res));
          console.log('The file saved to ', res.path());
        });
      return;
    }
  }
  function getExtention(filename) {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
        <Image
          source={require('./demo_stamp.png')}
          style={{width: 200, height: 200}}></Image>
      </View>
      <View style={styles.btns}>
        <View style={styles.btn}>
          <TextButton
            title="Show Ads"
            onPress={() => {
              showRewardAds();
            }}></TextButton>
        </View>
        <View style={styles.btn}>
          <TextButton
            title="Down Stamp"
            onPress={() => {
              downloadImage(
                'https://store-shaun.mbchara.com/shaun_server//picture/stamp/1mw47e2tjt1ylxndkjru612vw49423lqp3lgdp57nwdhrdwaqj.png',
              );
            }}></TextButton>
        </View>
        <View style={styles.btn}>
          <TextButton
            title="Read CSV"
            onPress={() => {
              navigation.navigate('ReadCSV');
            }}></TextButton>
        </View>
        <View style={styles.btn}>
          <TextButton
            title="Back"
            onPress={() => {
              navigation.goBack();
            }}></TextButton>
        </View>

        <BannerAd
          unitId={banner_UnitId}
          size={BannerAdSize.ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Stamp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBlue,
  },

  btns: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  btn: {
    marginHorizontal: 20,
    marginTop: 10,
  },
});
