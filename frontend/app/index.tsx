import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Bubble from "../components/Bubble";
import search from "../utils/api";

const Index = () => {
  const [bubbles, setBubbles] = useState([]);

  const addBubble = () => {
    const newBubble = {
      key: bubbles.length + 1,
      position: {
        x: Math.random() * 200,
        y: Math.random() * 400,
      },
      title: `Bubble ${bubbles.length + 1}`,
      content: null
    }
    setBubbles([...bubbles, newBubble])
  }

  const findSimilarStories = async (title, content) => {
    try {
      const text = title + ' ' + content;
      const results = await search(text);
      const newBubbles = results.map((result) => ({
        key: result.id,
        position: {
          x: Math.random() * 200,
          y: Math.random() * 400,
        },
        title: result.title,
        content: result.summary, 
      }));
      setBubbles((prev) => [...prev, ...newBubbles]);
    } catch (error) {
      console.error("Error finding similar stories:", error);
    }
  };
  
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.key}
            position={bubble.position}
            title={bubble.title}  
            content={bubble.content}
            findSimilarStories={findSimilarStories}
          />
        ))}
        <TouchableOpacity style={styles.bubbleButton} onPress={addBubble}>
          <Text style={styles.bubbleButtonText}>Add Bubble</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f0f2",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#333333",
    fontSize: 16,
    textAlign: "center",
  },
  contentText: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
  },
  bubbleButton: {
    position: "absolute",
    bottom: 50,
    padding: 15,
    backgroundColor: "#ffa07a",
    borderRadius: 10,
  },
  bubbleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Index;
