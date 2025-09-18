// Локальный генератор градиентов для презентации
export interface GradientConfig {
  gradient: string;
  colors: string[];
  direction: string;
  theme: string;
}

// Красивые цветовые палитры
const gradientPalettes = [
  // Профессиональные синие
  ['#667eea', '#764ba2'],
  ['#667eea', '#f093fb'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  
  // Теплые закаты
  ['#fa709a', '#fee140'],
  ['#ffecd2', '#fcb69f'],
  ['#ff9a9e', '#fecfef'],
  ['#ff8a80', '#ea4c46'],
  
  // Прохладный океан
  ['#a8edea', '#fed6e3'],
  ['#30cfd0', '#91a7ff'],
  ['#a1c4fd', '#c2e9fb'],
  ['#fbc2eb', '#a6c1ee'],
  
  // Фиолетовая магия
  ['#c471f5', '#fa71cd'],
  ['#b721ff', '#21d4fd'],
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  
  // Зеленая природа
  ['#56ab2f', '#a8e6cf'],
  ['#11998e', '#38ef7d'],
  ['#00b09b', '#96c93d'],
  ['#1e3c72', '#2a5298'],
  
  // Оранжевая энергия
  ['#ff7e5f', '#feb47b'],
  ['#ff6b6b', '#feca57'],
  ['#ffa726', '#fb8c00'],
  ['#ff9966', '#ff5722']
];

// Направления градиентов
const directions = [
  'to right',
  'to left', 
  'to bottom',
  'to top',
  'to bottom right',
  'to bottom left',
  'to top right',
  'to top left',
  '45deg',
  '135deg',
  '225deg',
  '315deg'
];

export function generateGradient(theme: string = 'random'): GradientConfig {
  let palette: string[];
  
  // Выбираем палитру по теме
  switch (theme) {
    case 'professional':
      palette = gradientPalettes[Math.floor(Math.random() * 4)]; // Синие
      break;
    case 'warm':
      palette = gradientPalettes[4 + Math.floor(Math.random() * 4)]; // Закаты
      break;
    case 'cool':
      palette = gradientPalettes[8 + Math.floor(Math.random() * 4)]; // Океан
      break;
    case 'creative':
      palette = gradientPalettes[12 + Math.floor(Math.random() * 4)]; // Фиолетовые
      break;
    case 'nature':
      palette = gradientPalettes[16 + Math.floor(Math.random() * 4)]; // Зеленые
      break;
    case 'energy':
      palette = gradientPalettes[20 + Math.floor(Math.random() * 4)]; // Оранжевые
      break;
    default:
      palette = gradientPalettes[Math.floor(Math.random() * gradientPalettes.length)]; // Случайный
  }
  
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const gradient = `linear-gradient(${direction}, ${palette[0]}, ${palette[1]})`;
  
  return {
    gradient,
    colors: palette,
    direction,
    theme
  };
}

export function generateVariations(count: number = 3): GradientConfig[] {
  const variations: GradientConfig[] = [];
  
  for (let i = 0; i < count; i++) {
    const palette = gradientPalettes[Math.floor(Math.random() * gradientPalettes.length)];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    
    variations.push({
      gradient: `linear-gradient(${direction}, ${palette[0]}, ${palette[1]})`,
      colors: palette,
      direction,
      theme: 'random'
    });
  }
  
  return variations;
}