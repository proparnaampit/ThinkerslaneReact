import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// react-native-vector-icons' types pull in a second copy of @types/react,
// which makes TypeScript reject the icon classes as JSX components (TS2786).
// Casting here fixes it in one place; runtime behaviour is unchanged.
type IconComponent = React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
  style?: any;
}>;

export const FeatherIcon = Feather as unknown as IconComponent;
export const MaterialCommunityIcon =
  MaterialCommunityIcons as unknown as IconComponent;
