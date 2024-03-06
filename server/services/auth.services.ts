import { authenticator, totp } from "otplib";
// @ts-ignore
import jwt from "jsonwebtoken";

export function generateSecret() {
  return authenticator.generateSecret();
}

export function generateTotp(secret: string) {
  totp.options = { digits: 6 };
  return totp.generate(secret);
}

export function generateJWT(userId: string) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: `30d`,
    algorithm: "HS256"
  });
}

export function verifyJWT(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
