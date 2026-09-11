# 🌐 NexusWeb — Visual Knowledge Network & Smart Website Organizer

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-6-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-Firestore_%26_Auth-ffca28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Express-Backend_Proxy-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI_Powered-8e75ff?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
</p>

<p align="center">
  <strong>منظم ومستكشف مواقع تفاعلي مستوحى من Obsidian وRoam Research يُمكّنك من تنظيم روابطك وأدواتك التقنية على هيئة شبكة معرفية بصرية ثلاثية الأبعاد تعتمد على قوى فيزيائية حقيقية (Force-Directed Graph).</strong>
  <br />
  <em>An Obsidian-inspired interactive visual network and smart organizer for websites, developer tools, and bookmarks with real-time cloud synchronization.</em>
</p>

---

## ✨ Features | المميزات الرئيسية

### 🕸️ 1. Interactive Force-Directed Graph (الشبكة البصرية التفاعلية)
- **Physics Simulation (محاكاة فيزيائية واقعية)**: تحريك وانجذاب الروابط بناءً على قوى التنافر والشحن والجاذبية للمركز وحساب الاصطدامات (Collision Detection).
- **Interactive Connections (ربط العقد تفاعلياً)**: إمكانية سحب سلك ربط مباشر بين أي موقعين بالماوس لإنشاء علاقات معرفية وسياقية بين الأدوات.
- **Dynamic Physics Controls**: التحكم المباشر بحجم العقد، قوة التنافر، مسافة الروابط، وتثبيت العقد (Pinning).
- **High-Performance HTML5 Canvas**: أداء سلس يصل إلى 60FPS حتى مع مئات العقد والمواقع.

### 🗂️ 2. Custom Networks & Categorization (شبكات وتصنيفات مخصصة)
- **My Networks Engine**: إنشاء وتصنيف شبكات متخصصة (مثل: *AI Research, DevOps Stack, CyberSecurity, Design System*).
- **Quick Switching**: التبديل الفوري بين الشبكات ومشاهدة تفرعات العقد التابعة لكل شبكة حصراً.
- **Smart Category Filtering**: تصنيفات تلقائية ذكية (Development, AI & ML, Cloud, Security, Design, Utilities).
- **Multiple View Modes**:
  - 🕸️ **Graph View**: الشبكة البصرية العنكبوتية.
  - 🍱 **Grid View**: بطاقات عصرية مع بيانات التحليل ونسب الشعبية ومؤشرات النشاط.
  - 📑 **List View**: جدول سريع ومنظم للبحث والتصفح الكثيف.
  - 🪐 **Radial Cluster View**: توزيع العقد حسب التصنيفات حول مركز الجاذبية.

### ☁️ 3. Cloud Persistence & Auth (المزامنة السحابية والحسابات)
- **Google & Email/Password Sign-In**: تسجيل الدخول بنقرة واحدة عبر حساب Google أو البريد الإلكتروني.
- **Real-Time Multi-Device Sync**: مزامنة لحظية فورية عبر Firebase Firestore؛ افتح التطبيق من أي متصفح أو جهاز واستكمل عملك دون فقدان أي عقدة.
- **Offline First**: إمكانية العمل بكفاءة تامة بدون إنترنت عبر LocalStorage مع مزامنة تلقائية عند عودة الاتصال.

### 📥 4. Drag & Drop Magic (إفلات الروابط واختصارات سطح المكتب)
- **Drop Anywhere**: اسحب أي رابط من متصفحك أو سطح مكتبك وأفلته في أي مكان داخل التطبيق.
- **Desktop Shortcuts Support**: دعم قراءة واستخراج الروابط تلقائياً من ملفات اختصارات سطح المكتب (`.url`, `.webloc`, `.desktop`).

### 🤖 5. Gemini AI Auto-Metadata (استخراج وتصنيف ذكي بالذكاء الاصطناعي)
- استخراج اسم الموقع، الوصف، الفئات المناسبة، والكلمات المفتاحية تلقائياً بمجرد إدخال الرابط عبر Gemini API.

### 🛡️ 6. Data Ownership & Fresh Start (إدارة البيانات والبدء من جديد)
- **Backup & Restore**: تصدير واستيراد بياناتك بالكامل كملف JSON بنقرة واحدة.
- **Wipe All Data & Fresh Start**: زر لتصفير كافة البيانات وبدء صفحة بيضاء فارغة تماماً (0 مواقع) لبناء شبكتك الخاصة من الصفر.
- **Curated Samples**: زر لاستعادة شبكة المطورين الافتراضية (40 موقعاً وأداة تقنية منتقاة بعناية).

---

