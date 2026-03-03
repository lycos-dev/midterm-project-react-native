export interface CountryData {
  name: string;
  code: string;
  dialCode: string;
  minLength: number;
  maxLength: number;
  placeholder: string;
  flag: string;
}

export const COUNTRIES: CountryData[] = [
  { name: 'Philippines', code: 'PH', dialCode: '+63', minLength: 10, maxLength: 10, placeholder: '912 345 6789', flag: '🇵🇭' },
  { name: 'United States', code: 'US', dialCode: '+1',  minLength: 10, maxLength: 10, placeholder: '555 123 4567', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', minLength: 10, maxLength: 11, placeholder: '7911 123456',  flag: '🇬🇧' },
  { name: 'India',          code: 'IN', dialCode: '+91', minLength: 10, maxLength: 10, placeholder: '98765 43210',  flag: '🇮🇳' },
  { name: 'Australia',      code: 'AU', dialCode: '+61', minLength: 9,  maxLength: 9,  placeholder: '412 345 678',  flag: '🇦🇺' },
  { name: 'Canada',         code: 'CA', dialCode: '+1',  minLength: 10, maxLength: 10, placeholder: '555 123 4567', flag: '🇨🇦' },
  { name: 'Singapore',      code: 'SG', dialCode: '+65', minLength: 8,  maxLength: 8,  placeholder: '8123 4567',    flag: '🇸🇬' },
  { name: 'Japan',          code: 'JP', dialCode: '+81', minLength: 10, maxLength: 10, placeholder: '90 1234 5678', flag: '🇯🇵' },
  { name: 'South Korea',    code: 'KR', dialCode: '+82', minLength: 9,  maxLength: 10, placeholder: '10 1234 5678', flag: '🇰🇷' },
  { name: 'Germany',        code: 'DE', dialCode: '+49', minLength: 10, maxLength: 11, placeholder: '151 23456789', flag: '🇩🇪' },
];
