export function red(s: string): string {
  return `\x1B[31m${s}\x1B[0m`
}

export function green(s: string): string {
  return `\x1B[32m${s}\x1B[0m`
}

export function yellow(s: string): string {
  return `\x1B[33m${s}\x1B[0m`
}

export function blue(s: string): string {
  return `\x1B[34m${s}\x1B[0m`
}

export function magenta(s: string): string {
  return `\x1B[35m${s}\x1B[0m`
}

export function cyan(s: string): string {
  return `\x1B[36m${s}\x1B[0m`
}

export function dim(s: string): string {
  return `\x1B[2m${s}\x1B[0m`
}

export function gray(s: string): string {
  return `\x1B[90m${s}\x1B[0m`
}

export function bold(s: string): string {
  return `\x1B[1m${s}\x1B[0m`
}

export function required(s?: string): string {
  return red(s?.length ? `*${s}` : '*')
}
