import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  applications,
  contestRegulations,
  contestReports,
  contests,
  InsertApplication,
  InsertContest,
  InsertContestRegulation,
  InsertContestReport,
  InsertPaymentTransaction,
  InsertUser,
  paymentTransactions,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ----------------- Contests -----------------

export async function listContests(includeDrafts = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(contests).orderBy(contests.sortOrder, contests.id);
  if (includeDrafts) return rows;
  return rows.filter((c) => c.status === "active");
}

export async function getContestBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(contests).where(eq(contests.slug, slug)).limit(1);
  if (rows.length === 0) return null;
  const contest = rows[0];

  const regulations = await db
    .select()
    .from(contestRegulations)
    .where(eq(contestRegulations.contestId, contest.id))
    .orderBy(contestRegulations.sortOrder, contestRegulations.id);

  return { ...contest, regulations };
}

export async function createContest(data: InsertContest) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  const result = await db.insert(contests).values(data);
  const insertId = Number((result as any)[0]?.insertId || 0);
  return insertId;
}

export async function updateContest(id: number, data: Partial<InsertContest>) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.update(contests).set(data).where(eq(contests.id, id));
  return true;
}

export async function deleteContest(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.delete(contestRegulations).where(eq(contestRegulations.contestId, id));
  await db.delete(contests).where(eq(contests.id, id));
  return true;
}

export async function duplicateContest(sourceId: number, newSlug: string, newTitle: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  const source = await db.select().from(contests).where(eq(contests.id, sourceId)).limit(1);
  if (source.length === 0) throw new Error("Source contest not found");

  const s = source[0];
  const insertContest: InsertContest = {
    slug: newSlug,
    title: newTitle,
    shortTitle: s.shortTitle,
    discipline: s.discipline,
    disciplineLabel: s.disciplineLabel,
    badge: s.badge,
    status: "active",
    receptionPeriod: s.receptionPeriod,
    resultsPeriod: s.resultsPeriod,
    feeAmount: s.feeAmount,
    cardImage: s.cardImage,
    bannerImage: s.bannerImage,
    accentColor: s.accentColor,
    description: s.description,
    juryNames: s.juryNames,
    isSeasonal: true,
    sortOrder: s.sortOrder + 1,
  };

  const result = await db.insert(contests).values(insertContest);
  const newContestId = Number((result as any)[0]?.insertId || 0);

  const existingRegulations = await db
    .select()
    .from(contestRegulations)
    .where(eq(contestRegulations.contestId, sourceId));

  for (const reg of existingRegulations) {
    await db.insert(contestRegulations).values({
      contestId: newContestId,
      sectionKey: reg.sectionKey,
      title: reg.title,
      content: reg.content,
      sortOrder: reg.sortOrder,
    });
  }

  return newContestId;
}

// ----------------- Regulations -----------------

export async function saveRegulationSection(reg: InsertContestRegulation) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  const existing = await db
    .select()
    .from(contestRegulations)
    .where(eq(contestRegulations.contestId, reg.contestId));

  const match = existing.find((e) => e.sectionKey === reg.sectionKey);
  if (match) {
    await db
      .update(contestRegulations)
      .set({
        title: reg.title,
        content: reg.content,
        sortOrder: reg.sortOrder ?? match.sortOrder,
      })
      .where(eq(contestRegulations.id, match.id));
    return match.id;
  }

  const result = await db.insert(contestRegulations).values(reg);
  return Number((result as any)[0]?.insertId || 0);
}

// ----------------- Reports -----------------

export async function listReports() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contestReports).orderBy(desc(contestReports.id));
}

export async function getReportBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(contestReports).where(eq(contestReports.slug, slug)).limit(1);
  return rows[0] || null;
}

export async function createReport(data: InsertContestReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  const result = await db.insert(contestReports).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

export async function updateReport(id: number, data: Partial<InsertContestReport>) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.update(contestReports).set(data).where(eq(contestReports.id, id));
  return true;
}

export async function deleteReport(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.delete(contestReports).where(eq(contestReports.id, id));
  return true;
}

// ----------------- Applications -----------------

export async function createApplication(data: InsertApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  const result = await db.insert(applications).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

export async function listApplications(contestSlug?: string) {
  const db = await getDb();
  if (!db) return [];

  if (contestSlug && contestSlug !== "all") {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.contestSlug, contestSlug))
      .orderBy(desc(applications.id));
  }

  return await db.select().from(applications).orderBy(desc(applications.id));
}

