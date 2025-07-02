// Final build test for Cloudflare
import React, { useState, useEffect, useRef } from 'react';
// ... the rest of the file
import { BookOpen, User, Award, CheckCircle, XCircle, Star, TrendingUp, BarChart2, Settings, Sparkles, Loader, BrainCircuit, ChevronRight, Smile, Meh, Frown, Pause, Play, Plus, Shield } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// --- Firebase Configuration ---
// This is now connected to your live Firebase project.
const firebaseConfig = {
  apiKey: "AIzaSyCeOcZADG2UgL2nOna53sTjGEfLVBiBHTQ",
  authDomain: "learnsphere-9f7de.firebaseapp.com",
  projectId: "learnsphere-9f7de",
  storageBucket: "learnsphere-9f7de.appspot.com",
  messagingSenderId: "546040524647",
  appId: "1:546040524647:web:06beb7b279a4955cf789c2",
  measurementId: "G-GZW448KWX4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// --- DATA ---
const subjectData = {
  mathematics: { id: 1, icon: BarChart2, color: 'bg-blue-500', description: 'From basic arithmetic to advanced calculus.', levels: { 'Elementary': { name: 'Math', promptTopic: 'Elementary School Math (grades 3-5) covering addition, subtraction, multiplication, division, and fractions.' }, 'Middle School': { name: 'Pre-Algebra', promptTopic: 'Middle School Pre-Algebra (grades 6-8) covering integers, one-step equations, and inequalities.' }, 'High School': { name: 'Algebra & Geometry', promptTopic: 'High School Algebra and Geometry covering linear equations, quadratic functions, and geometric theorems.' }, 'College Prep': { name: 'Calculus', promptTopic: 'AP Calculus covering limits, derivatives, and integrals.' } } },
  literacy: { id: 2, icon: BookOpen, color: 'bg-green-500', description: 'Improve reading, writing, and comprehension.', levels: { 'Elementary': { name: 'Reading & Writing', promptTopic: 'Elementary School Reading & Writing (grades 3-5) focusing on vocabulary, main idea, and simple sentence structure.' }, 'Middle School': { name: 'Language Arts', promptTopic: 'Middle School Language Arts (grades 6-8) focusing on grammar, theme analysis, and essay structure.' }, 'High School': { name: 'English Literature', promptTopic: 'High School English Literature focusing on literary devices, character analysis, and thematic essays.' }, 'College Prep': { name: 'Advanced Composition', promptTopic: 'Advanced Composition focusing on rhetorical analysis, persuasive writing, and research papers.' } } },
  science: { id: 3, icon: TrendingUp, color: 'bg-purple-500', description: 'Understand core scientific principles.', levels: { 'Elementary': { name: 'Science', promptTopic: 'Elementary School Science (grades 3-5) covering the water cycle, plant life, and the solar system.' }, 'Middle School': { name: 'Life Science', promptTopic: 'Middle School Life Science (grades 6-8) covering cells, ecosystems, and human body systems.' }, 'High School': { name: 'Biology & Chemistry', promptTopic: 'High School Biology and Chemistry covering genetics, chemical reactions, and the periodic table.' }, 'College Prep': { name: 'Physics', promptTopic: 'AP Physics covering kinematics, forces, and electricity.' } } },
  history: { id: 4, icon: Award, color: 'bg-red-500', description: 'Learn about world history and government.', levels: { 'Elementary': { name: 'Social Studies', promptTopic: 'Elementary School Social Studies (grades 3-5) covering community helpers, map skills, and local history.' }, 'Middle School': { name: 'World History', promptTopic: 'Middle School World History (grades 6-8) covering ancient civilizations and world cultures.' }, 'High School': { name: 'US Government', promptTopic: 'High School US Government covering the Constitution, branches of government, and civil rights.' }, 'College Prep': { name: 'Economics', promptTopic: 'AP Economics covering micro and macro principles like supply/demand and GDP.' } } },
};
const getSubjectsForLevel = (level) => { if (!level) return []; return Object.keys(subjectData).map(key => { const subject = subjectData[key]; const levelInfo = subject.levels[level]; return { id: subject.id, key: key, icon: subject.icon, color: subject.color, description: subject.description, name: levelInfo.name, promptTopic: levelInfo.promptTopic, progress: Math.random() > 0.5 ? Math.random() * 0.8 : 0, modules: Math.floor(Math.random() * 5) + 8 }; }); };
const gradeLevels = { 'Elementary': ['3rd Grade', '4th Grade', '5th Grade'], 'Middle School': ['6th Grade', '7th Grade', '8th Grade'], 'High School': ['9th Grade', '10th Grade', '11th Grade', '12th Grade'], 'College Prep': ['Freshman', 'Sophomore', 'Junior', 'Senior'], };
const confidenceLevels = { 'Elementary': [ { level: 'Needs help', description: 'I need a little help to get started.', icon: Frown, prompt: 'is new to this and needs some help' }, { level: 'Getting it', description: 'I know some things, but want to learn more.', icon: Meh, prompt: 'is getting the hang of things but wants to improve' }, { level: 'Ready!', description: 'I feel pretty confident and ready to go!', icon: Smile, prompt: 'is confident and ready for a challenge' }, ], 'default': [ { level: 'Catching up', description: 'I need to review the fundamentals.', icon: Frown, prompt: 'is catching up on the fundamentals' }, { level: 'On track', description: 'I have a good handle on the basics.', icon: Meh, prompt: 'is on track with their learning' }, { level: 'Advanced', description: 'I\'m ready for more challenging topics.', icon: Smile, prompt: 'is ready for advanced topics and challenges' }, ] };

// --- HOOK FOR DYNAMIC SIZING ---
const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    useEffect(() => {
        const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
};

// --- HELPER & UI COMPONENTS ---
const LoadingModal = ({ message }) => ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center shadow-2xl"><Loader className="animate-spin text-blue-600 mb-4" size={48} /><p className="text-lg font-semibold text-gray-700">{message}</p></div></div> );
const ExplanationModal = ({ text, onClose }) => ( <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-fade-in-up"><div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-gray-800 flex items-center"><BrainCircuit className="mr-2 text-purple-500"/> AI Tutor Explanation</h3><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle size={28} /></button></div><div className="prose max-w-none text-gray-600 max-h-[60vh] overflow-y-auto pr-2">{text.split('\n').map((p, i) => <p key={i}>{p}</p>)}</div><button onClick={onClose} className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">Got it!</button></div></div> );
const BottomNavBar = ({ activeScreen, onNavigate }) => { const navItems = [ { name: 'dashboard', icon: BookOpen, label: 'Learn' }, { name: 'subjects', icon: BarChart2, label: 'Subjects' }, { name: 'profile', icon: User, label: 'Profile' } ]; return ( <div className="bg-white shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] w-full"><div className="flex justify-around max-w-lg mx-auto">{navItems.map(item => ( <button key={item.name} onClick={() => onNavigate(item.name)} className={`flex flex-col items-center justify-center w-full py-2 px-1 transition-colors duration-300 ${activeScreen === item.name ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'}`}><item.icon size={24} /><span className="text-xs font-bold mt-1">{item.label}</span></button> ))}</div></div> ); };
const LoginScreen = ({ onLogin, onSignUp, onAdminToggle }) => {
    const [tapCount, setTapCount] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);

    const handleTitleTap = () => {
        const newTapCount = tapCount + 1;
        setTapCount(newTapCount);
        if (newTapCount >= 5) {
            onAdminToggle();
            setTapCount(0);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoginView) {
            onLogin(email, password);
        } else {
            onSignUp(email, password);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600 text-white p-4">
            <BookOpen size={80} className="mb-4 text-blue-200" />
            <h1 onClick={handleTitleTap} className="text-5xl font-bold mb-2 cursor-pointer select-none">LearnSphere</h1>
            <p className="text-lg text-blue-200 mb-8">Quality Education for All.</p>
            <div className="w-full max-w-sm bg-white text-gray-800 rounded-lg shadow-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">{isLoginView ? 'Welcome Back!' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300">
                        {isLoginView ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-gray-500 mt-6 text-sm">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLoginView(!isLoginView)} className="text-blue-600 font-bold ml-1">{isLoginView ? 'Sign Up' : 'Login'}</button>
                </p>
            </div>
        </div>
    );
};
const LevelSelectionScreen = ({ onComplete, userProfile, setUserProfile }) => {
    const [step, setStep] = useState(1);
    const handleLevelSelect = (levelName) => { setUserProfile({...userProfile, level: levelName }); setStep(2); };
    const handleGradeSelect = (grade) => { setUserProfile({...userProfile, grade: grade }); setStep(3); };
    const handleConfidenceSelect = (confidence) => { onComplete(userProfile.grade, confidence); };
    const renderStep = () => {
        switch (step) {
            case 1: return ( <div><div className="text-center mb-8"><h1 className="text-3xl sm:text-4xl font-bold text-gray-800">What's your school level?</h1></div><div className="w-full max-w-md space-y-4">{Object.keys(gradeLevels).map(levelName => ( <button key={levelName} onClick={() => handleLevelSelect(levelName)} className="w-full bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-between items-center text-left"><h2 className="text-2xl font-bold text-gray-800">{levelName}</h2><ChevronRight size={28} className="text-blue-500" /></button> ))}</div></div> );
            case 2: return ( <div><div className="text-center mb-8"><h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Which grade are you in?</h1></div><div className="w-full max-w-md grid grid-cols-2 gap-4">{gradeLevels[userProfile.level].map(grade => ( <button key={grade} onClick={() => handleGradeSelect(grade)} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:bg-blue-500 hover:text-white transition-all duration-300 text-center"><h2 className="text-xl font-bold">{grade}</h2></button>))}</div><button onClick={() => setStep(1)} className="mt-8 text-gray-500 hover:text-gray-800 font-semibold">← Back</button></div> );
            case 3: const levels = confidenceLevels[userProfile.level] || confidenceLevels['default']; return ( <div><div className="text-center mb-8"><h1 className="text-3xl sm:text-4xl font-bold text-gray-800">How are you feeling today?</h1></div><div className="w-full max-w-md space-y-4">{levels.map(conf => ( <button key={conf.level} onClick={() => handleConfidenceSelect(conf)} className="w-full bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center text-left"><conf.icon size={40} className="mr-6 text-purple-500" /><div><h2 className="text-2xl font-bold text-gray-800">{conf.level}</h2><p className="text-gray-500">{conf.description}</p></div></button> ))}</div><button onClick={() => setStep(2)} className="mt-8 text-gray-500 hover:text-gray-800 font-semibold">← Back</button></div> );
            default: return null;
        }
    };
    return <div className="flex flex-col items-center justify-center h-full p-4">{renderStep()}</div>;
};
const Dashboard = ({ userProfile, subjects, onNavigate, onStartQuiz }) => ( <div className="p-4 md:p-6 pb-6"><header className="flex justify-between items-center mb-6"><div><h1 className="text-3xl font-bold text-gray-800">Hello, {userProfile.name}!</h1><p className="text-gray-500">Let's continue your {userProfile.grade} journey.</p></div><div className="w-12 h-12 bg-gray-300 rounded-full cursor-pointer" onClick={() => onNavigate('profile')}><img src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${userProfile.name.charAt(0)}`} alt="Profile" className="rounded-full"/></div></header><div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold">Daily Challenge</h2><p className="text-blue-200 text-sm">A new quiz awaits in {subjects.length > 0 ? subjects[2].name : 'Science'}!</p></div>{subjects.length > 0 && <button onClick={() => onStartQuiz(subjects[2])} className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-100 transition">Start</button>}</div><h3 className="text-2xl font-bold text-gray-800 mb-4">Continue Learning</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{subjects.filter(s => s.progress > 0 && s.progress < 1).map(subject => ( <div key={subject.id} className="bg-white p-4 rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onStartQuiz(subject)}><div className="flex items-center mb-3"><div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center mr-4`}><subject.icon size={24} className="text-white" /></div><div><h4 className="font-bold text-lg text-gray-800">{subject.name}</h4><p className="text-sm text-gray-500">{subject.modules} Modules</p></div></div><div className="w-full bg-gray-200 rounded-full h-2.5"><div className={`${subject.color} h-2.5 rounded-full`} style={{ width: `${subject.progress * 100}%` }}></div></div><p className="text-right text-sm text-gray-500 mt-1">{Math.round(subject.progress * 100)}% Complete</p></div> ))}</div><div className="mt-6"><button onClick={() => onNavigate('subjects')} className="w-full bg-gray-800 text-white p-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors">Explore All Subjects</button></div></div> );
const SubjectsScreen = ({ subjects, onGenerateQuiz }) => ( <div className="p-4 md:p-6 pb-6"><h1 className="text-3xl font-bold text-gray-800 mb-6">All Subjects</h1><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{subjects.map(subject => ( <div key={subject.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"><div className={`${subject.color} h-24 flex items-center justify-center`}><subject.icon size={48} className="text-white" /></div><div className="p-6 flex flex-col flex-grow"><h3 className="text-2xl font-bold text-gray-800 mb-2">{subject.name}</h3><p className="text-gray-600 mb-4 flex-grow">{subject.description}</p><div className="space-y-2 mt-auto"><button onClick={() => onGenerateQuiz(subject)} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"><Sparkles size={20} className="mr-2" /> Generate AI Quiz</button></div></div></div> ))}</div></div> );
const ProfileScreen = ({ userProfile, onNavigate, isAdminMode, onLogout }) => ( <div className="p-4 md:p-6 pb-6"><div className="max-w-2xl mx-auto"><div className="bg-white rounded-2xl shadow-lg p-6 text-center"><img src={`https://placehold.co/128x128/3B82F6/FFFFFF?text=${userProfile.name.charAt(0)}`} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md"/><h1 className="text-3xl font-bold text-gray-800">{userProfile.name}</h1><p className="text-blue-600 font-semibold text-lg mb-6">{userProfile.grade}</p><div className="flex justify-around text-center mb-6 border-t border-b border-gray-200 py-4"><div><p className="text-2xl font-bold text-blue-600">{userProfile.points}</p><p className="text-sm text-gray-500">Points</p></div><div><p className="text-2xl font-bold text-blue-600">{userProfile.streaks}</p><p className="text-sm text-gray-500">Day Streak</p></div><div><p className="text-2xl font-bold text-blue-600">{userProfile.badges.length}</p><p className="text-sm text-gray-500">Badges</p></div></div></div><div className="mt-6 bg-white rounded-2xl shadow-lg p-6"><h2 className="text-2xl font-bold text-gray-800 mb-4">My Badges</h2><div className="flex flex-wrap gap-4 justify-center">{userProfile.badges.map((badge, index) => ( <div key={index} className="flex flex-col items-center p-2 text-center w-24"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2"><badge.icon size={32} className={badge.color} /></div><p className="text-sm font-semibold text-gray-700">{badge.name}</p></div> ))}</div></div>
{isAdminMode && (<div className="mt-6"><button onClick={() => onNavigate('admin')} className="w-full bg-red-600 text-white p-3 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center"><Shield size={20} className="mr-2" /> Admin Portal</button></div>)}
<div className="mt-6 bg-white rounded-2xl shadow-lg p-6"><h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2><div className="space-y-2"><a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"><User className="mr-3" /> Account Information</a><a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"><Settings className="mr-3" /> App Preferences</a><button onClick={onLogout} className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-lg font-bold"><XCircle className="mr-3" /> Logout</button></div></div></div></div> );
const AdminPortalScreen = ({ onResetProfile, onAddPoints, onGiveAllBadges }) => (
    <div className="p-4 md:p-6 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Portal</h1>
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Testing Tools</h2>
            <button onClick={onAddPoints} className="w-full bg-blue-500 text-white p-3 rounded-lg font-bold hover:bg-blue-600 transition">Add 1000 Points</button>
            <button onClick={onGiveAllBadges} className="w-full bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600 transition">Give All Badges</button>
            <button onClick={onResetProfile} className="w-full bg-red-500 text-white p-3 rounded-lg font-bold hover:bg-red-600 transition">Reset Profile (Points & Badges)</button>
        </div>
    </div>
);
const QuestionTimer = ({ isPaused, onTogglePause, duration = 3000 }) => {
    const [progress, setProgress] = useState(100);
    const intervalRef = useRef();

    useEffect(() => {
        if (isPaused) {
            clearInterval(intervalRef.current);
        } else {
            const startTime = Date.now();
            intervalRef.current = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const newProgress = 100 - (elapsedTime / duration) * 100;
                if (newProgress <= 0) {
                    clearInterval(intervalRef.current);
                    setProgress(0);
                } else {
                    setProgress(newProgress);
                }
            }, 50);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPaused, duration]);

    const strokeDashoffset = 283 * (progress / 100);

    return (
        <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle
                    className="text-green-500"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={283 - strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.05s linear' }}
                />
            </svg>
            <button onClick={onTogglePause} className="absolute inset-0 flex items-center justify-center text-gray-600 hover:text-blue-600">
                {isPaused ? <Play size={32} /> : <Pause size={32} />}
            </button>
        </div>
    );
};
const RewardNotification = ({ reward, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-6 rounded-full shadow-lg animate-fade-in-down z-50 flex items-center">
            {reward.type === 'points' && <Star size={20} className="mr-2" />}
            {reward.type === 'badge' && <Award size={20} className="mr-2" />}
            <span className="font-bold">{reward.message}</span>
        </div>
    );
};
const QuizScreen = ({ question, onAnswer, showResult, score, totalQuestions, onRestart, onExit, selectedAnswer, isCorrect, onExplain, questionIndex, isAssessment = false, quizControl }) => {
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const { advanceToNextQuestion, quizTimerRef } = quizControl;
    const [width, height] = useWindowSize();
    const isShortScreen = height < 700; // Threshold for smaller UI

    const handleTogglePause = () => {
        if (isTimerPaused) {
            quizTimerRef.current = setTimeout(() => advanceToNextQuestion(score), 1500);
        } else {
            clearTimeout(quizTimerRef.current);
        }
        setIsTimerPaused(!isTimerPaused);
    };

    useEffect(() => {
        setIsTimerPaused(false);
    }, [questionIndex]);

    const renderContent = () => {
        if (!question) return ( <div className="flex flex-col items-center justify-center h-full"><p className="text-lg text-gray-700">Loading questions...</p><button onClick={onExit} className="mt-4 bg-blue-600 text-white p-3 rounded-lg font-bold">Go to Dashboard</button></div> );
        if (showResult) { const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0; return ( <div className="flex flex-col items-center justify-center h-full text-center p-4"><div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full"><h2 className="text-3xl font-bold mb-2 text-gray-800">{isAssessment ? 'Assessment Complete!' : 'Quiz Complete!'}</h2><p className="text-gray-600 mb-6">{isAssessment ? 'We have your baseline. Let\'s start learning!' : `You've finished the ${question.subject} quiz.`}</p><div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold ${percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>{percentage}%</div><p className="text-lg sm:text-xl text-gray-700 mb-8">You answered <span className="font-bold">{score}</span> out of <span className="font-bold">{totalQuestions}</span> questions correctly.</p>{isAssessment ? ( <button onClick={onExit} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">Go to Dashboard</button> ) : ( <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"><button onClick={onRestart} className="flex-1 bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">Try Again</button><button onClick={onExit} className="flex-1 bg-gray-300 text-gray-800 p-3 rounded-lg font-bold hover:bg-gray-400 transition">Back to Subjects</button></div> )}</div></div> ); }
        
        const getButtonClass = (option) => { if (!selectedAnswer) return 'bg-white hover:bg-blue-100 border-gray-300'; if (option === selectedAnswer) return isCorrect ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500'; if (option === question.answer) return 'bg-green-500 text-white border-green-500'; return 'bg-white opacity-60 border-gray-300'; };
        
        return ( <>
            <div className="flex justify-between items-center mb-4 flex-shrink-0"><h2 className="text-xl font-bold text-gray-700">{isAssessment ? 'Placement Quiz' : `${question.subject || ''} Quiz`}</h2>{!isAssessment && <button onClick={onExit} className="text-gray-500 hover:text-gray-800"><XCircle size={28} /></button>}</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 flex-shrink-0"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}></div></div>
            <div className={`bg-white rounded-2xl shadow-xl flex-grow flex flex-col ${isShortScreen ? 'p-4' : 'p-6'}`}>
                <p className={`font-semibold text-gray-800 text-center flex-grow flex items-center justify-center ${isShortScreen ? 'text-lg md:text-xl mb-2' : 'text-xl md:text-2xl mb-4'}`}>{question.question}</p>
                {isAssessment && <p className="text-center text-gray-500 mb-4 text-sm font-semibold flex-shrink-0">({question.subject})</p>}
                <div className="grid grid-cols-2 gap-3 mt-auto flex-shrink-0">
                    {question.options.map((option, index) => ( <button key={index} onClick={() => onAnswer(option)} disabled={!!selectedAnswer} className={`rounded-lg font-semibold border-2 transition-all duration-300 ${getButtonClass(option)} ${isShortScreen ? 'p-3 text-base' : 'p-4 text-lg'}`}>{option}</button>))}
                </div>
            </div>
            {selectedAnswer && (
                <div className={`mt-4 text-center animate-fade-in-up flex flex-col items-center justify-center space-y-3 flex-shrink-0 ${isShortScreen ? 'mt-3 space-y-2' : 'mt-6 space-y-4'}`}>
                    {isCorrect === false && (
                        <>
                            <button onClick={onExplain} className="w-full max-w-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"><Sparkles size={20} className="mr-2" /> Explain Answer</button>
                            <button onClick={() => advanceToNextQuestion(score)} className="w-full max-w-xs bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition">Next Question</button>
                        </>
                    )}
                    {isCorrect === true && ( <QuestionTimer isPaused={isTimerPaused} onTogglePause={handleTogglePause} /> )}
                </div>
            )}
        </> );
    };

    return <div className="p-4 flex flex-col bg-gray-50 h-full">{renderContent()}</div>;
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [screen, setScreen] = useState('login');
    const [userProfile, setUserProfile] = useState(null);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    const [explanationText, setExplanationText] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [reward, setReward] = useState(null);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const quizTimerRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserProfile(userData);
                    if (userData.grade) {
                        navigate('dashboard');
                    } else {
                        navigate('level');
                    }
                }
            } else {
                setUserProfile(null);
                navigate('login');
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (userProfile && userProfile.level) {
            setSubjects(getSubjectsForLevel(userProfile.level));
        }
    }, [userProfile]);

    const navigate = (screenName) => {
        setScreen(screenName);
        if (screenName !== 'quiz' && screenName !== 'assessment') resetQuizState();
    };
    
    const resetQuizState = () => {
        clearTimeout(quizTimerRef.current);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    const advanceToNextQuestion = (currentScore) => {
        clearTimeout(quizTimerRef.current);
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            handleQuizCompletion(currentScore);
        }
    };

    const handleQuizCompletion = (finalScore) => {
        if (currentSubject) {
            const percentage = quizQuestions.length > 0 ? (finalScore / quizQuestions.length) * 100 : 0;
            if (percentage >= 80) {
                const subjectKey = currentSubject.key;
                const badgeName = `${currentSubject.name} Pro`;
                const hasBadge = userProfile.badges.some(b => b.name === badgeName);

                if (!hasBadge) {
                    const newBadge = { name: badgeName, icon: subjectData[subjectKey].icon, color: subjectData[subjectKey].color.replace('bg-', 'text-') };
                    const updatedProfile = { ...userProfile, badges: [...userProfile.badges, newBadge] };
                    setUserProfile(updatedProfile);
                    setDoc(doc(db, "users", auth.currentUser.uid), updatedProfile);
                    setReward({ type: 'badge', message: `New Badge: ${badgeName}!`});
                }
            }
        }
        setShowResult(true);
    };

    const handleOnboardingComplete = async (grade, confidence) => {
        const updatedProfile = { ...userProfile, grade, confidence: confidence.prompt, level: userProfile.level };
        await setDoc(doc(db, "users", auth.currentUser.uid), updatedProfile);
        setUserProfile(updatedProfile);
        handleGenerateAssessment(grade, confidence);
    };

    const handleGenerateAssessment = async (grade, confidence) => {
        setIsLoading(true);
        setLoadingMessage(`✨ Creating a placement quiz for ${grade}...`);
        const prompt = `Generate a 5-question multiple-choice placement quiz for a ${grade} student who says they are ${confidence.level}. The questions should cover a mix of Mathematics, Science, and Literacy.`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { "questions": { type: "ARRAY", items: { type: "OBJECT", properties: { "question": { "type": "STRING" }, "options": { "type": "ARRAY", "items": { "type": "STRING" } }, "answer": { "type": "STRING" }, "subject": { "type": "STRING" } }, required: ["question", "options", "answer", "subject"] } } }, required: ["questions"] } } };
        try {
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await response.json();
            if (result.candidates && result.candidates[0].content.parts[0].text) {
                const generated = JSON.parse(result.candidates[0].content.parts[0].text);
                setQuizQuestions(generated.questions);
                resetQuizState();
                setCurrentSubject(null);
                navigate('assessment');
            } else { throw new Error("API response format error"); }
        } catch (error) {
            console.error("Error generating assessment:", error);
            alert("An error occurred while creating the placement quiz.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartQuiz = (subject, questions = null) => {
        setCurrentSubject(subject);
        setQuizQuestions(questions || []);
        resetQuizState();
        navigate('quiz');
    };

    const handleGenerateQuiz = async (subject) => {
        setIsLoading(true);
        setLoadingMessage(`✨ Generating a new ${subject.name} quiz...`);
        const prompt = `Generate 5 multiple-choice quiz questions for a ${userProfile.grade} student who feels they are ${userProfile.confidence} on the topic of ${subject.promptTopic}.`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { "questions": { type: "ARRAY", items: { type: "OBJECT", properties: { "question": { "type": "STRING" }, "options": { "type": "ARRAY", "items": { "type": "STRING" } }, "answer": { "type": "STRING" } }, required: ["question", "options", "answer"] } } }, required: ["questions"] } } };
        try {
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await response.json();
            if (result.candidates && result.candidates[0].content.parts[0].text) {
                const generated = JSON.parse(result.candidates[0].content.parts[0].text);
                const formattedQuestions = generated.questions.map(q => ({...q, subject: subject.name}));
                handleStartQuiz(subject, formattedQuestions);
            } else { throw new Error("API response format error"); }
        } catch (error) {
            console.error("Error generating quiz:", error);
            alert("An error occurred while generating the quiz.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleExplainAnswer = async () => {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        setIsLoading(true);
        setLoadingMessage('✨ Asking our AI tutor for an explanation...');
        const prompt = `In simple terms for a ${userProfile.grade} student, explain why the correct answer to the question "${currentQuestion.question}" is "${currentQuestion.answer}". Also, briefly explain why the other options are incorrect.`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        try {
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await response.json();
            if (result.candidates && result.candidates[0].content.parts[0].text) {
                setExplanationText(result.candidates[0].content.parts[0].text);
                setShowExplanationModal(true);
            } else { throw new Error("API response format error"); }
        } catch (error) {
            console.error("Error getting explanation:", error);
            alert("An error occurred while getting the explanation.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = async (option) => {
        if (selectedAnswer) return;
        setSelectedAnswer(option);
        const correct = option === quizQuestions[currentQuestionIndex].answer;
        setIsCorrect(correct);
        if (correct) {
            const newScore = score + 1;
            setScore(newScore);
            const pointsEarned = 10;
            const updatedProfile = { ...userProfile, points: userProfile.points + pointsEarned };
            setUserProfile(updatedProfile);
            await setDoc(doc(db, "users", auth.currentUser.uid), updatedProfile, { merge: true });
            setReward({ type: 'points', message: `+${pointsEarned} Points!`});
            quizTimerRef.current = setTimeout(() => advanceToNextQuestion(newScore), 3000);
        }
    };

    // --- Auth Functions ---
    const handleSignUp = async (email, password) => {
        setIsLoading(true);
        setLoadingMessage("Creating your account...");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const newUserProfile = {
                uid: user.uid,
                email: user.email,
                name: "New Learner",
                level: '',
                grade: '',
                confidence: '',
                points: 0,
                streaks: 0,
                badges: []
            };
            await setDoc(doc(db, "users", user.uid), newUserProfile);
            setUserProfile(newUserProfile);
            navigate('level');
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogin = async (email, password) => {
        setIsLoading(true);
        setLoadingMessage("Logging in...");
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setUserProfile(null);
        navigate('login');
    };

    // --- Admin Functions ---
    const toggleAdminMode = () => {
        setIsAdminMode(prev => !prev);
        setReward({ type: 'badge', message: `Admin Mode ${!isAdminMode ? 'Enabled' : 'Disabled'}`});
    };
    const resetProfile = async () => {
        const updatedProfile = {...userProfile, points: 0, badges: [] };
        await setDoc(doc(db, "users", auth.currentUser.uid), updatedProfile);
        setUserProfile(updatedProfile);
        setReward({ type: 'badge', message: 'Profile Reset!' });
    };
    const addPoints = async () => {
        const updatedProfile = {...userProfile, points: userProfile.points + 1000 };
        await setDoc(doc(db, "users", auth.currentUser.uid), updatedProfile, { merge: true });
        setUserProfile(updatedProfile);
        setReward({ type: 'points', message: '+1000 Points!' });
    };
    const giveAllBadges = async () => {
        if (!userProfile.level) {
            alert("Please select a grade level first.");
            return;
        }
        const allBadges = getSubjectsForLevel(userProfile.level).map(subject => ({
            name: `${subject.name} Pro`,
            icon: subject.icon,
            color: subject.color.replace('bg-', 'text-')
        }));
        const updatedProfile = {...userProfile, badges: allBadges };
        await setDoc(doc(db, "users", auth.currentUser.uid), updatedProfile, { merge: true });
        setUserProfile(updatedProfile);
        setReward({ type: 'badge', message: 'All Badges Awarded!' });
    };

    const renderScreen = () => {
        if (isLoading && !userProfile) {
            return <LoadingModal message="Loading LearnSphere..." />;
        }
        if (!userProfile) {
            return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} onAdminToggle={toggleAdminMode} />;
        }

        switch (screen) {
            case 'level': return <LevelSelectionScreen onComplete={handleOnboardingComplete} userProfile={userProfile} setUserProfile={setUserProfile} />;
            case 'assessment': return <QuizScreen isAssessment={true} onExit={() => navigate('dashboard')} question={quizQuestions[currentQuestionIndex]} onAnswer={handleAnswer} showResult={showResult} score={score} totalQuestions={quizQuestions.length} onExplain={handleExplainAnswer} selectedAnswer={selectedAnswer} isCorrect={isCorrect} questionIndex={currentQuestionIndex} quizControl={{ advanceToNextQuestion, quizTimerRef, score }} />;
            case 'dashboard': return <Dashboard userProfile={userProfile} subjects={subjects} onNavigate={navigate} onStartQuiz={handleGenerateQuiz} />;
            case 'subjects': return <SubjectsScreen subjects={subjects} onGenerateQuiz={handleGenerateQuiz} />;
            case 'quiz': return <QuizScreen question={quizQuestions[currentQuestionIndex]} onAnswer={handleAnswer} showResult={showResult} score={score} totalQuestions={quizQuestions.length} onRestart={() => handleGenerateQuiz(currentSubject)} onExit={() => navigate('subjects')} selectedAnswer={selectedAnswer} isCorrect={isCorrect} onExplain={handleExplainAnswer} questionIndex={currentQuestionIndex} quizControl={{ advanceToNextQuestion, quizTimerRef, score }} />;
            case 'profile': return <ProfileScreen userProfile={userProfile} onNavigate={navigate} isAdminMode={isAdminMode} onLogout={handleLogout} />;
            case 'admin': return <AdminPortalScreen onResetProfile={resetProfile} onAddPoints={addPoints} onGiveAllBadges={giveAllBadges} />;
            default: return <LoadingModal message="Loading..." />;
        }
    };

    return (
        <div className="bg-gray-100 font-sans h-screen w-screen overflow-hidden flex flex-col">
            {reward && <RewardNotification reward={reward} onDismiss={() => setReward(null)} />}
            {isLoading && <LoadingModal message={loadingMessage} />}
            {showExplanationModal && <ExplanationModal text={explanationText} onClose={() => setShowExplanationModal(false)} />}
            
            <main className="flex-grow overflow-y-auto">
                {renderScreen()}
            </main>

            {userProfile && screen !== 'login' && screen !== 'level' && screen !== 'assessment' && screen !== 'admin' && (
                <footer className="flex-shrink-0 z-10">
                    <BottomNavBar activeScreen={screen} onNavigate={navigate} />
                </footer>
            )}
        </div>
    );
}

const style = document.createElement('style');
style.innerHTML = ` 
    @keyframes fade-in-down { 
        from { opacity: 0; transform: translate(-50%, -20px); } 
        to { opacity: 1; transform: translate(-50%, 0); } 
    }
    .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
    @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; } 
`;
document.head.appendChild(style);
