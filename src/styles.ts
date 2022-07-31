import { Dimensions, StyleSheet } from 'react-native';
import { colors } from './constants';

export * from './utils';

export const itemColorByType = (type?: string) => {
  switch (type || '') {
    case 'success':
      return 'lightgreen';
    case 'error':
      return 'red';
    case 'warning':
      return 'yellow';
    case 'info':
      return 'lightblue';
    default:
      return type;
  }
};

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  wrapper: {
    elevation: 100000,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    maxHeight: Math.max(height * 0.6, 300),
    backgroundColor: '#000000BB',
  },
  itemWrapper: {
    width: '100%',
    padding: 16,
    paddingBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIcon: {
    display: 'none',
    marginTop: 8,
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  itemLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  itemTime: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  itemType: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  itemCopyBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.separator,
  },
  itemCopyText: {
    color: colors.textSecondary,
  },
  itemScroll: {
    paddingBottom: 8,
  },
  itemScrollWrapperVisible: {
    paddingBottom: 8,
    marginBottom: 24,
  },
  itemScrollWrapper: {
    paddingBottom: 8,
    marginBottom: 0,
  },
  titleWrapper: {
    alignItems: 'center',
    padding: 8,
  },
  title: {
    color: colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  flex: {
    flex: 1,
  },
  separator: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: colors.separator,
  },
  emptyWrapper: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
  },
  buttonText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  button: {
    padding: 8,
    flex: 1,
    alignItems: 'center',
  },
  sendButton: {
    marginHorizontal: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  sendToInput: {
    color: colors.textSecondary,
    margin: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    flex: 1,
  },
  centralButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.separator,
  },
  buttonSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.separator,
    borderTopWidth: 1,
  },
});