## 🛠️ Tech Stack | التقنيات المستخدمة

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Visual Engine**: HTML5 Canvas 2D Force-Directed Simulation, [Motion](https://motion.dev/)
- **Icons & Effects**: [Lucide Icons](https://lucide.dev/), [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Cloud & Auth**: [Firebase v12](https://firebase.google.com/) (Authentication & Firestore Database)
- **Backend & Proxy**: [Node.js](https://nodejs.org/) & [Express 4](https://expressjs.com/), [tsx](https://github.com/privatenumber/tsx), [esbuild](https://esbuild.github.io/)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Gemini API)

---

## 🚀 Getting Started | طريقة التثبيت والتشغيل محلياً

### المتطلبات الأساسية (Prerequisites)
- [Node.js](https://nodejs.org/) الإصدار 18 أو أحدث
- مدير الحزم [npm](https://www.npmjs.com/) أو [pnpm](https://pnpm.io/)

### 1. استنساخ المستودع (Clone Repository)
```bash
git clone https://github.com/your-username/nexusweb.git
cd nexusweb
```

### 2. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 3. إعداد المتغيرات البيئية (Environment Setup)
قم بإنشاء ملف `.env` في المجلد الرئيسي استناداً إلى `.env.example`:

```env
# Gemini API Key (لتمكين ميزات الاستخراج والتصنيف بالذكاء الاصطناعي)
GEMINI_API_KEY="your-gemini-api-key"

# عنوان التطبيق
APP_URL="http://localhost:3000"
```

> **ملاحظة خاصة بـ Firebase**: التطبيق مهيأ مسبقاً للعمل مع Firestore والمصادقة. يمكنك أيضاً ربط مشروع Firebase الخاص بك في `src/services/firebase.ts`.

### 4. تشغيل خادم التطوير (Run Development Server)
```bash
npm run dev
```
افتح المتصفح وتوجه إلى: `http://localhost:3000`

---

## 🏗️ Production Build & Deployment | البناء والإنتاج

لبناء التطبيق للإنتاج وتجميع ملفات الواجهة وخادم Express:

```bash
npm run build
```

لتشغيل خادم الإنتاج:
```bash
npm start
```

---

## 📂 Project Structure | هيكل المشروع

```text
├── src/
│   ├── components/
│   │   ├── dashboard/       # Header, QuickAccess, StatsCards, GlobalDropZone
│   │   ├── graph/           # GraphCanvas (2D Force Simulation), GraphControls, NodeDetails
│   │   ├── layout/          # Sidebar navigation and network indicators
│   │   ├── modals/          # AddWebsite, NetworkModal, AuthModal, ClearAllDataModal, Settings
│   │   └── views/           # GridView, ListView, RadialClusterView, EmptyState
│   ├── services/
│   │   ├── firebase.ts      # Firebase Auth & Firestore Real-time Cloud Sync
│   │   ├── storage.ts       # LocalStorage persistence, export/import & wipe engine
│   │   ├── websiteParser.ts # AI & DOM URL title, favicon and metadata extraction
│   │   └── shortcutParser.ts# .url, .webloc, and .desktop drag-and-drop parser
│   ├── types.ts             # Global TypeScript models (Website, Network, Settings)
│   ├── App.tsx              # Root Controller & state orchestrator
│   └── main.tsx             # React DOM entrypoint
├── server.ts                # Express server + Vite middleware & API endpoints
├── firestore.rules          # Security rules for Firestore Cloud Database
├── metadata.json            # AI Studio applet metadata & capabilities
└── package.json             # NPM dependencies and scripts
```

---

## 🔒 Security & Privacy | الأمان والخصوصية

- **Row-Level User Isolation**: كل مستخدم يملك وثيقة خاصة به داخل Firestore مسارها `users/{userId}` ومحمية بقواعد أمان صارمة تمنع وصول أي مستخدم لبيانات الآخرين (`request.auth.uid == userId`).
- **Server-Side API Security**: مفتاح Gemini API يتم التعامل معه حصراً داخل الخادم (Server-Side) ولا يتم تسريبه أو تعريضه لمتصفح العميل إطلاقاً.
- **Local Fallback**: في حال عدم تسجيل الدخول، تعمل جميع الميزات محلياً 100% على متصفحك دون إرسال روابطك لأي خادم خارجي.

---

## 🤝 Contributing | المساهمة

المساهمات مرحب بها دائماً!
1. قم بعمل Fork للمشروع.
2. أنشئ فرعاً لميزتك الجديدة (`git checkout -b feature/AmazingFeature`).
3. قم بحفظ التعديلات (`git commit -m 'Add some AmazingFeature'`).
4. ارفع الفرع (`git push origin feature/AmazingFeature`).
5. افتح طلب دمج (Pull Request).

---

## 📄 License | الترخيص

هذا المشروع مرخص تحت رخصة **MIT License**. يمكنك استخدامه وتطويره بحرية.

<p align="center">
  صُنع بكل ❤️ لتنظيم المعرفة وتطوير تجربة تصفح أدوات المطورين.
</p>
