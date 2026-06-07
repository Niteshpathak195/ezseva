/**
 * RC4-128 (Standard Security Handler Rev 3) decrypt — mirrors pdf-protect encryption.
 * Preserves text/vectors (no rasterization).
 */

import {
  PDFDocument,
  PDFDict,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
  PDFRawStream,
  PDFArray,
} from "pdf-lib";
import { md5, RC4, hexToBytes, bytesToHex } from "@pdfsmaller/pdf-encrypt-lite";

const PADDING = hexToBytes(
  "28BF4E5E4E758A4164004E56FFFA01082E2E00B6D0683E802F0CA9FE6453697A"
);

function pwdToBytes(pwd: string): Uint8Array {
  const pwdBytes = new TextEncoder().encode(pwd || "");
  const result = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    result[i] = i < pwdBytes.length ? pwdBytes[i] : PADDING[i - pwdBytes.length];
  }
  return result;
}

function rc4(key: Uint8Array, data: Uint8Array): Uint8Array {
  return (new RC4(key) as { process: (d: Uint8Array) => Uint8Array }).process(data);
}

function computeEncKey(
  userPwd: string,
  ownerKey: Uint8Array,
  perms: number,
  fileId: Uint8Array
): Uint8Array {
  const pwdB = pwdToBytes(userPwd);
  const v = perms >>> 0;
  const permB = new Uint8Array([
    v & 0xff,
    (v >> 8) & 0xff,
    (v >> 16) & 0xff,
    (v >> 24) & 0xff,
  ]);

  const combined = new Uint8Array(
    pwdB.length + ownerKey.length + permB.length + fileId.length
  );
  combined.set(pwdB, 0);
  combined.set(ownerKey, pwdB.length);
  combined.set(permB, pwdB.length + ownerKey.length);
  combined.set(fileId, pwdB.length + ownerKey.length + permB.length);

  let key: Uint8Array = md5(combined) as Uint8Array;
  for (let i = 0; i < 50; i++) key = md5(key) as Uint8Array;
  return key.slice(0, 16);
}

function computeUserKey(encKey: Uint8Array, fileId: Uint8Array): Uint8Array {
  const combined = new Uint8Array(PADDING.length + fileId.length);
  combined.set(PADDING);
  combined.set(fileId, PADDING.length);
  let result = rc4(encKey, md5(combined) as Uint8Array);
  for (let i = 1; i <= 19; i++) {
    result = rc4(
      encKey.map((b) => b ^ i),
      result
    );
  }
  const final = new Uint8Array(32);
  final.set(result);
  return final;
}

