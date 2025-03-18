interface Property {
  name: string
  type: string
  required: boolean
  unique: boolean
  min?: number
  max?: number
  default?: string
}

export function generateMongooseSchema(
  modelName: string,
  properties: Property[]
): string {
  const capitalizedModelName =
    modelName.charAt(0).toUpperCase() + modelName.slice(1)

  const schemaProperties = properties
    .map((prop) => {
      let propDefinition = `  ${prop.name}: {`
      propDefinition += `\n    type: ${getMongooseType(prop.type)},`

      if (prop.required) {
        propDefinition += '\n    required: true,'
      }

      if (prop.unique) {
        propDefinition += '\n    unique: true,'
      }

      if (prop.type === 'String' && prop.min !== undefined) {
        propDefinition += `\n    minlength: ${prop.min},`
      }

      if (prop.type === 'String' && prop.max !== undefined) {
        propDefinition += `\n    maxlength: ${prop.max},`
      }

      if (prop.type === 'Number' && prop.min !== undefined) {
        propDefinition += `\n    min: ${prop.min},`
      }

      if (prop.type === 'Number' && prop.max !== undefined) {
        propDefinition += `\n    max: ${prop.max},`
      }

      propDefinition += '\n  },'

      return propDefinition
    })
    .join('\n')

  return `import mongoose from 'mongoose'

const ${modelName}Schema = new mongoose.Schema({
${schemaProperties}
}, { timestamps: true })

const ${capitalizedModelName} = mongoose.models.${capitalizedModelName} || mongoose.model('${capitalizedModelName}', ${modelName}Schema)

export default ${capitalizedModelName}`
}

export function generateZodSchema(
  modelName: string,
  properties: Property[]
): string {
  const capitalizedModelName =
    modelName.charAt(0).toUpperCase() + modelName.slice(1)

  const schemaProperties = properties
    .map((prop) => {
      let propDefinition = `  ${prop.name}: z.${getZodType(prop.type)}`

      if (prop.type === 'String') {
        if (prop.min !== undefined) {
          propDefinition += `.min(${prop.min})`
        }

        if (prop.max !== undefined) {
          propDefinition += `.max(${prop.max})`
        }
      }

      if (prop.type === 'Number') {
        if (prop.min !== undefined) {
          propDefinition += `.min(${prop.min})`
        }

        if (prop.max !== undefined) {
          propDefinition += `.max(${prop.max})`
        }
      }

      if (!prop.required) {
        propDefinition += '.optional()'
      }

      propDefinition += ','

      return propDefinition
    })
    .join('\n')

  return `import { z } from 'zod'

export const ${capitalizedModelName}Schema = z.object({
${schemaProperties}
})`
}

export function generateTypeScriptInterface(
  modelName: string,
  properties: Property[]
): string {
  const capitalizedModelName =
    modelName.charAt(0).toUpperCase() + modelName.slice(1)

  const interfaceProperties = properties
    .map((prop) => {
      return `  ${prop.name}${prop.required ? '' : '?'}: ${getTsType(
        prop.type
      )}`
    })
    .join('\n')

  return `export interface ${capitalizedModelName} {
${interfaceProperties}
}`
}

function getMongooseType(type: string): string {
  switch (type) {
    case 'String':
      return 'String'
    case 'Number':
      return 'Number'
    case 'Boolean':
      return 'Boolean'
    case 'Date':
      return 'Date'
    case 'ObjectId':
      return 'mongoose.Schema.Types.ObjectId'
    case 'Array':
      return '[]'
    case 'Object':
      return 'Object'
    default:
      return 'String'
  }
}

function getZodType(type: string): string {
  switch (type) {
    case 'String':
      return 'string()'
    case 'Number':
      return 'number()'
    case 'Boolean':
      return 'boolean()'
    case 'Date':
      return 'date()'
    case 'ObjectId':
      return 'string()'
    case 'Array':
      return 'array(z.any())'
    case 'Object':
      return 'record(z.any())'
    default:
      return 'string()'
  }
}

function getTsType(type: string): string {
  switch (type) {
    case 'String':
      return 'string'
    case 'Number':
      return 'number'
    case 'Boolean':
      return 'boolean'
    case 'Date':
      return 'Date'
    case 'ObjectId':
      return 'string'
    case 'Array':
      return 'any[]'
    case 'Object':
      return 'Record<string, any>'
    default:
      return 'string'
  }
}
