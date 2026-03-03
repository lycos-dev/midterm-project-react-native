import { CountryData } from '../constants/countries';

// First digit rules per country
const VALID_FIRST_DIGITS: Record<string, string[]> = {
  PH: ['9'],
  US: ['2','3','4','5','6','7','8','9'],
  CA: ['2','3','4','5','6','7','8','9'],
  GB: ['7'],
  IN: ['6','7','8','9'],
  AU: ['4'],
  SG: ['8','9'],
  JP: ['7','8','9'],
  KR: ['1'],
  DE: ['1','2','3','4','5','6','7','8','9'],
};

export const validateFirstDigit = (contact: string, country: CountryData): boolean => {
  const digitsOnly = contact.replace(/\D/g, '');
  if (!digitsOnly) return true;
  const validStarts = VALID_FIRST_DIGITS[country.code];
  if (!validStarts) return true;
  return validStarts.includes(digitsOnly[0]);
};

export const formatPhoneNumber = (text: string, country: CountryData): string => {
  const digitsOnly = text.replace(/\D/g, '');
  const limited = digitsOnly.slice(0, country.maxLength);

  switch (country.code) {
    case 'PH':
    case 'US':
    case 'CA':
    case 'AU':
      if (limited.length > 6) return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
      if (limited.length > 3) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
      return limited;

    case 'GB':
      if (limited.length > 4) return `${limited.slice(0, 4)} ${limited.slice(4)}`;
      return limited;

    case 'IN':
      if (limited.length > 5) return `${limited.slice(0, 5)} ${limited.slice(5)}`;
      return limited;

    case 'SG':
      if (limited.length > 4) return `${limited.slice(0, 4)} ${limited.slice(4)}`;
      return limited;

    case 'JP':
      if (limited.length > 6) return `${limited.slice(0, 2)} ${limited.slice(2, 6)} ${limited.slice(6)}`;
      if (limited.length > 2) return `${limited.slice(0, 2)} ${limited.slice(2)}`;
      return limited;

    default:
      return limited;
  }
};

export const validateContactNumber = (contact: string, country: CountryData): boolean => {
  const digitsOnly = contact.replace(/\D/g, '');
  return digitsOnly.length >= country.minLength && digitsOnly.length <= country.maxLength;
};