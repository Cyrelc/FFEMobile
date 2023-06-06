import React, { useState } from 'react';
import { Pressable, View, Animated } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons'

export default function PressAndHoldButton({ onPress, icon }) {
  const [isPressing, setIsPressing] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

  const handlePressIn = () => {
    setIsPressing(true);
    startAnimation();
  };

  const handlePressOut = () => {
    setIsPressing(false);
    stopAnimation();
  };

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start(({finished}) => {
      if(finished)
        onPress();
    });
  };

  const stopAnimation = () => {
    animation.stopAnimation();
    animation.setValue(0);
  };

  const circleAnimationStyle = {
    height: animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <View style={{ position: 'relative' }}>
        <View
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            width: '78%',
            height: '78%',
            borderRadius: 38,
            overflow: 'hidden',
            transform: [{rotate: '180deg'}]
          }}
        >
          <Animated.View
            style={[
              {
                width: '100%',
                height: '200%',
                backgroundColor: 'mediumseagreen',
              },
              circleAnimationStyle,
            ]}
          />
        </View>
        <IconButton icon={icon} mode="outlined" style={{color: 'black', backgroundColor: isPressing ? 'transparent' : 'white'}} />
      </View>
    </Pressable>
  );
}
