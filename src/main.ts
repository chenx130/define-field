import { blue, bold, cyan, gray, green, magenta, red, required, yellow } from './colors'
import { parseBoolean, parseColor, parseDate } from './util'

export type ParsedQuery = Record<string, string | string[]>

export type QueryFieldTypes = 'string' | 'boolean' | 'number' | 'color' | 'date' | 'array'

export interface QueryField<T extends QueryFieldTypes, Val, Required extends boolean> {
  type: T
  default?: Val
  description: string
  required: Required
  parse: (v: string | string[]) => Val | Error
  validator?: (v: Val) => Error | undefined | null | void
  order: number
}

export interface QueryField0<T, Required extends boolean = false> {
  default?: T
  required?: Required
  description: string
  validator?: (v: T) => Error | undefined | null | void
  order?: number
}

function nonStringArray(v: string | string[]): string {
  if (Array.isArray(v))
    throw new Error('Expected a single value, but got an array of values')
  return v
}

export function _field<Type extends QueryFieldTypes, Val, Required extends boolean>(type: Type, f: QueryField0<Val, Required>, parser: ((v: string | string[]) => Error | Val)): QueryField<Type, Val, Required> {
  return {
    type,
    default: f.default as Val,
    description: f.description,
    required: f.required ?? false as Required,
    validator: f.validator,
    parse: parser,
    order: f.order ?? 0,
  }
}

export function _string(field: QueryField0<string, false>): QueryField<'string', string, false>
export function _string(field: QueryField0<string, true>): QueryField<'string', string, true>
export function _string<T extends string = string>(field: QueryField0<T, false>): QueryField<'string', T, false>
export function _string<T extends string = string>(field: QueryField0<T, true>): QueryField<'string', T, true>
export function _string<T extends string = string>(field: QueryField0<T, boolean>): QueryField<'string', T, boolean> {
  return _field('string', field, v => Array.isArray(v) ? new Error('Expected a single value') : v as T)
}

export function _boolean(field: QueryField0<boolean, false>): QueryField<'boolean', boolean, false>
export function _boolean(field: QueryField0<boolean, true>): QueryField<'boolean', boolean, true>
export function _boolean<T extends boolean = boolean>(field: QueryField0<T, false>): QueryField<'boolean', T, false>
export function _boolean<T extends boolean = boolean>(field: QueryField0<T, true>): QueryField<'boolean', T, true>
export function _boolean<T extends boolean = boolean>(field: QueryField0<T, boolean>): QueryField<'boolean', T, boolean> {
  return _field('boolean', field, v => Array.isArray(v) ? new Error('Expected a single value') : parseBoolean(v) as T)
}

export function _number(field: QueryField0<number, false>): QueryField<'number', number, false>
export function _number(field: QueryField0<number, true>): QueryField<'number', number, true>
export function _number<T extends number = number>(field: QueryField0<T, false>): QueryField<'number', T, false>
export function _number<T extends number = number>(field: QueryField0<T, true>): QueryField<'number', T, true>
export function _number<T extends number = number>(field: QueryField0<T, boolean>): QueryField<'number', T, boolean> {
  return _field('number', field, (v) => {
    v = nonStringArray(v)
    if (/\d*(?:\.\d*)?/.test(v))
      return Number(v) as T
    else
      return new Error('Expected a number')
  })
}

export function _color(field: QueryField0<string, false>): QueryField<'color', string, false>
export function _color(field: QueryField0<string, true>): QueryField<'color', string, true>
export function _color<T extends string = string>(field: QueryField0<T, false>): QueryField<'color', T, false>
export function _color<T extends string = string>(field: QueryField0<T, true>): QueryField<'color', T, true>
export function _color<T extends string = string>(field: QueryField0<T, boolean>): QueryField<'color', T, boolean> {
  return _field('color', field, (v) => {
    v = nonStringArray(v)
    const color = parseColor(v.startsWith('#') ? v : `#${v}`)

    if (color) {
      const { r, g, b, a } = color

      if (a !== 1)
        return new Error('Invalid color, alpha channel is not supported')

      const pad = (n: number) => n.toString(16).padStart(2, '0')
      return `#${pad(r)}${pad(g)}${pad(b)}` as T
    }
    return new Error('Invalid color, expected color string, like #f00 or #ff0000, # can be omitted')
  })
}

export function _date(field: QueryField0<Date, false>): QueryField<'date', Date, false>
export function _date(field: QueryField0<Date, true>): QueryField<'date', Date, true>
export function _date<T extends Date = Date>(field: QueryField0<T, false>): QueryField<'date', T, false>
export function _date<T extends Date = Date>(field: QueryField0<T, true>): QueryField<'date', T, true>
export function _date<T extends Date = Date>(field: QueryField0<T, boolean>): QueryField<'date', T, boolean> {
  return _field('date', field, (v) => {
    return (parseDate(nonStringArray(v)) ?? new Error('Invalid date, expected date string, like 2021-01-01 00:00:00')) as T | Error
  })
}

