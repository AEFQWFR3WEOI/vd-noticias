import {
  createHash,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";

const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const SCRYPT_MAX_MEMORY = 64 * 1024 * 1024;

function scrypt(password: string, salt: Buffer, keyLength: number) {
  return new Promise<Buffer>((resolve, reject) => {
    nodeScrypt(
      password,
      salt,
      keyLength,
      {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELIZATION,
        maxmem: SCRYPT_MAX_MEMORY,
      },
      (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey);
      },
    );
  });
}

export function validatePassword(password: string) {
  if (password.length < 12) {
    return "La contraseña debe tener al menos 12 caracteres";
  }
  if (password.length > 128) {
    return "La contraseña no puede superar 128 caracteres";
  }
  return null;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, SCRYPT_KEY_LENGTH);
  return [
    "scrypt",
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, cost, blockSize, parallelization, saltValue, hashValue] =
    storedHash.split("$");
  if (
    algorithm !== "scrypt" ||
    Number(cost) !== SCRYPT_COST ||
    Number(blockSize) !== SCRYPT_BLOCK_SIZE ||
    Number(parallelization) !== SCRYPT_PARALLELIZATION ||
    !saltValue ||
    !hashValue
  ) {
    return false;
  }

  try {
    const expected = Buffer.from(hashValue, "base64url");
    const actual = await scrypt(
      password,
      Buffer.from(saltValue, "base64url"),
      expected.length,
    );
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function createOpaqueSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function safeEqualText(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}
