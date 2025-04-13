
# HackerFind - Connect Developers for Hackathons

![HackerFind Platform](https://github.com/identicons/jasonlong.png)

## About HackerFind

HackerFind is a platform designed to connect talented developers for hackathons. It allows users to discover upcoming hackathons, find teammates with complementary skills, and build amazing projects together.

## Features

- **GitHub Authentication**: Seamless sign-in with GitHub accounts
- **Developer Profiles**: Create and customize your developer profile with skills, bio, and portfolio links
- **Hackathon Discovery**: Browse upcoming hackathons with detailed information
- **Team Building**: Find teammates based on skills and availability
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Authentication, Database, Storage)
- **State Management**: React Context API, TanStack Query
- **Routing**: React Router
- **Styling**: Tailwind CSS with custom GitHub-inspired theme
- **Data Visualization**: Recharts (for statistics)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hackerfind
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── globe/          # Interactive globe visualization
│   ├── hackathons/     # Hackathon-related components
│   ├── layout/         # Layout components (Navbar, Footer, etc.)
│   ├── ui/             # shadcn/ui components
│   └── users/          # User-related components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations (Supabase)
├── lib/                # Utility functions and helpers
├── pages/              # Application pages
│   ├── Admin/          # Admin-related pages
│   ├── Auth/           # Authentication pages
│   ├── Hackathons/     # Hackathon-related pages
│   └── Profile/        # User profile pages
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Key URLs and Endpoints

- `/` - Home page
- `/auth/login` - Login page
- `/auth/callback` - OAuth callback handler
- `/developers` - Browse developers
- `/hackathons` - Browse hackathons
- `/hackathons/:id` - View hackathon details
- `/profile/:id` - View user profile
- `/profile/edit` - Edit user profile
- `/admin/hackathons/create` - Create new hackathon (auth required)

## Database Schema

The application uses Supabase for its backend and includes the following main tables:

- **profiles**: User profile information
- **hackathons**: Hackathon event details
- **hackathon_participants**: Many-to-many relationship between users and hackathons they're participating in
- **skills**: List of available skills that developers can add to their profiles

## Authentication Flow

1. User clicks "Sign in with GitHub" button
2. User is redirected to GitHub OAuth login page
3. After successful authentication, GitHub redirects to `/auth/callback`
4. The callback page handles the authentication token and establishes a session
5. User is redirected to the home page with an active session

## Deployment

The application is deployed using Lovable's built-in deployment feature. Simply click on the "Publish" button in the Lovable interface to deploy the latest version.

### Custom Domain Setup

To connect your custom domain:
1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain" and follow the instructions
3. Set up the necessary DNS records for your domain

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Lovable](https://lovable.dev) for the application development platform
- [Supabase](https://supabase.io) for backend services
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [React](https://reactjs.org) and [Vite](https://vitejs.dev) for the frontend framework
