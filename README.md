# LinkHub

LinkHub is a smart bookmarking application that helps you save, organize, and discover your favorite links. It leverages AI to automatically fetch metadata, categorize your links, and suggest relevant tags, making your collection easily searchable and manageable.

## Features

- **Save Links:** Easily add new links by simply pasting a URL.
- **AI-Powered Metadata:** Automatically fetches the title, description, and preview image for each link.
- **Smart Categorization:** AI suggests a relevant category for each link from a predefined list.
- **Tag Suggestions:** Get AI-powered tag recommendations to keep your links organized.
- **Search & Filter:** Quickly find your saved links with full-text search and category filters.
- **Modern UI:** A clean and responsive interface built with the latest web technologies.

## Tech Stack

This project is built with a modern, production-ready tech stack:

- **Framework:** [Next.js](https://nextjs.org/) (using the App Router)
- **UI Library:** [React](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) (from Google)

## Getting Started

To get the project up and running on your local machine, follow these steps.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) and npm installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    ```

2.  Navigate to the project directory:
    ```bash
    cd <project-directory>
    ```

3.  Install the dependencies:
    ```bash
    npm install
    ```

### Environment Setup

The AI features in this project are powered by the Google Gemini API. To run the application locally, you'll need to provide an API key.

1.  Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create a file named `.env` in the root of the project.
3.  Add your API key to the `.env` file like this:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### Running the Application

To run the application in development mode, use the following command. This will start the Next.js development server.

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

The AI features are powered by Genkit flows. To run the Genkit development UI, which allows you to inspect and test your flows, run this command in a separate terminal:

```bash
npm run genkit:dev
```

You can then view the Genkit developer UI at [http://localhost:4000](http://localhost:4000).
