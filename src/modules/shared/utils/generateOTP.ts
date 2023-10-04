const DIGITS = '0123456789';
export default function _generateOTP(digitNumber: number) {
  // Declare a digits variable
  // which stores all digits
  let OTP = '';
  for (let i = 0; i < digitNumber; i++) {
    OTP += DIGITS[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
