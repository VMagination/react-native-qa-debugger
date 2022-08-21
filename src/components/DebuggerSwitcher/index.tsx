import React, { FC, memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { styles } from './styles';
import { toggleDebugger } from '../../utils';

export const DebuggerSwitcher: FC = memo(() => {
  const onPress = () => {
    toggleDebugger();
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text allowFontScaling={false} style={styles.icon}>
        {'</>'}
      </Text>
    </TouchableOpacity>
  );
});
