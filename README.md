# EduQuest - Educational Gaming Platform 🎮📚

A beautiful, interactive educational gaming platform designed for middle school students to learn through play. Students can scan QR codes from their NCERT textbooks to access topic-specific games.

## 🎨 Design Features

- **Bold & Playful Aesthetic**: Vibrant gradient colors, playful typography (Fredoka + DM Sans), and engaging animations
- **Intuitive Navigation**: Easy-to-use interface designed specifically for middle school students
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Animated Elements**: Floating background shapes, card hover effects, and smooth transitions
- **Custom Color Scheme**: Primary (Orange), Secondary (Teal), and Accent colors (Purple, Yellow, Pink, Blue)

## 🚀 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Phaser** - Game development (to be integrated)
- **Firebase** - Backend/database (to be integrated)
- **QR Code Generation** - For textbook integration

## 📁 Project Structure

```
eduquest/
├── app/
│   ├── page.tsx                    # Landing page with subject cards
│   ├── layout.tsx                  # Root layout with global styles
│   ├── globals.css                 # Custom CSS animations & styles
│   ├── subject/[id]/              
│   │   └── page.tsx                # Subject page with topics & sections
│   ├── game/[subject]/[topic]/[section]/
│   │   └── page.tsx                # Game page (Phaser integration point)
│   ├── admin/
│   │   └── page.tsx                # Admin panel for QR code generation
│   └── qr-scanner/
│       └── page.tsx                # QR code scanner for students
├── components/                     # Reusable components (to be added)
├── lib/                            # Utility functions (to be added)
├── public/                         # Static assets
└── tailwind.config.ts              # Tailwind configuration
```

## 🎯 Key Pages

### 1. Landing Page (`/`)
- Hero section with search
- Subject cards (Math, Science, English, Social Studies)
- Recent activity/continue learning
- QR scanner call-to-action

### 2. Subject Page (`/subject/[id]`)
- Topic listings organized by NCERT chapters
- Section-based progression with level indicators
- Progress tracking per section
- Lock/unlock mechanism for sequential learning

### 3. Admin Panel (`/admin`)
- QR code generator for textbook integration
- Form to specify: Subject, Topic, Section, Level
- QR code preview and download
- Generation history with batch download
- Instructions for teachers/parents

### 4. QR Scanner (`/qr-scanner`)
- Camera interface for scanning QR codes
- Simulated scanning animation
- Manual code entry option
- Help section for students

### 5. Game Page (`/game/[subject]/[topic]/[section]`)
- Placeholder for Phaser game integration
- Score display and lives counter
- Game instructions
- Dynamic routing based on subject/topic/section/level

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to the project directory**
   ```bash
   cd eduquest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 QR Code Integration

### How It Works

1. **Generate QR Codes** (Admin Panel)
   - Teachers/parents access `/admin`
   - Select subject, topic, section, and starting level
   - Generate and download QR codes
   - Print and place in textbooks at end of exercise sections

2. **Scan QR Codes** (Student)
   - Students complete a textbook section
   - Scan the QR code with their phone
   - Automatically directed to the matching game
   - Play and learn!

### QR Code URL Format
```
https://yourdomain.com/game/{subject}/{topic}/{section}?level={level}
```

Example:
```
https://eduquest.com/game/math/linear-equations/0?level=1
```

## 🎮 Phaser Integration (Next Steps)

To integrate Phaser games:

1. **Install Phaser** (already in package.json)
   ```bash
   npm install phaser
   ```

2. **Create game components** in `components/games/`
   - Different game types for different subjects
   - Math games: equation solving, number matching
   - Science games: cell labeling, force diagrams
   - English games: grammar challenges, vocabulary

3. **Add game logic** in the game page
   - Initialize Phaser in `useEffect`
   - Load game based on subject/topic/section/level
   - Track score and progress

4. **Example Phaser Component Structure**:
   ```typescript
   // components/games/MathGame.tsx
   import Phaser from 'phaser';
   import { useEffect, useRef } from 'react';

   export default function MathGame({ topic, level, onComplete }) {
     const gameRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
       // Phaser game configuration
       const config: Phaser.Types.Core.GameConfig = {
         type: Phaser.AUTO,
         parent: gameRef.current!,
         width: 800,
         height: 600,
         // ... game scenes
       };

       const game = new Phaser.Game(config);
       return () => game.destroy(true);
     }, []);

     return <div ref={gameRef} />;
   }
   ```

## 🔥 Firebase Integration (Next Steps)

For data persistence:

1. **Install Firebase**
   ```bash
   npm install firebase
   ```

2. **Create Firebase config** (`lib/firebase.ts`)
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     // Your config here
   };

   export const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```

3. **Data to Store**:
   - User progress per subject/topic/level
   - High scores and achievements
   - Generated QR codes metadata
   - Game completion status

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme:
```typescript
colors: {
  primary: { /* Your colors */ },
  secondary: { /* Your colors */ },
  accent: { /* Your colors */ },
}
```

### Fonts
Change fonts in `app/globals.css`:
```css
@import url('your-google-fonts-url');

:root {
  --font-display: 'YourFont', sans-serif;
  --font-body: 'YourFont', sans-serif;
}
```

### Animations
Modify animations in `tailwind.config.ts` and `app/globals.css`

## 📝 Data Structure Example

```typescript
// Subject Data
{
  id: 'math',
  name: 'Mathematics',
  topics: [
    {
      id: 'linear-equations',
      name: 'Linear Equations',
      chapter: 'Chapter 4',
      sections: [
        {
          name: 'Introduction to Variables',
          levels: 3,
          completed: 2
        }
      ]
    }
  ]
}
```

## 🚧 To-Do / Future Enhancements

- [ ] Integrate Phaser games for each topic
- [ ] Connect Firebase for data persistence
- [ ] Implement user authentication
- [ ] Add real QR code scanning (using device camera)
- [ ] Create actual game mechanics for different subjects
- [ ] Add achievement/badge system
- [ ] Implement leaderboards
- [ ] Add audio/sound effects
- [ ] Create parent/teacher dashboard
- [ ] Add analytics for learning progress
- [ ] Support for multiple grade levels
- [ ] Multi-language support

## 📖 For Hackathon Judges

This is a **semi-functional prototype** demonstrating:

✅ **Beautiful, engaging UI/UX** designed for middle school students  
✅ **Complete navigation flow** from landing → subject → topic → game  
✅ **QR code generation system** for textbook integration  
✅ **Responsive design** that works on all devices  
✅ **Admin panel** for educators to create QR codes  
✅ **Scalable architecture** ready for Phaser game integration  

The core innovation is the **seamless integration between physical textbooks and digital games** through QR codes, making learning interactive and fun while aligned with curriculum (NCERT).

## 📄 License

This project is created for educational purposes as part of a hackathon.

## 🤝 Contributing

This is a hackathon project, but suggestions and improvements are welcome!

---

**Built with ❤️ for middle school learners**