export async function exportApplicationsCsv(contestSlug?: string): Promise<string> {
  const items = await listApplications(contestSlug);
  const header = [
    "ID",
    "Дата",
    "Конкурс",
    "Номинация",
    "Участник / Коллектив",
    "Возраст",
    "Название номера",
    "Ссылка на видео",
    "Преподаватель",
    "Учреждение",
    "Город",
    "Email",
    "Телефон",
    "Статус заявки",
    "Статус оплаты",
    "Сумма (руб)",
  ];

  const escapeCell = (val: unknown) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = items.map((app) => [
    app.id,
    app.createdAt ? new Date(app.createdAt).toLocaleString("ru-RU") : "",
    app.contestTitle,
    app.nomination,
    app.collectiveName ? `${app.participantName} (${app.collectiveName})` : app.participantName,
    app.ageCategory,
    app.performanceTitle,
    app.videoUrl,
    app.teacherName || "",
    app.institution || "",
    app.city,
    app.email,
    app.phone,
    app.status,
    app.paymentStatus,
    app.paymentAmount,
  ]);

  return [header.map(escapeCell).join(";"), ...rows.map((r) => r.map(escapeCell).join(";"))].join("\n");
}

// ----------------- PayKeeper Transactions -----------------

export async function createPaymentTransaction(data: InsertPaymentTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  const result = await db.insert(paymentTransactions).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

export async function setPaymentInvoice(orderId: string, invoiceId: string, payUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db
    .update(paymentTransactions)
    .set({
      paykeeperId: invoiceId,
      payUrl,
      status: "created",
    })
    .where(eq(paymentTransactions.orderId, orderId));
  return true;
}

export async function getPaymentTransaction(orderId: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.orderId, orderId))
    .limit(1);
  return rows[0] || null;
}

export async function getPaymentVerificationData(orderId: string) {
  const transaction = await getPaymentTransaction(orderId);
  if (!transaction) return null;
  let application = null;

  if (transaction.applicationId) {
    const db = await getDb();
    if (db) {
      const apps = await db
        .select()
        .from(applications)
        .where(eq(applications.id, transaction.applicationId))
        .limit(1);
      application = apps[0] || null;
    }
  }

  return { transaction, application };
}

export async function updatePaymentTransaction(orderId: string, status: "paid" | "failed" | "cancelled", payload?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db
    .update(paymentTransactions)
    .set({
      status,
      callbackPayload: payload,
    })
    .where(eq(paymentTransactions.orderId, orderId));

  // Если привязана заявка — синхронизируем статус заявки
  const txs = await db.select().from(paymentTransactions).where(eq(paymentTransactions.orderId, orderId)).limit(1);
  if (txs.length > 0 && txs[0].applicationId) {
    await db
      .update(applications)
      .set({
        paymentStatus: status === "paid" ? "paid" : "failed",
        status: status === "paid" ? "paid" : "new",
        paidAt: status === "paid" ? new Date() : null,
      })
      .where(eq(applications.id, txs[0].applicationId));
  }

  return true;
}

// ----------------- Seeder -----------------

