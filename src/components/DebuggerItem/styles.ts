import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 4,
    alignItems: 'flex-start',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  recursionSpacer: {
    paddingLeft: 4,
  },
});

export const getIconStyles = ({
  show,
  isObject,
}: {
  show: boolean;
  isObject: boolean;
}) => ({
  marginRight: 4,
  borderTopWidth: show ? 6 : 4,
  borderRightWidth: show ? 4 : 0,
  borderBottomWidth: !show ? 4 : 0,
  borderLeftWidth: !show ? 6 : 4,
  borderTopColor: isObject && show ? 'lightgray' : 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: 'transparent',
  borderLeftColor: isObject && !show ? 'lightgray' : 'transparent',
});