function keysMatch(a: Uint8Array, b: Uint8Array): boolean {
  const n = Math.min(16, a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function deriveEncKey(
  password: string,
  ownerKey: Uint8Array,
  perms: number,
  fileId: Uint8Array,
  storedU: Uint8Array
): Uint8Array | null {
  // User password (Algorithm 7)
  const userEncKey = computeEncKey(password, ownerKey, perms, fileId);
  const userKey = computeUserKey(userEncKey, fileId);
  if (keysMatch(userKey, storedU)) return userEncKey;

  // Owner password (Algorithm 8) — recover user password from O
  let key: Uint8Array = md5(pwdToBytes(password)) as Uint8Array;
  for (let i = 0; i < 50; i++) key = md5(key) as Uint8Array;
  key = key.slice(0, 16);
  let paddedUser = rc4(key, ownerKey);
  for (let i = 1; i <= 19; i++) {
    paddedUser = rc4(
      key.map((b) => b ^ i),
      paddedUser
    );
  }
  let recovered = "";
  for (let i = 0; i < 32; i++) {
    if (paddedUser[i] === 0) break;
    recovered += String.fromCharCode(paddedUser[i]);
  }
  if (recovered) {
    const ownerEncKey = computeEncKey(recovered, ownerKey, perms, fileId);
    const ownerUserKey = computeUserKey(ownerEncKey, fileId);
    if (keysMatch(ownerUserKey, storedU)) return ownerEncKey;
  }

  return null;
}

function decryptData(
  data: Uint8Array,
  objNum: number,
  genNum: number,
  encKey: Uint8Array
): Uint8Array {
  const k = new Uint8Array(encKey.length + 5);
  k.set(encKey);
  k[encKey.length] = objNum & 0xff;
  k[encKey.length + 1] = (objNum >> 8) & 0xff;
  k[encKey.length + 2] = (objNum >> 16) & 0xff;
  k[encKey.length + 3] = genNum & 0xff;
  k[encKey.length + 4] = (genNum >> 8) & 0xff;
  const objKey = (md5(k) as Uint8Array).slice(0, Math.min(encKey.length + 5, 16));
  return rc4(objKey, data);
}

function decryptStrings(
  obj: PDFDict | PDFArray,
  oN: number,
  gN: number,
  encKey: Uint8Array
): void {
  if (obj instanceof PDFDict) {
    const filter = obj.get(PDFName.of("Filter"));
    if (filter && filter.toString() === "/Standard") return;
    for (const [key, val] of obj.entries()) {
      if (val instanceof PDFHexString) {
        try {
          const raw = val.toString().replace(/^<|>$/g, "");
          if (raw.length > 0) {
            obj.set(
              key,
              PDFHexString.of(
                bytesToHex(decryptData(hexToBytes(raw), oN, gN, encKey))
              )
            );
          }
        } catch {
          /* skip */
        }
      } else if (val instanceof PDFString) {
        try {
          const decrypted = decryptData(val.asBytes(), oN, gN, encKey);
          obj.set(key, PDFString.of(new TextDecoder().decode(decrypted)));
        } catch {
          /* skip */
        }
      } else if (val instanceof PDFDict || val instanceof PDFArray) {
        decryptStrings(val as PDFDict | PDFArray, oN, gN, encKey);
      }
    }
  } else if (obj instanceof PDFArray) {
    for (let i = 0; i < obj.size(); i++) {
      const item = obj.get(i);
      if (item instanceof PDFHexString) {
        try {
          const raw = item.toString().replace(/^<|>$/g, "");
          if (raw.length > 0) {
            obj.set(
              i,
              PDFHexString.of(
                bytesToHex(decryptData(hexToBytes(raw), oN, gN, encKey))
              )
            );
          }
        } catch {
          /* skip */
        }
      } else if (item instanceof PDFString) {
        try {
          const decrypted = decryptData(item.asBytes(), oN, gN, encKey);
          obj.set(i, PDFString.of(new TextDecoder().decode(decrypted)));
        } catch {
          /* skip */
        }
      } else if (item instanceof PDFDict || item instanceof PDFArray) {
        decryptStrings(item as PDFDict | PDFArray, oN, gN, encKey);
      }
    }
  }
}

export function pdfHasEncryption(trailer: { Encrypt?: unknown }): boolean {
  return !!trailer.Encrypt;
}

/** Returns decrypted bytes, or null if not RC4 Standard / needs another method */
export async function decryptRc4Pdf(
  pdfBytes: Uint8Array,
  password: string
): Promise<Uint8Array | "not_encrypted" | "wrong_password" | "unsupported"> {
  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
      updateMetadata: false,
    });
  } catch {
    return "unsupported";
  }

  const trailer = pdfDoc.context.trailerInfo as {
    Encrypt?: unknown;
    ID?: { toString(): string }[];
  };

  if (!trailer.Encrypt) return "not_encrypted";

  const encDict = pdfDoc.context.lookup(trailer.Encrypt as Parameters<typeof pdfDoc.context.lookup>[0]) as PDFDict;
  const filter = encDict.get(PDFName.of("Filter"));
  if (!filter || filter.toString() !== "/Standard") return "unsupported";

  const rVal = encDict.get(PDFName.of("R")) as PDFNumber | undefined;
  if (!rVal || rVal.asNumber() < 2) return "unsupported";

  const oHex = (encDict.get(PDFName.of("O")) as PDFHexString).toString().replace(/^<|>$/g, "");
  const uHex = (encDict.get(PDFName.of("U")) as PDFHexString).toString().replace(/^<|>$/g, "");
  const ownerKey = hexToBytes(oHex);
  const storedU = hexToBytes(uHex);
  const perms = (encDict.get(PDFName.of("P")) as PDFNumber).asNumber();

  let fileId: Uint8Array;
  if (trailer.ID && trailer.ID.length > 0) {
    fileId = hexToBytes(trailer.ID[0].toString().replace(/^<|>$/g, ""));
  } else {
    return "unsupported";
  }

  const encKey = deriveEncKey(password, ownerKey, perms, fileId, storedU);
  if (!encKey) return "wrong_password";

  const context = pdfDoc.context;
  for (const [ref, obj] of context.enumerateIndirectObjects()) {
    const oN = ref.objectNumber;
    const gN = (ref as { generationNumber?: number }).generationNumber || 0;

    if (obj instanceof PDFDict) {
      const f = obj.get(PDFName.of("Filter"));
      if (f && f.toString() === "/Standard") continue;
    }

    if (obj instanceof PDFRawStream) {
      if (obj.dict) {
        const type = obj.dict.get(PDFName.of("Type"));
        if (type && (type.toString() === "/XRef" || type.toString() === "/Sig")) continue;
      }
      (obj as unknown as { contents: Uint8Array }).contents = decryptData(
        obj.contents,
        oN,
        gN,
        encKey
      );
      if (obj.dict) decryptStrings(obj.dict, oN, gN, encKey);
    } else if (obj instanceof PDFDict) {
      decryptStrings(obj, oN, gN, encKey);
    } else if (obj instanceof PDFArray) {
      decryptStrings(obj, oN, gN, encKey);
    }
  }

  delete (trailer as { Encrypt?: unknown }).Encrypt;
  return pdfDoc.save({ useObjectStreams: false });
}

export async function isPdfEncrypted(bytes: Uint8Array): Promise<boolean> {
  try {
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    return pdfHasEncryption(doc.context.trailerInfo as { Encrypt?: unknown });
  } catch {
    return false;
  }
}

export async function getPdfPageCount(bytes: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}
