import React, { useState, useEffect } from "react";
import { 
  Shield, Users, Flame, FileText, Calendar, Bell, Settings, 
  LogOut, AlertTriangle, Globe, Lock, User, Plus, Check, X, 
  Info, Upload, Activity as ActivityIcon, Award, Eye, UserPlus, 
  RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, Sliders, Menu
} from "lucide-react";
import { translations, User as MemberType, Tournament, ClanWar, Activity, RuleCategory, Report, Notification, ClanSettings } from "./types";

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [token, setToken] = useState<string | null>(localStorage.getItem("ss_token"));
  const [user, setUser] = useState<MemberType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Authentication State
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginClanPassword, setLoginClanPassword] = useState("");
  const [regNickname, setRegNickname] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Tabs & Navigation State
  const [activeTab, setActiveTab] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Database States
  const [members, setMembers] = useState<MemberType[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [clanWar, setClanWar] = useState<ClanWar | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [rules, setRules] = useState<RuleCategory[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [clanSettings, setClanSettings] = useState<ClanSettings | null>(null);

  // UI interaction states
  const [selectedDivision, setSelectedDivision] = useState<"SCV" | "TAC" | "VFX" | "RDF">("SCV");
  const [reportTitle, setReportTitle] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportScreenshot, setReportScreenshot] = useState("");
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState("");

  // Settings Management States (Founder only)
  const [editClanPassword, setEditClanPassword] = useState("");
  const [allowPublicReg, setAllowPublicReg] = useState(true);
  const [newNoticeTitleAr, setNewNoticeTitleAr] = useState("");
  const [newNoticeTitleEn, setNewNoticeTitleEn] = useState("");
  const [newNoticeContentAr, setNewNoticeContentAr] = useState("");
  const [newNoticeContentEn, setNewNoticeContentEn] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // Member management states (Founder & Admin)
  const [newMemUser, setNewMemUser] = useState("");
  const [newMemNick, setNewMemNick] = useState("");
  const [newMemPass, setNewMemPass] = useState("");
  const [newMemRole, setNewMemRole] = useState<"Founder" | "Administrator" | "Regular">("Regular");
  const [newMemDiv, setNewMemDiv] = useState<any>("None");
  const [manageError, setManageError] = useState("");
  const [manageSuccess, setManageSuccess] = useState("");

  // Tournament Management States
  const [newTTitleAr, setNewTTitleAr] = useState("");
  const [newTTitleEn, setNewTTitleEn] = useState("");
  const [newTDescAr, setNewTDescAr] = useState("");
  const [newTDescEn, setNewTDescEn] = useState("");
  const [newTStatus, setNewTStatus] = useState<"Active" | "Completed" | "Upcoming">("Upcoming");

  // Clan War Management States (Founder only)
  const [warTitleAr, setWarTitleAr] = useState("");
  const [warTitleEn, setWarTitleEn] = useState("");
  const [warRulesAr, setWarRulesAr] = useState("");
  const [warRulesEn, setWarRulesEn] = useState("");
  const [warSchedule, setWarSchedule] = useState("");
  const [warInstructionsAr, setWarInstructionsAr] = useState("");
  const [warInstructionsEn, setWarInstructionsEn] = useState("");
  const [warPoints, setWarPoints] = useState(0);

  // Activity Management States
  const [actType, setActType] = useState<any>("Training");
  const [actTitleAr, setActTitleAr] = useState("");
  const [actTitleEn, setActTitleEn] = useState("");
  const [actDescAr, setActDescAr] = useState("");
  const [actDescEn, setActDescEn] = useState("");
  const [actDate, setActDate] = useState("");

  // Notification Modal state
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const t = translations[lang];

  // Helper fetch header with auth token
  const getHeaders = () => {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  // Check login state on mount
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Sync data when authenticated user changes
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        handleLogout();
      }
    } catch (e) {
      console.error(e);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const headers = getHeaders();
      
      // Fetch concurrently
      const [membersRes, toursRes, warRes, actRes, rulesRes, notRes] = await Promise.all([
        fetch("/api/members", { headers }),
        fetch("/api/tournaments", { headers }),
        fetch("/api/clanwar", { headers }),
        fetch("/api/activities", { headers }),
        fetch("/api/rules", { headers }),
        fetch("/api/notifications", { headers })
      ]);

      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members);
      }
      if (toursRes.ok) {
        const data = await toursRes.json();
        setTournaments(data.tournaments);
      }
      if (warRes.ok) {
        const data = await warRes.json();
        setClanWar(data.clanWar);
        // Pre-fill clan war edit fields for Founder
        if (data.clanWar) {
          setWarTitleAr(data.clanWar.titleAr);
          setWarTitleEn(data.clanWar.titleEn);
          setWarRulesAr(data.clanWar.rulesAr);
          setWarRulesEn(data.clanWar.rulesEn);
          setWarSchedule(data.clanWar.schedule);
          setWarInstructionsAr(data.clanWar.instructionsAr);
          setWarInstructionsEn(data.clanWar.instructionsEn);
          setWarPoints(data.clanWar.requiredPoints);
        }
      }
      if (actRes.ok) {
        const data = await actRes.json();
        setActivities(data.activities);
      }
      if (rulesRes.ok) {
        const data = await rulesRes.json();
        setRules(data.rules);
      }
      if (notRes.ok) {
        const data = await notRes.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }

      // Fetch Founder specific configs
      if (user?.role === "Founder") {
        const settingsRes = await fetch("/api/settings", { headers });
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setClanSettings(data.settings);
          setEditClanPassword(data.settings.clanPassword);
          setAllowPublicReg(data.settings.allowPublicRegistration);
        }
      }

      // Fetch Admin & Founder specific configs (reports)
      if (user?.role === "Founder" || user?.role === "Administrator") {
        const reportsRes = await fetch("/api/reports", { headers });
        if (reportsRes.ok) {
          const data = await reportsRes.json();
          setReports(data.reports);
        }
      }

    } catch (e) {
      console.error("Failed fetching command center tactical data", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!loginUsername || !loginPassword || !loginClanPassword) {
      setAuthError(lang === "ar" ? "يرجى ملء جميع الخانات للاتصال." : "Please fill out all terminal credentials.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
          clanPassword: loginClanPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(lang === "ar" ? data.errorAr || data.errorEn : data.errorEn || data.errorAr);
      } else {
        setAuthSuccess(t.loginSuccess);
        localStorage.setItem("ss_token", data.token);
        // Immediately clear password states from memory
        setLoginPassword("");
        setLoginClanPassword("");
        // Wait briefly for immersive effect
        setTimeout(() => {
          setToken(data.token);
          setUser(data.user);
        }, 1200);
      }
    } catch (err) {
      setAuthError(lang === "ar" ? "فشل الاتصال بالخادم الرئيسي." : "Critical connection error with military server.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!loginUsername || !loginPassword || !regNickname || !loginClanPassword) {
      setAuthError(lang === "ar" ? "يرجى ملء جميع حقول التجنيد." : "Please fill out all enlistment fields.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
          nickname: regNickname,
          clanPassword: loginClanPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(lang === "ar" ? data.errorAr || data.errorEn : data.errorEn || data.errorAr);
      } else {
        setAuthSuccess(t.registerSuccess);
        // Immediately clear password states from memory
        setLoginPassword("");
        setLoginClanPassword("");
        setTimeout(() => {
          setIsRegister(false);
        }, 1500);
      }
    } catch (err) {
      setAuthError(lang === "ar" ? "فشل إرسال الهوية للخادم." : "Critical error submitting soldier credentials.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ss_token");
    setToken(null);
    setUser(null);
    setActiveTab("home");
    setMobileMenuOpen(false);
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: getHeaders()
      });
      setUnreadCount(0);
      // local update
      setNotifications(prev => prev.map(n => ({ ...n, isReadBy: [...n.isReadBy, user!.memberId] })));
    } catch (e) {
      console.error(e);
    }
  };

  // Submit report (Any member)
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportError("");
    setReportSuccess("");

    if (!reportTitle || !reportDesc) {
      setReportError(lang === "ar" ? "الموضوع والوصف ضروريان." : "Title and Description are mandatory.");
      return;
    }

    try {
      const res = await fetch("/api/reports/submit", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          title: reportTitle,
          description: reportDesc,
          screenshot: reportScreenshot
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setReportError(lang === "ar" ? data.errorAr || data.errorEn : data.errorEn || data.errorAr);
      } else {
        setReportSuccess(lang === "ar" ? "تم إرسال بلاغك الأمني بنجاح. سيقوم الإداريون بالمراجعة." : "Dispatch sent. Intelligence officers notified.");
        setReportTitle("");
        setReportDesc("");
        setReportScreenshot("");
        fetchAllData();
      }
    } catch (err) {
      setReportError("Error dispatching report.");
    }
  };

  // Screenshot base64 uploader helper
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin/Founder Member Action Helpers
  const updateMember = async (memberId: string, payload: any) => {
    setManageError("");
    setManageSuccess("");
    try {
      const res = await fetch("/api/members/update", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ memberId, ...payload })
      });
      const data = await res.json();
      if (!res.ok) {
        setManageError(lang === "ar" ? data.errorAr || data.errorEn : data.errorEn || data.errorAr);
      } else {
        setManageSuccess(lang === "ar" ? "تم تحديث الملف العسكري بنجاح." : "Tactical soldier profile updated.");
        fetchAllData();
      }
    } catch (e) {
      setManageError("Network error modifying profile.");
    }
  };

  const removeMember = async (memberId: string) => {
    if (!window.confirm(lang === "ar" ? "هل أنت متأكد من تسريح هذا الفرد نهائياً؟" : "Confirm dishonorable discharge?")) return;
    setManageError("");
    setManageSuccess("");
    try {
      const res = await fetch("/api/members/remove", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ memberId })
      });
      const data = await res.json();
      if (!res.ok) {
        setManageError(lang === "ar" ? data.errorAr || data.errorEn : data.errorEn || data.errorAr);
      } else {
        setManageSuccess(lang === "ar" ? "تم تسريح الفرد عسكرياً." : "Personnel discharged successfully.");
        fetchAllData();
      }
    } catch (e) {
      setManageError("Error discharging member.");
    }
  };

  const handleAddNewMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setManageError("");
    setManageSuccess("");

    if (!newMemUser || !newMemNick || !newMemPass) {
      setManageError(lang === "ar" ? "يرجى ملء كافة الخانات المطلوبة للتجنيد." : "Fill in all mandatory fields.");
      return;
    }

    try {
      const res = await fetch("/api/members/add", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          username: newMemUser,
          nickname: newMemNick,
          password: newMemPass,
          role: newMemRole,
          division: newMemDiv
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setManageError(lang === "ar" ? data.errorAr || data.errorEn : data.errorEn || data.errorAr);
      } else {
        setManageSuccess(lang === "ar" ? `تم تجنيد الفرد بنجاح برقم: ${data.member.memberId}` : `Soldier successfully enlisted with ID: ${data.member.memberId}`);
        setNewMemUser("");
        setNewMemNick("");
        setNewMemPass("");
        setNewMemRole("Regular");
        setNewMemDiv("None");
        fetchAllData();
      }
    } catch (err) {
      setManageError("Error enlisting new soldier.");
    }
  };

  // Submit / Edit / Manage Tournaments (Operations)
  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTTitleAr || !newTTitleEn) {
      alert("Arabic and English titles are required.");
      return;
    }
    try {
      const res = await fetch("/api/tournaments/create", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          titleAr: newTTitleAr,
          titleEn: newTTitleEn,
          descAr: newTDescAr,
          descEn: newTDescEn,
          status: newTStatus
        })
      });
      if (res.ok) {
        setNewTTitleAr("");
        setNewTTitleEn("");
        setNewTDescAr("");
        setNewTDescEn("");
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinTournament = async (tId: string) => {
    try {
      const res = await fetch("/api/tournaments/request", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ tournamentId: tId })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(lang === "ar" ? data.errorAr || data.errorEn : data.errorEn || data.errorAr);
      } else {
        alert(t.joinRequestSent);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTournamentRequest = async (tId: string, memberId: string, status: "Approved" | "Rejected") => {
    try {
      const res = await fetch("/api/tournaments/request/handle", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ tournamentId: tId, memberId, status })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTournament = async (id: string) => {
    if (!window.confirm("Delete tournament?")) return;
    try {
      const res = await fetch("/api/tournaments/delete", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // Submit / Save Clan War Details
  const handleSaveClanWar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/clanwar/update", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          titleAr: warTitleAr,
          titleEn: warTitleEn,
          rulesAr: warRulesAr,
          rulesEn: warRulesEn,
          schedule: warSchedule,
          instructionsAr: warInstructionsAr,
          instructionsEn: warInstructionsEn,
          requiredPoints: warPoints
        })
      });
      if (res.ok) {
        setSettingsSuccess(lang === "ar" ? "تم تحديث خطط حرب الكلان بنجاح." : "Clan war blueprints authorized and saved.");
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Activities (Drills) Create & Delete
  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitleAr || !actTitleEn) {
      alert("Titles are mandatory.");
      return;
    }
    try {
      const res = await fetch("/api/activities/create", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          type: actType,
          titleAr: actTitleAr,
          titleEn: actTitleEn,
          descAr: actDescAr,
          descEn: actDescEn,
          date: actDate
        })
      });
      if (res.ok) {
        setActTitleAr("");
        setActTitleEn("");
        setActDescAr("");
        setActDescEn("");
        setActDate("");
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!window.confirm("Dismantle activity?")) return;
    try {
      const res = await fetch("/api/activities/delete", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // Update sovereign Rules (Founder only)
  const handleUpdateRulesCategory = async (id: string, updatedAr: string[], updatedEn: string[]) => {
    try {
      const res = await fetch("/api/rules/update", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          id,
          contentAr: updatedAr,
          contentEn: updatedEn
        })
      });
      if (res.ok) {
        alert(lang === "ar" ? "تم تحديث الدستور العسكري بنجاح." : "Military code updated.");
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sovereign Clan Settings save
  const handleSaveSovereignSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess("");

    try {
      const res = await fetch("/api/settings/update", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          clanPassword: editClanPassword,
          allowPublicRegistration: allowPublicReg
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setSettingsError(lang === "ar" ? data.errorAr || data.errorEn : data.errorEn || data.errorAr);
      } else {
        setSettingsSuccess(lang === "ar" ? "تم تشفير وحفظ الإعدادات السيادية بنجاح." : "Sovereign tactical parameters deployed.");
        fetchAllData();
      }
    } catch (e) {
      setSettingsError("Failed saving settings.");
    }
  };

  // Send Direct High Priority Command Dispatch (Announcement)
  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess("");

    if (!newNoticeTitleAr || !newNoticeTitleEn || !newNoticeContentAr || !newNoticeContentEn) {
      setSettingsError(t.requiredFields);
      return;
    }

    try {
      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          titleAr: newNoticeTitleAr,
          titleEn: newNoticeTitleEn,
          contentAr: newNoticeContentAr,
          contentEn: newNoticeContentEn
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setSettingsError(lang === "ar" ? data.errorAr || data.errorEn : data.errorEn || data.errorAr);
      } else {
        setSettingsSuccess(lang === "ar" ? "تم بث البرقية العسكرية بنجاح للأفراد." : "Command dispatch broadcasted successfully.");
        setNewNoticeTitleAr("");
        setNewNoticeTitleEn("");
        setNewNoticeContentAr("");
        setNewNoticeContentEn("");
        fetchAllData();
      }
    } catch (e) {
      setSettingsError("Broadcasting error.");
    }
  };

  const handleResolveReport = async (id: string) => {
    try {
      const res = await fetch("/api/reports/resolve", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-orange-500 font-mono flex flex-col items-center justify-center p-4">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-orange-950 border-t-orange-500 animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-2 border-orange-500 opacity-20 animate-pulse"></div>
        </div>
        <p className="text-sm tracking-widest animate-pulse">SYS_SECURE_LINK: DECRYPTING SATELLITE INTERFACE...</p>
        <p className="text-xs text-stone-600 mt-2">SUICIDE SQUAD COMMAND CENTER</p>
      </div>
    );
  }

  // ══════════════════════ UNAUTHORIZED / LOGIN SCREEN ══════════════════════
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-black text-stone-200 font-sans flex flex-col justify-between p-4 relative overflow-hidden tactical-grid" dir={lang === "ar" ? "rtl" : "ltr"}>
        
        {/* Language selector & tactical details */}
        <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 border-b border-stone-900 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
            <span className="text-xs font-mono tracking-widest text-stone-500 uppercase">
              {lang === "ar" ? "خادم تكتيكي آمن 104-D" : "Tactical Secure Server 104-D"}
            </span>
          </div>
          <button 
            id="lang-toggle-btn"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-md border border-stone-800 bg-stone-950/80 hover:border-orange-500 text-stone-300 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-orange-500" />
            <span>{lang === "ar" ? "English" : "العربية"}</span>
          </button>
        </header>

        {/* Auth Command Box */}
        <main className="w-full max-w-md mx-auto my-12 bg-stone-950/90 border border-stone-800 p-6 sm:p-8 rounded-lg relative shadow-2xl z-10">
          
          {/* Futuristic corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500 -mt-1 -ml-1"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500 -mt-1 -mr-1"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500 -mb-1 -ml-1"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500 -mb-1 -mr-1"></div>

          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-red-950/40 border border-red-700/50 rounded-full text-red-500 mb-3 animate-pulse">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-widest font-mono text-stone-100 uppercase">
              {t.title}
            </h1>
            <p className="text-xs text-orange-500 font-mono mt-1 tracking-wider uppercase">
              {t.commanderTitle}
            </p>
          </div>

          {authError && (
            <div className="p-3 mb-6 bg-red-950/50 border-l-4 border-red-600 text-red-400 text-xs font-mono rounded flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3 mb-6 bg-green-950/50 border-l-4 border-green-600 text-green-400 text-xs font-mono rounded flex items-start gap-2.5 animate-bounce">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Registration is locked by Settings but default/owner is possible */}
          {!isRegister ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase tracking-wider">
                  {t.username}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500 pointer-events-none">
                    <User className="w-4 h-4 text-orange-500" />
                  </span>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-black/80 border border-stone-800 rounded px-3 py-2.5 pl-10 text-stone-100 placeholder-stone-700 focus:outline-none focus:border-orange-500 font-mono text-sm transition-all"
                    placeholder="e.g. founder"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase tracking-wider">
                  {t.password}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500 pointer-events-none">
                    <Lock className="w-4 h-4 text-orange-500" />
                  </span>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-black/80 border border-stone-800 rounded px-3 py-2.5 pl-10 text-stone-100 focus:outline-none focus:border-orange-500 font-mono text-sm transition-all"
                  />
                </div>
                <p className="text-[10px] text-stone-500 mt-1">{t.personalPassHelp}</p>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase tracking-wider">
                  {t.clanPassword}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500 pointer-events-none">
                    <Shield className="w-4 h-4 text-red-500" />
                  </span>
                  <input
                    type="password"
                    required
                    value={loginClanPassword}
                    onChange={(e) => setLoginClanPassword(e.target.value)}
                    placeholder={lang === "ar" ? "أدخل رمز دخول الكلان" : "Enter Clan Access Password"}
                    autoComplete="new-password"
                    className="w-full bg-black/80 border border-stone-800 rounded px-3 py-2.5 pl-10 text-stone-100 focus:outline-none focus:border-orange-500 font-mono text-sm tracking-widest transition-all"
                  />
                </div>
                <p className="text-[10px] text-stone-500 mt-1">{t.clanPassHelp}</p>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                className="w-full mt-6 bg-gradient-to-r from-red-950 to-orange-700/80 hover:from-red-900 hover:to-orange-600 text-stone-100 font-mono py-3 px-4 rounded text-sm tracking-widest font-semibold hover:text-white transition-all duration-300 shadow-lg shadow-orange-950/20 active:scale-[0.98] cursor-pointer border border-orange-500/30"
              >
                {t.login}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  id="toggle-register-btn"
                  onClick={() => {
                    setIsRegister(true);
                    setAuthError("");
                    setAuthSuccess("");
                  }}
                  className="text-xs text-orange-500 hover:underline font-mono uppercase tracking-wider"
                >
                  {t.register}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase tracking-wider">
                  {t.username}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500 pointer-events-none">
                    <User className="w-4 h-4 text-orange-500" />
                  </span>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-black/80 border border-stone-800 rounded px-3 py-2.5 pl-10 text-stone-100 focus:outline-none focus:border-orange-500 font-mono text-sm transition-all"
                    placeholder="e.g. noufel_combat"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase tracking-wider">
                  {t.nickname}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500 pointer-events-none">
                    <Award className="w-4 h-4 text-orange-500" />
                  </span>
                  <input
                    type="text"
                    required
                    value={regNickname}
                    onChange={(e) => setRegNickname(e.target.value)}
                    className="w-full bg-black/80 border border-stone-800 rounded px-3 py-2.5 pl-10 text-stone-100 focus:outline-none focus:border-orange-500 font-mono text-sm transition-all"
                    placeholder="e.g. SS_NOUFEL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase tracking-wider">
                  {t.password}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500 pointer-events-none">
                    <Lock className="w-4 h-4 text-orange-500" />
                  </span>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-black/80 border border-stone-800 rounded px-3 py-2.5 pl-10 text-stone-100 focus:outline-none focus:border-orange-500 font-mono text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase tracking-wider">
                  {t.clanPassword}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500 pointer-events-none">
                    <Shield className="w-4 h-4 text-red-500" />
                  </span>
                  <input
                    type="password"
                    required
                    value={loginClanPassword}
                    onChange={(e) => setLoginClanPassword(e.target.value)}
                    placeholder={lang === "ar" ? "أدخل رمز دخول الكلان" : "Enter Clan Access Password"}
                    autoComplete="new-password"
                    className="w-full bg-black/80 border border-stone-800 rounded px-3 py-2.5 pl-10 text-stone-100 focus:outline-none focus:border-orange-500 font-mono text-sm tracking-widest transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="register-submit-btn"
                className="w-full mt-6 bg-gradient-to-r from-stone-900 to-orange-950/80 hover:from-stone-850 hover:to-orange-900 text-stone-100 font-mono py-3 px-4 rounded text-sm tracking-widest font-semibold hover:text-white transition-all duration-300 shadow-lg cursor-pointer border border-orange-500/20"
              >
                {t.backToService}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  id="toggle-login-btn"
                  onClick={() => {
                    setIsRegister(false);
                    setAuthError("");
                    setAuthSuccess("");
                  }}
                  className="text-xs text-orange-500 hover:underline font-mono uppercase tracking-wider"
                >
                  {t.login}
                </button>
              </div>
            </form>
          )}
        </main>

        <footer className="w-full text-center py-6 border-t border-stone-900 z-10">
          <p className="text-[10px] font-mono text-stone-600 tracking-widest uppercase">
            &copy; 2026 Suicide Squad Command Center - {t.tagline}
          </p>
        </footer>
      </div>
    );
  }

  // ══════════════════════ AUTHORIZED FULL-STACK DASHBOARD ══════════════════════
  const activeRoleBadge = () => {
    switch(user.role) {
      case "Founder": return <span className="bg-red-950 text-red-400 text-[10px] border border-red-700/50 px-2 py-0.5 rounded font-mono tracking-widest">FOUNDER - COB</span>;
      case "Administrator": return <span className="bg-orange-950 text-orange-400 text-[10px] border border-orange-700/50 px-2 py-0.5 rounded font-mono tracking-widest">TAC_ADMIN</span>;
      default: return <span className="bg-stone-900 text-stone-400 text-[10px] border border-stone-800 px-2 py-0.5 rounded font-mono tracking-widest">COMBATANT</span>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-stone-200 font-sans flex flex-col justify-between tactical-grid" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* COMMAND CENTER TOP BAR */}
      <header className="border-b border-stone-850 bg-stone-950/90 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button 
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-stone-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600 animate-pulse" />
              <div>
                <h1 className="text-sm font-bold tracking-widest font-mono text-stone-100 uppercase flex items-center gap-1.5">
                  {t.title}
                  <span className="hidden sm:inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                </h1>
                <p className="text-[10px] text-orange-500 font-mono tracking-wider uppercase hidden sm:block">
                  {t.commanderTitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Tactical role badge */}
            <div className="hidden md:flex items-center gap-2 border-r border-stone-850 pr-3 mr-1">
              <span className="text-stone-500 text-xs font-mono">{user.nickname}</span>
              {activeRoleBadge()}
            </div>

            {/* Notification alert / bell with count */}
            <div className="relative">
              <button 
                id="notification-bell-btn"
                onClick={() => setShowNotificationCenter(!showNotificationCenter)}
                className="p-2 border border-stone-800 rounded bg-stone-900/60 hover:bg-stone-800 hover:border-orange-500 text-stone-300 relative transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-mono w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Secure Dispatch notification dropdown center */}
              {showNotificationCenter && (
                <div className={`absolute ${lang === "ar" ? "left-0" : "right-0"} mt-2 w-80 sm:w-96 bg-stone-950 border border-stone-850 rounded-lg shadow-2xl p-4 z-50 text-xs font-mono max-h-[500px] overflow-y-auto`}>
                  <div className="flex items-center justify-between border-b border-stone-850 pb-2 mb-3">
                    <span className="text-stone-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-red-500" />
                      {t.notifications}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={markAllNotificationsRead} 
                        className="text-[10px] text-orange-500 hover:underline cursor-pointer"
                      >
                        {lang === "ar" ? "مقروء الكل" : "Read All"}
                      </button>
                      <button 
                        onClick={() => setShowNotificationCenter(false)} 
                        className="p-1 hover:bg-stone-800 rounded text-stone-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {notifications.length === 0 ? (
                      <p className="text-stone-600 text-center py-4">{t.noNotifications}</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-2.5 border rounded ${n.isReadBy.includes(user.memberId) ? "bg-stone-950 border-stone-900 text-stone-400" : "bg-stone-900 border-orange-500/20 text-stone-200"}`}>
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-semibold text-[11px] block text-stone-200">
                              {lang === "ar" ? n.titleAr : n.titleEn}
                            </span>
                            <span className="text-[9px] text-stone-500 font-normal shrink-0">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-400 mt-1.5 whitespace-pre-line leading-relaxed">
                            {lang === "ar" ? n.contentAr : n.contentEn}
                          </p>
                          <div className="text-[9px] text-stone-500 mt-2 flex justify-between">
                            <span>BY: {n.senderNickname}</span>
                            {!n.isReadBy.includes(user.memberId) && (
                              <span className="text-orange-500 font-bold uppercase">● NEW</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language toggle */}
            <button 
              id="dashboard-lang-toggle"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded border border-stone-800 bg-stone-900/60 hover:border-orange-500 text-stone-300 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Logout button */}
            <button 
              id="logout-btn"
              onClick={handleLogout}
              className="p-2 border border-stone-800 rounded bg-stone-900/60 hover:bg-red-950/40 hover:border-red-600 text-stone-400 hover:text-red-400 transition-all cursor-pointer"
              title={t.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* SIDE NAVIGATION PANEL */}
        <aside className={`lg:w-64 shrink-0 lg:block ${mobileMenuOpen ? "block" : "hidden"} bg-stone-950/80 border border-stone-850 rounded-lg p-4 h-fit`}>
          <div className="mb-4 pb-4 border-b border-stone-850">
            <p className="text-[10px] text-stone-500 tracking-widest font-mono uppercase mb-2">
              {lang === "ar" ? "الأركان والمحاور" : "Command Deck Directory"}
            </p>
            <div className="p-2.5 bg-black rounded border border-stone-900">
              <p className="text-xs text-stone-400 font-mono">ID: {user.memberId}</p>
              <p className="text-[10px] text-orange-500 font-mono mt-0.5">NICK: {user.nickname}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === "home" ? "bg-red-950/40 border-r-4 border-orange-500 text-stone-100 font-semibold" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"}`}
            >
              <Sliders className="w-4 h-4 text-orange-500" />
              <span>{t.dashboard}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("members"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === "members" ? "bg-red-950/40 border-r-4 border-orange-500 text-stone-100 font-semibold" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"}`}
            >
              <Users className="w-4 h-4 text-orange-500" />
              <span>{t.members}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("divisions"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === "divisions" ? "bg-red-950/40 border-r-4 border-orange-500 text-stone-100 font-semibold" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"}`}
            >
              <Shield className="w-4 h-4 text-orange-500" />
              <span>{t.divisions}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("ssf"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === "ssf" ? "bg-red-950/40 border-r-4 border-orange-500 text-stone-100 font-semibold" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"}`}
            >
              <Award className="w-4 h-4 text-orange-500" />
              <span>{t.ssfDivision}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("rules"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === "rules" ? "bg-red-950/40 border-r-4 border-orange-500 text-stone-100 font-semibold" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"}`}
            >
              <FileText className="w-4 h-4 text-orange-500" />
              <span>{t.rules}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("tournaments"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === "tournaments" ? "bg-red-950/40 border-r-4 border-orange-500 text-stone-100 font-semibold" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"}`}
            >
              <ActivityIcon className="w-4 h-4 text-orange-500" />
              <span>{t.tournaments}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("clanwar"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === "clanwar" ? "bg-red-950/40 border-r-4 border-orange-500 text-stone-100 font-semibold" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"}`}
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{t.clanWar}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("activities"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === "activities" ? "bg-red-950/40 border-r-4 border-orange-500 text-stone-100 font-semibold" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"}`}
            >
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>{t.activities}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("reports"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === "reports" ? "bg-red-950/40 border-r-4 border-orange-500 text-stone-100 font-semibold" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"}`}
            >
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span>{t.reports}</span>
            </button>

            {user.role === "Founder" && (
              <button 
                onClick={() => { setActiveTab("settings"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded transition-all cursor-pointer ${activeTab === "settings" ? "bg-red-950/40 border-r-4 border-orange-500 text-stone-100 font-semibold" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"}`}
              >
                <Settings className="w-4 h-4 text-orange-500" />
                <span>{t.settings}</span>
              </button>
            )}
          </nav>
        </aside>

        {/* ACTIVE SUB-TAB INTERACTIVE CONTENT AREA */}
        <main className="flex-1 bg-stone-950/70 border border-stone-850 p-6 rounded-lg relative overflow-hidden">
          
          {/* Futuristic subtle line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>

          {/* ════════════════ TAB: HOME (DASHBOARD) ════════════════ */}
          {activeTab === "home" && (
            <div className="space-y-6">
              <div className="border-b border-stone-850 pb-4">
                <span className="text-[10px] text-orange-500 font-mono tracking-widest uppercase">{t.subtitle}</span>
                <h2 className="text-2xl font-bold font-mono tracking-wider text-stone-100 mt-1 uppercase">SUICIDE SQUAD COMMAND</h2>
                <p className="text-xs text-stone-400 mt-1">{lang === "ar" ? "أهلاً بك في الغرفة التكتيكية لإصدار البيانات وتتبع الرومات والتدريبات القتالية." : "Welcome to the Suicide Squad Command Center operations dashboard."}</p>
              </div>

              {/* Grid 3 Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Panel 1: Latest Notice */}
                <div className="p-4 bg-stone-900/40 border border-stone-800 rounded relative">
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                  <h3 className="text-sm font-bold font-mono text-stone-200 border-b border-stone-850 pb-2 mb-3 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-500 shrink-0" />
                    {t.clanNotice}
                  </h3>
                  {notifications.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-orange-500 font-mono">
                        {lang === "ar" ? notifications[0].titleAr : notifications[0].titleEn}
                      </h4>
                      <p className="text-[11px] text-stone-400 leading-relaxed whitespace-pre-line">
                        {lang === "ar" ? notifications[0].contentAr : notifications[0].contentEn}
                      </p>
                      <p className="text-[9px] text-stone-600 font-mono mt-3 text-right">
                        SENDER: {notifications[0].senderNickname}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-600 font-mono">{t.noNotifications}</p>
                  )}
                </div>

                {/* Panel 2: Current Tournaments */}
                <div className="p-4 bg-stone-900/40 border border-stone-800 rounded">
                  <h3 className="text-sm font-bold font-mono text-stone-200 border-b border-stone-850 pb-2 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500 shrink-0" />
                    {t.currentTournaments}
                  </h3>
                  <div className="space-y-3">
                    {tournaments.filter(t => t.status === "Active").length > 0 ? (
                      tournaments.filter(t => t.status === "Active").map(tour => (
                        <div key={tour.id} className="p-2.5 bg-black border border-stone-850 rounded">
                          <p className="text-xs font-bold text-orange-500">{lang === "ar" ? tour.titleAr : tour.titleEn}</p>
                          <p className="text-[10px] text-stone-400 mt-1 line-clamp-2">{lang === "ar" ? tour.descAr : tour.descEn}</p>
                          <button 
                            onClick={() => setActiveTab("tournaments")}
                            className="text-[9px] text-orange-500 font-mono hover:underline mt-2 inline-block cursor-pointer"
                          >
                            {lang === "ar" ? "تفاصيل العملية ←" : "Operational Intel →"}
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-600 font-mono">{t.noTournaments}</p>
                    )}
                  </div>
                </div>

                {/* Panel 3: Upcoming Activities */}
                <div className="p-4 bg-stone-900/40 border border-stone-800 rounded">
                  <h3 className="text-sm font-bold font-mono text-stone-200 border-b border-stone-850 pb-2 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                    {t.upcomingActivities}
                  </h3>
                  <div className="space-y-3">
                    {activities.length > 0 ? (
                      activities.slice(0, 2).map(act => (
                        <div key={act.id} className="p-2.5 bg-black border border-stone-850 rounded">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] bg-stone-800 text-stone-300 font-mono px-1.5 py-0.5 rounded uppercase">
                              {act.type}
                            </span>
                            <span className="text-[9px] text-stone-500 font-mono">
                              {new Date(act.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-stone-200 mt-1">{lang === "ar" ? act.titleAr : act.titleEn}</p>
                          <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{lang === "ar" ? act.descAr : act.descEn}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-600 font-mono">{lang === "ar" ? "لا توجد تدريبات مجدولة." : "No drills scheduled currently."}</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Clan Statistics Header */}
              <div className="p-4 bg-stone-950 border border-stone-850 rounded relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl"></div>
                <h3 className="text-xs tracking-widest font-mono text-stone-500 uppercase mb-3">SYSTEM_DIAGNOSTICS: TOTAL_FORCES</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-black/60 border border-stone-900 rounded">
                    <span className="text-[10px] font-mono text-stone-500 block uppercase">TOTAL PERSONNEL</span>
                    <span className="text-xl font-bold font-mono text-stone-100">{members.length}</span>
                  </div>
                  <div className="p-3 bg-black/60 border border-stone-900 rounded">
                    <span className="text-[10px] font-mono text-stone-500 block uppercase">ACTIVE RUNS</span>
                    <span className="text-xl font-bold font-mono text-stone-100">
                      {tournaments.filter(x => x.status === "Active").length}
                    </span>
                  </div>
                  <div className="p-3 bg-black/60 border border-stone-900 rounded">
                    <span className="text-[10px] font-mono text-stone-500 block uppercase">WAR ENGAGEMENT</span>
                    <span className="text-xl font-bold font-mono text-orange-500">READY</span>
                  </div>
                  <div className="p-3 bg-black/60 border border-stone-900 rounded">
                    <span className="text-[10px] font-mono text-stone-500 block uppercase">SSF AGENTS</span>
                    <span className="text-xl font-bold font-mono text-red-500">
                      {members.filter(m => m.division === "SSF").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════ TAB: MEMBERS PAGE ════════════════ */}
          {activeTab === "members" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-850 pb-4 gap-3">
                <div>
                  <h2 className="text-xl font-bold font-mono text-stone-100 uppercase">{t.members}</h2>
                  <p className="text-xs text-stone-400">{lang === "ar" ? "قاعدة بيانات الكلان والتحكم بالرتب وتوزيع المقاتلين." : "Operational roster of Suicide Squad forces."}</p>
                </div>
                {(user.role === "Founder" || user.role === "Administrator") && (
                  <button 
                    onClick={() => {
                      const div = document.getElementById("add-member-form-section");
                      div?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-stone-100 text-xs font-mono rounded cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.addMember}</span>
                  </button>
                )}
              </div>

              {manageError && (
                <div className="p-3 bg-red-950/40 border-l-4 border-red-600 text-red-400 text-xs font-mono rounded">
                  {manageError}
                </div>
              )}

              {manageSuccess && (
                <div className="p-3 bg-green-950/40 border-l-4 border-green-600 text-green-400 text-xs font-mono rounded">
                  {manageSuccess}
                </div>
              )}

              {/* Roster list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse" dir={lang === "ar" ? "rtl" : "ltr"}>
                  <thead>
                    <tr className="border-b border-stone-850 bg-stone-900/40 text-stone-400">
                      <th className="p-3 text-right">{t.memberId}</th>
                      <th className="p-3 text-right">{lang === "ar" ? "اللقب العسكري (Nickname)" : "In-Game Name"}</th>
                      <th className="p-3 text-right">{t.role}</th>
                      <th className="p-3 text-right">{t.divisionLabel}</th>
                      <th className="p-3 text-right">{t.status}</th>
                      <th className="p-3 text-right">{t.joinDate}</th>
                      {(user.role === "Founder" || user.role === "Administrator") && (
                        <th className="p-3 text-center">{t.actions}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member.memberId} className="border-b border-stone-900 hover:bg-stone-900/20 text-stone-300">
                        <td className="p-3 font-semibold text-stone-400">{member.memberId}</td>
                        <td className="p-3 font-medium text-stone-100">{member.nickname}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${member.role === 'Founder' ? 'bg-red-950/60 border border-red-700/40 text-red-400' : member.role === 'Administrator' ? 'bg-orange-950/60 border border-orange-700/40 text-orange-400' : 'bg-stone-900 text-stone-400'}`}>
                            {member.role === "Founder" ? t.founder : member.role === "Administrator" ? t.admin : t.regular}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-orange-500 font-bold">{member.division}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${member.status === "Active" ? "bg-green-950/40 border border-green-700/30 text-green-400" : "bg-stone-900 text-stone-500"}`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="p-3 text-stone-500">{member.joinDate}</td>
                        
                        {/* Control Actions */}
                        {(user.role === "Founder" || user.role === "Administrator") && (
                          <td className="p-3 text-center space-x-1.5 space-y-1">
                            {/* Division Change */}
                            <select 
                              value={member.division}
                              onChange={(e) => updateMember(member.memberId, { division: e.target.value })}
                              className="bg-black border border-stone-800 rounded text-[11px] px-1 py-0.5 text-stone-300 focus:outline-none"
                            >
                              <option value="None">None</option>
                              <option value="SCV">SCV</option>
                              <option value="TAC">TAC</option>
                              <option value="VFX">VFX</option>
                              <option value="RDF">RDF</option>
                              {user.role === "Founder" && <option value="SSF">SSF</option>}
                            </select>

                            {/* Rank promotion (Founder only) */}
                            {user.role === "Founder" && member.role !== "Founder" && (
                              <select 
                                value={member.role}
                                onChange={(e) => updateMember(member.memberId, { role: e.target.value })}
                                className="bg-black border border-stone-800 rounded text-[11px] px-1 py-0.5 text-orange-400 focus:outline-none"
                              >
                                <option value="Regular">{t.regular}</option>
                                <option value="Administrator">{t.admin}</option>
                              </select>
                            )}

                            {/* Suspend or Activate */}
                            {member.role !== "Founder" && (
                              <button 
                                onClick={() => updateMember(member.memberId, { status: member.status === "Active" ? "Suspended" : "Active" })}
                                className="text-[10px] text-yellow-500 hover:underline px-1 py-0.5 cursor-pointer"
                              >
                                {member.status === "Active" ? t.suspend : t.activate}
                              </button>
                            )}

                            {/* Discharge (Dishonorable Discharge) */}
                            {member.role !== "Founder" && (
                              <button 
                                onClick={() => removeMember(member.memberId)}
                                className="text-[10px] text-red-500 hover:underline px-1 py-0.5 cursor-pointer"
                              >
                                {t.removeMember}
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Founder/Admin Enlistment Form Panel */}
              {(user.role === "Founder" || user.role === "Administrator") && (
                <div id="add-member-form-section" className="p-5 bg-stone-900/30 border border-stone-800 rounded-lg mt-6">
                  <h3 className="text-sm font-bold font-mono text-stone-200 border-b border-stone-800 pb-2 mb-4 uppercase flex items-center gap-2">
                    <UserPlus className="text-orange-500 w-4 h-4" />
                    {t.addMember}
                  </h3>
                  <form onSubmit={handleAddNewMember} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1 font-mono uppercase">{t.newMemberName}</label>
                      <input 
                        type="text" 
                        required
                        value={newMemUser}
                        onChange={(e) => setNewMemUser(e.target.value)}
                        className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-200"
                        placeholder="e.g. noufel100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1 font-mono uppercase">{t.newMemberNick}</label>
                      <input 
                        type="text" 
                        required
                        value={newMemNick}
                        onChange={(e) => setNewMemNick(e.target.value)}
                        className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-200"
                        placeholder="e.g. SS_NOUFEL"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1 font-mono uppercase">{t.newMemberPass}</label>
                      <input 
                        type="password" 
                        required
                        value={newMemPass}
                        onChange={(e) => setNewMemPass(e.target.value)}
                        className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-200"
                      />
                    </div>
                    {user.role === "Founder" && (
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1 font-mono uppercase">{t.newMemberRole}</label>
                        <select 
                          value={newMemRole}
                          onChange={(e: any) => setNewMemRole(e.target.value)}
                          className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-200"
                        >
                          <option value="Regular">{t.regular}</option>
                          <option value="Administrator">{t.admin}</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1 font-mono uppercase">{t.divisionLabel}</label>
                      <select 
                        value={newMemDiv}
                        onChange={(e: any) => setNewMemDiv(e.target.value)}
                        className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-200"
                      >
                        <option value="None">None</option>
                        <option value="SCV">SCV</option>
                        <option value="TAC">TAC</option>
                        <option value="VFX">VFX</option>
                        <option value="RDF">RDF</option>
                        {user.role === "Founder" && <option value="SSF">SSF</option>}
                      </select>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                      <button 
                        type="submit" 
                        className="bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs px-5 py-2.5 rounded transition-all cursor-pointer"
                      >
                        {t.createMemberBtn}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ════════════════ TAB: DIVISIONS PAGE ════════════════ */}
          {activeTab === "divisions" && (
            <div className="space-y-6">
              <div className="border-b border-stone-850 pb-4">
                <h2 className="text-xl font-bold font-mono text-stone-100 uppercase">{t.divisions}</h2>
                <p className="text-xs text-stone-400">{lang === "ar" ? "فرق العمليات العسكرية للكلان. اضغط على أي فرقة لعرض مقاتليها وتكليفها." : "Official operational divisions for Suicide Squad."}</p>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-stone-850 gap-2">
                {(["SCV", "TAC", "VFX", "RDF"] as const).map(div => (
                  <button
                    key={div}
                    onClick={() => setSelectedDivision(div)}
                    className={`px-4 py-2 text-xs font-mono tracking-widest transition-all cursor-pointer ${selectedDivision === div ? "border-b-2 border-orange-500 text-stone-100 font-bold" : "text-stone-500 hover:text-stone-300"}`}
                  >
                    {div}
                  </button>
                ))}
              </div>

              {/* Selected Division Profile */}
              <div className="p-5 bg-stone-900/30 border border-stone-800 rounded-lg">
                <h3 className="text-base font-bold font-mono text-orange-500 mb-2">
                  {selectedDivision === "SCV" && t.divisionScvTitle}
                  {selectedDivision === "TAC" && t.divisionTacTitle}
                  {selectedDivision === "VFX" && t.divisionVfxTitle}
                  {selectedDivision === "RDF" && t.divisionRdfTitle}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed max-w-3xl">
                  {selectedDivision === "SCV" && t.divisionScvDesc}
                  {selectedDivision === "TAC" && t.divisionTacDesc}
                  {selectedDivision === "VFX" && t.divisionVfxDesc}
                  {selectedDivision === "RDF" && t.divisionRdfDesc}
                </p>
              </div>

              {/* Members of selected division */}
              <div>
                <h4 className="text-xs tracking-widest font-mono text-stone-400 uppercase mb-3">
                  {lang === "ar" ? `مقاتلو الفرقة (${selectedDivision})` : `Assigned Combatants (${selectedDivision})`}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {members.filter(m => m.division === selectedDivision).length > 0 ? (
                    members.filter(m => m.division === selectedDivision).map(member => (
                      <div key={member.memberId} className="p-3 bg-black border border-stone-850 rounded relative overflow-hidden flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-stone-500 font-mono block">ID: {member.memberId}</span>
                          <span className="text-xs font-bold font-mono text-stone-200 mt-0.5 block">{member.nickname}</span>
                          <span className="text-[10px] text-orange-500 font-mono uppercase mt-1 block">RANK: {member.role}</span>
                        </div>
                        <Shield className="w-8 h-8 text-stone-900 shrink-0" />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-600 font-mono col-span-3">
                      {lang === "ar" ? "لم يتم إلحاق أي مقاتل بهذه الفرقة حالياً." : "No personnel deployed to this unit yet."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════ TAB: SSF ADMIN PAGE ════════════════ */}
          {activeTab === "ssf" && (
            <div className="space-y-6">
              <div className="border-b border-stone-850 pb-4">
                <h2 className="text-xl font-bold font-mono text-red-500 uppercase">{t.ssfDivision}</h2>
                <p className="text-xs text-stone-400">{t.divisionSsfDesc}</p>
              </div>

              <div className="p-4 bg-red-950/20 border border-red-900/40 text-stone-300 text-xs rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-mono">
                  {t.ssfRestricted}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Administrators & responsibilities */}
                <div className="space-y-4">
                  <h3 className="text-xs tracking-widest font-mono text-orange-500 uppercase font-bold border-b border-stone-800 pb-2">
                    {t.adminResponsibilities}
                  </h3>
                  <div className="space-y-2 text-xs font-mono leading-relaxed text-stone-400">
                    <p className="p-2.5 bg-stone-900/40 rounded border border-stone-850">{t.responsibility1}</p>
                    <p className="p-2.5 bg-stone-900/40 rounded border border-stone-850">{t.responsibility2}</p>
                    <p className="p-2.5 bg-stone-900/40 rounded border border-stone-850">{t.responsibility3}</p>
                  </div>
                </div>

                {/* SSF Agent List */}
                <div className="space-y-4">
                  <h3 className="text-xs tracking-widest font-mono text-red-500 uppercase font-bold border-b border-stone-800 pb-2">
                    {lang === "ar" ? "أفراد جهاز الاستخبارات الحاليين" : "Active Intelligence Agents"}
                  </h3>
                  <div className="space-y-3">
                    {members.filter(m => m.division === "SSF").length > 0 ? (
                      members.filter(m => m.division === "SSF").map(member => (
                        <div key={member.memberId} className="p-3 bg-red-950/10 border border-red-950 rounded flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold font-mono text-stone-100">{member.nickname}</p>
                            <p className="text-[10px] text-stone-500 mt-0.5">SERVICE_ID: {member.memberId} | ROLE: {member.role}</p>
                          </div>
                          <span className="text-[10px] bg-red-950 text-red-400 border border-red-800/60 px-2 py-0.5 rounded font-mono">SSF AGENT</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-600 font-mono">{t.noSsfMembers}</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ════════════════ TAB: RULES (MILITARY CODE) ════════════════ */}
          {activeTab === "rules" && (
            <div className="space-y-6">
              <div className="border-b border-stone-850 pb-4">
                <h2 className="text-xl font-bold font-mono text-stone-100 uppercase">{t.rules}</h2>
                <p className="text-xs text-stone-400">{lang === "ar" ? "الميثاق واللوائح التنظيمية الداخلية لضمان الانضباط الحديدي." : "Official rules of engagement and code of conduct."}</p>
              </div>

              <div className="space-y-5">
                {rules.map(category => (
                  <div key={category.id} className="p-4 bg-stone-900/40 border border-stone-800 rounded-lg">
                    <h3 className="text-sm font-bold font-mono text-orange-500 border-b border-stone-800 pb-2 mb-3">
                      {lang === "ar" ? category.titleAr : category.titleEn}
                    </h3>
                    <ul className="space-y-2 text-xs text-stone-400 list-disc list-inside">
                      {(lang === "ar" ? category.contentAr : category.contentEn).map((rule, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {rule}
                        </li>
                      ))}
                    </ul>

                    {/* Quick Sovereign edits by Founder */}
                    {user.role === "Founder" && (
                      <div className="mt-4 pt-3 border-t border-stone-850 flex justify-end">
                        <button
                          onClick={() => {
                            const newContent = window.prompt(
                              lang === "ar" ? "أدخل القوانين الجديدة مفصولة بفاصلة (|)" : "Enter new rules separated by (|)",
                              (lang === "ar" ? category.contentAr : category.contentEn).join(" | ")
                            );
                            if (newContent) {
                              const rulesList = newContent.split("|").map(x => x.trim());
                              if (lang === "ar") {
                                handleUpdateRulesCategory(category.id, rulesList, category.contentEn);
                              } else {
                                handleUpdateRulesCategory(category.id, category.contentAr, rulesList);
                              }
                            }
                          }}
                          className="text-[10px] text-orange-500 hover:underline font-mono cursor-pointer"
                        >
                          {lang === "ar" ? "تعديل القوانين لهذا القسم ✎" : "Modify rules ✎"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════ TAB: TOURNAMENTS PAGE ════════════════ */}
          {activeTab === "tournaments" && (
            <div className="space-y-6">
              <div className="border-b border-stone-850 pb-4">
                <h2 className="text-xl font-bold font-mono text-stone-100 uppercase">{t.tournaments}</h2>
                <p className="text-xs text-stone-400">{lang === "ar" ? "البطولات الجارية، والمسابقات الكبرى وجوائزها." : "Squad tactical leagues and Free Fire tournaments."}</p>
              </div>

              {/* Create tournament (Founder/Admin only) */}
              {(user.role === "Founder" || user.role === "Administrator") && (
                <div className="p-4 bg-stone-900/30 border border-stone-800 rounded-lg">
                  <h3 className="text-xs tracking-widest font-mono text-stone-200 uppercase mb-3 font-bold border-b border-stone-800 pb-2">
                    {t.addTournament}
                  </h3>
                  <form onSubmit={handleCreateTournament} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        required
                        value={newTTitleAr}
                        onChange={(e) => setNewTTitleAr(e.target.value)}
                        className="bg-black border border-stone-800 rounded text-xs px-2.5 py-1.5 text-stone-200 placeholder-stone-600"
                        placeholder="العنوان بالعربية"
                      />
                      <input 
                        type="text" 
                        required
                        value={newTTitleEn}
                        onChange={(e) => setNewTTitleEn(e.target.value)}
                        className="bg-black border border-stone-800 rounded text-xs px-2.5 py-1.5 text-stone-200 placeholder-stone-600"
                        placeholder="Title in English"
                      />
                      <textarea 
                        value={newTDescAr}
                        onChange={(e) => setNewTDescAr(e.target.value)}
                        className="bg-black border border-stone-800 rounded text-xs px-2.5 py-1.5 text-stone-200 placeholder-stone-600"
                        placeholder="الوصف والجوائز بالعربية"
                        rows={2}
                      />
                      <textarea 
                        value={newTDescEn}
                        onChange={(e) => setNewTDescEn(e.target.value)}
                        className="bg-black border border-stone-800 rounded text-xs px-2.5 py-1.5 text-stone-200 placeholder-stone-600"
                        placeholder="Description in English"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <select 
                        value={newTStatus}
                        onChange={(e: any) => setNewTStatus(e.target.value)}
                        className="bg-black border border-stone-800 rounded text-xs px-2 py-1 text-stone-300"
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Upcoming">Upcoming</option>
                      </select>
                      <button 
                        type="submit" 
                        className="bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs px-4 py-1.5 rounded transition-all cursor-pointer"
                      >
                        {t.send}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tournament list cards */}
              <div className="space-y-4">
                {tournaments.length === 0 ? (
                  <p className="text-xs text-stone-600 font-mono">{t.noTournaments}</p>
                ) : (
                  tournaments.map(tour => (
                    <div key={tour.id} className="p-4 bg-stone-900/40 border border-stone-800 rounded-lg space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase ${tour.status === 'Active' ? 'bg-red-950/60 border border-red-700/40 text-red-400' : 'bg-stone-800 text-stone-400'}`}>
                            {tour.status === "Active" ? t.activeTournaments : tour.status === "Completed" ? t.completedTournaments : t.upcomingTournaments}
                          </span>
                          <h3 className="text-sm font-bold text-stone-100 font-mono mt-2">
                            {lang === "ar" ? tour.titleAr : tour.titleEn}
                          </h3>
                        </div>
                        
                        {(user.role === "Founder" || user.role === "Administrator") && (
                          <button 
                            onClick={() => handleDeleteTournament(tour.id)}
                            className="p-1 hover:bg-stone-800 text-red-400 hover:text-red-500 rounded transition-all cursor-pointer"
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-stone-400 whitespace-pre-line leading-relaxed">
                        {lang === "ar" ? tour.descAr : tour.descEn}
                      </p>

                      {/* Join Requests status */}
                      <div className="pt-3 border-t border-stone-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-stone-500 font-mono uppercase block">
                            {lang === "ar" ? "المشاركون في البطولة" : "Mission Combatants"}
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {tour.requests.filter(r => r.status === "Approved").length > 0 ? (
                              tour.requests.filter(r => r.status === "Approved").map(req => (
                                <span key={req.memberId} className="bg-black text-orange-500 text-[10px] border border-stone-850 px-2 py-0.5 rounded font-mono">
                                  {req.nickname}
                                </span>
                              ))
                            ) : (
                              <span className="text-stone-600 text-[10px] font-mono">{lang === "ar" ? "لا أحد حتى الآن" : "No approved forces."}</span>
                            )}
                          </div>
                        </div>

                        {/* Request Join trigger */}
                        {tour.status === "Active" && (
                          <button
                            onClick={() => handleJoinTournament(tour.id)}
                            className="bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/30 text-xs font-mono px-4 py-1.5 rounded cursor-pointer transition-all"
                          >
                            {t.joinTournament}
                          </button>
                        )}
                      </div>

                      {/* Manage Participation requests (Founder / Admin only) */}
                      {(user.role === "Founder" || user.role === "Administrator") && tour.requests.filter(r => r.status === "Pending").length > 0 && (
                        <div className="pt-3 border-t border-stone-850 space-y-2">
                          <p className="text-[10px] text-stone-400 font-bold font-mono uppercase">{t.requestsList}</p>
                          <div className="space-y-1.5">
                            {tour.requests.filter(r => r.status === "Pending").map(req => (
                              <div key={req.memberId} className="bg-black p-2 rounded border border-stone-900 flex justify-between items-center text-xs">
                                <span>{req.nickname}</span>
                                <div className="space-x-1.5">
                                  <button 
                                    onClick={() => handleTournamentRequest(tour.id, req.memberId, "Approved")}
                                    className="text-green-500 hover:underline font-mono text-[11px] cursor-pointer"
                                  >
                                    {t.approve}
                                  </button>
                                  <button 
                                    onClick={() => handleTournamentRequest(tour.id, req.memberId, "Rejected")}
                                    className="text-red-500 hover:underline font-mono text-[11px] cursor-pointer"
                                  >
                                    {t.reject}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ════════════════ TAB: CLAN WAR PAGE ════════════════ */}
          {activeTab === "clanwar" && (
            <div className="space-y-6">
              <div className="border-b border-stone-850 pb-4">
                <h2 className="text-xl font-bold font-mono text-red-500 uppercase">{t.clanWar}</h2>
                <p className="text-xs text-stone-400">{lang === "ar" ? "تفاصيل وتنسيق غارات حرب الكلان القادمة والتعليمات الصارمة." : "Active Clan War engagement directive."}</p>
              </div>

              {clanWar ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Current Active Battle Plans */}
                  <div className="space-y-4">
                    <div className="p-4 bg-stone-900/40 border border-stone-800 rounded-lg space-y-4">
                      <h3 className="text-sm font-bold text-orange-500 font-mono uppercase flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                        {t.clanWarNoticeTitle}
                      </h3>
                      <p className="text-xs font-bold font-mono text-stone-100">
                        {lang === "ar" ? clanWar.titleAr : clanWar.titleEn}
                      </p>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between border-b border-stone-850 pb-1 text-stone-400 font-mono">
                          <span>{t.schedule}:</span>
                          <span className="text-stone-200">{new Date(clanWar.schedule).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-850 pb-1 text-stone-400 font-mono pt-1">
                          <span>{t.pointsRequired}:</span>
                          <span className="text-orange-500 font-bold">{clanWar.requiredPoints} pts</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-stone-400 font-mono">{t.instructions}</p>
                        <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-line bg-black p-2.5 rounded border border-stone-900">
                          {lang === "ar" ? clanWar.instructionsAr : clanWar.instructionsEn}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-900/40 border border-stone-800 rounded-lg space-y-2">
                      <p className="text-xs font-bold text-stone-400 font-mono">{t.rulesOfEngagement}</p>
                      <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-line leading-relaxed">
                        {lang === "ar" ? clanWar.rulesAr : clanWar.rulesEn}
                      </p>
                    </div>
                  </div>

                  {/* Founder update Battle Plans */}
                  {user.role === "Founder" ? (
                    <div className="p-4 bg-stone-900/30 border border-stone-800 rounded-lg">
                      <h3 className="text-xs tracking-widest font-mono text-stone-200 uppercase mb-3 font-bold border-b border-stone-850 pb-2">
                        {lang === "ar" ? "تعديل خطة حرب الكلان (Founder)" : "Modify Clan War blue-prints"}
                      </h3>
                      <form onSubmit={handleSaveClanWar} className="space-y-3 font-mono text-xs">
                        <div>
                          <label className="block text-stone-400 mb-1">البيان بالعربية</label>
                          <input 
                            type="text" 
                            value={warTitleAr}
                            onChange={(e) => setWarTitleAr(e.target.value)}
                            className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1">Directive in English</label>
                          <input 
                            type="text" 
                            value={warTitleEn}
                            onChange={(e) => setWarTitleEn(e.target.value)}
                            className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1">{t.schedule}</label>
                          <input 
                            type="datetime-local" 
                            value={warSchedule}
                            onChange={(e) => setWarSchedule(e.target.value)}
                            className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1">{t.pointsRequired}</label>
                          <input 
                            type="number" 
                            value={warPoints}
                            onChange={(e) => setWarPoints(Number(e.target.value))}
                            className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                          />
                          <span className="text-[10px] text-stone-500">{t.pointsHelp}</span>
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1">{lang === "ar" ? "التعليمات والخطط بالعربية" : "Tactical Instructions (Arabic)"}</label>
                          <textarea 
                            value={warInstructionsAr}
                            onChange={(e) => setWarInstructionsAr(e.target.value)}
                            className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1">{lang === "ar" ? "التعليمات بالإنجليزية" : "Tactical Instructions (English)"}</label>
                          <textarea 
                            value={warInstructionsEn}
                            onChange={(e) => setWarInstructionsEn(e.target.value)}
                            className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1">{lang === "ar" ? "قوانين الحرب بالعربية" : "Engagement Rules (Arabic)"}</label>
                          <textarea 
                            value={warRulesAr}
                            onChange={(e) => setWarRulesAr(e.target.value)}
                            className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1">{lang === "ar" ? "قوانين الحرب بالإنجليزية" : "Engagement Rules (English)"}</label>
                          <textarea 
                            value={warRulesEn}
                            onChange={(e) => setWarRulesEn(e.target.value)}
                            className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                            rows={2}
                          />
                        </div>
                        <div className="flex justify-end pt-2">
                          <button 
                            type="submit" 
                            className="bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs px-4 py-1.5 rounded transition-all cursor-pointer"
                          >
                            {t.save}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="p-4 bg-stone-900/20 border border-stone-850 rounded-lg flex items-center justify-center text-stone-600">
                      <Lock className="w-16 h-16 opacity-10" />
                    </div>
                  )}

                </div>
              ) : (
                <p className="text-xs text-stone-500">Decrypting war logs...</p>
              )}
            </div>
          )}

          {/* ════════════════ TAB: ACTIVITIES PAGE ════════════════ */}
          {activeTab === "activities" && (
            <div className="space-y-6">
              <div className="border-b border-stone-850 pb-4">
                <h2 className="text-xl font-bold font-mono text-stone-100 uppercase">{t.activities}</h2>
                <p className="text-xs text-stone-400">{lang === "ar" ? "الرومات الودية، والاجتماعات والتدريبات العسكرية المكثفة." : "Command schedule, friendly rooms, and tactical exercises."}</p>
              </div>

              {/* Create Activity Form (Founder/Admin only) */}
              {(user.role === "Founder" || user.role === "Administrator") && (
                <div className="p-4 bg-stone-900/30 border border-stone-800 rounded-lg">
                  <h3 className="text-xs tracking-widest font-mono text-stone-200 uppercase mb-3 font-bold border-b border-stone-800 pb-2">
                    {t.addActivity}
                  </h3>
                  <form onSubmit={handleCreateActivity} className="space-y-3 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-400 mb-1">{t.activityType}</label>
                        <select 
                          value={actType}
                          onChange={(e: any) => setActType(e.target.value)}
                          className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 text-xs"
                        >
                          <option value="Training">{t.training}</option>
                          <option value="Friendly Room">{t.friendlyRoom}</option>
                          <option value="Meeting">{t.meeting}</option>
                          <option value="Event">{t.event}</option>
                          <option value="Announcement">{t.announcement}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-400 mb-1">{t.activityDate}</label>
                        <input 
                          type="datetime-local" 
                          required
                          value={actDate}
                          onChange={(e) => setActDate(e.target.value)}
                          className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 text-xs"
                        />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={actTitleAr}
                        onChange={(e) => setActTitleAr(e.target.value)}
                        className="bg-black border border-stone-800 rounded text-xs px-2.5 py-1.5 text-stone-200 placeholder-stone-600"
                        placeholder="العنوان بالعربية"
                      />
                      <input 
                        type="text" 
                        required
                        value={actTitleEn}
                        onChange={(e) => setActTitleEn(e.target.value)}
                        className="bg-black border border-stone-800 rounded text-xs px-2.5 py-1.5 text-stone-200 placeholder-stone-600"
                        placeholder="Title in English"
                      />
                      <textarea 
                        value={actDescAr}
                        onChange={(e) => setActDescAr(e.target.value)}
                        className="bg-black border border-stone-800 rounded text-xs px-2.5 py-1.5 text-stone-200 placeholder-stone-600 sm:col-span-2"
                        placeholder="تفاصيل التدريب أو الروم بالعربية"
                        rows={2}
                      />
                      <textarea 
                        value={actDescEn}
                        onChange={(e) => setActDescEn(e.target.value)}
                        className="bg-black border border-stone-800 rounded text-xs px-2.5 py-1.5 text-stone-200 placeholder-stone-600 sm:col-span-2"
                        placeholder="Drill details in English"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        className="bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs px-4 py-1.5 rounded transition-all cursor-pointer"
                      >
                        {t.send}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Roster of upcoming operations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.map(act => (
                  <div key={act.id} className="p-4 bg-stone-900/40 border border-stone-800 rounded-lg space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="bg-red-950 text-red-400 text-[10px] border border-red-900/40 px-2 py-0.5 rounded font-mono uppercase">
                        {act.type === "Training" ? t.training : act.type === "Friendly Room" ? t.friendlyRoom : act.type === "Meeting" ? t.meeting : act.type === "Event" ? t.event : t.announcement}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {new Date(act.date).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-stone-200 font-mono">
                        {lang === "ar" ? act.titleAr : act.titleEn}
                      </h4>
                      <p className="text-xs text-stone-400 leading-relaxed mt-2 whitespace-pre-line">
                        {lang === "ar" ? act.descAr : act.descEn}
                      </p>
                    </div>

                    {(user.role === "Founder" || user.role === "Administrator") && (
                      <div className="pt-2 border-t border-stone-850 flex justify-end">
                        <button 
                          onClick={() => handleDeleteActivity(act.id)}
                          className="text-[11px] text-red-500 hover:underline font-mono cursor-pointer"
                        >
                          {t.delete}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════ TAB: REPORTS PAGE ════════════════ */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="border-b border-stone-850 pb-4">
                <h2 className="text-xl font-bold font-mono text-stone-100 uppercase">{t.reports}</h2>
                <p className="text-xs text-stone-400">{t.reportInstruction}</p>
              </div>

              {/* Submit new report (Any member can) */}
              <div className="p-4 bg-stone-900/30 border border-stone-800 rounded-lg">
                <h3 className="text-xs tracking-widest font-mono text-orange-500 uppercase mb-3 font-bold border-b border-stone-800 pb-2">
                  {t.submitReport}
                </h3>

                {reportError && (
                  <div className="p-2.5 mb-4 bg-red-950/40 border-l-4 border-red-600 text-red-400 text-xs font-mono rounded">
                    {reportError}
                  </div>
                )}

                {reportSuccess && (
                  <div className="p-2.5 mb-4 bg-green-950/40 border-l-4 border-green-600 text-green-400 text-xs font-mono rounded">
                    {reportSuccess}
                  </div>
                )}

                <form onSubmit={handleReportSubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-stone-400 mb-1">{t.reportTitle}</label>
                    <input 
                      type="text" 
                      required
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder={t.reportTitlePlace}
                      className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">{t.reportDesc}</label>
                    <textarea 
                      required
                      value={reportDesc}
                      onChange={(e) => setReportDesc(e.target.value)}
                      placeholder={t.reportDescPlace}
                      className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">{t.screenshot}</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden" 
                        id="report-screenshot-upload"
                      />
                      <label 
                        htmlFor="report-screenshot-upload" 
                        className="bg-stone-900 border border-stone-800 text-stone-300 hover:border-orange-500 hover:text-white px-3 py-1.5 rounded cursor-pointer flex items-center gap-2 text-xs"
                      >
                        <Upload className="w-4 h-4 text-orange-500" />
                        <span>{lang === "ar" ? "تحميل صورة" : "Upload File"}</span>
                      </label>
                      {reportScreenshot && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {lang === "ar" ? "جاهز للرفع" : "File Attached"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit" 
                      className="bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs px-5 py-2 rounded transition-all cursor-pointer"
                    >
                      {t.submit}
                    </button>
                  </div>
                </form>
              </div>

              {/* View all reports (Founder / Admin only) */}
              {(user.role === "Founder" || user.role === "Administrator") && (
                <div className="space-y-4">
                  <h3 className="text-xs tracking-widest font-mono text-red-500 uppercase font-bold border-b border-stone-800 pb-2">
                    {t.reportsPanel}
                  </h3>
                  <div className="space-y-3">
                    {reports.length === 0 ? (
                      <p className="text-xs text-stone-600 font-mono">{t.noReports}</p>
                    ) : (
                      reports.map(rep => (
                        <div key={rep.id} className="p-4 bg-stone-900/40 border border-stone-800 rounded-lg space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[10px] text-stone-500 font-mono uppercase block">REPORTER: {rep.reporterNickname}</span>
                              <h4 className="text-xs font-bold text-stone-200 font-mono mt-1">
                                {rep.title}
                              </h4>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${rep.status === 'Resolved' ? 'bg-green-950 text-green-400' : 'bg-orange-950 text-orange-400 border border-orange-850'}`}>
                              {rep.status === "Resolved" ? t.resolved : t.pending}
                            </span>
                          </div>

                          <p className="text-xs text-stone-400 whitespace-pre-line leading-relaxed">
                            {rep.description}
                          </p>

                          {rep.screenshot && (
                            <div className="border border-stone-850 p-2 rounded bg-black max-w-sm">
                              <img src={rep.screenshot} alt="Visual Proof" className="max-h-64 rounded" />
                            </div>
                          )}

                          {rep.status === "Pending" && (
                            <div className="pt-2 flex justify-end border-t border-stone-850">
                              <button 
                                onClick={() => handleResolveReport(rep.id)}
                                className="bg-green-950 hover:bg-green-900 text-green-400 border border-green-800 text-[11px] font-mono px-3 py-1 rounded cursor-pointer"
                              >
                                {t.resolve}
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════ TAB: SETTINGS (FOUNDER ONLY) ════════════════ */}
          {activeTab === "settings" && user.role === "Founder" && (
            <div className="space-y-6">
              <div className="border-b border-stone-850 pb-4">
                <h2 className="text-xl font-bold font-mono text-red-500 uppercase">{t.settings}</h2>
                <p className="text-xs text-stone-400">{t.ownerSettingsOnly}</p>
              </div>

              {settingsError && (
                <div className="p-3 bg-red-950/40 border-l-4 border-red-600 text-red-400 text-xs font-mono rounded">
                  {settingsError}
                </div>
              )}

              {settingsSuccess && (
                <div className="p-3 bg-green-950/40 border-l-4 border-green-600 text-green-400 text-xs font-mono rounded">
                  {settingsSuccess}
                </div>
              )}

              {/* Master Settings form */}
              <form onSubmit={handleSaveSovereignSettings} className="p-4 bg-stone-900/30 border border-stone-800 rounded-lg space-y-4 text-xs font-mono">
                <h3 className="text-xs tracking-widest font-mono text-orange-500 uppercase font-bold border-b border-stone-800 pb-2">
                  {t.generalSettings}
                </h3>
                
                <div className="max-w-md">
                  <label className="block text-stone-400 mb-1">{t.changeClanPassword}</label>
                  <input 
                    type="text" 
                    value={editClanPassword}
                    onChange={(e) => setEditClanPassword(e.target.value)}
                    className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 text-sm font-bold tracking-widest"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="allow-public-reg"
                    checked={allowPublicReg}
                    onChange={(e) => setAllowPublicReg(e.target.checked)}
                    className="accent-orange-500"
                  />
                  <label htmlFor="allow-public-reg" className="text-stone-300 cursor-pointer">{t.toggleReg}</label>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    className="bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs px-5 py-2 rounded transition-all cursor-pointer"
                  >
                    {t.save}
                  </button>
                </div>
              </form>

              {/* Broad announcement broadcaster */}
              <form onSubmit={handleSendAnnouncement} className="p-4 bg-stone-900/30 border border-stone-800 rounded-lg space-y-4 text-xs font-mono">
                <h3 className="text-xs tracking-widest font-mono text-orange-500 uppercase font-bold border-b border-stone-800 pb-2">
                  {t.newAnnouncement}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 mb-1">{t.announcementTitle}</label>
                    <input 
                      type="text" 
                      required
                      value={newNoticeTitleAr}
                      onChange={(e) => setNewNoticeTitleAr(e.target.value)}
                      className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                      placeholder="عنوان باللغة العربية"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">{t.announcementTitleEn}</label>
                    <input 
                      type="text" 
                      required
                      value={newNoticeTitleEn}
                      onChange={(e) => setNewNoticeTitleEn(e.target.value)}
                      className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                      placeholder="Title in English"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-stone-400 mb-1">{t.announcementContent}</label>
                    <textarea 
                      required
                      value={newNoticeContentAr}
                      onChange={(e) => setNewNoticeContentAr(e.target.value)}
                      className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                      rows={3}
                      placeholder="المحتوى العسكري بالعربية"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-stone-400 mb-1">{t.announcementContentEn}</label>
                    <textarea 
                      required
                      value={newNoticeContentEn}
                      onChange={(e) => setNewNoticeContentEn(e.target.value)}
                      className="w-full bg-black border border-stone-800 rounded px-2.5 py-1.5 text-stone-200"
                      rows={3}
                      placeholder="Content in English"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    className="bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs px-5 py-2 rounded transition-all cursor-pointer"
                  >
                    {t.send}
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER BAR */}
      <footer className="border-t border-stone-900 bg-stone-950 py-4 mt-12 text-center text-[10px] font-mono text-stone-600 uppercase tracking-wider">
        <span>&copy; 2026 Suicide Squad HQ - Command Room . Security Enforced . RTL Ready</span>
      </footer>

    </div>
  );
}
