export interface User {
  memberId: string;
  username: string;
  nickname: string;
  role: "Founder" | "Administrator" | "Regular";
  division: "SCV" | "TAC" | "VFX" | "RDF" | "SSF" | "None";
  joinDate: string;
  status: "Active" | "Inactive" | "Suspended";
}

export interface Tournament {
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

export interface ClanWar {
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

export interface Activity {
  id: string;
  type: "Event" | "Training" | "Friendly Room" | "Meeting" | "Announcement";
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  date: string;
}

export interface RuleCategory {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string[];
  contentEn: string[];
}

export interface Report {
  id: string;
  title: string;
  description: string;
  screenshot?: string;
  reporterId: string;
  reporterNickname: string;
  status: "Pending" | "Resolved";
  submittedAt: string;
}

export interface Notification {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  senderNickname: string;
  createdAt: string;
  isReadBy: string[];
}

export interface ClanSettings {
  clanPassword: string;
  allowPublicRegistration: boolean;
}

// Translations Dictionary
export const translations = {
  ar: {
    title: "مجموعة الانتحار",
    subtitle: "كتيبة الانتحار - Suicide Squad",
    commanderTitle: "مركز القيادة والسيطرة التكتيكية",
    tagline: "انضباط . قوة . نصر أو شهادة",
    login: "تسجيل الدخول",
    register: "إنشاء حساب جديد",
    username: "اسم المستخدم",
    password: "كلمة المرور الشخصية",
    clanPassword: "رمز دخول الكلان (الرمز المشترك)",
    nickname: "الاسم المستعار في اللعبة (Nickname)",
    personalPassHelp: "اختر كلمة مرور سرية خاصة بك لتأمين حسابك.",
    clanPassHelp: "الرمز العسكري المشترك لجميع أفراد الكلان لفك التشفير.",
    backToService: "العودة للخدمة العسكرية",
    loggingIn: "جاري الاتصال بالقمر الصناعي العسكري...",
    registering: "جاري تشفير وتسجيل الهوية في قاعدة البيانات...",
    loginSuccess: "تم التحقق من الهوية بنجاح. مرحباً بك في مركز العمليات.",
    registerSuccess: "تم إنشاء هويتك العسكرية بنجاح! يمكنك الآن تسجيل الدخول.",
    logout: "تسجيل الخروج",
    dashboard: "لوحة القيادة",
    members: "أفراد الكتيبة",
    divisions: "الفرق العسكرية",
    ssfDivision: "قوات الأمن الخاصة (SSF)",
    rules: "الميثاق العسكري",
    tournaments: "العمليات والبطولات",
    clanWar: "حرب الكلان",
    activities: "الأنشطة والتدريب",
    reports: "الشكاوى والتقارير الأمنيّة",
    settings: "الإعدادات السيادية",
    notifications: "البرقيات والإشعارات",
    welcomeCommander: "مرحباً بالضابط المسؤول",
    clanNotice: "برقيات القيادة العليا المباشرة",
    news: "آخر أخبار الجبهة والكلان",
    upcomingActivities: "الأنشطة والتدريبات التكتيكية القادمة",
    currentTournaments: "العمليات العسكرية الجارية والبطولات",
    memberId: "الرقم العسكري",
    role: "الرتبة العسكرية",
    divisionLabel: "الفرقة الملحقة",
    status: "حالة الخدمة",
    joinDate: "تاريخ الالتحاق",
    actions: "الإجراءات التكتيكية",
    addMember: "تجنيد فرد جديد",
    removeMember: "تسريح من الخدمة",
    promote: "ترقية رتبة",
    demote: "تخفيض رتبة",
    changeDivision: "نقل فرقة",
    suspend: "تعليق الخدمة",
    activate: "إعادة تنشيط",
    founder: "القائد الأعلى (Founder)",
    admin: "مسؤول عسكري (Administrator)",
    regular: "مقاتل (Regular)",
    submitReport: "إرسال تقرير أمني عاجل",
    reportTitle: "عنوان البلاغ الأمني",
    reportDesc: "تفاصيل الواقعة أو البلاغ بالكامل",
    screenshot: "إرفاق صورة الإثبات (اختياري)",
    submit: "إرسال التقرير",
    reportsPanel: "أرشيف التقارير والشكاوى العسكرية",
    resolve: "تصفية وحل البلاغ",
    resolved: "تم الحل والتصفية",
    pending: "قيد المراجعة والاستخبار",
    newAnnouncement: "بث برقية عسكرية جديدة لجميع الأفراد",
    announcementTitle: "عنوان البرقية العسكرية",
    announcementTitleEn: "عنوان البرقية بالإنجليزية",
    announcementContent: "نص البرقية العسكرية العاجلة",
    announcementContentEn: "نص البرقية بالإنجليزية",
    send: "بث وإرسال",
    generalSettings: "تعديل شيفرة الكلان والبيانات السيادية",
    changeClanPassword: "تغيير رمز دخول الكلان المشترك",
    toggleReg: "السماح بالتسجيل الذاتي للمقاتلين الجدد",
    save: "حفظ الإعدادات السيادية",
    language: "اللغة المعتمدة",
    backHome: "العودة للقاعدة الرئيسية",
    pointsRequired: "النقاط المطلوبة",
    schedule: "التوقيت والجدولة الزمنية",
    instructions: "التعليمات والخطط العسكرية الميدانية",
    rulesOfEngagement: "قواعد الاشتباك والقتال",
    joinTournament: "تقديم طلب انضمام للعملية",
    joinRequestSent: "تم إرسال طلب الانضمام بنجاح. بانتظار تصديق القيادة.",
    approve: "قبول الطلب",
    reject: "رفض الطلب",
    requestsList: "طلبات المقاتلين للمشاركة في العملية",
    divisionScvTitle: "SCV - فرقة الصدمة العاصفة",
    divisionScvDesc: "فرقة الهجوم السريع والاختراق المباشر. تهدف إلى شل خطوط دفاع العدو وتأمين نقاط الهبوط الأولية.",
    divisionTacTitle: "TAC - كتيبة الإسناد التكتيكي",
    divisionTacDesc: "المسؤولة عن التخطيط، تزويد الفرق بالمواد الدفاعية، وحساب مسار الدوائر الآمنة وتوجيه نيران الدعم.",
    divisionVfxTitle: "VFX - فرقة النخبة للاستطلاع الإلكتروني",
    divisionVfxDesc: "تختص بالدقة العالية، استهداف الرؤوس، واكتشاف ثغرات تجمعات الأعداء والتصوير الحربي.",
    divisionRdfTitle: "RDF - قوات الردع والتدخل السريع",
    divisionRdfDesc: "فرقة الدفاع الثقيل وتأمين تراجع الحلفاء والانتشار السريع لإعادة بناء الخطوط المنهارة في الثواني الأخيرة.",
    divisionSsfTitle: "SSF - قوات الأمن الداخلي الخاصة",
    divisionSsfDesc: "جهاز الاستخبارات والأمن الداخلي للكلان. خاضعة مباشرة لأوامر القائد الأعلى ومكلفة بحماية وحدة الصف وضمان الانضباط الحديدي ومراجعة تقارير السلوك ومراقبة المقاتلين.",
    ssfRestricted: "منطقة عسكرية مغلقة! فقط القائد الأعلى (Founder) يمكنه تعيين أفراد أو تعديل قوات الأمن الداخلي الخاصة (SSF).",
    noSsfMembers: "لا يوجد أفراد معينون حالياً في قوات الأمن الخاصة.",
    adminResponsibilities: "المهام والمسؤوليات العسكرية للمسؤولين الثلاثة",
    responsibility1: "1. إدارة وقبول وتوزيع المجندين الجدد على الفرق القتالية المعتمدة (ما عدا SSF).",
    responsibility2: "2. مراجعة وتصفية تقارير المقاتلين والعمل على حل المشاكل الداخلية فوراً.",
    responsibility3: "3. قيادة التدريبات الأسبوعية، وتنظيم الرومات الودية، وإدارة العمليات والبطولات المصادق عليها.",
    registeredMembers: "المقاتلون المسجلون",
    newMemberName: "اسم المستخدم الجديد",
    newMemberNick: "الاسم المستعار الجديد في اللعبة",
    newMemberPass: "كلمة المرور الشخصية للمجند",
    newMemberRole: "الرتبة الممنوحة",
    createMemberBtn: "تأكيد تجنيد الفرد",
    clanWarNoticeTitle: "بيان الحرب العسكري المباشر",
    pointsHelp: "الحد الأدنى من النقاط الحربية المطلوب تجميعها خلال هذه المعركة.",
    addActivity: "جدولة نشاط عسكري جديد",
    activityType: "نوع النشاط",
    event: "حدث خاص",
    training: "تدريب عسكري",
    friendlyRoom: "روم ودية",
    meeting: "اجتماع طارئ",
    announcement: "إعلان عسكري",
    activityDate: "تاريخ وساعة النشاط",
    delete: "حذف وإلغاء",
    requiredFields: "يرجى ملء جميع الحقول المطلوبة بالترجمة المناسبة.",
    reportInstruction: "هل لاحظت سلوكاً غير رياضي أو مخالفة للقوانين؟ قدم تقريراً سرياً ومشفراً مباشراً إلى جهاز الاستخبارات والإدارة.",
    reportTitlePlace: "مثال: تطاول لفظي أثناء التدريب الودي",
    reportDescPlace: "اكتب وصفاً مفصلاً عما حدث، موضحاً أسماء الأفراد المتورطين والوقت والتاريخ بالتحديد.",
    ownerSettingsOnly: "قسم حمايات التشفير والتحكم السيادي - متاح فقط للقائد الأعلى.",
    noReports: "أرشيف التقارير نظيف بالكامل. لا توجد بلاغات معلقة.",
    noNotifications: "لا توجد برقيات واردة في السجل حالياً.",
    activeTournaments: "العمليات النشطة",
    completedTournaments: "العمليات المكتملة والمؤرشفة",
    upcomingTournaments: "العمليات المجدولة مستقبلاً",
    addTournament: "تأسيس عملية عسكرية جديدة",
    noTournaments: "لا توجد بطولات أو عمليات عسكرية مجدولة حالياً."
  },
  en: {
    title: "Suicide Squad",
    subtitle: "Suicide Squad Free Fire Clan",
    commanderTitle: "Tactical Command & Control Center",
    tagline: "Discipline . Power . Victory or Martyrdom",
    login: "Log In",
    register: "Request Tactical Registration",
    username: "Username",
    password: "Personal Password",
    clanPassword: "Clan Access Password (Shared)",
    nickname: "In-Game Name (Nickname)",
    personalPassHelp: "Choose a highly secure password to protect your soldier profile.",
    clanPassHelp: "The shared military password required to decrypt access.",
    backToService: "Return to Service",
    loggingIn: "Connecting to military satellite server...",
    registering: "Encrypting and filing identity in tactical database...",
    loginSuccess: "Identity verified. Welcome to the Command Operations Center.",
    registerSuccess: "Soldier profile successfully created! You may now log in.",
    logout: "Log Out",
    dashboard: "Dashboard",
    members: "Squad Registry",
    divisions: "Combat Divisions",
    ssfDivision: "Special Security Force (SSF)",
    rules: "Military Code",
    tournaments: "Operations & Leagues",
    clanWar: "Clan War Operations",
    activities: "Tactical Drills",
    reports: "Security Dispatches",
    settings: "Sovereign Settings",
    notifications: "Secure Dispatches",
    welcomeCommander: "Welcome, Officer in Charge",
    clanNotice: "Direct Command Dispatches",
    news: "Frontline & Clan Intel",
    upcomingActivities: "Upcoming Tactical Drills & Exercises",
    currentTournaments: "Ongoing Military Operations & Leagues",
    memberId: "Service ID",
    role: "Military Rank",
    divisionLabel: "Assigned Division",
    status: "Service Status",
    joinDate: "Enlistment Date",
    actions: "Tactical Actions",
    addMember: "Enlist New Soldier",
    removeMember: "Dishonorable Discharge",
    promote: "Promote Rank",
    demote: "Demote Rank",
    changeDivision: "Transfer Division",
    suspend: "Suspend Active Duty",
    activate: "Re-activate Duty",
    founder: "Founder (Commander-in-Chief)",
    admin: "Tactical Administrator",
    regular: "Combatant (Regular)",
    submitReport: "Dispatch Secure Security Report",
    reportTitle: "Security Report Subject",
    reportDesc: "Full description of infraction or situation",
    screenshot: "Attach Visual Proof (Optional)",
    submit: "Dispatch Report",
    reportsPanel: "Military Intelligence Archives",
    resolve: "Resolve & Archive File",
    resolved: "Resolved & Closed",
    pending: "Under Intelligence Review",
    newAnnouncement: "Broadcast New High-Priority Command Dispatch",
    announcementTitle: "Dispatch Title (Arabic)",
    announcementTitleEn: "Dispatch Title (English)",
    announcementContent: "Dispatch Content (Arabic)",
    announcementContentEn: "Dispatch Content (English)",
    send: "Broadcast Dispatch",
    generalSettings: "Encryption Codes & Sovereign Database Controls",
    changeClanPassword: "Modify Shared Clan Access Password",
    toggleReg: "Allow Combatant Self-Registration",
    save: "Authorize Settings Save",
    language: "Sovereign Language",
    backHome: "Return to Headquarters",
    pointsRequired: "Required Combat Points",
    schedule: "Operational Timeframe",
    instructions: "Battlefield Directives & Strategic Plans",
    rulesOfEngagement: "Rules of Engagement",
    joinTournament: "Enlist in Active Operation",
    joinRequestSent: "Enlistment request dispatched. Awaiting command authorization.",
    approve: "Approve Enlistment",
    reject: "Reject Request",
    requestsList: "Combatants Awaiting Mission Authorization",
    divisionScvTitle: "SCV - Shock Storm Cavalry",
    divisionScvDesc: "Rapid assault and direct penetration squad. Mission is to shatter enemy defensive lines and secure initial hot drops.",
    divisionTacTitle: "TAC - Tactical Auxiliary Command",
    divisionTacDesc: "Responsible for micro-planning, defensive fortifying (Gloo Walls), safe-zone mapping, and fire support direction.",
    divisionVfxTitle: "VFX - Virtual Reconnaissance Elite",
    divisionVfxDesc: "Specializes in extreme sniping, headshots, scanning enemy positions, and combat media intelligence.",
    divisionRdfTitle: "RDF - Rapid Deterrence Force",
    divisionRdfDesc: "Heavy defense, tactical backing of retreats, and swift deployment to reconstruct crumbling lines in critical final rings.",
    divisionSsfTitle: "SSF - Special Security Force",
    divisionSsfDesc: "The clan's intelligence and internal counter-espionage department. Directly answering only to the Founder. Tasked with safeguarding unity, ensuring iron discipline, auditing behavioral reports, and monitoring operations.",
    ssfRestricted: "Restricted Military Sector! Only the Founder (Commander-in-Chief) can assign agents or modify Special Security Force (SSF) files.",
    noSsfMembers: "No tactical agents currently deployed to Special Security Force duty.",
    adminResponsibilities: "Assigned Responsibilities for the 3 Authorized Officers",
    responsibility1: "1. Manage, approve, and distribute newly enlisted soldiers to active combat divisions (excluding SSF).",
    responsibility2: "2. Inspect, address, and resolve security dispatches and member disputes immediately.",
    responsibility3: "3. Direct weekly drills, schedule friendly scrims, and coordinate authorized operations and leagues.",
    registeredMembers: "Registered Personnel",
    newMemberName: "New Username",
    newMemberNick: "New In-Game Name",
    newMemberPass: " soldier Personal Password",
    newMemberRole: "Assigned Rank",
    createMemberBtn: "Authorize Enlistment",
    clanWarNoticeTitle: "Official Clan War Directive",
    pointsHelp: "Minimum combat points required to accumulate during this active clan operation.",
    addActivity: "Schedule Tactical Drill",
    activityType: "Operation Type",
    event: "Special Event",
    training: "Tactical Drill",
    friendlyRoom: "Friendly Scrim",
    meeting: "Crisis Council",
    announcement: "Operational Notice",
    activityDate: "Operation Timestamp",
    delete: "Dismantle & Delete",
    requiredFields: "Please input all required fields with proper translations.",
    reportInstruction: "Encountered toxic conduct or violation of the military code? Submit an encrypted report directly to military intelligence.",
    reportTitlePlace: "Example: Toxic language during training scrim",
    reportDescPlace: "Provide a meticulous account of the incident, listing specific handles, timestamps, and dates.",
    ownerSettingsOnly: "Cryptographic Protocols & Sovereign Control - Exclusive to Commander-in-Chief.",
    noReports: "Sovereign intelligence archives are fully clear. No pending files.",
    noNotifications: "No secure dispatches in local terminal archives.",
    activeTournaments: "Active Operations",
    completedTournaments: "Completed & Archived Operations",
    upcomingTournaments: "Scheduled Future Operations",
    addTournament: "Establish New Military Operation",
    noTournaments: "No active or scheduled military leagues on file."
  }
};
