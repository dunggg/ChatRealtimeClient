import React, {useState, useEffect} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {useSelector} from 'react-redux';
import SocketClient from '../../services/SocketClient';
import Server from '../../dev/Server';

const windowWidth = Dimensions.get('window').width;

const UserInfo = ({setModalVisible, user, navigation}) => {
  const {email, name, photo} = useSelector(state => state.user);
  const [statusFriend, setStatusFriend] = useState(null);

  const fetchAddFriend = (emailFrom, emailTo) => {
    fetch(Server.url + '/users/add-friend', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailFrom,
        emailTo,
      }),
    })
      .then(res => res.json())
      .then(result => {
        if (result.statusCode === 200) {
          ToastAndroid.show('Vui lòng đợi chấp nhận', ToastAndroid.SHORT);
        }
      })
      .catch(error => console.log(error));
  };

  const fetchUnFriend = (emailFrom, emailTo) => {
    fetch(Server.url + '/users/unfriend', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailFrom,
        emailTo,
      }),
    })
      .then(res => res.json())
      .then(result => {
        ToastAndroid.show(result.codeMessage, ToastAndroid.SHORT);
      })
      .catch(error => console.log(error));
  };

  const fetchAccept = (emailFrom, emailTo) => {
    fetch(Server.url + '/users/accept-friend', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailFrom,
        emailTo,
      }),
    })
      .then(res => res.json())
      .then(result => {
        ToastAndroid.show(result.codeMessage, ToastAndroid.SHORT);
      })
      .catch(error => console.log(error));
  };

  const clickFriend = () => {
    if (statusFriend === 'Unfriend') {
      setStatusFriend('Add Friend');
      fetchUnFriend(email, user.email);
    } else if (statusFriend === 'Cancel Friend Request') {
      setStatusFriend('Add Friend');
      fetchUnFriend(email, user.email);
    } else if (statusFriend === 'Add Friend') {
      fetchAddFriend(email, user.email);
      setStatusFriend('Cancel Friend Request');
    } else if (statusFriend === 'Accept') {
      setStatusFriend('Unfriend');
      fetchAccept(email, user.email);
    }
  };

  const checkFriend = (email, listFriend) => {
    const positionFriend = listFriend.find(
      userInfo => userInfo.email === email,
    );
    return positionFriend;
  };

  useEffect(() => {
    fetch(Server.url + '/users/find?email=' + email)
      .then(result => result.json())
      .then(data => {
        const {friends, friendRequest} = data.data;
        const indexfriendRequest = friendRequest.findIndex(
          email => email === user.email,
        );
        const userIndex = checkFriend(user.email, friends);
        if (indexfriendRequest !== -1) {
          return setStatusFriend('Accept');
        } else if (userIndex !== undefined) {
          if (userIndex.accept === false) {
            return setStatusFriend('Cancel Friend Request');
          }
          setStatusFriend('Unfriend');
        } else {
          setStatusFriend('Add Friend');
        }
      });
  }, []);

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Image
          style={{
            width: windowWidth * 0.3,
            height: windowWidth * 0.3,
            marginBottom: 20,
            borderRadius: 100,
          }}
          source={{
            uri: user.photo,
          }}
        />
        <Text>Tên: {user.name} </Text>
        <Text>Giới tính: </Text>
        <Text>Ngày sinh: </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            width: windowWidth * 0.5,
            justifyContent: 'space-between',
          }}>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={clickFriend}>
            <Text style={styles.textStyle}>
              {statusFriend ? statusFriend : '...'}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('MessageScreen', {user});
              SocketClient.joinRoomChat({email, name, photo}, user);
            }}>
            <Text style={styles.textStyle}>Chat</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const App = ({modalVisible, setModalVisible, user, navigation}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <UserInfo
        setModalVisible={setModalVisible}
        user={user}
        navigation={navigation}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default React.memo(App);
