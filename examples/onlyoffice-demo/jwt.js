// (async () => {
//   config.token = await createJWT(config, "IXIpaSaQctikEuI61euCjUSSE6O1nO");
// })();

export async function createJWT(json, secret) {
  if (!secret) return null
  let header = {
    typ: 'JWT',
    alg: 'HS256',
  }

  let base64EncodeURL = function (str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '')
  }

  let encodedHeader = base64EncodeURL(JSON.stringify(header))
  let encodedPayload = base64EncodeURL(JSON.stringify(json))
  let encoder = new TextEncoder()
  let algorithm = { name: 'HMAC', hash: 'SHA-256' }
  let key = await crypto.subtle.importKey('raw', encoder.encode(secret), algorithm, false, [
    'sign',
    'verify',
  ])
  let buf = encoder.encode(encodedHeader + '.' + encodedPayload)
  let sign = await crypto.subtle.sign(algorithm.name, key, buf)
  let hash = base64EncodeURL(String.fromCharCode(...new Uint8Array(sign)))
  return encodedHeader + '.' + encodedPayload + '.' + hash
}
