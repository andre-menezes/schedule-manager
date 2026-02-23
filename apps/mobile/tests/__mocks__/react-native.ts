export const Platform = {
  OS: 'ios',
  select: (obj: { ios?: unknown; android?: unknown; web?: unknown }) => obj.ios,
};

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
};

export const View = 'View';
export const Text = 'Text';
export const TextInput = 'TextInput';
export const TouchableOpacity = 'TouchableOpacity';
export const ActivityIndicator = 'ActivityIndicator';
export const Alert = {
  alert: jest.fn(),
};
