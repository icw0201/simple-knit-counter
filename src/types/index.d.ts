// Shared types here

/// <reference types="nativewind/types" />

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare global {
  var _REACT_NATIVE_NEW_ARCH_ENABLED: boolean;
}
