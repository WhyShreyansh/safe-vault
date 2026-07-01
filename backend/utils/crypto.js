import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef'; // 32 chars

export function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(KEY, 'utf8');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { iv: iv.toString('hex'), data: encrypted.toString('hex') };
}

export function decryptBuffer(encryptedHex, ivHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const key = Buffer.from(KEY, 'utf8');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()]);
  return decrypted;
}

export function hashSha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
