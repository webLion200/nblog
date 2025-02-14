import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export function signJwt(payload: object, expiresIn: number = 7) {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: expiresIn * 60 * 60 * 24,
  });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}
