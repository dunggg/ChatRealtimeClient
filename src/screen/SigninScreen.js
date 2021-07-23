import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import SigninGG from '../services/SigninGG';
import {ToastAndroid} from 'react-native';
import {useDispatch} from 'react-redux';
import {updateUser} from '../reducers/action';
import Server from '../dev/Server';

function SigninScreen({navigation}) {
  const dispatch = useDispatch();
  useEffect(() => {
    // kiểm tra xem đã đăng nhập hay chưa
    isSignined();
  });

  const userInfo = email => {
    fetch(Server.url + '/users/find?email=' + email)
      .then(result => result.json())
      .then(data => {
        dispatch(
          updateUser({
            email: data.data.email,
            name: data.data.name,
            photo: data.data.photo,
          }),
        );
      });
  };

  const isSignined = async () => {
    const getCurrentUser = await SigninGG.getCurrentUser();
    if (getCurrentUser) {
      await SigninGG.signIn();
      const {email} = getCurrentUser.user;
      userInfo(email);
      navigation.reset({index: 1, routes: [{name: 'BottomTabNavigatorHome'}]});
    }
  };

  const signin = async () => {
    const checkSignin = await SigninGG.signIn();
    if (checkSignin.error) {
      return ToastAndroid.show(checkSignin.error, ToastAndroid.SHORT);
    }
    const {email, name, photo} = checkSignin.userInfo.user;
    fetch(Server.url + '/users/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        photo,
      }),
    })
      .then(res => res.json())
      .then(result => {
        ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT);
        dispatch(updateUser({email, name, photo}));
        navigation.reset({
          index: 1,
          routes: [{name: 'BottomTabNavigatorHome'}],
        });
      })
      .catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signin}
        disabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(SigninScreen);
