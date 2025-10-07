type CommissionRuleItem = {
  min: number;
  max: number;
  value: number;
};

type CommissionRulesMap = {
  sale: Record<string, CommissionRuleItem[]>;
  profit: Record<string, CommissionRuleItem[]>;
};

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

function getStoreSizeKey(storeSize: string) {
  const normalized = normalizeText(storeSize);

  // Si es una tienda pequeña, mediana o grande -> agrupar en la misma clave
  if (
    ['GRANDE', 'MEDIANA', 'PEQUENA', 'EXPRESS'].includes(normalized)
  ) {
    return 'GRANDE-MEDIANA-PEQUEÑA-EXPRESS';
  }

  if (
    normalized.includes('GRANDE') &&
    normalized.includes('MEDIANA') &&
    normalized.includes('PEQUENA') &&
    normalized.includes('EXPRESS')
  ) {
    return 'GRANDE-MEDIANA-PEQUEÑA-EXPRESS';
  }

  if (normalized.includes('EXTRA') && normalized.includes('GRANDE')) {
    return 'EXTRA - GRANDE';
  }

  return storeSize;
}


export function transformCommissionRules(data: any[]): CommissionRulesMap {
  const result: CommissionRulesMap = { sale: {}, profit: {} };

  for (const rule of data) {
    const name = rule.parameterLine.name.toUpperCase();
    const isProfit = name.includes('UTILIDAD');
    const category = isProfit ? 'profit' : 'sale';

    const storeSizeKey = getStoreSizeKey(rule.parameterLine.groupProductLine);

    if (!result[category][storeSizeKey]) {
      result[category][storeSizeKey] = [];
    }

    result[category][storeSizeKey].push({
      min: parseFloat(rule.minComplace),
      max: parseFloat(rule.maxComplace),
      value: parseFloat(rule.commissionPercentage),
    });
  }

  return result;
}

export function getCommissionPercent(
  rules: CommissionRulesMap,
  storeSize: string,
  compliance: number,
  type: 'sale' | 'profit'
): {percent: number,calculate_rule:number} {
  const storeKey = getStoreSizeKey(storeSize);

  const storeRules = rules[type][storeKey];

  if (!storeRules || storeRules.length === 0) {
    return {percent: 0,calculate_rule:0};
  }

  const sortedRules = storeRules.slice().sort((a, b) => a.min - b.min);
  for (const rule of sortedRules) {
    if (compliance >= rule.min && compliance <= rule.max) {
      return {percent: parseFloat(rule.value.toFixed(2)),calculate_rule:rule.min};
    }
  }

  const maxRule = sortedRules[sortedRules.length - 1];
  if (compliance > maxRule.max) {
    return {percent: parseFloat(maxRule.value.toFixed(2)),calculate_rule:maxRule.min};
  }

  return {percent: 0,calculate_rule:0};
}

