import CryptoJS from 'crypto-js';

// We don't store the key permanently anymore, we derive it from the PIN session.
// However, to avoid typing PIN on every reload, we can cache it in SessionStorage or Memory.
let MEMORY_KEY: string | null = null;

/**
 * Derives a 256-bit encryption key from the User's PIN and Email (Salt).
 * This ensures the key is consistent across devices for the same user.
 */
export const deriveKeyFromPin = (pin: string, email: string): string => {
  // PBKDF2 with 5000 iterations. Enough to be annoying to brute force, fast enough for UI.
  const salt = email.trim().toLowerCase(); 
  const key = CryptoJS.PBKDF2(pin, salt, {
      keySize: 256 / 32,
      iterations: 5000
  });
  return key.toString();
};

/**
 * Generates a public hash of the key to store in the DB.
 * This allows us to check if the entered PIN is correct without knowing the PIN.
 */
export const generateVaultCheck = (derivedKey: string): string => {
    return CryptoJS.SHA256(derivedKey).toString();
};

/**
 * Sets the active encryption key in memory (called after successful PIN entry).
 */
export const unlockVault = (derivedKey: string) => {
    MEMORY_KEY = derivedKey;
};

/**
 * Checks if the vault is currently unlocked.
 */
export const isVaultUnlocked = (): boolean => {
    return !!MEMORY_KEY;
};

/**
 * Encrypts data using the active session key.
 */
export const encryptData = (data: string | number | null): string => {
  if (data === null || data === undefined) return '';
  if (!MEMORY_KEY) return ''; // Cannot encrypt if locked
  return CryptoJS.AES.encrypt(String(data), MEMORY_KEY).toString();
};

/**
 * Decrypts data using the active session key.
 */
export const decryptData = (ciphertext: string | null): string => {
  if (!ciphertext) return '';
  if (!MEMORY_KEY) return ''; // Cannot decrypt if locked
  
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, MEMORY_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    console.warn("Decryption failed", error);
    return ''; 
  }
};

/**
 * Helper for API payloads
 */
export const prepareEncryptedPayload = (data: any) => {
    if (!MEMORY_KEY) throw new Error("Vault is locked");
    return {
        ...data,
        name: encryptData(data.name),
        amount: encryptData(data.amount),
    };
}