# Programming Quiz App

An interactive learning platform designed to help developers prepare for technical interviews with AI-powered explanations.

## Features

- Multiple programming categories (Web Development, Python, Golang, Java)
- Interactive quizzes with AI-generated explanations
- OAuth authentication (GitHub and Google)
- Email/password authentication
- User progress tracking
- Dark/Light theme support

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database)
- Shadcn UI Components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd programming_quiz
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                  # Next.js app router pages
├── components/          # Reusable components
├── context/            # React context providers
├── lib/                # Utility functions and configurations
├── public/             # Static assets
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
