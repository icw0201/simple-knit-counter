export type ColorStyleKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export type ColorStyle = {
  container: string;
  text: string;
  subtext: string;
  icon: string;
};

export const colorStyles: Record<ColorStyleKey, ColorStyle> = {
  A: {//흰색 배경에 회색 테두리
    container: 'bg-white border border-lightgray',
    text: 'text-black',
    subtext: 'text-darkgray',
    icon: '#111111',
  },
  B: {//B : 100에 테두리
    container: 'bg-red-orange-100 border border-red-orange-400',
    text: 'text-red-orange-950',
    subtext: 'text-red-orange-700',
    icon: '#490806',
  },
  C: {//C~E: 테두리 없이 200~400
    container: 'bg-red-orange-200',
    text: 'text-red-orange-950',
    subtext: 'text-red-orange-700',
    icon: '#490806',
  },
  D: {
    container: 'bg-red-orange-300',
    text: 'text-red-orange-950',
    subtext: 'text-red-orange-700',
    icon: '#490806',
  },
  E: {
    container: 'bg-red-orange-400',
    text: 'text-red-orange-950',
    subtext: 'text-red-orange-700',
    icon: '#490806',
  },
  F: {//100에 테두리 없음
    container: 'bg-red-orange-100',
    text: 'text-red-orange-500',
    subtext: 'text-red-orange-400',
    icon: '#fc3e39',
  },
  G: {//비활성
    container: 'bg-lightgray',
    text: 'text-black',
    subtext: 'text-black',
    icon: '#111111',
  },
};
