# FinBridge

FinBridge is a comprehensive financial management platform built with **Next.js**, **Tailwind CSS**, and **Firebase**.  
It provides AI-powered insights, document parsing, personalized financial recommendations, and a seamless interface for managing finances, payments, and reports.

---

## Features

- AI-driven financial advice and reminders
- Parsing of financial documents
- Expense, fee, and payment management
- Reports & dashboards
- User-friendly UI with reusable components
- Firebase backend integration for hosting and database

---

## Project Structure

```

FinBridge/
│
├── backend/                # Node.js / Firebase backend
├── src/                    # Frontend source (Next.js)
│   ├── app/                # Pages
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React Contexts
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── docs/                   # Project documentation
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts

````

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x
- Firebase account
- Firebase CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/Ayushkr0005/FinBridge.git
cd FinBridge

# Install dependencies
npm install
````

---

### Running Locally

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in the browser.

---

### Firebase Deployment

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting (run only once)
firebase init hosting

# Build Next.js app for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

> Make sure to **never commit `.env` or secrets** to the repository.

---

### Recommended Git Workflow

```bash
# Create a feature branch
git checkout -b feature/feature-name

# After making changes
git add .
git commit -m "Add feature description"

# Push branch
git push origin feature/feature-name

# Merge to main after testing
git checkout main
git merge feature/feature-name
git push
```

---

### Contributing

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature-name`)
3. Commit your changes
4. Push to your fork
5. Create a Pull Request

---

### License

This project is licensed under the MIT License.

---

### Contact

For questions or support, reach out via GitHub Issues or email.

--- 
