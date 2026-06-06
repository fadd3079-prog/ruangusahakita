export function calculatePlatformFee(amount: number) {
  return Math.round(amount * 0.1);
}

export function calculateAdminFee() {
  return 5000;
}

export function calculateTotalPayment(amount: number) {
  return amount + calculatePlatformFee(amount) + calculateAdminFee();
}
