export function base64ToBlob(base64: string, contentType: string): Blob {
  // Decode base64 string
  const binaryString = window.atob(base64);
  // Create a Uint8Array from binary string
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  // Create and return a Blob from the Uint8Array
  return new Blob([bytes], { type: contentType });
}
