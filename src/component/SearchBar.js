import * as React from 'react';
import {View, ToastAndroid, Dimensions} from 'react-native';
import {Searchbar} from 'react-native-paper';
import UserInfo from './Modal/UserInfo';
import {useSelector} from 'react-redux';
import Server from '../dev/Server';

const MyComponent = ({navigation}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [userSearch, setUserSearch] = React.useState({});
  const {email} = useSelector(state => state.user);

  const showToast = message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const findUser = email => {
    fetch(Server.url + '/users/find?email=' + email)
      .then(result => result.json())
      .then(data => {
        if (data.statusCode === 200) {
          setUserSearch(data.data);
          setModalVisible(true);
        } else if (data.statusCode === 404) {
          showToast('Không tìm thấy người này');
        } else {
          showToast('Lỗi Server vui lòng thử lại sau');
        }
      })
      .catch(err => console.error(err));
  };

  const onChangeSearch = query => setSearchQuery(query.trim());

  return (
    <View>
      <Searchbar
        onSubmitEditing={() => {
          if (searchQuery.trim() === email) {
            return showToast('Đã có lỗi xảy ra');
          }
          findUser(searchQuery.trim());
        }}
        blurOnSubmit={true}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <UserInfo
        navigation={navigation}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        user={userSearch}
      />
    </View>
  );
};

export default React.memo(MyComponent);
