export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return passwordRegex.test(password)
}

export const validateCouponCode = (code) => {
  // Alphanumeric, 4-10 characters
  const codeRegex = /^[A-Za-z0-9]{4,10}$/
  return codeRegex.test(code)
}

export const validateDiscount = (discount) => {
  // Number between 0-100 or price format
  const percentRegex = /^100$|^\d{1,2}(\.\d{1,2})?$/
  const priceRegex = /^\d+(\.\d{1,2})?$/
  return percentRegex.test(discount) || priceRegex.test(discount)
}

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/[<>]/g, '')
}