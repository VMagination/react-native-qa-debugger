import React, { useCallback } from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  multiply,
  Debugger,
  addLogItem,
  toggleDebugger,
} from 'react-native-qa-debugger';

toggleDebugger(true);

export default function App() {
  const [result, setResult] = React.useState(2);

  React.useEffect(() => {
    multiply(result / 2 + 1, 2).then(setResult);
    addLogItem({
      label: result,
      asd: { 1: 1, 2: 3 },
      a: {
        asdasdasdas1: {
          asdasdasdasasdaasdasdasdasasdasdasdassdasdasasdasdasdas1:
            'asdasdasdas',
          asdasdasdas2: { ddddd: null },
        },
      },
    });
    addLogItem({
      label: result,
      type: 'response',
      data: 'long ass string asd asd ad asd asd a das das dsad asd a asd a das dasd asd a',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResultPress = () => {
    multiply(result / 2 + 1, 2).then(setResult);
    toggleDebugger(true);
    addLogItem({
      label: result,
      logType: 'success',
      a: { asdb: { wasd: 'asdasdasdas', sad: { ddddd: null } } },
    });
    addLogItem({
      logType: 'error',
      label: result,
      type: 'request',
      data: 'long ass string asd asd ad asd asd a das das dsad asd a asd a das dasd asd a',
    });
  };

  const getGlobalState = useCallback(() => {
    return { result };
  }, [result]);

  return (
    <View style={styles.container}>
      <Debugger getGlobalState={getGlobalState} />
      <TouchableOpacity onPress={handleResultPress}>
        <Text>Result: {result}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
