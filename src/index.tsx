import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
  SafeAreaView,
  Keyboard,
  useWindowDimensions,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { resetLogItems, toggleDebugger, useDebugItems } from './utils';
import Clipboard from '@react-native-clipboard/clipboard';
import { useShowDebugger } from './utils/useShowDebugger';
import { styles } from './styles';
import { DebuggerState } from './state';
import type { Props } from './types';
import { ListItem } from './components/ListItem';
import { DebuggerSwitcher } from './components/DebuggerSwitcher';
import { getCompleteDebugItems } from './utils/getCompleteDebugItems';

export {
  resetLogItems,
  logToDebugger,
  useShowDebugger,
  useDebugItems,
  toggleDebugger,
  getCompleteDebugItems,
  addLogItem,
} from './utils';
export { DebuggerSwitcher } from './components';

const Separator = () => <View style={styles.separator} />;

const EmptySection = () => (
  <View style={styles.emptyWrapper}>
    <Text style={styles.emptyText}>No events captured yet</Text>
  </View>
);

const keyExtractor = ({ id }: { id: string | number }) => `${id}`;

const renderItem = ({ item }: any) => <ListItem item={item} />;

export const Debugger: FC<Props> = React.memo(
  ({
    getGlobalState,
    disableSnapshots,
    sendToDefaultValue,
    customSendRequest,
    hideSwitcher,
  }) => {
    const { height } = useWindowDimensions();

    const [debugItems] = useDebugItems();
    const [show] = useShowDebugger();
    const [sendTo, setSendTo] = useState(sendToDefaultValue ?? '');
    const [forceHeight, setForceHeight] = useState<null | number>(null);

    useEffect(() => {
      DebuggerState.isMounted = true;
      return () => {
        DebuggerState.isMounted = false;
      };
    }, []);

    useEffect(() => {
      DebuggerState.getGlobalState = getGlobalState;
      DebuggerState.areSnapshotsEnabled = Boolean(
        !disableSnapshots && getGlobalState
      );
    }, [getGlobalState, disableSnapshots]);

    const handleClose = () => toggleDebugger(false);

    const handleGetGlobalState = async () => {
      try {
        if (getGlobalState) {
          Clipboard.setString(JSON.stringify(await getGlobalState?.()));
          Alert.alert('Global state copied to clipboard');
        }
      } catch {}
    };
    const handleCopyItems = async () => {
      try {
        const completeDebugItems = await getCompleteDebugItems(debugItems);
        const clipboardString = JSON.stringify(completeDebugItems);
        Clipboard.setString(clipboardString);
        const saved = await Clipboard.getString();
        if (saved === clipboardString) {
          Alert.alert('Items copied to clipboard');
        } else {
          Alert.alert(
            'Failed to copy, might be too many items, try sending instead'
          );
        }
      } catch {
        Alert.alert('Failed to copy, try sending instead');
      }
    };

    const handleSend = async () => {
      if (!sendTo) return;

      const completeDebugItems = await getCompleteDebugItems(debugItems);
      if (sendTo.includes('@') && !sendTo.includes('/')) {
        const canSendEmail = await Linking.canOpenURL(`mailto:${sendTo}`);
        if (canSendEmail) {
          Linking.openURL(
            `mailto:${sendTo}?subject=logs${new Date().toISOString()}&body=${JSON.stringify(
              completeDebugItems
            )}`
          );
        } else {
          Alert.alert('Cannot send email');
        }
      } else if (customSendRequest && typeof customSendRequest === 'function') {
        customSendRequest(sendTo, completeDebugItems);
      } else {
        // 	https://webhook.site/ab0c53e9-a21e-4b46-ab4c-02fe9b6cac93
        fetch(sendTo.trim(), {
          method: 'POST',
          body: JSON.stringify(completeDebugItems),
        })
          .then(() => {
            Alert.alert('Success', `Logs sent to ${sendTo.trim()}`);
          })
          .catch(() => {
            Alert.alert('Error', `Could not send logs to ${sendTo.trim()}`);
          });
      }
    };

    useEffect(() => {
      const openListener = Keyboard.addListener(
        'keyboardDidShow',
        ({ endCoordinates }) => {
          setForceHeight(height - endCoordinates.height - 24);
        }
      );
      const hideListener = Keyboard.addListener('keyboardDidHide', () => {
        setForceHeight(null);
      });
      return () => {
        openListener.remove();
        hideListener.remove();
      };
    }, [height]);

    return (
      <>
        {show ? (
          <SafeAreaView
            style={[
              styles.wrapper,
              forceHeight ? { maxHeight: forceHeight } : false,
            ]}
          >
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>QA DEBUGGER</Text>
            </View>
            <FlatList
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.flex}
              ItemSeparatorComponent={Separator}
              data={debugItems}
              ListEmptyComponent={EmptySection}
              renderItem={renderItem}
            />
            <View style={styles.buttonSection}>
              <Text style={styles.buttonText}> Send to</Text>
              <TextInput
                style={styles.sendToInput}
                value={sendTo}
                onChangeText={setSendTo}
              />
              {Boolean(sendTo) && (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSend}
                >
                  <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
              )}
            </View>
            {Boolean(getGlobalState) && (
              <View style={styles.buttonSection}>
                <Pressable onPress={handleGetGlobalState} style={styles.button}>
                  <Text style={styles.buttonText}>Copy global state</Text>
                </Pressable>
              </View>
            )}
            <View style={styles.buttonSection}>
              <Pressable onPress={handleCopyItems} style={styles.button}>
                <Text style={styles.buttonText}>Copy items</Text>
              </Pressable>
              <Pressable
                onPress={resetLogItems}
                style={[styles.button, styles.centralButton]}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </Pressable>
              <Pressable onPress={handleClose} style={styles.button}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        ) : null}
        {!hideSwitcher && (
          <View style={styles.switcher}>
            <DebuggerSwitcher />
          </View>
        )}
      </>
    );
  }
);