export async function seedInitialPlatformDataIfEmpty() {
  const db = await getDb();
  if (!db) return;

  const currentContests = await db.select().from(contests).limit(1);
  if (currentContests.length === 0) {
    console.log("[Platform Seed] Seeding initial contests and regulations...");

    const initialContests = [
      {
        slug: "misteriya-zvuka",
        title: "IV Международный конкурс народного и академического вокала «Мистерия звука»",
        shortTitle: "Мистерия звука (Вокал)",
        discipline: "vocal" as const,
        disciplineLabel: "Вокал",
        badge: "Регулярный проект",
        receptionPeriod: "Ежемесячный прием заявок (с 1 по 25 число)",
        resultsPeriod: "Итоги через 14 дней после окончания приема",
        feeAmount: 790,
        cardImage: "/manus-storage/folk-academic-vocal-headsafe_a0ddd57b.jpg",
        accentColor: "#2563eb",
        description: "Международный проект ТО «Триумф». Оценивается профессиональным экспертным советом из Италии, Франции и России.",
        juryNames: "Сильвио Занон (Италия), Альберт Жалилов (Россия), Элен Бержи (Франция)",
        sortOrder: 10,
        regulations: [
          {
            sectionKey: "goals",
            title: "Цели и задачи",
            content: "Выявление талантливых вокалистов, популяризация академического и народного певческого наследия, повышение квалификации педагогов и методическая поддержка руководителей творческих коллективов.",
          },
          {
            sectionKey: "nominations",
            title: "Номинации",
            content: "Академический вокал, народный вокал, фольклорные ансамбли, хоровое искусство, авторская песня, патриотическая песня, духовная музыка.",
          },
          {
            sectionKey: "age_categories",
            title: "Возрастные категории",
            content: "Дошкольная (до 6 лет), Младшая (7–9 лет), Средняя (10–12 лет), Старшая (13–15 лет), Юношеская (16–18 лет), Молодежная (19–25 лет), Взрослая (от 26 лет), Смешанная группа.",
          },
          {
            sectionKey: "requirements",
            title: "Требования к конкурсным материалам",
            content: "Видеозапись живого выступления, снятая на статичную камеру без монтажа и постобработки звука. Разрешение видео — не менее 720p. Допускаются записи не старше 2 лет.",
          },
          {
            sectionKey: "performance_program",
            title: "Программа выступления",
            content: "Один отдельный конкурсный номер хронометражем до 5 минут. Исполнение возможно a cappella или под фонограмму минус один.",
          },
          {
            sectionKey: "jury",
            title: "Экспертный совет",
            content: "В состав жюри входят Сильвио Занон (баритон, педагог, La Scala, Верона), Альберт Жалилов (заслуженный артист, солист, Санкт-Петербург), Элен Бержи (директор международного фестиваля, Париж).",
          },
          {
            sectionKey: "evaluation_criteria",
            title: "Критерии оценки",
            content: "Чистота интонации, вокальная техника, музыкальность, глубина раскрытия художественного образа, сценическая культура и соответствие репертуара возрасту исполнителя.",
          },
          {
            sectionKey: "financial_conditions",
            title: "Финансовые условия",
            content: "Организационный взнос за участие одного конкурсного номера составляет 790 рублей. Оплата производится онлайн банковской картой через шлюз PayKeeper.",
          },
        ],
      },
      {
        slug: "tantsy-triumph",
        title: "I Международный конкурс хореографического искусства «ТАНЦЫ.ТРИУМФ»",
        shortTitle: "ТАНЦЫ.ТРИУМФ (Хореография)",
        discipline: "choreography" as const,
        disciplineLabel: "Хореография",
        badge: "Хореографический проект",
        receptionPeriod: "Ежемесячный прием заявок",
        resultsPeriod: "Итоги через 14 дней после окончания приема",
        feeAmount: 790,
        cardImage: "/manus-storage/dance-competition_ccbc075c.jpg",
        accentColor: "#7c3aed",
        description: "Масштабный хореографический проект для детских, юношеских и взрослых коллективов со всего мира.",
        juryNames: "Ю Юмамото (Япония), Дана Фалькович (Беларусь), Руслан Бальбуциев (Россия)",
        sortOrder: 20,
        regulations: [
          {
            sectionKey: "goals",
            title: "Цели и задачи",
            content: "Развитие хореографического искусства, обмен творческим опытом балетмейстеров и коллективов, поддержка молодых исполнителей.",
          },
          {
            sectionKey: "nominations",
            title: "Номинации",
            content: "Классический танец, народно-сценический танец, современная хореография (контемпорари, модерн), эстрадный танец, уличные направления, детский танец.",
          },
          {
            sectionKey: "age_categories",
            title: "Возрастные категории",
            content: "Младшая (до 9 лет), Средняя (10–13 лет), Старшая (14–17 лет), Взрослая (18+), Смешанная.",
          },
          {
            sectionKey: "requirements",
            title: "Требования к видеозаписи",
            content: "Полный сценический обзор коллектива, статичная камера, хорошее сценическое освещение. Номер исполняется в костюмах.",
          },
          {
            sectionKey: "jury",
            title: "Экспертный совет",
            content: "Ю Юмамото (хореограф, балетмейстер, Токио), Дана Фалькович (педагог высшей категории, Минск), Руслан Бальбуциев (режиссер, хореограф, Санкт-Петербург).",
          },
          {
            sectionKey: "financial_conditions",
            title: "Финансовые условия",
            content: "Организационный взнос — 790 руб. В стоимость входит диплом международного образца, благодарность руководителю и персональная рецензия.",
          },
        ],
      },
      {
        slug: "mir-teatra",
        title: "IV Международный конкурс театрального искусства «Мир театра»",
        shortTitle: "Мир театра (Театр)",
        discipline: "theater" as const,
        disciplineLabel: "Театр и художественное слово",
        badge: "Регулярный проект",
        receptionPeriod: "Ежемесячный прием заявок",
        resultsPeriod: "Итоги через 14 дней после окончания приема",
        feeAmount: 790,
        cardImage: "/manus-storage/theatre-competition_263faeac.jpg",
        accentColor: "#059669",
        description: "Проект для школьных, студенческих и независимых театров. Экспертиза от театральных деятелей Лондона и Санкт-Петербурга.",
        juryNames: "Дмитрий Девдариани (Великобритания), Руслан Бальбуциев (Россия), Сильвио Занон (Италия)",
        sortOrder: 30,
        regulations: [
          {
            sectionKey: "goals",
            title: "Цели и задачи",
            content: "Популяризация театрального искусства, поддержка любительских и профессиональных трупп, развитие искусства художественного слова.",
          },
          {
            sectionKey: "nominations",
            title: "Номинации",
            content: "Драматический театр, музыкальный театр, кукольный театр, пластический театр, художественное слово, литературно-музыкальная композиция.",
          },
          {
            sectionKey: "jury",
            title: "Экспертный совет",
            content: "Дмитрий Девдариани (Лондон), Руслан Бальбуциев (Санкт-Петербург), Сильвио Занон (Верона).",
          },
          {
            sectionKey: "financial_conditions",
            title: "Финансовые условия",
            content: "Организационный взнос — 790 руб. Наградной пакет отправляется на электронную почту в течение 7 дней после публикации итогов.",
          },
        ],
      },
      {
        slug: "muzykalnaya-shkatulka",
        title: "IV Международный конкурс инструментального творчества «Музыкальная шкатулка»",
        shortTitle: "Музыкальная шкатулка (Инструменты)",
        discipline: "instrumental" as const,
        disciplineLabel: "Инструментальное творчество",
        badge: "Академический уровень",
        receptionPeriod: "Ежемесячный прием заявок",
        resultsPeriod: "Итоги через 14 дней после окончания приема",
        feeAmount: 790,
        cardImage: "/manus-storage/instrumental-competition_c8d515e8.jpg",
        accentColor: "#d97706",
        description: "Конкурс академического и народного исполнительства с акцентом на чистоту звукоизвлечения и технику.",
        juryNames: "Элен Бержи (Франция), Томас Кройцбергер (Австрия), Александр Палей (США)",
        sortOrder: 40,
        regulations: [
          {
            sectionKey: "goals",
            title: "Цели и задачи",
            content: "Сохранение традиций инструментального исполнительства, развитие исполнительской культуры и поддержка одаренных музыкантов.",
          },
          {
            sectionKey: "nominations",
            title: "Номинации",
            content: "Фортепиано, струнные инструменты, духовые и ударные, народные инструменты, камерные ансамбли, оркестры.",
          },
          {
            sectionKey: "requirements",
            title: "Требования к видеозаписи",
            content: "На видеозаписи участников должны быть обязательно отчетливо видны руки и лицо исполнителя. Съемка одним дублем.",
          },
          {
            sectionKey: "jury",
            title: "Экспертный совет",
            content: "Элен Бержи (Париж), Томас Кройцбергер (Вена), Александр Палей (Нью-Йорк).",
          },
        ],
      },
      {
        slug: "new-circus",
        title: "XIII Международный конкурс циркового искусства «New-Circus»",
        shortTitle: "New-Circus (Цирк)",
        discipline: "circus" as const,
        disciplineLabel: "Цирковое искусство",
        badge: "Профильный проект",
        receptionPeriod: "Ежемесячный прием заявок",
        resultsPeriod: "Итоги через 14 дней после окончания приема",
        feeAmount: 790,
        cardImage: "/manus-storage/circus-competition_9c3aed67.jpg",
        accentColor: "#dc2626",
        description: "Ежегодный смотр цирковых студий и солистов с участием профессиональных режиссеров цирка.",
        juryNames: "Анас Хатыфович Халиуллин (Татарстан), Ю Юмамото (Япония), Руслан Бальбуциев (Россия)",
        sortOrder: 50,
        regulations: [
          {
            sectionKey: "goals",
            title: "Цели и задачи",
            content: "Развитие любительского и профессионального циркового движения, оценка сложности трюков и сценического образа.",
          },
          {
            sectionKey: "nominations",
            title: "Номинации",
            content: "Акробатика, воздушная гимнастика, эквилибр, жонглирование, клоунада, оригинальный жанр.",
          },
          {
            sectionKey: "jury",
            title: "Экспертный совет",
            content: "Анас Халиуллин (заслуженный артист РТ, режиссер цирка), Ю Юмамото (хореограф, Токио), Руслан Бальбуциев (режиссер, Санкт-Петербург).",
          },
        ],
      },
      {
        slug: "art-hit",
        title: "XIII Международный конкурс эстрадного вокала «ART-HIT»",
        shortTitle: "ART-HIT (Эстрадный вокал)",
        discipline: "vocal" as const,
        disciplineLabel: "Эстрадный вокал",
        badge: "Популярное",
        receptionPeriod: "Ежемесячный прием заявок",
        resultsPeriod: "Итоги через 14 дней после окончания приема",
        feeAmount: 790,
        cardImage: "/manus-storage/vocal-competition_ef105875.jpg",
        accentColor: "#ea580c",
        description: "Проект для вокалистов и ансамблей эстрадного направления со всего мира.",
        juryNames: "Руслан Бальбуциев (Россия), Сильвио Занон (Италия), Альберт Жалилов (Россия)",
        sortOrder: 60,
        regulations: [
          {
            sectionKey: "goals",
            title: "Цели и задачи",
            content: "Выявление ярких эстрадных исполнителей, содействие творческому росту и продвижению авторов и вокалистов.",
          },
          {
            sectionKey: "nominations",
            title: "Номинации",
            content: "Соло, дуэты, трио, вокальные ансамбли; направления: эстрадная песня, джаз, поп-рок, ретро-хит, авторская песня.",
          },
          {
            sectionKey: "jury",
            title: "Экспертный совет",
            content: "Руслан Бальбуциев (Санкт-Петербург), Сильвио Занон (Верона), Альберт Жалилов (Санкт-Петербург).",
          },
        ],
      },
    ];

    for (const c of initialContests) {
      const { regulations: regList, ...contestData } = c;
      const res = await db.insert(contests).values(contestData);
      const contestId = Number((res as any)[0]?.insertId || 0);

      if (regList && contestId) {
        for (let i = 0; i < regList.length; i++) {
          await db.insert(contestRegulations).values({
            contestId,
            sectionKey: regList[i].sectionKey,
            title: regList[i].title,
            content: regList[i].content,
            sortOrder: i * 10,
          });
        }
      }
    }
  }

  const currentReports = await db.select().from(contestReports).limit(1);
  if (currentReports.length === 0) {
    console.log("[Platform Seed] Seeding initial reports...");
    const initialReports: InsertContestReport[] = [
      {
        slug: "itogi-artcode-30-11-14-12",
        title: "Отчет об итогах конкурсов ARTCODE (период 30/11 — 14/12)",
        category: "Официальный отчет",
        publishedDate: "15 декабря",
        periodLabel: "30 ноября — 14 декабря",
        summary: "Опубликованы результаты профильных конкурсов ARTCODE. В конкурсах приняли участие солисты и творческие коллективы из регионов России и зарубежных стран.",
        fullReport: `### Итоги конкурсного периода 30/11 — 14/12\n\nОрганизационный комитет ТО «Триумф» завершил экспертную оценку конкурсных программ по направлениям «Вокал», «Хореография», «Театр» и «Инструментальное исполнительство».\n\n- Всего участников: 142 конкурсных номера.\n- Экспертная коллегия: педагоги ведущих консерваторий и заслуженные деятели искусств.\n- Наградные материалы и персональные рецензии высланы участникам на указанные в заявках адреса электронной почты.`,
        isFeatured: true,
      },
      {
        slug: "itogi-artcode-17-12-10-01",
        title: "Отчет об итогах конкурсов ARTCODE (период 17/12 — 10/01)",
        category: "Официальный отчет",
        publishedDate: "11 января",
        periodLabel: "17 декабря — 10 января",
        summary: "В ленте опубликованы официальные итоги экспертизы заочных конкурсов. Участникам направлены наградные документы и именные рецензии экспертов.",
        fullReport: `### Итоги новогоднего и январского периода 17/12 — 10/01\n\nПоздравляем обладателей Гран-при и дипломантов международных конкурсов платформы ARTCODE. Протоколы утверждены председателями экспертных комиссий.\n\n- Проведено рецензирование выступлений академического, народного и эстрадного отделений.\n- Обладатели специальных призов получили приглашения на очные фестивальные программы ТО «Триумф».`,
        isFeatured: true,
      },
      {
        slug: "itogi-artcode-12-01-26-01",
        title: "Отчет об итогах конкурсов ARTCODE (период 12/01 — 26/01)",
        category: "Официальный отчет",
        publishedDate: "27 января",
        periodLabel: "12 января — 26 января",
        summary: "Завершен январский конкурсный цикл. Экспертный совет подвел результаты, наградные пакеты и протоколы зарегистрированы оргкомитетом.",
        fullReport: `### Итоги зимнего конкурсного цикла 12/01 — 26/01\n\nВ рамках данного цикла экспертную оценку прошли сольные исполнители и творческие коллективы циркового, театрального и инструментального направлений.\n\nВсе документы оформлены на официальных бланках с подписями и печатями организатора.`,
        isFeatured: false,
      },
    ];

    for (const r of initialReports) {
      await db.insert(contestReports).values(r);
    }
  }
}
