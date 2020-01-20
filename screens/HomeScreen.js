import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput
} from "react-native";

import db from "../db.js";

db.collection("messages").onSnapshot(querySnapshot => {
  var messages = [];
  querySnapshot.forEach(doc => {
    messages.push(doc.data());
  });
  console.log("Current messages ", messages);
});

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  const [from, setFrom] = useState("");
  const [text, setText] = useState("");
  const [to, setTo] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    db.collection("messages").onSnapshot(querySnapshot => {
      const messages = [];
      querySnapshot.forEach(doc => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      console.log("Current messages ", messages.join(", "));
      setMessages([...messages]);
    });
  }, []);

  const handleDelete = message => {
    db.collection("messages")
      .doc(message.id)
      .delete();
  };

  const handleEdit = message => {
    setFrom(message.from);
    setText(message.text);
    setTo(message.to);
    setId(message.id);
  };

  const handleSend = () => {
    if (id) {
      db.collection("messages")
        .doc(id)
        .update({ from, text, to });
    } else {
      db.collection("messages").add({ from, text, to });
    }
    setFrom("");
    setText("");
    setTo("");
    setId("");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {messages.map((message, i) => (
          <View style={styles.getStartedText} key={i}>
            <Text style={styles.getStartedText}>
              {message.from} {message.text} {message.to}
            </Text>
            <Button title="Edit" onPress={() => handleEdit(message)} />
            <Button title="Delete" onPress={() => handleDelete(message)} />
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="From"
        onChangeText={setFrom}
        value={from}
      />
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
