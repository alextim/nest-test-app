/**
 * https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k
 */
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';

/*
import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

const HASH_ROUNDS = 8;

export const hash = (password: string) => bcryptHash(password, HASH_ROUNDS);
export const compare = (password: string, hash: string) => bcryptCompare(password, hash);
*/

const keyLength = 32;
/**
 * Has a password or a secret with a password hashing algorithm (scrypt)
 * @param {string} password
 * @returns {string} The salt+hash
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
 * @param {string} hash The hash+salt to check against
 * @returns {boolean}
 */
export const compare = (password: string, hash: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const [salt, hashKey] = hash.split('.');
    // we need to pass buffer values to timingSafeEqual
    const hashKeyBuff = Buffer.from(hashKey, 'hex');
    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      // compare the new supplied password with the hashed password using timeSafeEqual
      resolve(timingSafeEqual(hashKeyBuff, derivedKey));
    });
  });
