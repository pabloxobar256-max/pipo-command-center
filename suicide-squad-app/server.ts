import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

// Interfaces for our Clan Database
interface User {
  memberId: string;
  username: string;
  passwordHash: string;
  nickname: string;
  role: "Founder" | "Administrator" | "Regular";
  division: "SCV" | "TAC" | "VFX" | "RDF" | "SSF" | "None";
  joinDate: string;
  status: "Active" | "Inactive" | "Suspended";
}

interface Tournament {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  status: "Active" | "Completed" | "Upcoming";
  requests: {
    memberId: string;
    nickname: string;
    status: "Pending" | "Approved" | "Rejected";
    requestDate: string;
  }[];
}

interface ClanWar {
  id: string;
  titleAr: string;
  titleEn: string;
  rulesAr: string;
  rulesEn: string;
  schedule: string;
  instructionsAr: string;
  instructionsEn: string;
  requiredPoints: number;
}

interface Activity {
  id: string;
  type: "Event" | "Training" | "Friendly Room" | "Meeting" | "Announcement";
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  date: string;
}

interface RuleCategory {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string[];
  contentEn: string[];
}

interface Report {
  id: string;
  title: string;
  description: string;
  screenshot?: string; // Base64
  reporterId: string;
  reporterNickname: string;
  status: "Pending" | "Resolved";
  submittedAt: string;
}

interface Notification {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  senderNickname: string;
  createdAt: string;
  isReadBy: string[]; // List of member IDs who read it
}

interface ClanSettings {
  clanPassword: string;
  allowPublicRegistration: boolean;
}

interface DatabaseSchema {
  users: User[];
  tournaments: Tournament[];
  clanWar: ClanWar;
  activities: Activity[];
  rules: RuleCategory[];
  reports: Report[];
  notifications: Notification[];
  settings: ClanSettings;
}

const DB_FILE = path.join(process.cwd(), "database.json");

// Helper function to hash password securely
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "suicide-squad-salt-2026").digest("hex");
}

