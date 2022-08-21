import React, { useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { itemColorByType, styles } from '../../styles';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { DebuggerItem } from '../DebuggerItem';

export const ListItem = ({ item }: any) => {
  const [visible, setVisible] = useState(false);

  const handleCopyPress = () =>
    Clipboard.setString(
      JSON.stringify({
        ...item,
        snapshot: undefined,
        snapshotReadable: undefined,
      })
    );

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
