export const currency = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);
export const shortDate = (date) => date ? new Intl.DateTimeFormat("en-IN").format(new Date(date)) : "-";
export const titleCase = (value = "") => value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
