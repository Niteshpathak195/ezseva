"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EzSeva — Typing Speed Test (Enhanced — Typing Master Level)
// app/typing-test/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Version    : 2.0.0
// Updated    : March 2026
//
// PART 1 OF 2 — Paste Part 2 directly below this file's last line
//
// NEW IN v2.0:
//   ✅ Backspace support — real exam feel
//   ✅ Word-level error highlighting
//   ✅ Blinking animated caret
//   ✅ Combo streak counter (🔥 consecutive correct keys)
//   ✅ Sound feedback toggle (Web Audio API — no deps)
//   ✅ Per-second WPM timeline (SVG graph in result)
//   ✅ Personal best tracking (localStorage — scores only, not files)
//   ✅ Personalized improvement tips
//   ✅ Enhanced 3D keyboard visual with finger zones
//   ✅ Animated SVG hand diagram showing finger placement
//   ✅ Home row F/J bump indicators
//   ✅ Live finger highlight as you type
//   ✅ Smooth progress bar (.progress-bar-fill class)
//   ✅ All hex colors → CSS vars
//   ✅ "use client" line 1
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */

type Lang       = "english" | "hindi";
type TestStatus = "idle" | "running" | "finished";
type AppView    = "setup" | "course" | "test" | "result";
type Duration   = 1 | 2 | 5 | 10;
type FingerKey  = "little_l" | "ring_l" | "middle_l" | "index_l" | "thumb" | "index_r" | "middle_r" | "ring_r" | "little_r";

interface ExamPreset {
  id: string;
  label: string;
  lang: Lang;
  targetWpm: number;
  targetAccuracy: number;
  defaultDur: Duration;
  badge: string;
  color: string;
  info: string;
}

interface CharState {
  ch: string;
  typed: string | null;
}

interface TestResult {
  wpm: number;
  accuracy: number;
  errors: number;
  grade: string;
  passed: boolean;
  duration: number;
  wpmTimeline: number[]; // WPM per second
}

interface PersonalBest {
  wpm: number;
  accuracy: number;
  date: string;
}

interface FingerLesson {
  id: number;
  title: string;
  subtitle: string;
  fingers: string;
  keys: string[];
  practice: string;
  tip: string;
  emoji: string;
}

/* ═══════════════════════════════════════════════════════════════
   FINGER COLOR SYSTEM
═══════════════════════════════════════════════════════════════ */

const FINGER_COLORS: Record<FingerKey, string> = {
  little_l: "#7C3AED",
  ring_l:   "#2563EB",
  middle_l: "#0D9488",
  index_l:  "#059669",
  thumb:    "#64748B",
  index_r:  "#D97706",
  middle_r: "#DC2626",
  ring_r:   "#9333EA",
  little_r: "#C026D3",
};

const KEY_FINGER: Record<string, FingerKey> = {
  Q:"little_l", A:"little_l", Z:"little_l",
  W:"ring_l",   S:"ring_l",   X:"ring_l",
  E:"middle_l", D:"middle_l", C:"middle_l",
  R:"index_l",  F:"index_l",  V:"index_l",
  T:"index_l",  G:"index_l",  B:"index_l",
  Y:"index_r",  H:"index_r",  N:"index_r",
  U:"index_r",  J:"index_r",  M:"index_r",
  I:"middle_r", K:"middle_r", ",":"middle_r",
  O:"ring_r",   L:"ring_r",   ".":"ring_r",
  P:"little_r", ";":"little_r", "/":"little_r",
  "1":"little_l","2":"ring_l","3":"middle_l","4":"index_l","5":"index_l",
  "6":"index_r","7":"index_r","8":"middle_r","9":"ring_r","0":"little_r",
};

const FINGER_META = [
  { key: "little_l" as FingerKey,  name: "Little",  hand: "L", keys: "Q · A · Z · 1"         },
  { key: "ring_l"   as FingerKey,  name: "Ring",    hand: "L", keys: "W · S · X · 2"         },
  { key: "middle_l" as FingerKey,  name: "Middle",  hand: "L", keys: "E · D · C · 3"         },
  { key: "index_l"  as FingerKey,  name: "Index",   hand: "L", keys: "R F V T G B · 4 5"     },
  { key: "index_r"  as FingerKey,  name: "Index",   hand: "R", keys: "Y H N U J M · 6 7"     },
  { key: "middle_r" as FingerKey,  name: "Middle",  hand: "R", keys: "I · K · , · 8"         },
  { key: "ring_r"   as FingerKey,  name: "Ring",    hand: "R", keys: "O · L · . · 9"         },
  { key: "little_r" as FingerKey,  name: "Little",  hand: "R", keys: "P · ; · / · 0"         },
];

/* ═══════════════════════════════════════════════════════════════
   KEYBOARD ROWS
═══════════════════════════════════════════════════════════════ */

const KB_ROWS = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L",";"],
  ["Z","X","C","V","B","N","M",",",".","/"],
];
const KB_OFFSETS = [0, 0, 14, 28]; // px indent

/* ═══════════════════════════════════════════════════════════════
   EXAM PRESETS
═══════════════════════════════════════════════════════════════ */

const EXAM_PRESETS: ExamPreset[] = [
  { id:"cpct_en",   label:"CPCT MP",      lang:"english", targetWpm:30, targetAccuracy:85, defaultDur:5,  badge:"🏆 MP Govt",  color:"#7C3AED", info:"MP govt jobs require CPCT. English: 30 WPM, 85% accuracy." },
  { id:"cpct_hi",   label:"CPCT हिंदी",  lang:"hindi",   targetWpm:20, targetAccuracy:85, defaultDur:5,  badge:"🏆 MP Govt",  color:"#7C3AED", info:"CPCT Hindi Mangal: 20 WPM, 85% accuracy required." },
  { id:"ssc_chsl",  label:"SSC CHSL",     lang:"english", targetWpm:35, targetAccuracy:80, defaultDur:10, badge:"🔥 SSC",      color:"#DC2626", info:"SSC CHSL LDC/DEO post: 35 WPM English, 10 min test." },
  { id:"ssc_cgl",   label:"SSC CGL",      lang:"english", targetWpm:35, targetAccuracy:80, defaultDur:10, badge:"🔥 SSC",      color:"#DC2626", info:"SSC CGL PA/SA post: 35 WPM English typing required." },
  { id:"railway",   label:"Railway RRB",  lang:"hindi",   targetWpm:25, targetAccuracy:80, defaultDur:10, badge:"🚆 Railway",  color:"#059669", info:"RRB Junior Clerk/Steno: 25 WPM Hindi Mangal." },
  { id:"vyapam",    label:"VYAPAM MP",    lang:"hindi",   targetWpm:30, targetAccuracy:80, defaultDur:5,  badge:"📋 VYAPAM",  color:"#D97706", info:"VYAPAM Steno/Data Entry: 30 WPM Hindi Mangal." },
  { id:"custom_en", label:"Practice EN",  lang:"english", targetWpm:40, targetAccuracy:90, defaultDur:1,  badge:"⚙️ Practice", color:"#0D9488", info:"Free practice mode — no pass/fail criteria." },
  { id:"custom_hi", label:"Practice HI",  lang:"hindi",   targetWpm:25, targetAccuracy:85, defaultDur:1,  badge:"⚙️ Practice", color:"#0D9488", info:"Hindi free practice mode — no pass/fail criteria." },
];

/* ═══════════════════════════════════════════════════════════════
   PASSAGES — English
═══════════════════════════════════════════════════════════════ */

const EN_PASSAGES: string[] = [
  "The candidate must type the given passage accurately and at the required speed. Practice daily to improve your words per minute score. Focus on accuracy before increasing speed. Keep your fingers on the home row keys and avoid looking at the keyboard while typing. Consistent practice of at least thirty minutes every day will help you clear any government typing examination.",
  "Government examinations in India test typing speed as a mandatory skill. The SSC Combined Higher Secondary Level examination requires candidates to type at thirty five words per minute with high accuracy. Regular practice on a standard keyboard will help you achieve this target within three to four months of consistent effort.",
  "India is a diverse country with twenty eight states and eight union territories. The government provides various services to citizens through digital platforms. Computer literacy has become essential for employment in the public sector. Many competitive examinations now include typing tests as a qualifying round for clerical and data entry positions.",
  "The Central Processing Certificate Test is conducted by the Madhya Pradesh Agency for Promotion of Information Technology. Candidates must demonstrate proficiency in both Hindi and English typing. The examination also tests basic computer knowledge and data entry skills required for government jobs in Madhya Pradesh state departments.",
  "Typing speed is measured in words per minute where each word is counted as five characters including spaces. To improve your typing speed you must practice on a real keyboard daily. Start slow and focus on hitting the correct keys. As accuracy improves your speed will naturally increase over time without extra effort.",
  "Railway recruitment board examinations are conducted across India for filling thousands of vacancies each year. Candidates applying for junior clerk typist and stenographer posts must qualify in the typing skill test. The minimum speed required varies by post and category. Preparation should begin at least six months before the examination date.",
];

/* ═══════════════════════════════════════════════════════════════
   PASSAGES — Hindi (Mangal Unicode)
═══════════════════════════════════════════════════════════════ */

