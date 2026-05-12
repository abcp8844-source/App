export interface Country {
  name: string;
  code: string;
  flag: string;
  iso: string;
}

export interface Market extends Country {
  currency: string;
  symbol: string;
  localIdType: string;
  isLocked: boolean; // Only true for your top 20
}

// 1. YOUR 20 LOCKED MARKETS (The only places where business operates)
export const OPERATIONAL_MARKETS: Market[] = [
  { name: "Thailand", code: "+66", flag: "🇹🇭", iso: "TH", currency: "THB", symbol: "฿", localIdType: "Thai ID", isLocked: true },
  { name: "China", code: "+86", flag: "🇨🇳", iso: "CN", currency: "CNY", symbol: "¥", localIdType: "Resident ID", isLocked: true },
  { name: "Singapore", code: "+65", flag: "🇸🇬", iso: "SG", currency: "SGD", symbol: "S$", localIdType: "NRIC", isLocked: true },
  { name: "Turkey", code: "+90", flag: "🇹🇷", iso: "TR", currency: "TRY", symbol: "₺", localIdType: "Kimlik", isLocked: true },
  { name: "United States", code: "+1", flag: "🇺🇸", iso: "US", currency: "USD", symbol: "$", localIdType: "SSN", isLocked: true },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", iso: "GB", currency: "GBP", symbol: "£", localIdType: "NIN", isLocked: true },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪", iso: "AE", currency: "AED", symbol: "د.إ", localIdType: "Emirates ID", isLocked: true },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", iso: "SA", currency: "SAR", symbol: "ر.س", localIdType: "Iqama", isLocked: true },
  { name: "Japan", code: "+81", flag: "🇯🇵", iso: "JP", currency: "JPY", symbol: "¥", localIdType: "My Number", isLocked: true },
  { name: "South Korea", code: "+82", flag: "🇰🇷", iso: "KR", currency: "KRW", symbol: "₩", localIdType: "ARC", isLocked: true },
  { name: "Germany", code: "+49", flag: "🇩🇪", iso: "DE", currency: "EUR", symbol: "€", localIdType: "ID Card", isLocked: true },
  { name: "France", code: "+33", flag: "🇫🇷", iso: "FR", currency: "EUR", symbol: "€", localIdType: "CNI", isLocked: true },
  { name: "Italy", code: "+39", flag: "🇮🇹", iso: "IT", currency: "EUR", symbol: "€", localIdType: "Tax Code", isLocked: true },
  { name: "Canada", code: "+1", flag: "🇨🇦", iso: "CA", currency: "CAD", symbol: "C$", localIdType: "SIN", isLocked: true },
  { name: "Malaysia", code: "+60", flag: "🇲🇾", iso: "MY", currency: "MYR", symbol: "RM", localIdType: "MyKad", isLocked: true },
  { name: "Indonesia", code: "+62", flag: "🇮🇩", iso: "ID", currency: "IDR", symbol: "Rp", localIdType: "KTP", isLocked: true },
  { name: "Vietnam", code: "+ Vietnamese", flag: "🇻🇳", iso: "VN", currency: "VND", symbol: "₫", localIdType: "ID Card", isLocked: true },
  { name: "Hong Kong", code: "+852", flag: "🇭🇰", iso: "HK", currency: "HKD", symbol: "HK$", localIdType: "HKID", isLocked: true },
  { name: "Australia", code: "+61", flag: "🇦🇺", iso: "AU", currency: "AUD", symbol: "A$", localIdType: "TFN", isLocked: true },
  { name: "Switzerland", code: "+41", flag: "🇨🇭", iso: "CH", currency: "CHF", symbol: "Fr", localIdType: "Swiss ID", isLocked: true },
];

// 2. GLOBAL LIST (195 Countries for Passport selection)
// (Note: I will provide the full JSON for all 195 in a separate config to keep this file clean)
export const ALL_WORLD_COUNTRIES: Country[] = [
  ...OPERATIONAL_MARKETS, // Include the 20
  { name: "Pakistan", code: "+92", flag: "🇵🇰", iso: "PK" },
  { name: "India", code: "+91", flag: "🇮🇳", iso: "IN" },
];
