import {View, Text, StyleSheet, Image, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import Colors from './colors';
import TextButton from './TextButton';
import CustomInputField from './CustomInputField';
import { useNavigation } from '@react-navigation/native';

var db = openDatabase({name: 'User.db'});
const Login = () => {
  const [mode, setMode] = useState('signin');
  //signin
  const [inputUserName, setInputUserName] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  //register
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const navigation = useNavigation<any>();
  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='user'",
        [],
        (tx, res) => {
          console.log('item:', res.rows);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_pass VARCHAR(255))',
              [],
            );
          }
        },
      );
    });
  }, []);
  const createUser = () => {
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO user (user_name, user_pass) VALUES (?, ?)',
        [userName, userPassword],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('create user success',userName, userPassword);
            setUserName('');
            setUserPassword('');
          } else {
            console.log('Registration Failed');
          }
        },
        (error) => {
          console.error(error);
        }
      );
    });
  };
  const checkLogin = () => {
    console.log('check login', inputUserName, inputPassword);
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM user WHERE user_name = ? AND user_pass = ?',
        [inputUserName, inputPassword],
        (tx, results) => {
          if (results.rows.length > 0) {
            // Tồn tại một bản ghi khớp
            console.log('Login successful');
            setInputPassword('');
            setInputUserName('');
            navigation.navigate('Home');
          } else {
            // Không tìm thấy bản ghi khớp
            console.log('Login failed');
          }
        },
        (error) => {
          console.error(error);
        }
      );
    });
  };
  //render
  function renderSignin() {
    return (
      <View>
        <View style={styles.signIn}>
          <View>
            <Text style={styles.txtTitle}>Sign in to continue</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <CustomInputField
              value={inputUserName}
              setValue={setInputUserName}
              placeholder="enter username"
              secureText={false}
              borColor={Colors.blue}
            />
            <CustomInputField
              value={inputPassword}
              setValue={setInputPassword}
              placeholder="enter password"
              secureText={true}
              borColor={Colors.blue}
            />
          </View>
          <View style={{marginTop: 20}}>
            <TextButton
              title="Sign in"
              onPress={() => {checkLogin()}}
              bgColor={Colors.blue}></TextButton>
          </View>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>
            Don't have account?{' '}
            <Text
              style={{color: Colors.purple}}
              onPress={() => {
                setMode('signup');
              }}>
              Create account
            </Text>
          </Text>
        </View>
      </View>
    );
  }

  function renderSignup() {
    return (
      <View>
        <View style={styles.signUp}>
          <View>
            <Text style={styles.txtTitle}>Sign up to continue</Text>
          </View>
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
            <CustomInputField
              value={''}
              setValue={setInputPassword}
              placeholder="phone number"
              secureText={true}
              borColor={Colors.blue}
            />
          </View>

          <View style={{marginTop: 20}}>
            <TextButton
              title="Sign up"
              onPress={() => {
                createUser();
              }}
              bgColor={Colors.blue}></TextButton>
          </View>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>
            Have an account?{' '}
            <Text
              style={{color: Colors.purple}}
              onPress={() => {
                setMode('signin');
              }}>
              Sign in
            </Text>
          </Text>
        </View>
      </View>
    );
  }
  function renderAuthMain() {
    return mode === 'signin' ? renderSignin() : renderSignup();
  }

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Image
            source={require('./Lep_logo.png')}
            style={{width: 180, height: 100}}></Image>
        </View>
        {renderAuthMain()}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBlue,
  },
  top: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  signIn: {
    height: 400,
    marginHorizontal: 30,
    borderRadius: 10,
    backgroundColor: Colors.white,
    elevation: 15,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  signUp: {
    height: 450,
    marginHorizontal: 30,
    borderRadius: 10,
    backgroundColor: Colors.white,
    elevation: 15,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  txtTitle: {
    color: Colors.dark,
    fontWeight: 'bold',
    fontSize: 35,
  },
});
export default Login;
