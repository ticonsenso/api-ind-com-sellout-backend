import bcrypt from 'bcryptjs';
import { format, parse } from 'date-fns';

const saltRounds = 10;

const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error al cifrar la contraseña:', error);
    throw error;
  }
};

const cleanString = (input: unknown): string => {
  const str = typeof input === 'string' ? input : String(input ?? '');
  return str
    .replace(/[\s\u00A0\u200B\u200C\u200D\uFEFF]/g, '') // elimina todos los espacios y caracteres invisibles
    .trim();

};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error al verificar la contraseña:', error);
    throw error;
  }
};

const formatDateToYYYYMMDD = (date: Date | null | undefined): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided to formatDateToYYYYMMDD");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function formatDateToISO(dateString: string): string {
  try {
    const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
    return '';
  }
}
const smsErrors: string[] = [];
const seenMessages = new Set<string>();

function addErrorMessage(message: string) {
  if (!seenMessages.has(message)) {
    smsErrors.push(message);
    seenMessages.add(message);
  }
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); 
}


function parseDateFromISO(dateString: string | Date): Date {
  if (dateString instanceof Date) {
    if (isNaN(dateString.getTime())) {
      throw new Error(`Fecha inválida: ${dateString}`);
    }
    return dateString;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Fecha inválida: ${dateString}`);
  }
  return date;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function getLastDayOfMonth(dateString: string): Date {
  const date = new Date(dateString + 'T00:00:00Z');
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
  return lastDayOfMonth;
}

function parseEuropeanNumber(value: string | number): number {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const hasComma = value.includes(",");
  const hasDot = value.includes(".");

  // Caso 1: Formato europeo -> "34.287,23"
  if (hasComma && hasDot) {
    return parseFloat(value.replace(/\./g, "").replace(",", "."));
  }

  // Caso 2: Solo coma -> "34287,23"
  if (hasComma && !hasDot) {
    return parseFloat(value.replace(",", "."));
  }

  // Caso 3: Solo punto -> puede ser decimal US o miles europeo
  if (!hasComma && hasDot) {
    // Detectar separador de miles tipo "1.234" o "12.345.678"
    if (/^\d{1,3}(\.\d{3})+$/.test(value)) {
      return parseInt(value.replace(/\./g, ""), 10);
    }
    return parseFloat(value); // decimal normal
  }

  // Caso 4: Entero puro -> "34287"
  return parseFloat(value);
}


function normalizePercent(value: number): number {
  return value / 100;
}

export {
  hashPassword,
  verifyPassword,
  formatDateToYYYYMMDD,
  chunkArray,
  parseEuropeanNumber,
  getLastDayOfMonth,
  parseDateFromISO,
  parseLocalDate,
  cleanString,
  addErrorMessage,
  normalizePercent,
};
