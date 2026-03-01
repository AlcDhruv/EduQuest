# EduQuest - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd eduquest
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to: http://localhost:3000

That's it! Your platform is running! 🎉

## 🎯 What You'll See

### Main Pages Available:
1. **Home** (`/`) - Browse subjects and topics
2. **Subject Pages** (`/subject/math`, `/subject/science`) - View topics and levels
3. **Admin Panel** (`/admin`) - Generate QR codes for textbooks
4. **QR Scanner** (`/qr-scanner`) - Scan textbook QR codes (simulated)
5. **Game Page** (`/game/...`) - Placeholder for Phaser games

## 🎨 Design Highlights

- **Vibrant Colors**: Orange & Teal primary palette with Purple, Pink, Yellow, Blue accents
- **Playful Typography**: Fredoka (display) + DM Sans (body)
- **Smooth Animations**: Floating shapes, card hovers, transitions
- **Mobile Responsive**: Works on all screen sizes

## 📱 QR Code Feature Demo

### As Admin/Teacher:
1. Go to `/admin`
2. Fill in: Subject, Topic, Section, Level
3. Click "Generate QR Code"
4. Download the QR code
5. (In real use: Print and paste in textbook)

### As Student:
1. Go to `/qr-scanner` 
2. Click "Start Camera" (simulated for demo)
3. Waits 2 seconds to simulate scanning
4. Redirects to appropriate subject/topic

## 🔧 Next Steps for Full Implementation

### 1. Phaser Game Integration
- Create game components in `components/games/`
- Different game types per subject (math puzzles, science quizzes, etc.)
- Integrate in `/app/game/[subject]/[topic]/[section]/page.tsx`

### 2. Firebase Setup
- Create Firebase project
- Add config to `lib/firebase.ts`
- Store: user progress, scores, QR metadata

### 3. Real QR Scanning
- Use `react-qr-reader` or similar library
- Access device camera
- Parse scanned URL and redirect

### 4. Actual Game Development
Different game mechanics per subject:
- **Math**: Equation solving, number matching, fraction visualization
- **Science**: Cell labeling, force diagrams, element matching
- **English**: Grammar correction, vocabulary building, sentence construction
- **Social Studies**: Map quizzes, timeline matching, historical events

## 🏗️ Project Structure

```
eduquest/
├── app/                   # Next.js pages
│   ├── page.tsx          # Home page
│   ├── subject/[id]      # Dynamic subject pages
│   ├── game/...          # Dynamic game pages
│   ├── admin/            # QR generator
│   └── qr-scanner/       # QR scanner
├── components/           # React components (add your games here)
├── public/              # Images, fonts, assets
└── tailwind.config.ts   # Theme customization
```

## 💡 Tips for Hackathon

### For Presentation:
1. **Show the Flow**: Home → Subject → Topic → QR Scan → Game
2. **Highlight Innovation**: Physical textbook + Digital game integration
3. **Demonstrate Admin Panel**: How teachers create QR codes
4. **Emphasize Design**: Beautiful, student-friendly UI

### For Demo:
1. Start at homepage - show subject cards
2. Click Math → show topic organization
3. Open Admin panel → generate a QR code
4. Go to QR Scanner → show scanning simulation
5. End at game page → explain Phaser integration point

## 🎮 Mock Data Provided

The project includes mock data for:
- 4 Subjects (Math, Science, English, Social Studies)
- Multiple topics per subject
- 3-5 sections per topic
- Progress tracking simulation

## 🔥 Making it Production-Ready

To deploy for real use:

1. **Environment Variables** (create `.env.local`):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

2. **Build for Production**:
```bash
npm run build
npm run start
```

3. **Deploy** (Vercel recommended):
```bash
npm install -g vercel
vercel
```

## 🐛 Troubleshooting

**Port already in use?**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**Dependencies issue?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
```bash
rm -rf .next
npm run dev
```

## 📞 Support

For questions or issues during development, refer to:
- Next.js Docs: https://nextjs.org/docs
- Tailwind Docs: https://tailwindcss.com/docs
- Phaser Docs: https://phaser.io/learn

---

**Happy Coding! Make learning fun! 🚀📚**
