import fs from "fs";
import express from "express";
import crypto from "crypto";

const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded());

app.post("/", (req, res) => {
  const { masterPassword, title, password } = req.body;

  const algorithm = "aes256";
  const inputEncoding = "utf8";
  const outputEncoding = "hex";
  const ivlength = 16; // AES blocksize

  const masterPasswordHash32Chars = crypto
    .createHmac("sha256", masterPassword)
    .digest("base64")
    .substring(0, 32);

  const key = Buffer.from(masterPasswordHash32Chars, "latin1"); // key must be 32 bytes for aes256
  const iv = crypto.randomBytes(ivlength);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let ciphered = cipher.update(
    JSON.stringify({
      title,
      password,
    }),
    inputEncoding,
    outputEncoding
  );
  ciphered += cipher.final(outputEncoding);
  const ciphertext = iv.toString(outputEncoding) + ":" + ciphered + '\n';

  fs.appendFileSync("passwords.txt", ciphertext, "utf8");

  res.sendStatus(200);
});

app.use(express.static("static"));

app.listen(port);
