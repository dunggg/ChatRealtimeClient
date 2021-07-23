import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {useSelector} from 'react-redux';
import Server from '../dev/Server';

const {width} = Dimensions.get('window');
const height = Dimensions.get('window').height * 0.08;

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
      return ToastAndroid.show('Successful refusal', ToastAndroid.SHORT);
    })
    .catch(error => console.log(error));
};

function ListRequestFriendScreen() {
  const {email} = useSelector(state => state.user);
  const [data, setData] = useState(null);
  let listRequestFriend = [];

  useEffect(() => {
    if (email !== '') {
      fetch(Server.url + '/users/list-request-friend?email=' + email)
        .then(response => response.json())
        .then(result => {
          if (result.statusCode === 200) {
            setData(result.data);
            listRequestFriend = result.data;
          }
        })
        .catch(err => console.error(err));
    }
  }, [email]);

  const Item = ({item, index}) => (
    <View style={styles.item}>
      <Image style={styles.item_img} source={{uri: item.photo}} />
      <Text style={styles.item_title}>{item.name}</Text>
      <TouchableOpacity
        onPress={() => {
          fetchAccept(email, item.email);
          listRequestFriend.splice(index, 1);
          setData(listRequestFriend);
        }}
        style={styles.button}>
        <Text style={styles.textStyle}>Chấp nhận</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          fetchUnFriend(item.email, email);
          listRequestFriend.splice(index, 1);
          setData(listRequestFriend);
        }}
        style={styles.button}>
        <Text style={styles.textStyle}>Từ chối</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item}) => <Item item={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flastlist}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.email}
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
  flastlist: {
    width: width,
    marginTop: height * 0.2,
  },
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopColor: '#FAFAFA',
  },
  item_title: {
    fontSize: 20,
    flex: 6,
  },
  item_img: {
    width: height,
    height,
    borderRadius: height * 0.5,
    resizeMode: 'center',
  },
  container_list_request: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A9F5F2',
  },
  text_list_request: {
    flex: 8,
    marginLeft: 20,
    fontSize: 20,
  },
  icon_list_request: {
    height: '100%',
    flex: 2,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default React.memo(ListRequestFriendScreen);
