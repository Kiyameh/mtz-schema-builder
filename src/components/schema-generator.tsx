/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {useState, useEffect} from 'react'
import {Plus, Trash2, Save, Library} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Card, CardContent} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Checkbox} from '@/components/ui/checkbox'
import {CodeBlock} from '@/components/code-block'
import {
  generateMongooseSchema,
  generateTypeScriptInterface,
  generateZodSchema,
} from '@/lib/schema-generators'
import {ModelLibrary} from '@/components/model-library'
import {toast} from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export type PropertyType =
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'Date'
  | 'ObjectId'
  | 'Array'
  | 'Object'

export interface Property {
  name: string
  type: PropertyType
  required: boolean
  unique: boolean
  min?: number
  max?: number
  default?: string
}

export interface SavedModel {
  id: string
  modelName: string
  properties: Property[]
  generatedCode: {
    mongoose: string
    zod: string
    typescript: string
  }
  createdAt: string
}

export default function SchemaGenerator() {
  const [modelName, setModelName] = useState('')
  const [properties, setProperties] = useState<Property[]>([
    {name: '', type: 'String', required: false, unique: false},
  ])
  const [activeTab, setActiveTab] = useState('mongoose')
  const [generatedCode, setGeneratedCode] = useState({
    mongoose: '',
    zod: '',
    typescript: '',
  })
  const [savedModels, setSavedModels] = useState<SavedModel[]>([])
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  // Load saved models from localStorage on component mount
  useEffect(() => {
    const storedModels = localStorage.getItem('schemaModels')
    if (storedModels) {
      setSavedModels(JSON.parse(storedModels))
    }
  }, [])

  const addProperty = () => {
    setProperties([
      ...properties,
      {name: '', type: 'String', required: false, unique: false},
    ])
  }

  const removeProperty = (index: number) => {
    const newProperties = [...properties]
    newProperties.splice(index, 1)
    setProperties(newProperties)
  }

  const updateProperty = (index: number, field: keyof Property, value: any) => {
    const newProperties = [...properties]
    newProperties[index] = {...newProperties[index], [field]: value}
    setProperties(newProperties)
  }

  const generateSchemas = () => {
    // Filter out empty properties
    const validProperties = properties.filter((prop) => prop.name.trim() !== '')

    if (modelName.trim() === '' || validProperties.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Model name and at least one property are required.',
        variant: 'destructive',
      })
      return
    }

    const mongooseSchema = generateMongooseSchema(modelName, validProperties)
    const zodSchema = generateZodSchema(modelName, validProperties)
    const tsInterface = generateTypeScriptInterface(modelName, validProperties)

    setGeneratedCode({
      mongoose: mongooseSchema,
      zod: zodSchema,
      typescript: tsInterface,
    })
  }

  const saveModelToLibrary = () => {
    // Validate that we have generated code and a model name
    if (!generatedCode.mongoose || modelName.trim() === '') {
      toast({
        title: 'Cannot Save',
        description: 'Please generate a schema first.',
        variant: 'destructive',
      })
      return
    }

    const newModel: SavedModel = {
      id: Date.now().toString(),
      modelName,
      properties: properties.filter((prop) => prop.name.trim() !== ''),
      generatedCode,
      createdAt: new Date().toISOString(),
    }

    const updatedModels = [...savedModels, newModel]
    setSavedModels(updatedModels)

    // Save to localStorage
    localStorage.setItem('schemaModels', JSON.stringify(updatedModels))

    toast({
      title: 'Success',
      description: `${modelName} model saved to library.`,
    })
  }

  const deleteModel = (id: string) => {
    const updatedModels = savedModels.filter((model) => model.id !== id)
    setSavedModels(updatedModels)

    // Update localStorage
    localStorage.setItem('schemaModels', JSON.stringify(updatedModels))

    toast({
      title: 'Deleted',
      description: 'Model removed from library.',
    })
  }

  const loadModel = (model: SavedModel) => {
    setModelName(model.modelName)
    setProperties(model.properties)
    setGeneratedCode(model.generatedCode)
    setIsLibraryOpen(false)

    toast({
      title: 'Model Loaded',
      description: `${model.modelName} loaded into editor.`,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schema Definition</h2>
        <Dialog
          open={isLibraryOpen}
          onOpenChange={setIsLibraryOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline">
              <Library className="h-4 w-4 mr-2" />
              Model Library
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Saved Models</DialogTitle>
            </DialogHeader>
            <ModelLibrary
              models={savedModels}
              onDelete={deleteModel}
              onLoad={loadModel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="modelName">Model/Schema Name</Label>
              <Input
                id="modelName"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g. User, Product, etc."
                className="mt-1"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Properties</h3>
                <Button
                  onClick={addProperty}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>

              {properties.map((property, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-start p-4 border rounded-md"
                >
                  <div className="col-span-3">
                    <Label htmlFor={`property-${index}-name`}>Name</Label>
                    <Input
                      id={`property-${index}-name`}
                      value={property.name}
                      onChange={(e) =>
                        updateProperty(index, 'name', e.target.value)
                      }
                      placeholder="e.g. name, email"
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor={`property-${index}-type`}>Type</Label>
                    <Select
                      value={property.type}
                      onValueChange={(value) =>
                        updateProperty(index, 'type', value as PropertyType)
                      }
                    >
                      <SelectTrigger
                        id={`property-${index}-type`}
                        className="mt-1"
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Number">Number</SelectItem>
                        <SelectItem value="Boolean">Boolean</SelectItem>
                        <SelectItem value="Date">Date</SelectItem>
                        <SelectItem value="ObjectId">ObjectId</SelectItem>
                        <SelectItem value="Array">Array</SelectItem>
                        <SelectItem value="Object">Object</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center space-x-2 mt-6">
                      <Checkbox
                        id={`property-${index}-required`}
                        checked={property.required}
                        onCheckedChange={(checked) =>
                          updateProperty(index, 'required', checked)
                        }
                      />
                      <Label htmlFor={`property-${index}-required`}>
                        Required
                      </Label>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center space-x-2 mt-6">
                      <Checkbox
                        id={`property-${index}-unique`}
                        checked={property.unique}
                        onCheckedChange={(checked) =>
                          updateProperty(index, 'unique', checked)
                        }
                      />
                      <Label htmlFor={`property-${index}-unique`}>Unique</Label>
                    </div>
                  </div>

                  {(property.type === 'Number' ||
                    property.type === 'String') && (
                    <>
                      <div className="col-span-1">
                        <Label htmlFor={`property-${index}-min`}>Min</Label>
                        <Input
                          id={`property-${index}-min`}
                          type="number"
                          value={property.min || ''}
                          onChange={(e) =>
                            updateProperty(
                              index,
                              'min',
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          className="mt-1"
                        />
                      </div>

                      <div className="col-span-1">
                        <Label htmlFor={`property-${index}-max`}>Max</Label>
                        <Input
                          id={`property-${index}-max`}
                          type="number"
                          value={property.max || ''}
                          onChange={(e) =>
                            updateProperty(
                              index,
                              'max',
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}

                  <div className="col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProperty(index)}
                      disabled={properties.length === 1}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={generateSchemas}
                className="flex-1"
              >
                Generate Schemas
              </Button>
              <Button
                onClick={saveModelToLibrary}
                variant="outline"
                className="flex items-center"
                disabled={!generatedCode.mongoose}
              >
                <Save className="h-4 w-4 mr-2" />
                Save to Library
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {generatedCode.mongoose && (
        <Card>
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="mongoose">Mongoose</TabsTrigger>
                <TabsTrigger value="zod">Zod</TabsTrigger>
                <TabsTrigger value="typescript">TypeScript</TabsTrigger>
              </TabsList>
              <TabsContent value="mongoose">
                <CodeBlock
                  code={generatedCode.mongoose}
                  language="typescript"
                />
              </TabsContent>
              <TabsContent value="zod">
                <CodeBlock
                  code={generatedCode.zod}
                  language="typescript"
                />
              </TabsContent>
              <TabsContent value="typescript">
                <CodeBlock
                  code={generatedCode.typescript}
                  language="typescript"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