export type QueryField0WithParse<T, R extends boolean = false> = QueryField0<T, R> & { parse?: (v: string[]) => T | Error }

export function _array(field: QueryField0WithParse<string[], false>): QueryField<'array', string[], false>
export function _array(field: QueryField0WithParse<string[], true>): QueryField<'array', string[], true>
export function _array<T extends string = string>(field: QueryField0WithParse<T[], false>): QueryField<'array', T[], false>
export function _array<T extends string = string>(field: QueryField0WithParse<T[], true>): QueryField<'array', T[], true>
export function _array<T extends string = string>(field: QueryField0WithParse<T[], boolean>): QueryField<'array', T[], boolean> {
  const _parse = field.parse
  return _field('array', field, (v) => {
    let r: T[]
    if (Array.isArray(v))
      r = v as T[]
    else
      r = v.split(',').map(v => v.trim()).filter(Boolean) as T[]

    if (typeof _parse === 'function')
      return _parse(r) as T[]
    return r
  })
}

export function define<T extends Record<string, QueryField<QueryFieldTypes, any, boolean>>>(
  fields: T,
): {
    [K in keyof T]: QueryField<T[K]['type'], T[K]['default'], T[K]['required']>
  } {
  return fields
}

export type ParsedQueryType<T extends Record<string, QueryField<QueryFieldTypes, any, boolean>>> = {
  [K in keyof T]: T[K] extends QueryField<QueryFieldTypes, infer Val, infer R> ? (R extends true ? Exclude<Val, undefined> : (Val | undefined)) : never
}

export interface ParseQueryResult<T extends Record<string, QueryField<QueryFieldTypes, any, boolean>>> {
  parsedQuery: ParsedQueryType<T>
  errors: { [K in keyof T]?: { required: boolean, message: string } }
}

export function parse<T extends Record<string, QueryField<QueryFieldTypes, any, boolean>>>(query: ParsedQuery, fields: T): ParseQueryResult<T> {
  const parsedQuery: Record<string, any> = {}
  const errors: Partial<Record<keyof T, { required: boolean, message: string }>> = {}

  for (const key in fields) {
    const field = fields[key]
    const value = query[key]

    if (value === undefined && field.required) {
      errors[key] = { required: true, message: 'Required field is missing' }
    }
    else if (value === undefined) {
      if (field.default !== undefined)
        parsedQuery[key] = field.default
    }
    else {
      const parse = (value: string | string[]): any => {
        const r = field.parse(value)
        if (r instanceof Error)
          throw r

        if (typeof field.validator === 'function') {
          const err = field.validator(r)
          if (err instanceof Error)
            throw err
        }

        return r
      }

      try {
        parsedQuery[key] = parse(value)
      }
      catch (err) {
        parsedQuery[key] = field.default
        errors[key] = { required: field.required, message: err instanceof Error ? err.message : String(err) }
      }
    }
  }

  return { parsedQuery: parsedQuery as ParsedQueryType<T>, errors }
}

export function printFields(fields: Record<string, QueryField<QueryFieldTypes, any, boolean>>) {
  const entries = Object.entries(fields)

  entries.sort((a, b) => {
    const aRequired = a[1].required ? 0 : 1
    const bRequired = b[1].required ? 0 : 1
    if (aRequired !== bRequired)
      return aRequired - bRequired
    return a[1].order - b[1].order
  })

  let len = 0

  for (const [key, field] of entries)
    len = Math.max(len, key.length + (field.required ? 1 : 0) + field.type.length + 2)

  const messages: string[] = []

  const colors = {
    string: cyan,
    boolean: magenta,
    number: yellow,
    color: green,
    date: blue,
    array: red,
  } as const

  const t = (type: QueryFieldTypes) => (colors[type] ?? cyan)(`(${type})`)

  for (const [key, field] of entries) {
    const padding = ' '.repeat(len - key.length - (field.required ? 1 : 0) - field.type.length - 2)
    const defaultVal = field.default !== void 0 ? `(default: ${field.default})` : ''

    messages.push(` - ${bold(key)}${t(field.type)}${field.required ? required() : ''}${padding} : ${gray(field.description)} ${defaultVal}`)
  }

  // eslint-disable-next-line no-console
  console.log(`${bold('Parameters:')}\n\n${messages.join('\n')}`)
}

export function printErrors(errors: Record<string, { required: boolean, message: string }>) {
  const messages = [] as string[]

  let maxLen = 0
  for (const key in errors)
    maxLen = Math.max(maxLen, key.length)

  for (const key in errors) {
    const err = errors[key]
    messages.push(` - ${bold(key.padEnd(maxLen, ' '))} : ${(err.required ? red : yellow)(err.message)}`)
  }

  if (messages.length)
    // eslint-disable-next-line no-console
    console.log(`${red(bold('Errors:'))}\n\n${messages.join('\n')}`)
}