// Initial Database Seeding
const initialDb: DatabaseSchema = {
  users: [
    {
      memberId: "SS-0001",
      username: "founder",
      passwordHash: hashPassword("founder123"),
      nickname: "SS_COMMANDER",
      role: "Founder",
      division: "SSF",
      joinDate: "2026-01-01",
      status: "Active",
    }
  ],
  settings: {
    clanPassword: "BACK.TO.SERVICE",
    allowPublicRegistration: true,
  },
  tournaments: [
    {
      id: "t-1",
      titleAr: "بطولة فري فاير الجزائرية الكبرى",
      titleEn: "Free Fire Algerian Grand League",
      descAr: "البطولة الكبرى للتحدي بين أقوى الفرق المحلية. الجائزة الأولى 5000 جوهرة.",
      descEn: "The grand tournament to challenge the strongest local squads. First prize 5000 diamonds.",
      status: "Active",
      requests: []
    }
  ],
  clanWar: {
    id: "cw-1",
    titleAr: "حرب الكلان القادمة ضد الكلان المنافس",
    titleEn: "Upcoming Clan War vs Rivals",
    rulesAr: "1. يمنع منعا كليا استخدام أي برامج مساعدة أو محاكيات غير معتمدة.\n2. التواجد في الديسكورد قبل الحرب بـ 15 دقيقة.\n3. احترام توجيهات قائد الفريق والالتزام بالخطة العسكرية.",
    rulesEn: "1. Strictly forbidden to use any third-party tools or unauthorized emulators.\n2. Be present on Discord 15 minutes before the war starts.\n3. Respect the team leader directives and adhere to the military plan.",
    schedule: "2026-07-10T21:00:00",
    instructionsAr: "الهبوط في منطقة البايمودا. التركيز على حماية زملائك وتجنب الاشتباكات العشوائية في البداية.",
    instructionsEn: "Land in the Bermuda region. Focus on protecting teammates and avoid random early fights.",
    requiredPoints: 50
  },
  activities: [
    {
      id: "a-1",
      type: "Training",
      titleAr: "تدريب تكتيكي مكثف",
      titleEn: "Intensive Tactical Training",
      descAr: "تدريب على التنسيق والسرعة في الجدران الإضافية (Gloo Walls). حضور إجباري لجميع الأعضاء.",
      descEn: "Training on team coordination and speed in placing Gloo Walls. Attendance is mandatory for all.",
      date: "2026-07-06T20:00:00"
    }
  ],
  rules: [
    {
      id: "general",
      titleAr: "القواعد العامة",
      titleEn: "General Rules",
      contentAr: [
        "احترام جميع أعضاء الكلان والتعامل بأدب.",
        "تجنب المواضيع السياسية والطائفية داخل الكلان.",
        "الالتزام بالاسم الرسمي أو بادئة الكلان إذا لزم الأمر."
      ],
      contentEn: [
        "Respect all clan members and maintain polite behavior.",
        "Avoid political and sectarian topics inside the clan community.",
        "Adhere to the official clan name format or tag if required."
      ]
    },
    {
      id: "clanwar",
      titleAr: "قواعد حرب الكلان",
      titleEn: "Clan War Rules",
      contentAr: [
        "التواجد الإجباري لجميع المشاركين قبل بدء الحرب بـ 15 دقيقة.",
        "تنفيذ أوامر القادة العسكريين في الميدان دون تردد.",
        "يمنع الانسحاب من المعركة مهما كانت الظروف."
      ],
      contentEn: [
        "Mandatory presence for all participants 15 minutes before starting.",
        "Execute the orders of tactical commanders in the field without hesitation.",
        "Strictly forbidden to abandon the battle under any circumstances."
      ]
    },
    {
      id: "weekly",
      titleAr: "قواعد النشاط الأسبوعي",
      titleEn: "Weekly Activity Rules",
      contentAr: [
        "يجب جمع ما لا يقل عن 100 نقطة نشاط أسبوعياً.",
        "المشاركة في الرومات الودية المقامة يومي الجمعة والسبت.",
        "تقديم مبرر مسبق للإدارة في حال الغياب عن اللعب لأكثر من 3 أيام."
      ],
      contentEn: [
        "Gather at least 100 activity points weekly.",
        "Participate in friendly rooms held on Fridays and Saturdays.",
        "Provide a prior excuse to the administration for inactivity exceeding 3 days."
      ]
    },
    {
      id: "conduct",
      titleAr: "السلوك المهني",
      titleEn: "Professional Conduct",
      contentAr: [
        "عدم الإساءة للكلانات المنافسة في مواقع التواصل الاجتماعي.",
        "اللعب بذكاء وروح رياضية عالية.",
        "تمثيل الكلان بأفضل صورة داخل اللعبة وخارجها."
      ],
      contentEn: [
        "No offensive remarks toward rival clans on social media.",
        "Play smart and show high sportsmanship.",
        "Represent the clan in the best possible way inside and outside the game."
      ]
    },
    {
      id: "tournament",
      titleAr: "قواعد البطولات",
      titleEn: "Tournament Rules",
      contentAr: [
        "التسجيل في البطولات متاح فقط للأعضاء المسجلين والنشطين.",
        "يجب الالتزام بالمواعيد المحددة لكل مباراة.",
        "الاعتراض على النتائج يتم بطريقة رسمية عبر المشرفين والمسؤولين."
      ],
      contentEn: [
        "Tournament registration is open only to registered active members.",
        "Adhere to scheduled match times with zero tolerance for delays.",
        "Any appeals must be submitted formally through tournament moderators."
      ]
    }
  ],
  reports: [],
  notifications: [
    {
      id: "n-1",
      titleAr: "مرحباً بكم في مركز القيادة الجديد",
      titleEn: "Welcome to the New Command Center",
      contentAr: "تم تفعيل مركز القيادة الرقمي لكلان Suicide Squad بنجاح. يرجى مراجعة القواعد والتحقق من مهامكم.",
      contentEn: "The Suicide Squad digital command center has been successfully activated. Please check the rules and verify your assignments.",
      senderNickname: "SS_COMMANDER",
      createdAt: "2026-07-05T12:00:00",
      isReadBy: []
    }
  ]
};

