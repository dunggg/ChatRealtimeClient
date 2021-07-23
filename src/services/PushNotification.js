import notifee, {
  AndroidGroupAlertBehavior,
  AndroidImportance,
  AndroidColor,
  EventType,
} from '@notifee/react-native';
import SocketClient from './SocketClient';
import store from '../reducers/store';

class PushNotification {
  constructor() {
    this.channelId = '123';
    this.check = false;
    this.onForegroundEvent();
    this.onBackgroundEvent();
  }

  async createChannelGroup() {
    await notifee.createChannelGroup({
      id: 'send-notification-importance-hight',
      name: 'send-notification-importance-hight',
    });
  }

  async createChannel() {
    // Assign the group to the channel
    await notifee.createChannel({
      id: this.channelId,
      name: 'New Comments',
      groupId: 'send-notification-importance-hight',
      importance: AndroidImportance.HIGH,
      vibration: true,
      lights: true,
      vibrationPattern: [300, 500],
      lightColor: AndroidColor.RED,
    });
  }

  async localNotification(data) {
    // if (!this.check) {
    //   await notifee.displayNotification({
    //     title: 'Friend Request',
    //     // subtitle: 'Friends Request',
    //     android: {
    //       channelId: this.channelId,
    //       groupSummary: true,
    //       groupId: 'send-notification-importance-hight',
    //       groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
    //       importance: AndroidImportance.HIGH,
    //       lights: [AndroidColor.RED, 300, 600],
    //       vibrationPattern: [300, 500],
    //     },
    //   });
    //   this.check = true;
    // }
    // Display a notification
    await notifee.displayNotification({
      id: data.userSend,
      title: 'Lời mời kết bạn',
      body: 'Bạn có một lời mời kết bạn từ ' + data.userSend,
      android: {
        channelId: this.channelId,
        color: '#4caf50',
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        groupId: 'send-notification-importance-hight',
        groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
        showTimestamp: true,
        importance: AndroidImportance.HIGH,
        largeIcon: data.picture,
        pressAction: {
          id: 'default',
        },
        vibrationPattern: [300, 500],
      },
    });
  }

  async localNotificationMessage(data) {
    // Display a notification
    await notifee.displayNotification({
      id: data.userSend,
      title: data.userSend,
      body: data.message,
      data: {
        idMessage: data.idMessage,
      },
      android: {
        channelId: this.channelId,
        color: '#4caf50',
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        groupId: 'send-notification-importance-hight',
        groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
        showTimestamp: true,
        importance: AndroidImportance.HIGH,
        largeIcon: data.picture,
        pressAction: {
          id: 'default',
        },
        vibrationPattern: [300, 500],
        actions: [
          {
            title: '<b>Like</b> &#128111;',
            pressAction: {id: 'dance'},
          },
          {
            title: 'Reply',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'reply',
            },
            input: true, // enable free text input
          },
        ],
      },
    });
  }

  onForegroundEvent() {
    notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          this.check = false;
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }

  onBackgroundEvent() {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (
        type === EventType.ACTION_PRESS &&
        detail.pressAction.id === 'reply'
      ) {
        const random = Math.floor(Math.random() * 100);
        await notifee.cancelNotification(detail.notification.id);
        const {email, photo} = store.getState().user;
        SocketClient.sendPrivate(
          email,
          detail.notification.id,
          detail.input,
          detail.notification.data.idMessage + random,
          photo,
        );
      }
    });
  }
}

export default new PushNotification();
