import { CountryData } from '../constants/countries';

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
