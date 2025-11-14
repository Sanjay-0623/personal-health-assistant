# Personal Health Care Assistant

> An intelligent health monitoring and management system for proactive personal healthcare

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sanjay-0623s-projects/v0-personal-health-assistant)

## Description

The Personal Health Care Assistant is a comprehensive web application designed to help users take control of their health through intelligent digital support. The platform seamlessly integrates real-time health monitoring, AI-powered insights, medication management, and emergency alert systems to provide a complete healthcare management solution.

Built with modern web technologies and AI capabilities, this application emphasizes preventive care, user well-being, and remote health management while ensuring data privacy and security compliance.

## Features

### Real-Time Health Monitoring
- Track vital signs including heart rate, blood pressure, oxygen levels, and body temperature
- Visual health metrics dashboard with interactive charts and trend analysis
- Historical data tracking with date range filtering
- Abnormal reading detection with automatic alerts

### AI-Powered Health Analysis
- Personalized health insights based on your complete health profile
- Interactive health chat assistant for medical questions
- Smart recommendations for lifestyle improvements
- Pattern recognition for early health risk detection

### Medication Management
- Comprehensive medication tracking with dosage and timing information
- Automated medication reminders (upcoming feature)
- Medication history and adherence tracking
- Easy-to-use interface for adding and managing prescriptions

### Emergency Features
- One-click emergency contact access
- Emergency alert system for critical health events
- Medical information quick access
- Healthcare professional connection support

### User Profile & Settings
- Secure user authentication and profile management
- Medical history tracking (allergies, chronic conditions)
- Emergency contact management
- Privacy-first data handling with Row Level Security

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Vercel AI SDK v5
- **Charts**: Recharts
- **Deployment**: Vercel

## Installation

### Prerequisites

- Node.js 18+ or Bun 1.0+
- A Supabase account and project
- Git

### Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Sanjay-0623/personal-health-assistant.git
   cd personal-health-assistant
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   bun install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Development redirect URL
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

4. **Set up the database**
   
   Run the SQL migration scripts in your Supabase SQL Editor in the following order:
   - `scripts/001_create_profiles.sql`
   - `scripts/002_create_health_metrics.sql`
   - `scripts/003_create_medications.sql`
   - `scripts/004_create_medication_logs.sql`
   - `scripts/005_create_health_alerts.sql`
   - `scripts/006_create_ai_insights.sql`
   - `scripts/007_create_profile_trigger.sql`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   bun dev
   \`\`\`

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign Up**: Create a new account using email and password
2. **Complete Profile**: Add your personal and medical information
3. **Add Health Metrics**: Log your vital signs and health data
4. **Set Up Medications**: Add your current medications and schedules
5. **View Dashboard**: Monitor your health trends and AI insights
6. **Chat with Assistant**: Ask health-related questions anytime
7. **Manage Alerts**: Review and respond to health alerts

## Database Schema

The application uses the following main tables:
- `profiles` - User profile information
- `health_metrics` - Daily health readings (heart rate, BP, oxygen, etc.)
- `medications` - User medications and prescriptions
- `medication_logs` - Medication intake tracking
- `health_alerts` - System-generated health alerts
- `ai_insights` - AI-generated health insights and recommendations

All tables are protected with Row Level Security (RLS) policies.

## Security & Privacy

- End-to-end authentication with Supabase Auth
- Row Level Security (RLS) on all database tables
- Secure environment variable handling
- HIPAA-aware data practices
- No third-party data sharing

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sanjay-0623/personal-health-assistant)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Sanjay**

## Acknowledgments

- Built with Next.js and React
- UI components from shadcn/ui
- Database and authentication by Supabase
- AI capabilities powered by Vercel AI SDK

## Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This application is for informational purposes only and should not replace professional medical advice. Always consult with healthcare professionals for medical decisions.
