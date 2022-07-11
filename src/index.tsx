import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { resetLogItems, toggleDebugger, useDebugItems } from './utils';
import Clipboard from '@react-native-clipboard/clipboard';
import { useShowDebugger } from './utils/useShowDebugger';
import { DebuggerItem } from './components/DebuggerItem';
import { styles, itemColorByType } from './styles';
import { DebuggerState } from './state';

export * from './utils';
export * from './components';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

const Item = ({ item }: any) => {
  const [visible, setVisible] = useState(false);

  const handleCopyPress = () =>
    Clipboard.setString(`'${JSON.stringify(item)}'`);

  const colorByType = itemColorByType(item.logType);

  const textColor = { color: colorByType };
  const iconColor = { backgroundColor: colorByType };

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.itemHeader}>
        <View style={[styles.itemIcon, iconColor]} />
        <View>
          <Text selectable style={[styles.itemLabel, textColor]}>
            {item.label}
          </Text>
          <Text selectable style={[styles.itemTime, textColor]}>
            {item.timestamp}
          </Text>
          {Boolean(item.type) && (
            <Text selectable style={[styles.itemType, textColor]}>
              {item.type}
            </Text>
          )}
        </View>
      </View>
      <ScrollView
        style={
          visible ? styles.itemScrollWrapperVisible : styles.itemScrollWrapper
        }
        contentContainerStyle={item.itemScroll}
        horizontal
      >
        <DebuggerItem onToggle={setVisible} item={item.data} />
      </ScrollView>
      {visible && (
        <Pressable onPress={handleCopyPress} style={styles.itemCopyBtn}>
          <Text style={styles.itemCopyText}>Copy</Text>
        </Pressable>
      )}
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;

const EmptySection = () => (
  <View style={styles.emptyWrapper}>
    <Text style={styles.emptyText}>No events captured yet</Text>
  </View>
);

const keyExtractor = ({ id }: { id: string | number }) => `${id}`;

type Props = {
  getGlobalState?: () => Record<any, any>;
};

const renderItem = ({ item }: any) => <Item item={item} />;

export const Debugger: FC<Props> = React.memo(({ getGlobalState }) => {
  const [debugItems] = useDebugItems();
  const [show] = useShowDebugger();
  console.log({ debugItems });
  useEffect(() => {
    DebuggerState.isMounted = true;
    return () => {
      DebuggerState.isMounted = false;
    };
  }, []);

  useEffect(() => {
    DebuggerState.getGlobalState = getGlobalState;
  }, [getGlobalState]);

  const handleClose = () => toggleDebugger(false);

  const handleGetGlobalState = () =>
    getGlobalState && Clipboard.setString(JSON.stringify(getGlobalState?.()));

  const handleCopyAll = () => {
    Clipboard.setString(JSON.stringify(debugItems));
  };

  return show ? (
    <View style={styles.wrapper}>
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
        <Pressable onPress={handleCopyAll} style={styles.button}>
          <Text style={styles.buttonText}>Copy all items</Text>
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
      <View style={styles.buttonSection}>
        <Pressable onPress={handleGetGlobalState} style={styles.button}>
          <Text style={styles.buttonText}>Copy global state</Text>
        </Pressable>
      </View>
    </View>
  ) : null;
});