// Database utility functions
function loadDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf8");
      return initialDb;
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading database, returning initial structure:", err);
    return initialDb;
  }
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing database:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // Helper to get authed user
  const getAuthedUser = (req: express.Request, db: DatabaseSchema): User | null => {
    const token = req.headers["authorization"]?.replace("Bearer ", "") || "";
    if (!token) return null;
    const user = db.users.find(u => u.memberId === token);
    return user && user.status === "Active" ? user : null;
  };

  // ══════════════════════ API ROUTES ══════════════════════

  // Public Endpoint to check setup or test backend
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", time: new Date().toISOString() });
  });

  // REGISTER
  app.post("/api/auth/register", (req, res) => {
    const { username, password, nickname, clanPassword } = req.body;
    const db = loadDb();

    if (!username || !password || !nickname || !clanPassword) {
      return res.status(400).json({ errorAr: "جميع الحقول مطلوبة.", errorEn: "All fields are required." });
    }

    // Check Clan Password
    if (clanPassword !== db.settings.clanPassword) {
      return res.status(400).json({ errorAr: "رمز دخول الكلان غير صحيح.", errorEn: "Incorrect Clan Access Password." });
    }

    // Check unique username
    const exists = db.users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      return res.status(400).json({ errorAr: "اسم المستخدم مستخدم بالفعل.", errorEn: "Username is already taken." });
    }

    // Generate Member ID (SS-XXXX)
    const nextNum = db.users.length + 1;
    const padNum = String(nextNum).padStart(4, "0");
    const memberId = `SS-${padNum}`;

    const newUser: User = {
      memberId,
      username,
      passwordHash: hashPassword(password),
      nickname,
      role: "Regular",
      division: "None",
      joinDate: new Date().toISOString().split("T")[0],
      status: "Active"
    };

    db.users.push(newUser);
    saveDb(db);

    res.json({
      success: true,
      user: {
        memberId: newUser.memberId,
        username: newUser.username,
        nickname: newUser.nickname,
        role: newUser.role,
        division: newUser.division,
        joinDate: newUser.joinDate,
        status: newUser.status
      }
    });
  });

  // LOGIN
  app.post("/api/auth/login", (req, res) => {
    const { username, password, clanPassword } = req.body;
    const db = loadDb();

    if (!username || !password || !clanPassword) {
      return res.status(400).json({ errorAr: "جميع الحقول مطلوبة للاتصال.", errorEn: "All fields are required to establish connection." });
    }

    // Check Clan Access Password
    if (clanPassword !== db.settings.clanPassword) {
      return res.status(401).json({ errorAr: "رمز دخول الكلان غير صحيح.", errorEn: "Incorrect Clan Access Password." });
    }

    // Check user credentials
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ errorAr: "فشل التحقق: اسم المستخدم أو كلمة المرور الشخصية غير صحيحة.", errorEn: "Verification failed: Incorrect username or personal password." });
    }

    if (user.status !== "Active") {
      return res.status(403).json({ errorAr: "تم تعليق هذا الحساب عسكرياً. تواصل مع الإدارة.", errorEn: "This account is military suspended. Contact administration." });
    }

    res.json({
      success: true,
      token: user.memberId, // Simulating session token with member ID
      user: {
        memberId: user.memberId,
        username: user.username,
        nickname: user.nickname,
        role: user.role,
        division: user.division,
        joinDate: user.joinDate,
        status: user.status
      }
    });
  });

  // GET AUTH ME
  app.get("/api/auth/me", (req, res) => {
    const db = loadDb();
    const user = getAuthedUser(req, db);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({
      user: {
        memberId: user.memberId,
        username: user.username,
        nickname: user.nickname,
        role: user.role,
        division: user.division,
        joinDate: user.joinDate,
        status: user.status
      }
    });
  });

  // GET MEMBERS
  app.get("/api/members", (req, res) => {
    const db = loadDb();
    const user = getAuthedUser(req, db);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    // Filter sensitive password data out
    const cleanMembers = db.users.map(u => ({
      memberId: u.memberId,
      username: u.username,
      nickname: u.nickname,
      role: u.role,
      division: u.division,
      joinDate: u.joinDate,
      status: u.status
    }));

    res.json({ members: cleanMembers });
  });

  // UPDATE MEMBER (Founder and Admin roles)
  app.post("/api/members/update", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    const { memberId, role, division, status, nickname } = req.body;
    const targetUser = db.users.find(u => u.memberId === memberId);

    if (!targetUser) {
      return res.status(404).json({ errorAr: "المعني بالأمر غير موجود.", errorEn: "Target member not found." });
    }

    // Auth constraints:
    // Only Founder can promote/demote to Founder/Admin or edit the Founder, or change settings
    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ errorAr: "ليس لديك الصلاحيات الكافية.", errorEn: "Insufficient tactical clearance." });
    }

    if (targetUser.role === "Founder" && authUser.role !== "Founder") {
      return res.status(403).json({ errorAr: "لا يمكن تعديل ملف القائد الأعلى.", errorEn: "Cannot alter Commander-in-Chief profile." });
    }

    // Admin limit check: Maximum 3 administrators allowed!
    if (role === "Administrator" && targetUser.role !== "Administrator") {
      const adminCount = db.users.filter(u => u.role === "Administrator").length;
      if (adminCount >= 3) {
        return res.status(400).json({
          errorAr: "فشل الترقية: لا يمكن تعيين أكثر من 3 مسؤولين عسكريين (إداريين).",
          errorEn: "Clearance Denied: Cannot appoint more than 3 tactical Administrators."
        });
      }
    }

    // SSF restrictions: Only Founder can appoint or change SSF members
    if ((division === "SSF" || targetUser.division === "SSF") && authUser.role !== "Founder") {
      return res.status(403).json({
        errorAr: "صلاحية مرفوضة: فقط القائد الأعلى (Founder) يمكنه التعيين في قوات الأمن الخاصة SSF.",
        errorEn: "Access Denied: Only Commander-in-Chief can appoint to Special Security Force (SSF)."
      });
    }

    // Administrators constraints
    if (authUser.role === "Administrator") {
      // Admin can accept/remove or move between divisions, but cannot promote to admin/founder
      if (role && role !== targetUser.role) {
        return res.status(403).json({ errorAr: "لا تملك الصلاحية لتغيير الرتب العسكرية.", errorEn: "Insufficient clearance to modify military ranks." });
      }
    }

    // Apply updates
    if (nickname !== undefined) targetUser.nickname = nickname;
    if (role !== undefined && authUser.role === "Founder") targetUser.role = role;
    if (division !== undefined) targetUser.division = division;
    if (status !== undefined) targetUser.status = status;

    saveDb(db);
    res.json({ success: true, member: targetUser });
  });

  // ADD MEMBER DIRECTLY BY FOUNDER/ADMIN
  app.post("/api/members/add", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ error: "No permission" });
    }

    const { username, nickname, password, division, role } = req.body;
    if (!username || !nickname || !password) {
      return res.status(400).json({ errorAr: "الحقول الأساسية مطلوبة.", errorEn: "Basic fields are required." });
    }

    const exists = db.users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      return res.status(400).json({ errorAr: "اسم المستخدم مستخدم بالفعل.", errorEn: "Username already exists." });
    }

    // Check Admin count limit
    if (role === "Administrator") {
      const adminCount = db.users.filter(u => u.role === "Administrator").length;
      if (adminCount >= 3) {
        return res.status(400).json({ errorAr: "الحد الأقصى للمسؤولين هو 3.", errorEn: "Maximum limit of 3 Administrators reached." });
      }
    }

    // Check SSF restriction
    if (division === "SSF" && authUser.role !== "Founder") {
      return res.status(403).json({ errorAr: "فقط القائد الأعلى يعين في SSF.", errorEn: "Only the Founder can appoint to SSF." });
    }

    const nextNum = db.users.length + 1;
    const padNum = String(nextNum).padStart(4, "0");
    const memberId = `SS-${padNum}`;

    const newMember: User = {
      memberId,
      username,
      passwordHash: hashPassword(password),
      nickname,
      role: role || "Regular",
      division: division || "None",
      joinDate: new Date().toISOString().split("T")[0],
      status: "Active"
    };

    db.users.push(newMember);
    saveDb(db);

    res.json({ success: true, member: newMember });
  });

  // REMOVE MEMBER
  app.post("/api/members/remove", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ error: "No clearance" });
    }

    const { memberId } = req.body;
    const targetIdx = db.users.findIndex(u => u.memberId === memberId);

    if (targetIdx === -1) {
      return res.status(404).json({ error: "Member not found" });
    }

    const targetUser = db.users[targetIdx];

    if (targetUser.role === "Founder") {
      return res.status(403).json({ errorAr: "لا يمكنك عزل القائد الأعلى.", errorEn: "You cannot discharge the Commander-in-Chief." });
    }

    if (authUser.role === "Administrator" && targetUser.role === "Administrator") {
      return res.status(403).json({ errorAr: "لا يمكن للمسؤولين عزل بعضهم البعض.", errorEn: "Administrators cannot discharge fellow Administrators." });
    }

    if (targetUser.division === "SSF" && authUser.role !== "Founder") {
      return res.status(403).json({ errorAr: "فقط القائد الأعلى يعزل من SSF.", errorEn: "Only the Founder can discharge SSF members." });
    }

    db.users.splice(targetIdx, 1);
    saveDb(db);

    res.json({ success: true });
  });

  // GET TOURNAMENTS
  app.get("/api/tournaments", (req, res) => {
    const db = loadDb();
    const user = getAuthedUser(req, db);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    res.json({ tournaments: db.tournaments });
  });

  // CREATE TOURNAMENT
  app.post("/api/tournaments/create", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ error: "No permission" });
    }

    const { titleAr, titleEn, descAr, descEn, status } = req.body;
    if (!titleAr || !titleEn) {
      return res.status(400).json({ error: "Titles required" });
    }

    const newT: Tournament = {
      id: "t-" + Date.now(),
      titleAr,
      titleEn,
      descAr: descAr || "",
      descEn: descEn || "",
      status: status || "Upcoming",
      requests: []
    };

    db.tournaments.push(newT);
    saveDb(db);
    res.json({ success: true, tournament: newT });
  });

  // EDIT TOURNAMENT
  app.post("/api/tournaments/update", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ error: "No permission" });
    }

    const { id, titleAr, titleEn, descAr, descEn, status } = req.body;
    const t = db.tournaments.find(x => x.id === id);
    if (!t) return res.status(404).json({ error: "Tournament not found" });

    if (titleAr) t.titleAr = titleAr;
    if (titleEn) t.titleEn = titleEn;
    if (descAr) t.descAr = descAr;
    if (descEn) t.descEn = descEn;
    if (status) t.status = status;

    saveDb(db);
    res.json({ success: true, tournament: t });
  });

  // DELETE TOURNAMENT
  app.post("/api/tournaments/delete", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ error: "No permission" });
    }

    const { id } = req.body;
    const idx = db.tournaments.findIndex(x => x.id === id);
    if (idx === -1) return res.status(404).json({ error: "Tournament not found" });

    db.tournaments.splice(idx, 1);
    saveDb(db);
    res.json({ success: true });
  });

  // REQUEST TO JOIN TOURNAMENT
  app.post("/api/tournaments/request", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    const { tournamentId } = req.body;
    const t = db.tournaments.find(x => x.id === tournamentId);
    if (!t) return res.status(404).json({ error: "Tournament not found" });

    // Check if request already exists
    const requestExists = t.requests.some(r => r.memberId === authUser.memberId);
    if (requestExists) {
      return res.status(400).json({
        errorAr: "تم إرسال طلب انضمام مسبقاً لهذه البطولة.",
        errorEn: "A participation request has already been sent."
      });
    }

    t.requests.push({
      memberId: authUser.memberId,
      nickname: authUser.nickname,
      status: "Pending",
      requestDate: new Date().toISOString()
    });

    saveDb(db);
    res.json({ success: true, tournament: t });
  });

  // APPROVE / REJECT REQUESTS
  app.post("/api/tournaments/request/handle", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ error: "No permission" });
    }

    const { tournamentId, memberId, status } = req.body; // status: 'Approved' | 'Rejected'
    const t = db.tournaments.find(x => x.id === tournamentId);
    if (!t) return res.status(404).json({ error: "Tournament not found" });

    const reqObj = t.requests.find(r => r.memberId === memberId);
    if (!reqObj) return res.status(404).json({ error: "Request not found" });

    reqObj.status = status;
    saveDb(db);
    res.json({ success: true, tournament: t });
  });

  // GET CLAN WAR
  app.get("/api/clanwar", (req, res) => {
    const db = loadDb();
    const user = getAuthedUser(req, db);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    res.json({ clanWar: db.clanWar });
  });

  // UPDATE CLAN WAR (Founder only)
  app.post("/api/clanwar/update", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder") {
      return res.status(403).json({ errorAr: "صلاحيات حصرية للقائد الأعلى.", errorEn: "Exclusive Founder permissions required." });
    }

    const { titleAr, titleEn, rulesAr, rulesEn, schedule, instructionsAr, instructionsEn, requiredPoints } = req.body;

    if (titleAr !== undefined) db.clanWar.titleAr = titleAr;
    if (titleEn !== undefined) db.clanWar.titleEn = titleEn;
    if (rulesAr !== undefined) db.clanWar.rulesAr = rulesAr;
    if (rulesEn !== undefined) db.clanWar.rulesEn = rulesEn;
    if (schedule !== undefined) db.clanWar.schedule = schedule;
    if (instructionsAr !== undefined) db.clanWar.instructionsAr = instructionsAr;
    if (instructionsEn !== undefined) db.clanWar.instructionsEn = instructionsEn;
    if (requiredPoints !== undefined) db.clanWar.requiredPoints = Number(requiredPoints);

    saveDb(db);
    res.json({ success: true, clanWar: db.clanWar });
  });

  // GET ACTIVITIES
  app.get("/api/activities", (req, res) => {
    const db = loadDb();
    const user = getAuthedUser(req, db);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    res.json({ activities: db.activities });
  });

  // CREATE ACTIVITY (Founder / Admin)
  app.post("/api/activities/create", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ error: "No permission" });
    }

    const { type, titleAr, titleEn, descAr, descEn, date } = req.body;
    if (!type || !titleAr || !titleEn) {
      return res.status(400).json({ error: "All basic fields required" });
    }

    const newA: Activity = {
      id: "act-" + Date.now(),
      type,
      titleAr,
      titleEn,
      descAr: descAr || "",
      descEn: descEn || "",
      date: date || new Date().toISOString()
    };

    db.activities.push(newA);
    saveDb(db);
    res.json({ success: true, activity: newA });
  });

  // DELETE ACTIVITY
  app.post("/api/activities/delete", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ error: "No permission" });
    }

    const { id } = req.body;
    const idx = db.activities.findIndex(x => x.id === id);
    if (idx === -1) return res.status(404).json({ error: "Activity not found" });

    db.activities.splice(idx, 1);
    saveDb(db);
    res.json({ success: true });
  });

  // GET RULES
  app.get("/api/rules", (req, res) => {
    const db = loadDb();
    const user = getAuthedUser(req, db);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    res.json({ rules: db.rules });
  });

  // UPDATE RULES (Founder only)
  app.post("/api/rules/update", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder") {
      return res.status(403).json({ error: "Founder only" });
    }

    const { id, titleAr, titleEn, contentAr, contentEn } = req.body; // contents must be arrays of strings
    const rCategory = db.rules.find(r => r.id === id);
    if (!rCategory) return res.status(404).json({ error: "Rule category not found" });

    if (titleAr !== undefined) rCategory.titleAr = titleAr;
    if (titleEn !== undefined) rCategory.titleEn = titleEn;
    if (contentAr !== undefined) rCategory.contentAr = contentAr;
    if (contentEn !== undefined) rCategory.contentEn = contentEn;

    saveDb(db);
    res.json({ success: true, ruleCategory: rCategory });
  });

  // GET REPORTS
  app.get("/api/reports", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    // Only Founder and Administrators can view reports
    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ errorAr: "صلاحية مرفوضة لعرض التقارير والشكاوى.", errorEn: "Clearance denied to inspect military files." });
    }

    res.json({ reports: db.reports });
  });

  // SUBMIT REPORT (Any member)
  app.post("/api/reports/submit", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    const { title, description, screenshot } = req.body;
    if (!title || !description) {
      return res.status(400).json({ errorAr: "موضوع الشكوى والوصف مطلوبان.", errorEn: "Title and description are required." });
    }

    const newReport: Report = {
      id: "rep-" + Date.now(),
      title,
      description,
      screenshot, // Optional Base64
      reporterId: authUser.memberId,
      reporterNickname: authUser.nickname,
      status: "Pending",
      submittedAt: new Date().toISOString()
    };

    db.reports.push(newReport);

    // Create an instant alert/notification for Administrators & Founder
    const repNotice: Notification = {
      id: "n-rep-" + Date.now(),
      titleAr: `🚨 تقرير أمني جديد من ${authUser.nickname}`,
      titleEn: `🚨 New Security Report from ${authUser.nickname}`,
      contentAr: `العنوان: ${title}\nالتفاصيل: ${description.slice(0, 50)}...`,
      contentEn: `Title: ${title}\nDetails: ${description.slice(0, 50)}...`,
      senderNickname: "SYSTEM_SEC",
      createdAt: new Date().toISOString(),
      isReadBy: []
    };
    db.notifications.push(repNotice);

    saveDb(db);
    res.json({ success: true, report: newReport });
  });

  // RESOLVE REPORT (Founder and Administrators)
  app.post("/api/reports/resolve", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ error: "No permission" });
    }

    const { id } = req.body;
    const r = db.reports.find(x => x.id === id);
    if (!r) return res.status(404).json({ error: "Report not found" });

    r.status = "Resolved";
    saveDb(db);
    res.json({ success: true, report: r });
  });

  // GET NOTIFICATIONS & UNREAD COUNT
  app.get("/api/notifications", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    const totalNotifications = db.notifications;
    const unreadCount = totalNotifications.filter(n => !n.isReadBy.includes(authUser.memberId)).length;

    res.json({
      notifications: totalNotifications,
      unreadCount
    });
  });

  // MARK NOTIFICATIONS AS READ
  app.post("/api/notifications/read", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.body; // If id provided, read one, else read all
    if (id) {
      const n = db.notifications.find(x => x.id === id);
      if (n && !n.isReadBy.includes(authUser.memberId)) {
        n.isReadBy.push(authUser.memberId);
      }
    } else {
      db.notifications.forEach(n => {
        if (!n.isReadBy.includes(authUser.memberId)) {
          n.isReadBy.push(authUser.memberId);
        }
      });
    }

    saveDb(db);
    res.json({ success: true });
  });

  // SEND ANNOUNCEMENT (Founder and Admin)
  app.post("/api/notifications/send", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder" && authUser.role !== "Administrator") {
      return res.status(403).json({ error: "No permission" });
    }

    const { titleAr, titleEn, contentAr, contentEn } = req.body;
    if (!titleAr || !titleEn || !contentAr || !contentEn) {
      return res.status(400).json({ error: "All translation fields required" });
    }

    const newNotice: Notification = {
      id: "n-" + Date.now(),
      titleAr,
      titleEn,
      contentAr,
      contentEn,
      senderNickname: authUser.nickname,
      createdAt: new Date().toISOString(),
      isReadBy: []
    };

    db.notifications.unshift(newNotice); // Prepend to show latest first
    saveDb(db);
    res.json({ success: true, notification: newNotice });
  });

  // GET SETTINGS (Founder only)
  app.get("/api/settings", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder") {
      return res.status(403).json({ error: "Founder only clearance level." });
    }

    res.json({ settings: db.settings });
  });

  // UPDATE SETTINGS (Founder only)
  app.post("/api/settings/update", (req, res) => {
    const db = loadDb();
    const authUser = getAuthedUser(req, db);
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    if (authUser.role !== "Founder") {
      return res.status(403).json({ error: "Founder only clearance level." });
    }

    const { clanPassword, allowPublicRegistration } = req.body;

    if (clanPassword !== undefined) {
      if (clanPassword.trim() === "") {
        return res.status(400).json({ errorAr: "كلمة مرور الكلان لا يمكن أن تكون فارغة.", errorEn: "Clan password cannot be blank." });
      }
      db.settings.clanPassword = clanPassword.trim();
    }

    if (allowPublicRegistration !== undefined) {
      db.settings.allowPublicRegistration = !!allowPublicRegistration;
    }

    saveDb(db);
    res.json({ success: true, settings: db.settings });
  });

  // ══════════════════════ STATIC ASSETS & VITE SERVING ══════════════════════

  // Vite middleware integration for dev, static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Command Center live on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Suicide Squad Command Center backend:", err);
});
