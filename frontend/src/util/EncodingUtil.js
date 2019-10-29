export const intArrayToBase64 = arr => {
  const uInt8Array = new Uint8Array(arr);
  let stringChar = "";
  for (let i = 0; i < uInt8Array.length; i++) {
    stringChar += String.fromCharCode(uInt8Array[i]);
  }
  return btoa(stringChar);
};
