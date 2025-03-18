"use client"

import { useState } from "react"
import type { SavedModel } from "@/components/schema-generator"
import { Button } from "@/components/ui/button"
import { Trash2, FileCode, Clock } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/code-block"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ModelLibraryProps {
  models: SavedModel[]
  onDelete: (id: string) => void
  onLoad: (model: SavedModel) => void
}

export function ModelLibrary({ models, onDelete, onLoad }: ModelLibraryProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileCode className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No saved models yet.</p>
        <p className="text-sm mt-2">Generate and save a model to see it here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <Accordion type="single" collapsible className="w-full">
        {models.map((model) => (
          <AccordionItem key={model.id} value={model.id}>
            <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="font-medium">{model.modelName}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(model.createdAt)}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    {model.properties.length} {model.properties.length === 1 ? "property" : "properties"}
                  </p>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onLoad(model)}>
                      Load
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(model.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="mongoose">
                  <TabsList className="grid grid-cols-3 mb-2">
                    <TabsTrigger value="mongoose">Mongoose</TabsTrigger>
                    <TabsTrigger value="zod">Zod</TabsTrigger>
                    <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                  </TabsList>
                  <TabsContent value="mongoose">
                    <CodeBlock code={model.generatedCode.mongoose} language="typescript" />
                  </TabsContent>
                  <TabsContent value="zod">
                    <CodeBlock code={model.generatedCode.zod} language="typescript" />
                  </TabsContent>
                  <TabsContent value="typescript">
                    <CodeBlock code={model.generatedCode.typescript} language="typescript" />
                  </TabsContent>
                </Tabs>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this model from your library.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

