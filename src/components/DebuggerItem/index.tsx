import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { emptyFn } from '../../utils';

import { styles, getIconStyles } from './styles';
import { colors } from '../../constants';

export const DebuggerItem = React.memo(
  ({ item, prefix = '', onToggle }: any) => {
    const { width } = useWindowDimensions();
    const [show, setShow] = useState(false);

    const isObject = item && typeof item === 'object';

    useEffect(() => {
      onToggle?.(show);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const toggleSection = () => setShow((v) => !v);

    const preview = useMemo(
      () =>
        `${prefix} ${
          isObject
            ? `{ ${Object.entries(item)
                .reduce(
                  (accum, [key, value]) => [
                    ...accum,
                    `${key} : ${
                      value && typeof value === 'object' ? `{...}` : `${value}`
                    }`,
                  ],
                  [] as string[]
                )
                .join(', ')} }`
            : `${item}`
        }`,
      []
    );

    return (
      <View style={styles.wrapper}>
        <Pressable
          style={styles.pressable}
          onLongPress={emptyFn}
          onPress={toggleSection}
        >
          <View style={getIconStyles({ show, isObject })} />
          <Text
            style={{
              color: colors.textMain,
              maxWidth: prefix ? undefined : width - 74,
            }}
            numberOfLines={!isObject && show ? undefined : 1}
            selectable
          >
            {preview}
          </Text>
        </Pressable>
        {show && item && typeof item === 'object' && (
          <View style={styles.recursionSpacer}>
            {Object.entries(item).map(([key, value], index) => (
              <DebuggerItem key={index} prefix={`${key}: `} item={value} />
            ))}
          </View>
        )}
      </View>
    );
  }
);
