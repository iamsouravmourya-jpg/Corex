/**
 * LernexAI Proprietary — Web Crypto API AES-GCM 256-Bit Local Vault Cryptography
 * Encrypts and decrypts canvas scene graphs using PBKDF2-SHA256 key derivation
 * and authenticated AES-GCM 256-bit encryption directly in the browser.
 */

export interface EncryptedVaultEnvelope {
  cipher: 'AES-GCM-256'
  kdf: 'PBKDF2-SHA256'
  saltBase64: string
  ivBase64: string
  ciphertextBase64: string
  createdAt: number
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i)
  }
  return out
}

async function deriveAesKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptProjectPayload(
  plainJson: string,
  passphrase: string,
): Promise<EncryptedVaultEnvelope> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveAesKey(passphrase, salt)
  const encoded = new TextEncoder().encode(plainJson)

  const encryptedBuf = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    encoded,
  )

  return {
    cipher: 'AES-GCM-256',
    kdf: 'PBKDF2-SHA256',
    saltBase64: bytesToBase64(salt),
    ivBase64: bytesToBase64(iv),
    ciphertextBase64: bytesToBase64(new Uint8Array(encryptedBuf)),
    createdAt: Date.now(),
  }
}

export async function decryptProjectPayload(
  envelope: EncryptedVaultEnvelope,
  passphrase: string,
): Promise<string> {
  const salt = base64ToBytes(envelope.saltBase64)
  const iv = base64ToBytes(envelope.ivBase64)
  const ciphertext = base64ToBytes(envelope.ciphertextBase64)
  const key = await deriveAesKey(passphrase, salt)

  const decryptedBuf = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    ciphertext as unknown as BufferSource,
  )

  return new TextDecoder().decode(decryptedBuf)
}