const HI_PASSAGES: string[] = [
  "मध्यप्रदेश शासन द्वारा विभिन्न पदों पर भर्ती के लिए सीपीसीटी परीक्षा आयोजित की जाती है। इस परीक्षा में हिंदी एवं अंग्रेजी दोनों भाषाओं में टाइपिंग का परीक्षण किया जाता है। अभ्यर्थियों को प्रतिदिन कम से कम तीस मिनट का अभ्यास करना चाहिए।",
  "रेलवे भर्ती बोर्ड द्वारा आयोजित परीक्षाओं में हिंदी टाइपिंग अनिवार्य है। स्टेनोग्राफर पद के लिए न्यूनतम पच्चीस शब्द प्रति मिनट की गति आवश्यक है। सटीकता और गति दोनों का संतुलन बनाना जरूरी है। नियमित अभ्यास से आप यह लक्ष्य आसानी से प्राप्त कर सकते हैं।",
  "व्यापम परीक्षा में सम्मिलित होने वाले अभ्यर्थियों को हिंदी टाइपिंग में तीस शब्द प्रति मिनट की गति प्राप्त करनी होती है। मंगल फॉन्ट में अभ्यास करने से परीक्षा में सफलता की संभावना काफी बढ़ जाती है। आज से ही अभ्यास शुरू करें।",
  "भारत सरकार ने डिजिटल इंडिया अभियान के तहत कंप्यूटर साक्षरता को बढ़ावा दिया है। आज के युग में टाइपिंग एक आवश्यक कौशल बन गया है। सरकारी नौकरी पाने के लिए हिंदी और अंग्रेजी दोनों में दक्षता आवश्यक है।",
  "सीपीसीटी परीक्षा में उत्तीर्ण होने के लिए अभ्यर्थी को कंप्यूटर की बुनियादी जानकारी के साथ-साथ टाइपिंग में भी दक्ष होना आवश्यक है। मध्यप्रदेश के सरकारी विभागों में नौकरी के लिए यह प्रमाण पत्र अनिवार्य कर दिया गया है।",
  "हिंदी टाइपिंग के लिए मंगल फॉन्ट का उपयोग किया जाता है जो यूनिकोड आधारित है। इसमें इनस्क्रिप्ट कीबोर्ड लेआउट का प्रयोग होता है। अभ्यर्थियों को इस कीबोर्ड लेआउट को अच्छी तरह याद करना चाहिए।",
];

/* ═══════════════════════════════════════════════════════════════
   FINGER COURSE
═══════════════════════════════════════════════════════════════ */

const FINGER_LESSONS: FingerLesson[] = [
  { id:1, title:"Home Row — Left Hand",   subtitle:"Foundation of all typing",        fingers:"Little→A · Ring→S · Middle→D · Index→F",           keys:["A","S","D","F"],               practice:"asdf fdsa asdf fdsa asd fds",          tip:"Left index always rests on F. Feel the bump? That is your anchor point.",          emoji:"👈" },
  { id:2, title:"Home Row — Right Hand",  subtitle:"Mirror of the left hand",         fingers:"Index→J · Middle→K · Ring→L · Little→;",            keys:["J","K","L",";"],               practice:"jkl; ;lkj jkl; ;lkj jkl ;lk",         tip:"Right index rests on J. Both thumbs always rest on the Space bar.",               emoji:"👉" },
  { id:3, title:"Home Row Combined",      subtitle:"Both hands working together",     fingers:"Left: ASDF  |  Right: JKL;",                         keys:["A","S","D","F","J","K","L",";"],practice:"ask fall jak sad flask salad flash",    tip:"Never look at keyboard. Trust your fingers to find their home position.",         emoji:"🤝" },
  { id:4, title:"Top Row — Left Side",    subtitle:"Stretch up from home row",        fingers:"Little→Q · Ring→W · Middle→E · Index→R,T",          keys:["Q","W","E","R","T"],            practice:"qwert treqw wet tar tree read quite",  tip:"Reach up from ASDF. Return to home row after every single keystroke.",            emoji:"⬆️" },
  { id:5, title:"Top Row — Right Side",   subtitle:"Right hand upper reach",          fingers:"Index→Y,U · Middle→I · Ring→O · Little→P",          keys:["Y","U","I","O","P"],            practice:"yuiop poiuy your type prior output",   tip:"Y and U are both typed by right index. Practice the stretch carefully.",          emoji:"⬆️" },
  { id:6, title:"Bottom Row",             subtitle:"Reach down carefully",            fingers:"Left: Z X C V B  |  Right: N M , . /",               keys:["Z","X","C","V","B","N","M"],    practice:"zinc exam cave brown name mix zone",   tip:"Bottom row is hardest. Go slow — accuracy before speed here.",                   emoji:"⬇️" },
  { id:7, title:"Numbers Row",            subtitle:"Top of the keyboard",             fingers:"Same finger columns as QWERTY — just stretch further",keys:["1","2","3","4","5","6","7","8","9","0"], practice:"1234 5678 90 2025 1947 35",  tip:"Numbers are rare in typing exams. Master letters first.",                        emoji:"🔢" },
  { id:8, title:"Full Sentence Practice", subtitle:"Put it all together",             fingers:"All fingers in position — home row is your base",    keys:["A","S","D","F","J","K","L"],    practice:"the quick brown fox jumps over the lazy dog", tip:"This sentence uses every letter in English. Master it and you own the keyboard.", emoji:"🏆" },
];

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════ */

function fmtTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function calcWPM(chars: CharState[], startTime: number | null, elapsed?: number): number {
  if (!startTime) return 0;
  const mins = elapsed !== undefined ? elapsed / 60 : (Date.now() - startTime) / 1000 / 60;
  if (mins <= 0) return 0;
  const correctChars = chars.filter((c) => c.typed !== null && c.typed === c.ch).length;
  return Math.max(0, Math.round((correctChars / 5) / mins));
}

function calcAccuracy(chars: CharState[], pos: number): number {
  if (pos === 0) return 100;
  const correct = chars.slice(0, pos).filter((c) => c.typed === c.ch).length;
  return Math.round((correct / pos) * 100);
}

function getGrade(wpm: number, acc: number, targetWpm: number, targetAcc: number): string {
  if (acc >= 97 && wpm >= targetWpm * 1.3) return "A+";
  if (acc >= 92 && wpm >= targetWpm * 1.1) return "A";
  if (acc >= 85 && wpm >= targetWpm)       return "B";
  if (acc >= 78 && wpm >= targetWpm * 0.85)return "C";
  if (acc >= 70)                           return "D";
  return "F";
}

function buildPassage(lang: Lang, wpm: number, dur: Duration): string {
  const pool = lang === "hindi" ? HI_PASSAGES : EN_PASSAGES;
  const needed = (wpm + 15) * 5 * dur;
  let txt = pool[Math.floor(Math.random() * pool.length)];
  let attempts = 0;
  while (txt.replace(/\s+/g, " ").length < Math.min(needed, 1200) && attempts < 20) {
    txt += " " + pool[Math.floor(Math.random() * pool.length)];
    attempts++;
  }
  return txt.replace(/\s+/g, " ").trim();
}

