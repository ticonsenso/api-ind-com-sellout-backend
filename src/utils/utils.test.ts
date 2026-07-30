import {
  chunkArray,
  parseEuropeanNumber,
  generateSearchProductKey,
  generateSearchStoreKey,
  getMonthRange,
} from "./utils";

describe("chunkArray", () => {
  it("divide un arreglo en chunks del tamaño indicado", () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("devuelve un solo chunk si el tamaño es mayor al arreglo", () => {
    expect(chunkArray([1, 2], 10)).toEqual([[1, 2]]);
  });

  it("devuelve un arreglo vacío para entrada vacía", () => {
    expect(chunkArray([], 5)).toEqual([]);
  });
});

describe("parseEuropeanNumber", () => {
  it("parsea formato europeo con miles y decimales: '34.287,23'", () => {
    expect(parseEuropeanNumber("34.287,23")).toBeCloseTo(34287.23);
  });

  it("parsea formato con solo coma decimal: '34287,23'", () => {
    expect(parseEuropeanNumber("34287,23")).toBeCloseTo(34287.23);
  });

  it("parsea separador de miles con solo puntos: '1.234'", () => {
    expect(parseEuropeanNumber("1.234")).toBe(1234);
  });

  it("parsea decimal normal con punto: '12.5'", () => {
    expect(parseEuropeanNumber("12.5")).toBeCloseTo(12.5);
  });

  it("parsea enteros puros", () => {
    expect(parseEuropeanNumber("34287")).toBe(34287);
  });

  it("devuelve el mismo valor si ya es number", () => {
    expect(parseEuropeanNumber(42)).toBe(42);
  });

  it("devuelve 0 para valor vacío", () => {
    expect(parseEuropeanNumber("")).toBe(0);
  });
});

describe("generateSearchProductKey / generateSearchStoreKey", () => {
  it("concatena y normaliza a mayúsculas sin espacios extremos", () => {
    expect(generateSearchProductKey(" dist ", "storeA", "prod1")).toBe(
      "DIST STOREAPROD1"
    );
  });

  it("genera la misma clave para el mismo par distribuidor/tienda", () => {
    const key1 = generateSearchStoreKey("DIST", "TIENDA1");
    const key2 = generateSearchStoreKey("DIST", "TIENDA1");
    expect(key1).toBe(key2);
  });

  it("genera claves distintas para tiendas distintas", () => {
    const key1 = generateSearchStoreKey("DIST", "TIENDA1");
    const key2 = generateSearchStoreKey("DIST", "TIENDA2");
    expect(key1).not.toBe(key2);
  });
});

/**
 * getMonthRange reemplaza filtros "EXTRACT(YEAR)=y AND EXTRACT(MONTH)=m" (no
 * sargables, ignoran cualquier índice) por un rango >= inicio AND < inicio
 * del mes siguiente. Estas pruebas verifican que el rango sea EXACTAMENTE
 * equivalente al filtro EXTRACT original para cualquier día del mes, sin
 * asumir que la fecha guardada siempre es el día 1.
 */
describe("getMonthRange", () => {
  function matchesExtractYearMonth(dateStr: string, year: number, month: number): boolean {
    const d = new Date(dateStr + "T00:00:00Z");
    return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month;
  }

  function isInRange(dateStr: string, start: string, end: string): boolean {
    return dateStr >= start && dateStr < end; // comparación lexicográfica ISO = comparación cronológica
  }

  it("produce inicio de mes y siguiente mes en formato YYYY-MM-DD", () => {
    expect(getMonthRange(2024, 3)).toEqual({ start: "2024-03-01", end: "2024-04-01" });
  });

  it("cruza el año correctamente en diciembre", () => {
    expect(getMonthRange(2024, 12)).toEqual({ start: "2024-12-01", end: "2025-01-01" });
  });

  it("acepta year/month como strings (como llegan de date.split('-'))", () => {
    expect(getMonthRange("2024", "03")).toEqual({ start: "2024-03-01", end: "2024-04-01" });
  });

  it("es equivalente a EXTRACT(YEAR)/EXTRACT(MONTH) para cualquier día del mes, no solo el día 1", () => {
    const { start, end } = getMonthRange(2024, 2); // febrero bisiesto
    const diasDelMes = ["2024-02-01", "2024-02-15", "2024-02-29"];

    for (const dia of diasDelMes) {
      expect(isInRange(dia, start, end)).toBe(matchesExtractYearMonth(dia, 2024, 2));
      expect(isInRange(dia, start, end)).toBe(true);
    }

    expect(isInRange("2024-01-31", start, end)).toBe(false);
    expect(isInRange("2024-03-01", start, end)).toBe(false);
  });
});
