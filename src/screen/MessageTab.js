import React, {useEffect} from 'react';
import {View, ToastAndroid, Button} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import SocketClient from '../services/SocketClient';
import SigninGG from '../services/SigninGG';
import {deleteUser} from '../reducers/action';
import FirebaseClient from '../services/Firebase';
import {ListMessageUser} from '../component/index';
import Server from '../dev/Server';

function MessageTab({navigation}) {
  const {user} = useSelector(state => state);
  const dispatch = useDispatch();

  const updateToken = (email, tokenClient) => {
    fetch(Server.url + '/users/update-token', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        tokenClient,
      }),
    }).catch(error => console.log('error', error));
  };

  const deleteToken = (email, tokenClient) => {
    fetch(Server.url + '/users/delete-token', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        tokenClient,
      }),
    }).catch(error => console.log('error', error));
  };

  useEffect(() => {
    if (user.email !== '') {
      SocketClient.addEmail(user.email);
      // updateToken to server
      FirebaseClient.currentToken()
        .then(token => updateToken(user.email, token))
        .catch(error => {
          ToastAndroid.show(
            'Đã xảy ra lỗi khi cập nhật token',
            ToastAndroid.SHORT,
          );
        });
    }

    SocketClient.socket.on('answer-request', ({id}) => {
      SocketClient.callMadeAnswerRequest(id);
      navigation.navigate('CallVideoScreen', {email: undefined});
    });
  }, [user]);

  const signOut = async () => {
    await SigninGG.signOut();
    dispatch(deleteUser());
    FirebaseClient.currentToken()
      .then(token => deleteToken(user.email, token))
      .catch(error => console.log(error));
    navigation.reset({index: 1, routes: [{name: 'SigninScreen'}]});
  };

  return (
    <View>
      <ListMessageUser user={user} navigation={navigation} />
      <Button title="Đăng xuất" onPress={signOut} />
    </View>
  );
}

export default React.memo(MessageTab);
