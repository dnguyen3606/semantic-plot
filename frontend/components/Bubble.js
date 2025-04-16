import React, { useState } from "react";
import { Text, TextInput, StyleSheet, View, ScrollView } from "react-native";
import { TouchableOpacity, Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolate, withDecay } from "react-native-reanimated";
import { COLORS } from "../utils/colors";
import { screenHeight, screenWidth } from "../utils/dimensions";

const Bubble = ({ position: initPosition, title: initTitle, content: initContent, findSimilarStories }) => {
    const [expanded, setExpanded] = useState(false);
    const [title, setTitle] = useState(initTitle);
    const [content, setContent] = useState(initContent);
    const animation = useSharedValue(0);
    const position = {x: useSharedValue(initPosition.x), y: useSharedValue(initPosition.y)};
    const offset = {x: useSharedValue(0), y: useSharedValue(0)};
    const [dragging, isDragging] = useState(false);

    //toggle circle <-> rectangle expansion
    const toggleExpansion = () => {
        animation.value = withSpring(expanded ? 0 : 1);
        setExpanded(!expanded);
    };
    
    //gesture handler, grabbing, momentum physics, etc.
    const tap = Gesture.Tap()
        .onBegin(() => {
            //feedback, opacity?
        })
        .onTouchesUp(() => {
            expanded ? null : toggleExpansion();
        })
    const drag = Gesture.Pan()
        .onStart(() => {
            isDragging(true);
            offset.x.value = position.x.value;
            offset.y.value = position.y.value;
        })
        .onChange((event) => {
            position.x.value = event.translationX + offset.x.value;
            position.y.value = event.translationY + offset.y.value;
        })
        .onFinalize((event) => {
            isDragging(false);
            position.x.value = withDecay({
                velocity: Math.abs(event.velocityX) > 250 ? event.velocityX * 0.5 : 0,
            });
            position.y.value = withDecay({
                velocity: Math.abs(event.velocityY) > 250 ? event.velocityY * 0.5 : 0,
            });
        })

    const composed = Gesture.Race(drag, tap);

    React.useEffect(() => {
        if (!dragging) {
            const interval = setInterval(() => {
                if ((!expanded && (
                    position.x.value <= -(screenWidth / 2) + 75 ||
                    position.x.value >= screenWidth / 2 - 75 ||
                    position.y.value <= -(screenHeight / 2) + 75 ||
                    position.y.value >= screenHeight / 2 - 75)) ||
                    (expanded && (
                    position.x.value <= -(screenWidth / 2) + 150 ||
                    position.x.value >= screenWidth / 2 - 150 ||
                    position.y.value <= -(screenHeight / 2) + 200 ||
                    position.y.value >= screenHeight / 2 - 200))
                ) {
                    position.x.value = withSpring(0);
                    position.y.value = withSpring(0);
                }
            }, 20);
            return () => clearInterval(interval);
        }
    }, [dragging, expanded, position]);

    // state-based styling + animated style
    const bubbleAnimation = useAnimatedStyle(() => ({
        transform: [{translateX: position.x.value}, {translateY: position.y.value}],
        width: interpolate(
            animation.value,
            [0,1], [100,300]
        ),
        height: interpolate(
            animation.value,
            [0,1], [100,400]
        ),
        borderRadius: interpolate(
            animation.value,
            [0,1], [50,20]
        ),
    }));

    return (
        <GestureDetector gesture={composed}>
            <Animated.View
            style={[(expanded ? styles.rectangle : styles.bubble), bubbleAnimation]} 
            >
                { !expanded ? (
                    <Text style={styles.bubbleTitle}>{title}</Text>
                ) : (
                    <View style={{flex: 1}}>
                        <View style={styles.rectangleTitleView}>
                            <TextInput 
                            defaultValue={title} 
                            onChangeText={setTitle} 
                            style={styles.titleText}
                            />
                            <TouchableOpacity style={styles.closeButton} onPress={toggleExpansion}>
                                <Text style={styles.closeButton}>x</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>
                            <TextInput 
                            defaultValue={content}
                            onChangeText={setContent}
                            multiline 
                            style={styles.contentText}
                            />
                        </ScrollView>
                        <View style={styles.rectangleContentToolBar}>
                            <TouchableOpacity onPress={() => findSimilarStories(title, content)}>
                                <Text>Find similar stories</Text>
                            </TouchableOpacity>
                            <Text>literally nothing lol</Text>
                        </View>
                    </View>
                )}
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    bubble: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightblue,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    bubbleTitle: {
        alignSelf: 'center',
        justifyContent: 'center',
        color: COLORS.darkText,
        fontSize: 16,
    },
    rectangle: {
        position: 'absolute',
        backgroundColor: COLORS.orange,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        padding: 10,
    },
    touchableContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    rectangleTitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50, 
    },
    titleText: {
        flex: 1,
        width: 1,
        fontSize: 21,
        padding: 5,
    }, 
    closeButton: {
        alignSelf: 'center',
        padding: 5,
        color: COLORS.orange2,
    },
    contentText: {
        flex: 1, 
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.darkText,
        borderRadius: 5,
    },
    rectangleContentToolBar: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 5,
        height: 50,
    }
});

export default Bubble;