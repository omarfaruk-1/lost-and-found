export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const CATEGORIES = [
  { value: "phone", label: "Phone" },
  { value: "bag", label: "Bag" },
  { value: "document", label: "Document" },
  { value: "wallet", label: "Wallet" },
  { value: "electronics", label: "Electronics" },
  { value: "jewelry", label: "Jewelry" },
  { value: "others", label: "Others" },
];

export const ITEM_TYPES = [
  { value: "lost", label: "Lost" },
  { value: "found", label: "Found" },
];

export const REVIEW_REASONS = [
  { value: "insufficient_proof", label: "Insufficient proof" },
  { value: "wrong_item", label: "Wrong item" },
  { value: "false_claim", label: "False claim" },
];

export const categoryLabel = (value) =>
  CATEGORIES.find((item) => item.value === value)?.label || value;

export const typeLabel = (value) =>
  ITEM_TYPES.find((item) => item.value === value)?.label || value;