import './App.css'
import SchemaGenerator from './components/schema-generator'
import {Toaster} from './components/ui/toaster'

function App() {
  return (
    <>
      <main className="container mx-auto py-8 px-4">
        <img
          src="/mtz_logo.jpg"
          alt="MTZ Logo"
        />
        <h1 className="text-3xl font-bold mb-6 text-center">
          Schema Generator
        </h1>
        <p className="text-center mb-8 text-muted-foreground">
          Generate Mongoose, Zod, and TypeScript schemas from a single
          definition
        </p>
        <SchemaGenerator />
        <Toaster />
      </main>
    </>
  )
}

export default App
