# Schema Generator Web Application



This web application allows users to easily define and generate schemas for **Mongoose**, **Zod**, and **TypeScript**. It's a user-friendly solution for quickly creating schemas without diving into the technical complexities.

## Features

- **Form-based Input:** Users can define database object names and specify properties, including:
  - Property name
  - Data type
  - Additional options like:
    - Required
    - Indexed
    - Minimum or Maximum values
- **Schema Outputs:** Generates the following schemas:
  - **Zod schema:** A validation schema compatible with the Zod library.
  - **TypeScript interface:** A strongly-typed interface for TypeScript.
  - **Mongoose schema and model:** Schema and model ready for Mongoose, a popular MongoDB library.
- **Tabbed Output Display:**
  - View generated Zod schema, TypeScript interface, and Mongoose schema in separate tabs.
  - Copy code functionality for easy integration into your project.

## Technologies Used

- **Vite:** Lightning-fast build tool for modern web applications.
- **React:** JavaScript library for building user interfaces.
- **TailwindCSS:** For designing a modern and responsive user interface.
- **JavaScript/TypeScript:** For robust and scalable development.
- **Zod:** Validation library for schema generation.
- **Mongoose:** MongoDB Object Data Modeling library.

