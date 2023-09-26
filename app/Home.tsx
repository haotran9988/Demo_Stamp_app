import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import Colors from './colors';
import TextButton from './TextButton';
import CustomInputField from './CustomInputField';
import { useNavigation } from '@react-navigation/native';

const db = openDatabase({name: 'User.db'});
const {width} = Dimensions.get('screen');
const foodWidth = width - 20;
const Home = () => {
  let [data, setData] = useState([]);
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [isUpdate, setUpdate] = useState(false);
  let [currentUser, setCurrentUser]=useState(0);
  const navigation=useNavigation<any>();

  useEffect(() => {
    getUser();
  }, []);
  const getUser = () => {
    db.transaction(txn => {
      txn.executeSql('SELECT * FROM user', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          console.log('data row: ', results.rows.item(i));
          temp.push(results.rows.item(i));
        }
        setData(temp);
      });
    });
  };
  const deleteUser = id => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM  user where user_id=?',
        [id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('delete successfully');
            getUser();
          }
        },
      );
    });
  };
  const updateUser = (id) => {
    db.transaction(txn => {
      txn.executeSql(
        'UPDATE user set user_name=?, user_pass=? where user_id=?',
        [userName, userPassword, id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('User updated successfully');
            setUpdate(false);
            getUser();
            setUserName('');
            setUserPassword('');
          }
        },(error) => {
          console.error(error);
        }
      );
    });
  };
  //render
  function updateView() {
    return (
      <View style={[StyleSheet.absoluteFillObject, styles.containerDetail]}>
        <View style={styles.update}>
          <View style={{alignItems: 'center'}}>
            <CustomInputField
              value={userName}
              setValue={setUserName}
              placeholder="enter username"
              secureText={false}
              borColor={Colors.blue}
            />
            <CustomInputField
              value={userPassword}
              setValue={setUserPassword}
              placeholder="enter password"
              secureText={true}
              borColor={Colors.blue}
            />
          </View>

          <View style={{marginTop: 20}}>
            <TextButton
              title="Update"
              onPress={() => {
                updateUser(currentUser);
              }}
              bgColor={Colors.blue}></TextButton>
          </View>
          <View style={{marginTop: 20}}>
            <TextButton
              title="Cancel"
              onPress={() => {
                setUpdate(false);
              }}
              bgColor={Colors.blue}></TextButton>
          </View>
        </View>
      </View>
    );
  }
  function listUsers() {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={item => item.user_id.toString()}
        renderItem={({item}) => (
          <View style={styles.foodCard}>
            <View style={{flex: 1}}>
              <Image
                source={require('./Lep_logo.png')}
                style={{
                  width: 70,
                  height: 70,
                  marginTop: 5,
                  borderRadius: 75,
                  marginHorizontal: 20,
                }}
              />
            </View>
            <View style={{flex: 1.5, marginLeft: 20}}>
              <Text
                style={{fontSize: 15, fontWeight: 'bold', color: Colors.dark}}>
                {item.user_name}
              </Text>
              <Text
                style={{fontSize: 12, color: Colors.dark}}>
                {item.user_pass}
              </Text>
            </View>
            <View style={{alignItems: 'center', flex: 1}}>
              <Text style={{fontWeight: 'bold', color: Colors.dark}}></Text>
              <View style={styles.actonBtn}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    {
                      Alert.alert(
                        'Delete food',
                        `Are you sure you want to delete ${item.user_name}?`,
                        [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              deleteUser(item.user_id);
                            },
                          },
                        ],
                      );
                    }
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    Xoá
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    {
                      setCurrentUser(item.user_id);
                      setUpdate(true);
                    }
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    Sửa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>{listUsers()}</View>
      <View style={styles.btnBack}>
        <View style={{marginVertical:10}}>
        <TextButton title='Stamp' onPress={()=>{navigation.navigate('Stamp')}}></TextButton>
        </View>
        <TextButton title='Back' onPress={()=>{navigation.goBack();}}></TextButton>
      </View>
      {isUpdate && updateView()}
    </SafeAreaView>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBlue,
  },
  foodCard: {
    height: 100,
    width: foodWidth,
    marginHorizontal: 10,
    alignItems: 'center',
    elevation: 13,
    backgroundColor: Colors.white,
    marginVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
  },
  actonBtn: {
    width: 80,
    height: 30,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  botBar: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  txt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
    marginLeft: 20,
  },
  containerDetail: {
    justifyContent: 'center',
    backgroundColor: Colors.loading,
    zIndex: 1,
  },
  detail: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: 10,
    marginTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.blue,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    width: '100%',
  },
  update: {
    height: 400,
    marginHorizontal: 30,
    borderRadius: 10,
    backgroundColor: Colors.white,
    elevation: 15,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  btnBack:{
    marginHorizontal:10,
    flex:1,
    justifyContent:'flex-end',
    marginBottom:30,
  }
});
