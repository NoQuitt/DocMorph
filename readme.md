# DocMorph AI - Frontend

## Description
DocMorph AI is a modern AI-powered document management platform. The frontend is built to provide users with an intuitive interface to interact with advanced backend capabilities for extracting and filling data in documents.

## Features
- Extract sensitive information from documents like names, dates of birth, and more.
- Fill forms and documents dynamically using extracted or custom data.
- Supports multiple formats: PDF, DOCX, XLSX, CSV, and TXT.
- Modern UI with responsive design and animations.
- Seamless integration with Grok AI for high precision.

## Requirements
- Node.js (v16+ recommended)
- npm or yarn
- A valid Grok AI API key

## Setup
1. Clone this repository:
    ```bash
    git clone https://github.com/your-repo/DocMorphAI-frontend.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a .env file in the root directory and add the following:
    ```bash
    GROK_API_KEY=your-grok-api-key
    ```
    Replace your-grok-api-key with your valid Grok AI API key.

5. Start the development server:
    ```bash
    npm start
    ```

6. Open your browser and navigate to http://localhost:3000.

## Technologies
- React: JavaScript library for building user interfaces.
- TailwindCSS: Styling framework for responsive designs.
- Framer Motion: Smooth animations and transitions.
- Grok AI: AI-powered backend processing for document management.