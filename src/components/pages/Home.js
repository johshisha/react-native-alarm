import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, PushNotificationIOS, DatePickerIOS, Dimensions, Switch } from 'react-native';

import PushNotification from 'react-native-push-notification';

PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        console.log( 'TOKEN:', token );
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );

        // process the notification

        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "YOUR GCM (OR FCM) SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      setTime: new Date(),
      switchValue: false,
      notifications: [],
    }
  }

  _handleDatePicked(date) {
    if (Date.now() > Date(date)) {
      date.setDate(date.getDate()+1);
    }
    date.setSeconds(0);
    console.log('will handle date picked')
    this.fetchNotifiers()
    console.log('done handle date picked')
    this.setState({setTime: date})
  }

  fetchNotifiers() {
    let notifications = []
    PushNotificationIOS.getScheduledLocalNotifications(res => {
      res.map(notif => { notifications.push(notif.fireDate) })
      console.log('will set notifications')
      this.setState(notifications)
      console.log('done set notifications')
    })
  }

  render() {
    console.log('getScheduledLocalNotifications')
    console.log(this.state.notifications)
    return (
      <View style={[styles.container, { flex: 1 }]}>
        <View>
          <Text>Registered Notifications</Text>
          {this.state.notifications.map((notif) => {
            console.log(notif)
            return (<Text>{notif}</Text>)
          })}
        </View>
        <DatePickerIOS
          date={this.state.setTime}
          onDateChange={this._handleDatePicked.bind(this)}
          mode={'time'}
          style={{width: Dimensions.get("window").width}}
        />
        <Switch
          onValueChange={this.toggleSwitch.bind(this)}
          value={this.state.switchValue}
        />
      </View>
    );
  }

  toggleSwitch(value) {
    this.setState({switchValue: value})
    if (value) {
      this.setNotification()
    } else {
      this.cancelNotification()
    }
  }

  turnOffSwitch() {
    this.setState({switchValue: false})
  }

  setNotification() {
    console.log("notification")
    console.log(this.state.setTime || new Date(Date.now() + (6 * 1000)))
    PushNotification.localNotificationSchedule({
      /* iOS and Android properties */
      userInfo: { id: '123', value: 'test' },
      title: "My Notification Title", // (optional)
      message: "My Notification Message", // (required)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
      date: this.state.setTime
    });
  }

  cancelNotification() {
    console.log("cancel notification")
    PushNotification.cancelLocalNotifications({id: '123'});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});


export default Home
