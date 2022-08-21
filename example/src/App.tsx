import React, { useCallback } from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  Debugger,
  logToDebugger,
  toggleDebugger,
  // @ts-ignore
} from 'react-native-qa-debugger';

toggleDebugger(true);

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export default function App() {
  const [result, setResult] = React.useState(2);

  React.useEffect(() => {
    multiply(result / 2 + 1, 2).then(setResult);
    logToDebugger({
      label: 'https://backend.com/v1.69/api/',
      type: 'response',
      logType: 'error',
      data: {
        veryDescriptiveError: 'Internal error',
        goodLuck: true,
      },
    });
    logToDebugger({
      label: 'https://backend.com/v1.420/api/',
      type: 'request',
      data: { body: { a: 1, b: 2 }, method: 'GET' },
      /*asd: { 1: 1, 2: 3 },
      a: {
        asdasdasdas1: {
          asdasdasdasasdaasdasdasdasasdasdasdassdasdasasdasdasdas1:
            'asdasdasdas',
          asdasdasdas2: { ddddd: null },
        },
      },*/
    });
    logToDebugger({
      label: 'https://backend.com/v1.420/api/',
      type: 'response',
      logType: 'success',
      data: {
        nestedObject: { object: { a: 1, b: 2 } },
        primitiveField: 'useful text',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResultPress = () => {
    multiply(result / 2 + 1, 2).then(setResult);
    toggleDebugger(true);
    logToDebugger({
      label: result,
      logType: 'success',
      a: { asdb: { wasd: 'asdasdasdas', sad: { ddddd: null } } },
    });
    logToDebugger({
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
      <TouchableOpacity onPress={handleResultPress}>
        <Text>Result: {result}</Text>
      </TouchableOpacity>
      <Debugger getGlobalState={getGlobalState} />
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