function getPersonalBest(presetId: string): PersonalBest | null {
  try {
    const raw = localStorage.getItem(`ez_pb_${presetId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function savePersonalBest(presetId: string, wpm: number, accuracy: number) {
  try {
    const existing = getPersonalBest(presetId);
    if (!existing || wpm > existing.wpm) {
      localStorage.setItem(`ez_pb_${presetId}`, JSON.stringify({
        wpm, accuracy, date: new Date().toLocaleDateString("en-IN"),
      }));
    }
  } catch {}
}

/* ═══════════════════════════════════════════════════════════════
   SOUND ENGINE (Web Audio API — zero deps)
═══════════════════════════════════════════════════════════════ */

function createSoundEngine() {
  let ctx: AudioContext | null = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctx;
  }
  return {
    correct() {
      try {
        const c = getCtx();
        const o = c.createOscillator();
        const g = c.createGain();
        o.connect(g); g.connect(c.destination);
        o.frequency.value = 880;
        o.type = "sine";
        g.gain.setValueAtTime(0.06, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);
        o.start(c.currentTime); o.stop(c.currentTime + 0.04);
      } catch {}
    },
    error() {
      try {
        const c = getCtx();
        const o = c.createOscillator();
        const g = c.createGain();
        o.connect(g); g.connect(c.destination);
        o.frequency.value = 200;
        o.type = "sawtooth";
        g.gain.setValueAtTime(0.08, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
        o.start(c.currentTime); o.stop(c.currentTime + 0.08);
      } catch {}
    },
    streak() {
      try {
        const c = getCtx();
        [660, 880, 1100].forEach((freq, i) => {
          const o = c.createOscillator();
          const g = c.createGain();
          o.connect(g); g.connect(c.destination);
          o.frequency.value = freq;
          o.type = "sine";
          const t = c.currentTime + i * 0.06;
          g.gain.setValueAtTime(0.05, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
          o.start(t); o.stop(t + 0.07);
        });
      } catch {}
    },
  };
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED HAND SVG COMPONENT
═══════════════════════════════════════════════════════════════ */

function HandSVG({ hand, activeFingers }: { hand: "left" | "right"; activeFingers: FingerKey[] }) {
  const isLeft = hand === "left";

  // Finger tip positions in SVG space (viewBox 0 0 120 130)
  const fingerTips = isLeft ? [
    { key: "little_l" as FingerKey, x: 14,  y: 42,  label: "Little" },
    { key: "ring_l"   as FingerKey, x: 34,  y: 22,  label: "Ring"   },
    { key: "middle_l" as FingerKey, x: 56,  y: 14,  label: "Middle" },
    { key: "index_l"  as FingerKey, x: 78,  y: 20,  label: "Index"  },
    { key: "thumb"    as FingerKey, x: 96,  y: 72,  label: "Thumb"  },
  ] : [
    { key: "index_r"  as FingerKey, x: 26,  y: 20,  label: "Index"  },
    { key: "middle_r" as FingerKey, x: 48,  y: 14,  label: "Middle" },
    { key: "ring_r"   as FingerKey, x: 70,  y: 22,  label: "Ring"   },
    { key: "little_r" as FingerKey, x: 90,  y: 42,  label: "Little" },
    { key: "thumb"    as FingerKey, x: 8,   y: 72,  label: "Thumb"  },
  ];

  // Palm shape
  const palmPath = isLeft
    ? "M 96 72 Q 108 80 108 95 Q 108 118 60 122 Q 12 118 12 95 Q 12 80 24 72"
    : "M 8 72 Q -4 80 -4 95 Q -4 118 44 122 Q 92 118 92 95 Q 92 80 104 72";

  // Finger shapes (simplified rectangles with rounded tops)
  const fingers = isLeft ? [
    { key: "little_l" as FingerKey, x: 8,  y: 42, w: 14, h: 50 },
    { key: "ring_l"   as FingerKey, x: 28, y: 22, w: 15, h: 68 },
    { key: "middle_l" as FingerKey, x: 48, y: 14, w: 16, h: 76 },
    { key: "index_l"  as FingerKey, x: 70, y: 20, w: 15, h: 70 },
    { key: "thumb"    as FingerKey, x: 86, y: 56, w: 14, h: 44 },
  ] : [
    { key: "thumb"    as FingerKey, x: 4,  y: 56, w: 14, h: 44 },
    { key: "index_r"  as FingerKey, x: 20, y: 20, w: 15, h: 70 },
    { key: "middle_r" as FingerKey, x: 40, y: 14, w: 16, h: 76 },
    { key: "ring_r"   as FingerKey, x: 62, y: 22, w: 15, h: 68 },
    { key: "little_r" as FingerKey, x: 82, y: 42, w: 14, h: 50 },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "10px", fontWeight: 800, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
        {isLeft ? "👈 Left Hand" : "Right Hand 👉"}
      </p>
      <svg viewBox="0 0 116 128" width="116" height="128" style={{ overflow: "visible" }}>
        {/* Palm */}
        <ellipse cx="58" cy="105" rx="46" ry="22"
          fill="var(--bg-muted)" stroke="var(--border-light)" strokeWidth="1.5" />

        {/* Fingers */}
        {fingers.map((f) => {
          const isActive = activeFingers.includes(f.key);
          const color = FINGER_COLORS[f.key];
          return (
            <g key={f.key}>
              <rect
                x={f.x} y={f.y} width={f.w} height={f.h}
                rx={f.w / 2}
                fill={isActive ? color : "var(--bg-muted)"}
                stroke={isActive ? color : "var(--border-light)"}
                strokeWidth="1.5"
                style={{ transition: "fill 0.25s ease, stroke 0.25s ease" }}
              />
              {/* Knuckle lines */}
              <line
                x1={f.x + 2} y1={f.y + f.h * 0.38}
                x2={f.x + f.w - 2} y2={f.y + f.h * 0.38}
                stroke={isActive ? "rgba(255,255,255,0.4)" : "var(--border-light)"}
                strokeWidth="1"
              />
              <line
                x1={f.x + 2} y1={f.y + f.h * 0.62}
                x2={f.x + f.w - 2} y2={f.y + f.h * 0.62}
                stroke={isActive ? "rgba(255,255,255,0.4)" : "var(--border-light)"}
                strokeWidth="1"
              />
              {/* Nail */}
              <ellipse
                cx={f.x + f.w / 2} cy={f.y + 5}
                rx={f.w / 2 - 3} ry={4}
                fill={isActive ? "rgba(255,255,255,0.35)" : "var(--border-light)"}
              />
              {/* Glow pulse when active */}
              {isActive && (
                <rect
                  x={f.x - 2} y={f.y - 2} width={f.w + 4} height={f.h + 4}
                  rx={f.w / 2 + 2}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.5"
                  style={{ animation: "fingerPulse 0.8s ease-in-out infinite" }}
                />
              )}
            </g>
          );
        })}

        {/* Home row indicator dots (F and J) */}
        {isLeft && (
          <circle cx="77" cy="82" r="3" fill="var(--brand)" opacity="0.8" />
        )}
        {!isLeft && (
          <circle cx="27" cy="82" r="3" fill="var(--brand)" opacity="0.8" />
        )}
      </svg>

      {/* Finger labels */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginTop: "4px", flexWrap: "wrap" }}>
        {fingerTips.filter(f => f.key !== "thumb").map((f) => {
          const isActive = activeFingers.includes(f.key);
          return (
            <span key={f.key} style={{
              fontSize: "9px", fontWeight: 800,
              color: isActive ? FINGER_COLORS[f.key] : "var(--text-hint)",
              padding: "1px 4px",
              background: isActive ? `${FINGER_COLORS[f.key]}18` : "transparent",
              borderRadius: "4px",
              transition: "all 0.2s ease",
            }}>
              {f.label}
            </span>
          );
        })}
      </div>

      <style>{`
        @keyframes fingerPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D KEYBOARD VISUAL COMPONENT
═══════════════════════════════════════════════════════════════ */

function KeyboardVisual({
  highlightKeys,
  currentChar,
}: {
  highlightKeys: string[];
  currentChar?: string;
}) {
  const upper = highlightKeys.map((k) => k.toUpperCase());
  const curUpper = currentChar?.toUpperCase() || "";
  const HOME_BUMPS = ["F", "J"];

  return (
    <div style={{ overflowX: "auto", paddingBottom: "6px" }}>
      <div style={{ minWidth: "300px", maxWidth: "520px", margin: "0 auto" }}>
        {/* Keyboard rows */}
        {KB_ROWS.map((row, ri) => (
          <div key={ri} style={{
            display: "flex", gap: "3px", justifyContent: "center",
            marginBottom: "3px",
            paddingLeft: `${KB_OFFSETS[ri]}px`,
          }}>
            {row.map((key) => {
              const fingerKey = KEY_FINGER[key];
              const isHighlighted = upper.includes(key);
              const isCurrent = key === curUpper;
              const isHomeBump = HOME_BUMPS.includes(key);
              const bg = isHighlighted || isCurrent
                ? (fingerKey ? FINGER_COLORS[fingerKey] : "var(--brand)")
                : "var(--bg-subtle)";
              const col = isHighlighted || isCurrent ? "#fff" : "var(--text-muted)";

              return (
                <div
                  key={key}
                  title={fingerKey ? `${fingerKey.replace("_", " ")} finger` : ""}
                  style={{
                    width: "32px", height: "32px",
                    borderRadius: "5px",
                    background: bg,
                    color: col,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10.5px", fontWeight: 800,
                    // 3D keycap effect
                    border: isHighlighted || isCurrent
                      ? `1.5px solid ${bg}`
                      : "1.5px solid var(--border-light)",
                    boxShadow: isHighlighted || isCurrent
                      ? `0 3px 0 ${bg}88, 0 4px 8px ${bg}44`
                      : "0 2px 0 var(--border-light), 0 1px 2px rgba(0,0,0,0.06)",
                    transform: isCurrent ? "translateY(2px)" : "translateY(0)",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                    position: "relative",
                    cursor: "default",
                  }}
                >
                  {key}
                  {/* Home row bump */}
                  {isHomeBump && (
                    <span style={{
                      position: "absolute", bottom: "3px",
                      left: "50%", transform: "translateX(-50%)",
                      width: "4px", height: "2px",
                      background: isHighlighted ? "rgba(255,255,255,0.7)" : "var(--brand)",
                      borderRadius: "1px",
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Space bar */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "3px", gap: "3px" }}>
          {/* Left Shift */}
          <div style={{ width: "48px", height: "26px", borderRadius: "5px", background: "var(--bg-subtle)", border: "1.5px solid var(--border-light)", boxShadow: "0 2px 0 var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 700, color: "var(--text-hint)" }}>
            Shift
          </div>
          {/* Space */}
          <div style={{ width: "160px", height: "26px", borderRadius: "5px", background: "var(--bg-subtle)", border: "1.5px solid var(--border-light)", boxShadow: "0 2px 0 var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 700, color: "var(--text-hint)" }}>
            SPACE — Both Thumbs
          </div>
          {/* Backspace */}
          <div style={{ width: "48px", height: "26px", borderRadius: "5px", background: "var(--bg-subtle)", border: "1.5px solid var(--border-light)", boxShadow: "0 2px 0 var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 700, color: "var(--text-hint)" }}>
            ←
          </div>
        </div>

        {/* Color Legend */}
        <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
          {FINGER_META.map((f) => (
            <span key={f.key} style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              fontSize: "9.5px", fontWeight: 700, color: "var(--text-secondary)",
              padding: "2px 6px",
              background: highlightKeys.some(k => KEY_FINGER[k.toUpperCase()] === f.key)
                ? `${FINGER_COLORS[f.key]}18` : "transparent",
              borderRadius: "4px",
              transition: "background 0.2s",
            }}>
              <span style={{
                width: "10px", height: "10px", borderRadius: "2px",
                background: FINGER_COLORS[f.key], display: "inline-block", flexShrink: 0,
              }} />
              {f.hand === "L" ? "L-" : "R-"}{f.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FINGER COURSE COMPONENT
═══════════════════════════════════════════════════════════════ */

function FingerCourse({ onBack }: { onBack: () => void }) {
  const [lessonIdx, setLessonIdx] = useState(0);
  const [practiceInput, setPracticeInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const lesson = FINGER_LESSONS[lessonIdx];
  const progressPct = ((lessonIdx + 1) / FINGER_LESSONS.length) * 100;

  // Active fingers for this lesson
  const activeFingers: FingerKey[] = Array.from(
    new Set(lesson.keys.map(k => KEY_FINGER[k.toUpperCase()]).filter(Boolean))
  ) as FingerKey[];

  const leftActive  = activeFingers.filter(f => f.endsWith("_l") || f === "thumb");
  const rightActive = activeFingers.filter(f => f.endsWith("_r"));

  return (
    <div style={{ marginBottom: "14px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 900, color: "var(--text-primary)" }}>🎓 Finger Placement Course</h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Lesson {lessonIdx + 1} of {FINGER_LESSONS.length}</p>
        </div>
        <button onClick={onBack} style={{ padding: "8px 16px", background: "transparent", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-md)", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font)" }}>
          ← Back to Test
        </button>
      </div>

      {/* Progress */}
      <div className="progress-bar-wrap" style={{ marginBottom: "16px" }}>
        <div className="progress-bar-fill" style={{ width: `${progressPct}%`, transition: "width 0.4s ease" }} />
      </div>

      <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", boxShadow: "var(--shadow-md)" }}>

        {/* Lesson title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
          <span style={{ fontSize: "30px" }}>{lesson.emoji}</span>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 900, color: "var(--text-primary)", marginBottom: "2px" }}>{lesson.title}</h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{lesson.subtitle}</p>
          </div>
        </div>

        {/* Finger assignment */}
        <div style={{ background: "var(--bg-muted)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: "16px", fontSize: "12.5px", fontWeight: 700, color: "var(--brand-dark)", lineHeight: 1.8, fontFamily: "monospace" }}>
          {lesson.fingers}
        </div>

        {/* ── HAND DIAGRAM + KEYBOARD ── */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Which finger types which key
          </p>

          {/* Hand diagrams */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "14px", flexWrap: "wrap" }}>
            <HandSVG hand="left"  activeFingers={leftActive}  />
            <HandSVG hand="right" activeFingers={rightActive} />
          </div>

          {/* Keyboard */}
          <KeyboardVisual highlightKeys={lesson.keys} />
        </div>

        {/* Finger detail table */}
        <div style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", padding: "12px 14px", marginBottom: "14px" }}>
          <p style={{ fontSize: "10.5px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Finger → Key Mapping</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {FINGER_META.filter(f => activeFingers.includes(f.key)).map(f => (
              <div key={f.key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: FINGER_COLORS[f.key], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                  {f.hand}{f.name.slice(0,1)}
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1px" }}>{f.hand === "L" ? "Left" : "Right"} {f.name}</p>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "monospace" }}>{f.keys}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div style={{ background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: "14px", display: "flex", gap: "8px" }}>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: "12.5px", color: "var(--brand-dark)", lineHeight: 1.65 }}>{lesson.tip}</p>
        </div>

        {/* Practice box */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Practice — type this</p>
          <div style={{ background: "var(--bg-subtle)", border: "1.5px dashed var(--brand-border)", borderRadius: "var(--radius-md)", padding: "12px 14px", fontFamily: "monospace", fontSize: "15px", fontWeight: 700, color: "var(--brand-dark)", letterSpacing: "0.08em", marginBottom: "8px" }}>
            {lesson.practice}
          </div>
          <input
            ref={inputRef}
            type="text"
            className="input"
            placeholder="Type here to practice…"
            value={practiceInput}
            onChange={(e) => setPracticeInput(e.target.value)}
            style={{ fontFamily: "monospace", fontSize: "14px", letterSpacing: "0.06em" }}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          />
        </div>

        {/* Nav buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => { setLessonIdx(Math.max(0, lessonIdx - 1)); setPracticeInput(""); }}
            disabled={lessonIdx === 0}
            style={{ flex: 1, padding: "10px", background: "transparent", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", cursor: lessonIdx === 0 ? "not-allowed" : "pointer", opacity: lessonIdx === 0 ? 0.4 : 1, fontFamily: "var(--font)" }}
          >
            ← Prev
          </button>
          {lessonIdx < FINGER_LESSONS.length - 1 ? (
            <button
              onClick={() => { setLessonIdx(lessonIdx + 1); setPracticeInput(""); }}
              style={{ flex: 2, padding: "10px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: 800, cursor: "pointer", fontFamily: "var(--font)" }}
            >
              Next Lesson →
            </button>
          ) : (
            <button
              onClick={() => { onBack(); setLessonIdx(0); setPracticeInput(""); }}
              style={{ flex: 2, padding: "10px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: 800, cursor: "pointer", fontFamily: "var(--font)" }}
            >
              🏁 Take the Test Now!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  PART 1 ENDS HERE
// Paste Part 2 directly below this line (do NOT add any closing brackets)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  PART 2 — Paste this directly below Part 1's last line
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  PART 2 — Paste this directly below Part 1's last line
// ─────────────────────────────────────────────────────────────────────────────

/* ═══════════════════════════════════════════════════════════════
   WPM TIMELINE GRAPH (SVG — zero deps)
═══════════════════════════════════════════════════════════════ */

function WpmGraph({ timeline, targetWpm }: { timeline: number[]; targetWpm: number }) {
  if (timeline.length < 2) return null;
  const W = 280, H = 80, PAD = 8;
  const max = Math.max(...timeline, targetWpm + 5, 10);
  const pts = timeline.map((v, i) => {
    const x = PAD + (i / (timeline.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v / max) * (H - PAD * 2));
    return `${x},${y}`;
  });
  const targetY = H - PAD - ((targetWpm / max) * (H - PAD * 2));

  return (
    <div style={{ marginBottom: "14px" }}>
      <p style={{ fontSize: "10.5px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
        WPM Over Time
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", borderRadius: "var(--radius-md)", background: "var(--bg-subtle)", border: "1px solid var(--border-light)" }}>
        {/* Target line */}
        <line x1={PAD} y1={targetY} x2={W - PAD} y2={targetY} stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
        <text x={W - PAD - 2} y={targetY - 3} fontSize="8" fill="var(--accent)" textAnchor="end" fontWeight="bold">target</text>

        {/* Area fill */}
        <defs>
          <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon
          points={`${PAD},${H - PAD} ${pts.join(" ")} ${W - PAD},${H - PAD}`}
          fill="url(#wpmGrad)"
        />

        {/* Line */}
        <polyline points={pts.join(" ")} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots at peaks */}
        {timeline.map((v, i) => {
          const x = PAD + (i / (timeline.length - 1)) * (W - PAD * 2);
          const y = H - PAD - ((v / max) * (H - PAD * 2));
          if (i % Math.max(1, Math.floor(timeline.length / 8)) !== 0) return null;
          return <circle key={i} cx={x} cy={y} r="2.5" fill="var(--brand)" />;
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "var(--text-hint)", marginTop: "3px" }}>
        <span>Start</span>
        <span>End</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */

export default function TypingTestPage() {

  /* ── App View ── */
  const [view, setView] = useState<AppView>("setup");

  /* ── Setup State ── */
  const [lang, setLang]     = useState<Lang>("english");
  const [preset, setPreset] = useState<ExamPreset>(EXAM_PRESETS[0]);
  const [dur, setDur]       = useState<Duration>(5);
  const [soundOn, setSoundOn] = useState(true);

  /* ── Test State ── */
  const [chars, setChars]         = useState<CharState[]>([]);
  const [pos, setPos]             = useState(0);
  const [errors, setErrors]       = useState(0);
  const [wpm, setWpm]             = useState(0);
  const [accuracy, setAccuracy]   = useState(100);
  const [secsLeft, setSecsLeft]   = useState(300);
  const [streak, setStreak]       = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [result, setResult]       = useState<TestResult | null>(null);
  const [personalBest, setPersonalBest] = useState<PersonalBest | null>(null);
  const [isNewPB, setIsNewPB]     = useState(false);

  /* ── Refs ── */
  const startTimeRef    = useRef<number | null>(null);
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const hiddenInputRef  = useRef<HTMLTextAreaElement>(null);
  const passageRef      = useRef<HTMLDivElement>(null);
  const charsRef        = useRef<CharState[]>([]);
  const posRef          = useRef(0);
  const errorsRef       = useRef(0);
  const streakRef       = useRef(0);
  const wpmTimelineRef  = useRef<number[]>([]);
  const soundRef        = useRef<ReturnType<typeof createSoundEngine> | null>(null);
  const durRef          = useRef<number>(dur * 60);
  const soundOnRef      = useRef(soundOn);

  /* ── Sync refs ── */
  useEffect(() => { charsRef.current  = chars; },  [chars]);
  useEffect(() => { posRef.current    = pos; },    [pos]);
  useEffect(() => { errorsRef.current = errors; }, [errors]);
  useEffect(() => { soundOnRef.current = soundOn; }, [soundOn]);

  /* ── Init sound on mount ── */
  useEffect(() => {
    soundRef.current = createSoundEngine();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  /* ── Preset filter ── */
  const filteredPresets = EXAM_PRESETS.filter((p) => p.lang === lang);

  /* ── Lang change ── */
  const handleLangChange = useCallback((l: Lang) => {
    setLang(l);
    const first = EXAM_PRESETS.find((p) => p.lang === l);
    if (first) { setPreset(first); setDur(first.defaultDur); }
  }, []);

  /* ── Preset change ── */
  const handlePresetChange = useCallback((p: ExamPreset) => {
    setPreset(p);
    setLang(p.lang);
    setDur(p.defaultDur);
  }, []);

  /* ── Finish Test ── */
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : dur * 60;
    const finalWpm = calcWPM(charsRef.current, startTimeRef.current, elapsed);
    const finalAcc = calcAccuracy(charsRef.current, posRef.current);
    const grade    = getGrade(finalWpm, finalAcc, preset.targetWpm, preset.targetAccuracy);
    const passed   = finalWpm >= preset.targetWpm && finalAcc >= preset.targetAccuracy;

    // Personal best
    const existing = getPersonalBest(preset.id);
    const newPB    = !existing || finalWpm > existing.wpm;
    if (newPB) savePersonalBest(preset.id, finalWpm, finalAcc);
    setIsNewPB(newPB && finalWpm > 0);

    setResult({
      wpm: finalWpm, accuracy: finalAcc,
      errors: errorsRef.current, grade, passed,
      duration: dur,
      wpmTimeline: [...wpmTimelineRef.current],
    });
    setView("result");
  }, [preset, dur]);

  /* ── Tick ── */
  const tick = useCallback(() => {
    setSecsLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timerRef.current!);
        finishTest();
        return 0;
      }
      return prev - 1;
    });
    // Record WPM snapshot every second
    const snap = calcWPM(charsRef.current, startTimeRef.current);
    wpmTimelineRef.current.push(snap);
    setWpm(snap);
    setAccuracy(calcAccuracy(charsRef.current, posRef.current));
  }, [finishTest]);

  /* ── Start Test ── */
  const startTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const passage  = buildPassage(lang, preset.targetWpm, dur);
    const newChars: CharState[] = passage.split("").map((ch) => ({ ch, typed: null }));
    charsRef.current      = newChars;
    posRef.current        = 0;
    errorsRef.current     = 0;
    streakRef.current     = 0;
    wpmTimelineRef.current = [];
    startTimeRef.current  = null;
    durRef.current        = dur * 60;

    setChars(newChars);
    setPos(0);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setStreak(0);
    setMaxStreak(0);
    setSecsLeft(dur * 60);
    setResult(null);
    setIsNewPB(false);
    setPersonalBest(getPersonalBest(preset.id));
    setView("test");
    setTimeout(() => hiddenInputRef.current?.focus(), 100);
  }, [lang, preset, dur]);

  /* ── Keypress handler — with BACKSPACE support ── */
  const onHiddenInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!val) return;
    const ch = val[val.length - 1];
    e.target.value = "";

    // Backspace
    if (ch === "\b" || val.endsWith("\b")) {
      if (posRef.current > 0) {
        const newPos = posRef.current - 1;
        const updated = charsRef.current.map((c, i) =>
          i === newPos ? { ...c, typed: null } : c
        );
        charsRef.current = updated;
        posRef.current   = newPos;
        streakRef.current = 0;
        setChars([...updated]);
        setPos(newPos);
        setStreak(0);
      }
      return;
    }

    // Start timer on first real keypress
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(tick, 1000);
    }

    const currentPos  = posRef.current;
    const currentChars = charsRef.current;
    if (currentPos >= currentChars.length) return;

    const isCorrect = ch === currentChars[currentPos].ch;

    // Sound feedback
    if (soundOnRef.current && soundRef.current) {
      if (isCorrect) {
        if (streakRef.current > 0 && streakRef.current % 10 === 9) {
          soundRef.current.streak();
        } else {
          soundRef.current.correct();
        }
      } else {
        soundRef.current.error();
      }
    }

    // Update chars
    const updated = currentChars.map((c, i) =>
      i === currentPos ? { ...c, typed: ch } : c
    );

    if (!isCorrect) {
      errorsRef.current++;
      streakRef.current = 0;
    } else {
      streakRef.current++;
    }

    charsRef.current = updated;
    posRef.current   = currentPos + 1;

    const newStreak = streakRef.current;
    setChars([...updated]);
    setPos(currentPos + 1);
    setErrors(errorsRef.current);
    setStreak(newStreak);
    setMaxStreak(prev => Math.max(prev, newStreak));
    setWpm(calcWPM(updated, startTimeRef.current));
    setAccuracy(calcAccuracy(updated, currentPos + 1));

    if (currentPos + 1 >= currentChars.length) finishTest();

    // Scroll current char into view
    requestAnimationFrame(() => {
      const cur = passageRef.current?.querySelector(".tt-cur");
      cur?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  }, [tick, finishTest]);

  // Intercept real backspace key on textarea
  const onHiddenKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (posRef.current > 0) {
        const newPos = posRef.current - 1;
        const updated = charsRef.current.map((c, i) =>
          i === newPos ? { ...c, typed: null } : c
        );
        charsRef.current = updated;
        posRef.current   = newPos;
        streakRef.current = 0;
        setChars([...updated]);
        setPos(newPos);
        setStreak(0);
      }
    }
  }, []);

  /* ── Stop early ── */
  const stopTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    finishTest();
  }, [finishTest]);

  /* ── Reset ── */
  const resetAll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = null;
    setView("setup");
    setChars([]);
    setPos(0);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setStreak(0);
    setMaxStreak(0);
    setResult(null);
  }, []);

  /* ── Current char for keyboard highlight ── */
  const currentChar = chars[pos]?.ch || "";
  const currentFingerKey = KEY_FINGER[currentChar.toUpperCase()];

  /* ── Progress ── */
  const progressPct = chars.length > 0 ? Math.round((pos / chars.length) * 100) : 0;

  /* ── Passage render with word-level error highlighting ── */
  const renderPassage = () => {
    // Build word boundaries for word-level error styling
    return chars.map((c, i) => {
      let status: "pending" | "correct" | "wrong" | "current" = "pending";
      if (i === pos) status = "current";
      else if (i < pos) status = c.typed === c.ch ? "correct" : "wrong";

      const display = c.ch === " " ? "\u00A0" : c.ch;

      return (
        <span
          key={i}
          className={status === "current" ? "tt-cur" : ""}
          style={{
            color: status === "correct" ? "var(--brand)"
                 : status === "wrong"   ? "#ef4444"
                 : status === "current" ? "#fff"
                 : "var(--text-secondary)",
            background: status === "current" ? "var(--brand)" : "transparent",
            borderRadius: status === "current" ? "2px" : "0",
            textDecoration: status === "wrong" ? "underline wavy #ef4444" : "none",
            fontSize: lang === "hindi" ? "16px" : "15px",
            fontFamily: lang === "hindi" ? "'Mangal','Noto Sans Devanagari',sans-serif" : "inherit",
            lineHeight: lang === "hindi" ? "2.2" : "1.9",
            letterSpacing: lang === "hindi" ? "0.02em" : "0.01em",
            animation: status === "current" ? "caretBlink 1s step-end infinite" : "none",
          }}
        >
          {display}
        </span>
      );
    });
  };

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @keyframes caretBlink {
          0%,100% { background: var(--brand); }
          50%      { background: var(--brand-hover, #0B7C72); }
        }
        @keyframes streakPop {
          0%   { transform: scale(0.8); opacity:0; }
          60%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity:1; }
        }
        .streak-badge { animation: streakPop 0.3s ease forwards; }
      `}</style>

      <Navbar />
      <main style={{ background: "var(--bg-subtle)", minHeight: "100vh", paddingBottom: "56px" }}>

        {/* ── Top Ad ── */}
        <div aria-hidden="true" style={{ background: "var(--bg-subtle)" }}>
          <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <div className="container-sm" style={{ padding: "32px 20px 0" }}>

          {/* ══ PAGE HEADER ══ */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-sm)", padding: "4px 12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--brand)", letterSpacing: "1.5px", textTransform: "uppercase" }}>⌨️ Free Typing Test</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "10px" }}>
              Online Typing Speed Test
            </h1>
            <p style={{ fontSize: "14.5px", color: "var(--text-muted)", maxWidth: "460px", margin: "0 auto 16px", lineHeight: 1.65 }}>
              Practice for CPCT, SSC, Railway &amp; VYAPAM — Hindi &amp; English.{" "}
              <strong style={{ color: "var(--brand)" }}>Your data never leaves your device.</strong>
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "18px" }}>
              {[{ icon:"🔒",text:"100% Private"},{icon:"⚡",text:"Instant"},{icon:"📱",text:"Mobile Ready"},{icon:"₹",text:"Free Forever"}].map((t)=>(
                <span key={t.text} style={{ fontSize:"11.5px",padding:"4px 11px",background:"var(--brand-light)",color:"var(--brand)",borderRadius:"99px",fontWeight:700,border:"1px solid var(--brand-mid)" }}>
                  {t.icon} {t.text}
                </span>
              ))}
            </div>
            <a href="/" style={{ display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"12.5px",fontWeight:700,color:"var(--text-muted)",textDecoration:"none",padding:"7px 16px",borderRadius:"99px",border:"1.5px solid var(--border-light)",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",transition:"all 0.15s ease" }}
              onMouseEnter={(e)=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="var(--brand-border)";el.style.color="var(--brand)";el.style.background="var(--brand-light)";}}
              onMouseLeave={(e)=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="var(--border-light)";el.style.color="var(--text-muted)";el.style.background="#fff";}}
            >← All Tools</a>
          </div>

          {/* ══ VIEW: SETUP ══ */}
          {view === "setup" && (
            <div style={{ background:"#fff",border:"1.5px solid var(--border-light)",borderRadius:"var(--radius-xl)",padding:"24px",marginBottom:"14px",boxShadow:"var(--shadow-md)" }}>

              {/* Language */}
              <p style={{ fontSize:"11px",fontWeight:800,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:"10px" }}>Language</p>
              <div style={{ display:"flex",gap:"8px",marginBottom:"20px" }}>
                {(["english","hindi"] as Lang[]).map((l) => (
                  <button key={l} onClick={()=>handleLangChange(l)} style={{ flex:1,padding:"10px",borderRadius:"var(--radius-md)",border:lang===l?"2px solid var(--brand)":"1.5px solid var(--border-light)",background:lang===l?"var(--brand)":"#fff",color:lang===l?"#fff":"var(--text-secondary)",fontWeight:700,fontSize:"13px",cursor:"pointer",transition:"all 0.15s",fontFamily:"var(--font)" }}>
                    {l==="english"?"🇬🇧 English":"🇮🇳 हिंदी (Mangal)"}
                  </button>
                ))}
              </div>

              {/* Exam Presets */}
              <p style={{ fontSize:"11px",fontWeight:800,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:"10px" }}>Exam Preset</p>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(130px,1fr))",gap:"8px",marginBottom:"16px" }}>
                {filteredPresets.map((p) => {
                  const pb = getPersonalBest(p.id);
                  return (
                    <button key={p.id} onClick={()=>handlePresetChange(p)} style={{ padding:"10px 8px",borderRadius:"var(--radius-md)",border:preset.id===p.id?`2px solid ${p.color}`:"1.5px solid var(--border-light)",background:preset.id===p.id?`${p.color}15`:"#fff",cursor:"pointer",textAlign:"center",transition:"all 0.15s",fontFamily:"var(--font)",position:"relative" }}>
                      <span style={{ display:"block",fontSize:"9.5px",fontWeight:700,color:preset.id===p.id?p.color:"var(--text-muted)",marginBottom:"3px" }}>{p.badge}</span>
                      <span style={{ display:"block",fontSize:"12.5px",fontWeight:800,color:preset.id===p.id?p.color:"var(--text-primary)" }}>{p.label}</span>
                      <span style={{ display:"block",fontSize:"10px",color:"var(--text-muted)",marginTop:"2px" }}>{p.targetWpm} WPM</span>
                      {pb && <span style={{ display:"block",fontSize:"9px",color:p.color,fontWeight:700,marginTop:"2px" }}>PB: {pb.wpm} WPM</span>}
                    </button>
                  );
                })}
              </div>

              {/* Info banner */}
              <div style={{ background:`${preset.color}10`,border:`1px solid ${preset.color}40`,borderRadius:"var(--radius-md)",padding:"10px 14px",marginBottom:"16px",fontSize:"12px",color:"var(--text-secondary)",lineHeight:1.6 }}>
                <strong style={{ color:preset.color }}>{preset.badge} {preset.label}:</strong> {preset.info}
              </div>

              {/* Duration */}
              <p style={{ fontSize:"11px",fontWeight:800,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:"10px" }}>Duration</p>
              <div style={{ display:"flex",gap:"8px",marginBottom:"16px" }}>
                {([1,2,5,10] as Duration[]).map((d)=>(
                  <button key={d} onClick={()=>setDur(d)} style={{ flex:1,padding:"9px 4px",borderRadius:"var(--radius-md)",border:dur===d?"2px solid var(--brand)":"1.5px solid var(--border-light)",background:dur===d?"var(--brand)":"#fff",color:dur===d?"#fff":"var(--text-secondary)",fontWeight:700,fontSize:"12px",cursor:"pointer",transition:"all 0.15s",fontFamily:"var(--font)" }}>
                    {d} min
                  </button>
                ))}
              </div>

              {/* Sound toggle */}
              <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px",padding:"10px 14px",background:"var(--bg-subtle)",borderRadius:"var(--radius-md)",border:"1px solid var(--border-light)" }}>
                <span style={{ fontSize:"14px" }}>{soundOn?"🔊":"🔇"}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:"12.5px",fontWeight:700,color:"var(--text-primary)" }}>Sound Feedback</p>
                  <p style={{ fontSize:"11px",color:"var(--text-muted)" }}>Tick on correct · Buzz on error · Chime on 10-streak</p>
                </div>
                <button onClick={()=>setSoundOn(p=>!p)} style={{ padding:"6px 14px",borderRadius:"99px",border:`1.5px solid ${soundOn?"var(--brand)":"var(--border-light)"}`,background:soundOn?"var(--brand)":"#fff",color:soundOn?"#fff":"var(--text-muted)",fontSize:"11.5px",fontWeight:700,cursor:"pointer",transition:"all 0.15s",fontFamily:"var(--font)" }}>
                  {soundOn?"ON":"OFF"}
                </button>
              </div>

              {/* CTA */}
              <button onClick={startTest} className="btn-primary" style={{ width:"100%",padding:"14px",fontSize:"15px",fontWeight:800,marginBottom:"10px",letterSpacing:"0.3px" }}>
                ▶ Start Typing Test
              </button>
              <button onClick={()=>setView("course")} style={{ width:"100%",padding:"11px",background:"transparent",color:"var(--brand)",border:"1.5px solid var(--brand-border)",borderRadius:"var(--radius-md)",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.15s" }}
                onMouseEnter={(e)=>{e.currentTarget.style.background="var(--brand-light)";}}
                onMouseLeave={(e)=>{e.currentTarget.style.background="transparent";}}
              >
                🎓 Learn Finger Placement First
              </button>
            </div>
          )}

          {/* ══ VIEW: COURSE ══ */}
          {view === "course" && (
            <FingerCourse onBack={()=>setView("setup")} />
          )}

          {/* ══ VIEW: TEST ══ */}
          {view === "test" && (
            <div style={{ marginBottom:"14px" }}>

              {/* Stats bar */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px",marginBottom:"10px" }}>
                {[
                  { val:fmtTime(secsLeft),  label:"Time",     color:secsLeft<=10?"#ef4444":"var(--text-primary)" },
                  { val:String(wpm),        label:"WPM",      color:"var(--brand)" },
                  { val:`${accuracy}%`,     label:"Accuracy", color:accuracy>=preset.targetAccuracy?"var(--brand)":"#ef4444" },
                  { val:String(errors),     label:"Errors",   color:errors===0?"var(--brand)":"#ef4444" },
                ].map(({ val,label,color })=>(
                  <div key={label} style={{ background:"#fff",border:"1.5px solid var(--border-light)",borderRadius:"var(--radius-lg)",padding:"10px 6px",textAlign:"center",boxShadow:"var(--shadow-sm)" }}>
                    <div style={{ fontSize:"20px",fontWeight:900,color,lineHeight:1,marginBottom:"3px",fontVariantNumeric:"tabular-nums" }}>{val}</div>
                    <div style={{ fontSize:"9.5px",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.8px" }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Streak badge */}
              {streak >= 5 && (
                <div className="streak-badge" style={{ textAlign:"center",marginBottom:"8px" }}>
                  <span style={{ display:"inline-flex",alignItems:"center",gap:"5px",background:`linear-gradient(135deg, var(--accent), #f59e0b)`,color:"#fff",padding:"5px 14px",borderRadius:"99px",fontSize:"12px",fontWeight:800,boxShadow:"0 3px 10px rgba(217,119,6,0.35)" }}>
                    🔥 {streak} key streak!
                  </span>
                </div>
              )}

              {/* Progress */}
              <div className="progress-bar-wrap" style={{ marginBottom:"6px" }}>
                <div className="progress-bar-fill" style={{ width:`${progressPct}%`,transition:"width 0.2s ease" }} />
              </div>
              <p style={{ fontSize:"10.5px",color:"var(--text-muted)",textAlign:"right",marginBottom:"10px" }}>{progressPct}% · {pos}/{chars.length} chars</p>

              {/* Live keyboard highlight */}
              {currentChar && (
                <div style={{ background:"#fff",border:"1.5px solid var(--border-light)",borderRadius:"var(--radius-xl)",padding:"14px 16px",marginBottom:"10px",boxShadow:"var(--shadow-sm)" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px",flexWrap:"wrap" }}>
                    <span style={{ fontSize:"11px",fontWeight:800,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"1px" }}>Next key:</span>
                    <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:"32px",height:"32px",background:"var(--brand)",color:"#fff",borderRadius:"var(--radius-sm)",fontSize:"14px",fontWeight:900,boxShadow:"0 3px 0 var(--brand-hover, #0B7C72)" }}>
                      {currentChar === " " ? "⎵" : currentChar}
                    </span>
                    {currentFingerKey && (
                      <span style={{ fontSize:"11px",fontWeight:700,color:FINGER_COLORS[currentFingerKey],background:`${FINGER_COLORS[currentFingerKey]}15`,padding:"3px 10px",borderRadius:"99px" }}>
                        {currentFingerKey.replace("_l"," Left").replace("_r"," Right").replace("_"," ")} finger
                      </span>
                    )}
                  </div>
                  <KeyboardVisual highlightKeys={[currentChar]} currentChar={currentChar} />
                </div>
              )}

              {/* Passage */}
              <div
                ref={passageRef}
                onClick={()=>hiddenInputRef.current?.focus()}
                style={{ background:"#fff",border:"1.5px solid var(--border-light)",borderRadius:"var(--radius-lg)",padding:"16px 18px",lineHeight:lang==="hindi"?"2.4":"2.0",fontSize:lang==="hindi"?"16px":"15px",cursor:"text",marginBottom:"10px",boxShadow:"var(--shadow-sm)",maxHeight:"200px",overflowY:"auto",fontFamily:lang==="hindi"?"'Mangal','Noto Sans Devanagari',sans-serif":"var(--font)" }}
              >
                {renderPassage()}
              </div>

              {/* Hidden textarea */}
              <textarea
                ref={hiddenInputRef}
                onChange={onHiddenInput}
                onKeyDown={onHiddenKeyDown}
                style={{ position:"absolute",opacity:0,width:"1px",height:"1px",pointerEvents:"none" }}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              />

              <p style={{ fontSize:"12px",color:"var(--text-muted)",textAlign:"center",marginBottom:"10px" }}>
                {startTimeRef.current ? "⌨️ Keep typing… Backspace to correct" : "👆 Tap the passage above and start typing"}
              </p>

              {/* Target reminder */}
              <div style={{ background:`${preset.color}10`,border:`1px solid ${preset.color}35`,borderRadius:"var(--radius-md)",padding:"8px 14px",marginBottom:"12px",display:"flex",justifyContent:"space-between",fontSize:"12px",color:"var(--text-secondary)",flexWrap:"wrap",gap:"4px" }}>
                <span>Target: <strong style={{ color:preset.color }}>{preset.targetWpm} WPM</strong></span>
                <span>Accuracy: <strong style={{ color:preset.color }}>{preset.targetAccuracy}%</strong></span>
                <span style={{ fontWeight:700,color:preset.color }}>{preset.badge} {preset.label}</span>
              </div>

              <button onClick={stopTest} style={{ width:"100%",padding:"11px",background:"transparent",border:"1.5px solid #ef4444",borderRadius:"var(--radius-md)",fontSize:"13px",fontWeight:700,color:"#ef4444",cursor:"pointer",fontFamily:"var(--font)" }}>
                ⏹ End Test Early
              </button>
            </div>
          )}

          {/* ══ VIEW: RESULT ══ */}
          {view === "result" && result && (
            <div style={{ background:"#fff",border:"2px solid var(--brand-border)",borderRadius:"var(--radius-xl)",padding:"28px 24px",marginBottom:"14px",textAlign:"center",boxShadow:"var(--shadow-md)" }}>
              <div style={{ fontSize:"48px",marginBottom:"8px" }}>
                {result.passed ? "🏆" : result.accuracy >= preset.targetAccuracy ? "⚡" : "💪"}
              </div>
              <h2 style={{ fontSize:"22px",fontWeight:900,color:"var(--text-primary)",marginBottom:"4px" }}>
                {result.passed ? "Excellent! You Passed!" : result.wpm >= preset.targetWpm * 0.8 ? "Almost There!" : "Keep Practicing!"}
              </h2>
              <p style={{ fontSize:"13px",color:"var(--text-muted)",marginBottom:"14px" }}>
                {preset.badge} {preset.label} · {result.duration} min test
              </p>

              {/* PB badge */}
              {isNewPB && result.wpm > 0 && (
                <div style={{ display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 16px",borderRadius:"99px",marginBottom:"12px",background:`linear-gradient(135deg, var(--accent), #f59e0b)`,color:"#fff",fontSize:"12.5px",fontWeight:800,boxShadow:"0 3px 10px rgba(217,119,6,0.3)" }}>
                  🏅 New Personal Best!
                </div>
              )}

              {/* Pass/Fail */}
              <div style={{ display:"inline-flex",alignItems:"center",gap:"6px",padding:"8px 20px",borderRadius:"99px",marginBottom:"18px",background:result.passed?"var(--brand-light)":"var(--bg-subtle)",color:result.passed?"var(--brand)":"var(--text-secondary)",fontSize:"13px",fontWeight:800,border:`1.5px solid ${result.passed?"var(--brand-border)":"var(--border-light)"}` }}>
                {result.passed
                  ? `✅ ${preset.label} Standard Met!`
                  : `❌ Need ${preset.targetWpm} WPM & ${preset.targetAccuracy}% accuracy`}
              </div>

              {/* Metrics */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"10px",marginBottom:"16px" }}>
                {[
                  { val:`${result.wpm}`,      label:"Net WPM",      color:result.wpm>=preset.targetWpm?"var(--brand)":"#ef4444" },
                  { val:`${result.accuracy}%`,label:"Accuracy",     color:result.accuracy>=preset.targetAccuracy?"var(--brand)":"#ef4444" },
                  { val:`${result.errors}`,   label:"Total Errors", color:result.errors===0?"var(--brand)":"#ef4444" },
                  { val:result.grade,          label:"Grade",        color:["A+","A"].includes(result.grade)?"var(--brand)":result.grade==="B"?"var(--accent)":"#ef4444" },
                ].map(({val,label,color})=>(
                  <div key={label} style={{ background:"var(--bg-muted)",borderRadius:"var(--radius-lg)",padding:"14px 10px" }}>
                    <div style={{ fontSize:"28px",fontWeight:900,color,lineHeight:1,marginBottom:"4px" }}>{val}</div>
                    <div style={{ fontSize:"11px",fontWeight:700,color:"var(--text-muted)" }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Max streak */}
              {maxStreak >= 10 && (
                <div style={{ display:"inline-flex",alignItems:"center",gap:"6px",padding:"5px 14px",borderRadius:"99px",marginBottom:"14px",background:"linear-gradient(135deg, var(--accent), #f59e0b)",color:"#fff",fontSize:"12px",fontWeight:800 }}>
                  🔥 Best Streak: {maxStreak} keys
                </div>
              )}

              {/* WPM Graph */}
              {result.wpmTimeline.length > 2 && (
                <WpmGraph timeline={result.wpmTimeline} targetWpm={preset.targetWpm} />
              )}

              {/* Personalized tip */}
              {!result.passed && (
                <div style={{ background:"var(--brand-light)",border:"1px solid var(--brand-border)",borderRadius:"var(--radius-md)",padding:"10px 14px",marginBottom:"16px",fontSize:"12.5px",color:"var(--brand-dark)",lineHeight:1.65,textAlign:"left" }}>
                  💡 {result.wpm < preset.targetWpm
                    ? `Your speed is ${preset.targetWpm - result.wpm} WPM short. Open the Finger Placement course → Lesson 3 (Both Hands Combined) and practice the home row for 10 minutes daily.`
                    : result.accuracy < preset.targetAccuracy
                    ? `Accuracy ${result.accuracy}% needs to reach ${preset.targetAccuracy}%. Slow down by 20% and focus on hitting the right key before rushing. Speed will follow.`
                    : `You are very close! ${preset.targetWpm - result.wpm} WPM gap. Try the 1-minute practice mode daily to build muscle memory.`}
                </div>
              )}

              {/* Grade legend */}
              <div style={{ background:"var(--bg-subtle)",borderRadius:"var(--radius-md)",padding:"10px 14px",marginBottom:"18px",fontSize:"11px",color:"var(--text-muted)",display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap" }}>
                {[["A+","97%+"],["A","92%+"],["B","85%+"],["C","78%+"],["D","70%+"],["F","Below"]].map(([g,d])=>(
                  <span key={g} style={{ fontWeight:result.grade===g?800:400,color:result.grade===g?"var(--brand)":"var(--text-muted)" }}>
                    {g}: {d}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display:"flex",gap:"10px",flexWrap:"wrap" }}>
                <button className="btn-cta" onClick={startTest} style={{ flex:2,fontSize:"14px",padding:"13px",minWidth:"120px" }}>
                  ↺ Try Again
                </button>
                <button className="btn-secondary" onClick={resetAll} style={{ flex:1,minWidth:"100px" }}>
                  ⚙ Settings
                </button>
                <a href="/" className="btn-secondary" style={{ flex:1,textDecoration:"none",textAlign:"center",minWidth:"100px",display:"inline-flex",alignItems:"center",justifyContent:"center" }}>
                  🏠 Home
                </a>
              </div>
            </div>
          )}

          {/* ── Mid Ad ── */}
          <div aria-hidden="true" style={{ margin:"24px 0" }}>
            <ins className="adsbygoogle" style={{ display:"block",minHeight:"250px" }}
              data-ad-format="auto" data-full-width-responsive="true" />
          </div>

          {/* ══ HOW TO USE ══ */}
          <section aria-label="How to use" style={{ background:"#fff",border:"1.5px solid var(--border-light)",borderRadius:"var(--radius-xl)",padding:"22px",marginBottom:"14px",boxShadow:"var(--shadow-md)" }}>
            <h2 style={{ fontSize:"16px",fontWeight:800,marginBottom:"16px",color:"var(--text-primary)" }}>🪄 How to Use the Typing Test</h2>
            {[
              { n:"1",title:"Select Your Exam",            desc:"Choose CPCT, SSC CHSL, SSC CGL, Railway RRB, or VYAPAM. Pick Hindi or English and set the test duration." },
              { n:"2",title:"Learn Finger Placement",      desc:"New to touch typing? Open the 8-lesson Finger Placement Course. Learn exactly which finger types which key — the foundation of fast accurate typing." },
              { n:"3",title:"Start Typing",                desc:"Tap the passage to begin. Live WPM, accuracy and error count update in real time. Use Backspace to fix mistakes. Sound feedback helps your rhythm." },
              { n:"4",title:"Review Your Result",          desc:"See WPM graph, grade, streak, and whether you passed the exam standard. Personal best is saved automatically for each exam preset." },
            ].map(({n,title,desc})=>(
              <div key={n} style={{ display:"flex",gap:"12px",marginBottom:"13px",alignItems:"flex-start" }}>
                <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:"26px",height:"26px",borderRadius:"50%",background:"var(--brand)",color:"#fff",fontSize:"11px",fontWeight:900,flexShrink:0,marginTop:"1px" }}>{n}</span>
                <div>
                  <p style={{ fontSize:"13px",fontWeight:700,color:"var(--text-primary)",marginBottom:"2px" }}>{title}</p>
                  <p style={{ fontSize:"12.5px",color:"var(--text-muted)",lineHeight:1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* ══ USE CASES ══ */}
          <section aria-label="Use cases" style={{ background:"var(--brand-light)",border:"1px solid var(--brand-border)",borderRadius:"var(--radius-xl)",padding:"20px 22px",marginBottom:"14px" }}>
            <h2 style={{ fontSize:"15px",fontWeight:800,marginBottom:"12px",color:"var(--brand-dark)" }}>🎯 Who Is This For?</h2>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"10px" }}>
              {[
                { icon:"🏆",title:"CPCT MP Aspirants",    desc:"CPCT certificate is mandatory for MP government jobs. Practice English and Hindi typing here." },
                { icon:"🔥",title:"SSC Students",          desc:"Clear the 35 WPM English typing requirement for SSC CHSL and SSC CGL examinations." },
                { icon:"🚆",title:"Railway Candidates",    desc:"Practice Hindi typing at 25 WPM for RRB Junior Clerk and Steno posts." },
                { icon:"📋",title:"VYAPAM Aspirants",      desc:"Prepare for MP Steno and Data Entry posts with the Hindi typing test." },
              ].map(({icon,title,desc})=>(
                <div key={title} style={{ display:"flex",gap:"10px",alignItems:"flex-start" }}>
                  <span style={{ fontSize:"20px",flexShrink:0 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize:"12.5px",fontWeight:700,color:"var(--brand-dark)",marginBottom:"2px" }}>{title}</p>
                    <p style={{ fontSize:"11.5px",color:"var(--brand)",lineHeight:1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ FAQ ══ */}
          <section aria-label="FAQ" style={{ background:"#fff",border:"1.5px solid var(--border-light)",borderRadius:"var(--radius-xl)",padding:"22px",marginBottom:"14px",boxShadow:"var(--shadow-md)" }}>
            <h2 style={{ fontSize:"16px",fontWeight:800,marginBottom:"16px",color:"var(--text-primary)" }}>❓ Frequently Asked Questions</h2>
            {[
              {
                q: "What typing speed is required for the CPCT MP exam?",
                a: "CPCT requires a minimum of 30 WPM for English and 20 WPM for Hindi (Mangal font). Accuracy must be 85% or above. The CPCT certificate is mandatory for most Madhya Pradesh government department jobs.",
              },
              {
                q: "What happens in the SSC CHSL typing test?",
                a: "SSC CHSL requires 35 WPM in English for the LDC post. The test is 10 minutes long. Errors are penalised — net WPM equals gross WPM minus error deductions. Maintaining accuracy above 80% is essential to pass.",
              },
              {
                q: "Which font is used for Hindi typing in government exams?",
                a: "Mangal font with the Unicode Inscript keyboard layout is the standard for all government exams including SSC, Railway, VYAPAM, and CPCT. This is different from the older Krutidev font. EzSeva's Hindi test also uses Mangal Unicode.",
              },
              {
                q: "How long does it take to improve typing speed?",
                a: "With 30 minutes of daily practice, clear improvement is visible within 4 to 6 weeks. Focus on accuracy first — aim for 95% or above. Speed follows naturally once your fingers know the correct positions. Start with the Finger Placement course.",
              },
              {
                q: "Can I take the typing test on a mobile phone?",
                a: "Yes, the EzSeva typing test works on mobile virtual keyboards. However, for exam preparation you must practice on a physical keyboard — all government typing examinations are conducted on desktop computers with physical keyboards.",
              },
              {
                q: "How is WPM calculated?",
                a: "WPM (Words Per Minute) = (correctly typed characters / 5) / minutes elapsed. Each group of 5 characters counts as one word — this is the international standard. Errors are subtracted when calculating net WPM.",
              },
            ].map((faq,i,arr)=>(
              <div key={i} style={{ marginBottom:i<arr.length-1?"16px":0,paddingBottom:i<arr.length-1?"16px":0,borderBottom:i<arr.length-1?"1px solid var(--border-light)":"none" }}>
                <p style={{ fontSize:"13.5px",fontWeight:700,color:"var(--text-primary)",marginBottom:"5px" }}>Q: {faq.q}</p>
                <p style={{ fontSize:"12.5px",color:"var(--text-muted)",lineHeight:1.7 }}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* ══ RELATED TOOLS ══ */}
          <section aria-label="More free tools" style={{ marginBottom:"8px" }}>
            <h2 style={{ fontSize:"15px",fontWeight:800,marginBottom:"12px",color:"var(--text-secondary)" }}>🔗 More Free Tools</h2>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:"10px" }}>
              {[
                { icon:"🖼️",title:"Image Resize",    href:"/image-resize",  desc:"SSC, Railway, VYAPAM sizes" },
                { icon:"🪪",title:"Photo+Signature",  href:"/photo-joiner",  desc:"Merge for govt forms" },
                { icon:"📄",title:"Image to PDF",     href:"/image-to-pdf",  desc:"Combine images into PDF" },
                { icon:"🗜️",title:"PDF Compress",    href:"/pdf-compress",  desc:"Shrink PDF size" },
                { icon:"📑",title:"PDF Merge",        href:"/pdf-merge",     desc:"Combine PDFs into one" },
                { icon:"✂️",title:"PDF Split",        href:"/pdf-split",     desc:"Extract PDF pages" },
                { icon:"🔒",title:"PDF Protect",      href:"/pdf-protect",   desc:"Add password to PDF" },
                { icon:"🎨",title:"Image Crop",       href:"/image-crop",    desc:"Crop to any size" },
              ].map((t)=>(
                <a key={t.href} href={t.href} className="tool-card" style={{ padding:"14px" }}>
                  <div className="tool-card-icon" style={{ marginBottom:"7px" }}>{t.icon}</div>
                  <div style={{ fontSize:"12px",fontWeight:700,color:"var(--text-primary)",marginBottom:"3px" }}>{t.title}</div>
                  <div style={{ fontSize:"11px",color:"var(--text-muted)" }}>{t.desc}</div>
                </a>
              ))}
            </div>
          </section>

        </div>

        {/* ── Bottom Ad ── */}
        <div aria-hidden="true">
          <ins className="adsbygoogle" style={{ display:"block",minHeight:"90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <Footer />
      </main>
    </>
  );
}

/*
export const metadata = {
  title: "Free Online Typing Test — Hindi & English | CPCT, SSC, Railway, VYAPAM | EzSeva",
  description: "Practice typing test online free for CPCT MP, SSC CHSL, SSC CGL, Railway RRB, VYAPAM. Hindi Mangal and English. Live WPM, accuracy, streak counter. No signup. 100% private.",
  keywords: ["typing test online free","cpct typing test","ssc typing test","hindi typing test mangal","vyapam typing test","railway typing test","typing speed test india","online typing practice"],
  openGraph: { title: "Free Typing Test — Hindi & English | CPCT SSC Railway | EzSeva", description: "Practice typing for CPCT, SSC, Railway, VYAPAM. Live WPM + finger guide. Free forever.", url: "https://ezseva.in/typing-test", siteName: "EzSeva" },
  alternates: { canonical: "https://ezseva.in/typing-test" },
};
*/