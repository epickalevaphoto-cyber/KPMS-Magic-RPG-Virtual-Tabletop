export interface DiceRoll {
  id: string;
  userId: string;
  userName: string;
  diceType: 'd6' | 'd10' | 'd100' | 'custom';
  diceCount: number;
  modifier: number;
  results: number[];
  total: number;
  timestamp: number;
  reason?: string;
}

export function rollSingleDice(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollDice(count: number, sides: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    results.push(rollSingleDice(sides));
  }
  return results;
}

export function rollD6(count: number = 1, modifier: number = 0): DiceRoll {
  const results = rollDice(count, 6);
  const total = results.reduce((sum, r) => sum + r, 0) + modifier;
  return {
    id: `roll_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: 'system',
    userName: 'Система',
    diceType: 'd6',
    diceCount: count,
    modifier: modifier,
    results: results,
    total: total,
    timestamp: Date.now()
  };
}

export function rollD10(count: number = 1, modifier: number = 0): DiceRoll {
  const results = rollDice(count, 10);
  const total = results.reduce((sum, r) => sum + r, 0) + modifier;
  return {
    id: `roll_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: 'system',
    userName: 'Система',
    diceType: 'd10',
    diceCount: count,
    modifier: modifier,
    results: results,
    total: total,
    timestamp: Date.now()
  };
}

export function rollD100(modifier: number = 0): DiceRoll {
  const result = rollSingleDice(100);
  return {
    id: `roll_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: 'system',
    userName: 'Система',
    diceType: 'd100',
    diceCount: 1,
    modifier: modifier,
    results: [result],
    total: result + modifier,
    timestamp: Date.now()
  };
}

export function rollCheck(characteristic: number, skill: number, modifier: number = 0, difficulty: number = 12): DiceRoll & { success: boolean; degree: 'critical' | 'success' | 'failure' | 'fumble' } {
  const roll = rollSingleDice(10);
  const total = roll + characteristic + skill + modifier;
  let degree: 'critical' | 'success' | 'failure' | 'fumble';
  if (roll === 1) degree = 'fumble';
  else if (roll === 10) degree = 'critical';
  else if (total >= difficulty) degree = 'success';
  else degree = 'failure';
  return {
    id: `check_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: 'system',
    userName: 'Система',
    diceType: 'd10',
    diceCount: 1,
    modifier: characteristic + skill + modifier,
    results: [roll],
    total: total,
    timestamp: Date.now(),
    success: degree === 'success' || degree === 'critical',
    degree: degree
  };
}

let rollHistory: DiceRoll[] = [];

export function addToHistory(roll: DiceRoll): void {
  rollHistory.unshift(roll);
  if (rollHistory.length > 100) rollHistory = rollHistory.slice(0, 100);
  try {
    localStorage.setItem('kpms_roll_history', JSON.stringify(rollHistory));
  } catch (e) { console.error('Error saving roll history:', e); }
}

export function getRollHistory(): DiceRoll[] {
  try {
    const stored = localStorage.getItem('kpms_roll_history');
    if (stored) {
      rollHistory = JSON.parse(stored);
      return rollHistory;
    }
  } catch (e) { console.error('Error loading roll history:', e); }
  return rollHistory;
}

export function clearRollHistory(): void {
  rollHistory = [];
  localStorage.removeItem('kpms_roll_history');
}

export function formatRollText(roll: DiceRoll): string {
  let text = `🎲 **${roll.userName}** бросил`;
  if (roll.diceType === 'd100') text += ` d100`;
  else text += ` ${roll.diceCount}${roll.diceType}`;
  if (roll.modifier !== 0) text += ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}`;
  text += `: **${roll.results.join(' + ')}**`;
  if (roll.modifier !== 0) text += ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}`;
  text += ` = **${roll.total}**`;
  if ('degree' in roll) {
    const check = roll as any;
    if (check.degree === 'critical') text += ' 🎉 Критический успех!';
    else if (check.degree === 'fumble') text += ' 💀 Критический провал!';
    else if (check.success) text += ' ✅ Успех!';
    else text += ' ❌ Провал!';
  }
  return text;
}
