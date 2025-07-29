function padZeroes(num, length) {
  if (num.length == length) {
    return num;
  } else {
    padding = "";
    for (let i = 0; i < length - num.length; i++) {
      padding += "0";
    }
    return padding + num;
  }
}

function chunkString(numString, length) {
  if (numString.length == length) {
    return [numString];
  } else {
    strings = [];
    for (let i = 0; i < numString.length; i += length) {
      strings.push(numString.slice(i, i + length));
    }
    return strings;
  }
}

function XOR(word1, word2) {
  let len = word1.length;
  let binXOR = (parseInt(word1, 2) ^ parseInt(word2, 2)).toString(2);
  let paddedBinaryString = binXOR.padStart(len, "0");
  return paddedBinaryString;
}

function NOT(n) {
  return n
    .split("")
    .map((bit) => (bit == "1" ? "0" : "1"))
    .join("");
}

function AND(n1, n2) {
  let len = n1.length;
  let binAND = (parseInt(n1, 2) & parseInt(n2, 2)).toString(2);
  let paddedBinaryString = binAND.padStart(len, "0");
  return paddedBinaryString;
}

function OR(n1, n2) {
  let len = n1.length;
  let binOR = (parseInt(n1, 2) | parseInt(n2, 2)).toString(2);
  let paddedBinaryString = binOR.padStart(len, "0");
  return paddedBinaryString;
}

function ADD(n1, n2) {
  let result = (parseInt(n1, 2) + parseInt(n2, 2)) >>> 0;
  return result.toString(2).padStart(32, "0");
}

function leftRotate(word, steps) {
  return word.slice(steps) + word.slice(0, steps);
}

function binToHex(word) {
  return parseInt(word, 2).toString(16);
}

function sha1(text) {
  // Take input text and split it into an array of ASCII codes
  let asciiText = text.split("").map((letter) => letter.charCodeAt(letter));

  // Convert ascii codes to binary and pad with 0s to the front until they are 8-bits long
  let binary8bit = asciiText
    .map((num) => num.toString(2))
    .map((num) => padZeroes(num, 8));

  // join them all together then append 1 to the end.
  let mergedString = binary8bit.join("") + "1";

  // pad the binary message with 0s until length is 512 mod 448 - use a while loop
  while (mergedString.length % 512 !== 448) {
    mergedString += "0";
  }

  // Take the 8-bit ascii code array and get its length in binary and pad with 0s until it is 64 characters
  const len = binary8bit.join("").length.toString(2);
  const padded64bit = padZeroes(len, 64);

  // append to mergedString
  mergedString += padded64bit;

  // break message into an array of 512 characters
  const chunks = chunkString(mergedString, 512);
  // check chunks ara of length 512
  // break each chunk into a subarray of 32-bit 'words'
  let chunkWords = chunks.map((chunk) => chunkString(chunk, 32));

  // loop through each 'chunk' array of sixteen 32-bit words and extend
  // each array to 80 words using bitwise operations
  const words80 = chunkWords.map((chunk) => {
    for (let i = 16; i <= 79; i++) {
      const word1 = chunk[i - 3];
      const word2 = chunk[i - 8];
      const word3 = chunk[i - 14];
      const word4 = chunk[i - 16];

      const xorA = XOR(word1, word2);
      const xorB = XOR(xorA, word3);
      const xorC = XOR(xorB, word4);

      const newWord = leftRotate(xorC, 1);
      chunk.push(newWord);
    }
    return chunk;
  });

  let h0 = "01100111010001010010001100000001";
  let h1 = "11101111110011011010101110001001";
  let h2 = "10011000101110101101110011111110";
  let h3 = "00010000001100100101010001110110";
  let h4 = "11000011110100101110000111110000";

  // loop through each chunk
  for (let i = 0; i < words80.length; i++) {
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let j = 0; j < 80; j++) {
      let f;
      let k;
      if (j < 20) {
        let bAndc = AND(b, c);
        let bNot = NOT(b);
        let bNotAndd = AND(bNot, d);
        f = OR(bAndc, bNotAndd);
        k = "01011010100000100111100110011001";
      } else if (j < 40) {
        let bXORc = XOR(b, c);
        f = XOR(bXORc, d);
        k = "01101110110110011110101110100001";
      } else if (j < 60) {
        let bAndc = AND(b, c);
        let bAndd = AND(b, d);
        let cAndd = AND(c, d);
        let bcXORdb = XOR(bAndc, bAndd);
        f = XOR(bcXORdb, cAndd);
        k = "10001111000110111011110011011100";
      } else {
        let bXORc = XOR(b, c);
        f = XOR(bXORc, d);
        k = "11001010011000101100000111010110";
      }

      let v1 = ADD(leftRotate(a, 5), f);
      let v2 = ADD(v1, e);
      let v3 = ADD(v2, k);

      let temp = ADD(v3, words80[i][j]);
      e = d;
      d = c;
      c = leftRotate(b, 30);
      b = a;
      a = temp;
    }

    h0 = ADD(h0, a);
    h1 = ADD(h1, b);
    h2 = ADD(h2, c);
    h3 = ADD(h3, d);
    h4 = ADD(h4, e);
  }

  console.log([h0, h1, h2, h3, h4]);

  return [h0, h1, h2, h3, h4].map((string) => binToHex(string)).join("");
}

let n = sha1("abc");
console.log(n);
// console.log("7110eda4d09e062aa5e4a390b0a572ac0d2c0220" === n);
