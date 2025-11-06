export type ColorStyleKey = 'default' | 'lightest' | 'light' | 'medium' | 'vivid';

export type ColorStyle = {
  container: string;
  text: string;
  subtext: string;
  icon: string;
};

export const colorStyles: Record<ColorStyleKey, ColorStyle> = {
  default: {//흰색 배경에 회색 테두리
    container: 'bg-white border border-lightgray',
    text: 'text-black',
    subtext: 'text-darkgray',
    icon: '#111111',
  },
  lightest: {//100에 테두리 없음
    container: 'bg-red-orange-100',
    text: 'text-red-orange-500',
    subtext: 'text-red-orange-400',
    icon: '#111111',
  },
  light: {//테두리 없이 200
    container: 'bg-red-orange-200',
    text: 'text-red-orange-950',
    subtext: 'text-red-orange-700',
    icon: '#490806',
  },
  medium: {//테두리 없이 300
    container: 'bg-red-orange-300',
    text: 'text-red-orange-950',
    subtext: 'text-red-orange-700',
    icon: '#490806',
  },
  vivid: {//테두리 없이 400
    container: 'bg-red-orange-400',
    text: 'text-red-orange-950',
    subtext: 'text-red-orange-700',
    icon: '#490806',
  },
};
