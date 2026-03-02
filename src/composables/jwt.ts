export const readJWTData = <T = null>(token: string): T => {
  const parts = token.split(".")
  if (parts.length < 2) return null as T

  const payload = parts[1]!

  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64 + "===".slice((base64.length + 3) % 4)

  try {
    const bin = atob(padded)
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))

    return JSON.parse(new TextDecoder().decode(bytes)) as T
  } catch(_) {
    return null as T
  }
}