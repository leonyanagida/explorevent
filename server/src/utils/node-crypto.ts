import crypto from 'crypto'

export const cryptoEncrypt = (text: string) => {
  const algorithm = 'aes-192-cbc'
  const password = 'password'
  // Use the async `crypto.scrypt()` instead.
  const key = crypto.scryptSync(password, 'salt', 24)
  // Use `crypto.randomBytes` to generate a random iv instead of the static iv
  // shown here.
  const iv = Buffer.alloc(16, 0) // Initialization vector.
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export const cryptoDecrypt = (cryptoText: string) => {
  const algorithm = 'aes-192-cbc'
  const password = 'password'
  // Use the async `crypto.scrypt()` instead.
  const key = crypto.scryptSync(password, 'salt', 24)
  // The IV is usually passed along with the ciphertext.
  const iv = Buffer.alloc(16, 0) // Initialization vector.
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  // Encrypted using same algorithm, key and iv.
  const encrypted = cryptoText
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
