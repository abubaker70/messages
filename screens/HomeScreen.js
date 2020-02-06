import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";

import Message from "./Message";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  Dimensions
} from "react-native";

import db from "../db.js";
import firebase from "firebase/app";
import "firebase/auth";
import SettingsScreen from "./SettingsScreen.js";

db.collection("messages").onSnapshot(querySnapshot => {
  var messages = [];
  querySnapshot.forEach(doc => {
    messages.push(doc.data());
  });
  console.log("Current messages ", messages);
});

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [to, setTo] = useState("");
  const [id, setId] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);

  const handleLoca = async () => {
    const snap = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    setLat(snap.data().lat);
    setLong(snap.data().long);
    console.log(snap.data().lat);
    console.log(snap.data().long);
  };
  useEffect(() => {
    handleLoca();
  }, []);

  useEffect(() => {
    db.collection("messages").onSnapshot(querySnapshot => {
      const messages = [];
      querySnapshot.forEach(doc => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      // console.log("Current messages ", messages.join(", "));
      setMessages([...messages]);
    });
  }, []);

  useEffect(() => {
    console.log("Auth: ", firebase.auth());
  }, []);

  const handleEdit = message => {
    setText(message.text);
    setTo(message.to);
    setId(message.id);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const handleSend = () => {
    const from = firebase.auth().currentUser.uid;
    if (id) {
      db.collection("messages")
        .doc(id)
        .update({ from, text, to });
    } else {
      db.collection("messages").add({ from, text, to });
    }

    setText("");
    setTo("");
    setId("");
  };

  const loca = {
    latitude: 25.3548,
    longitude: 51.1839,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Button title="Logout" onPress={handleLogout} />
        {messages.map((message, i) => (
          <Message key={i} message={message} handleEdit={handleEdit} />
        ))}
      </ScrollView>

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="Text"
        onChangeText={setText}
        value={text}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="To"
        onChangeText={setTo}
        value={to}
      />
      <Button title="Send" onPress={handleSend} />
      <MapView
        showsUserLocation={true}
        initialRegion={loca}
        style={styles.mapStyle}
      >
        <Marker
          coordinate={{
            latitude: lat,
            longitude: long
          }}
          title={"You"}
          description={"You Are Here"}
        />
      </MapView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not i development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/development-mode/"
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes"
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
