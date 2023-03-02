/**
 * https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k
 */
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';

const keyLength = 32;
/**
 * Has a password or a secret with a password hashing algorithm (scrypt)
 * @param {string} password
 * @returns {string} The dot separated salt+hash
 */
export const hash = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    // generate random 16 bytes long salt - recommended by NodeJS Docs
    const salt = randomBytes(16).toString('hex');

    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      // derivedKey is of type Buffer
      resolve(`${salt}.${derivedKey.toString('hex')}`);
    });
  });

/**
 * Compare a plain text password with a salt+hash password
 * @param {string} password The plain text password
 * @param {string} hash The dot separated salt+hash to check against
 * @returns {boolean}
 */
export const compare = (password: string, hash: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const [salt, hashKey] = hash.split('.');

    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      // compare the new supplied password with the hashed password using timeSafeEqual
      resolve(timingSafeEqual(Buffer.from(hashKey, 'hex'), derivedKey));
    });
  });
