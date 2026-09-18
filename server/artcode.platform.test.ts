import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-open-id",
      email: "admin@my-artcode.com",
      name: "Администратор ARTCODE",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("ARTCODE Platform Public and Admin APIs", () => {
  it("returns active competitions with complete public content", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const contests = await caller.contests.list();

    expect(Array.isArray(contests)).toBe(true);
    expect(contests.length).toBeGreaterThan(0);

    const first = contests[0];
    expect(first.title).toBeDefined();
    expect(first.slug).toBeDefined();

  });

  it("fetches individual contest with complete regulation sections", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const contest = await caller.contests.bySlug({ slug: "misteriya-zvuka" });

    expect(contest).toBeDefined();
    expect(contest.slug).toBe("misteriya-zvuka");
    expect(contest.regulations).toBeDefined();
    expect(contest.regulations.length).toBeGreaterThanOrEqual(4);

    const sectionKeys = contest.regulations.map((r) => r.sectionKey);
    expect(sectionKeys).toContain("goals");
    expect(sectionKeys).toContain("nominations");
  });

  it("lists official contest reports with dates and summaries", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const reports = await caller.reports.list();

    expect(Array.isArray(reports)).toBe(true);
    expect(reports.length).toBeGreaterThan(0);

    const rep = reports[0];
    expect(rep.title).toBeDefined();
    expect(rep.publishedDate).toBeDefined();
    expect(rep.summary).toBeDefined();
  });

  it("submits application and generates PayKeeper order id and fee amount", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.applications.submit({
      contestId: 1,
      contestSlug: "misteriya-zvuka",
      contestTitle: "IV Международный конкурс народного и академического вокала «Мистерия звука»",
      discipline: "Вокал",
      participantName: "Тимофей Рыбченков",
      ageCategory: "7-9 лет",
      nomination: "Академический вокал, соло",
      performanceTitle: "Романс «Жаворонок»",
      videoUrl: "https://disk.yandex.ru/i/sample-video-entry",
      city: "Санкт-Петербург",
      email: "artist.test@my-artcode.com",
      phone: "+7 (999) 111-22-33",
      paymentAmount: 790,
    });

    expect(result.success).toBe(true);
    expect(result.applicationId).toBeGreaterThan(0);
    expect(result.orderId).toMatch(/^ART-\d+-\d+$/);
    expect(result.paymentAmount).toBe(790);
  });

  it("allows admin to filter applications and export separate CSV for a contest", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());
    const apps = await adminCaller.applications.list({ contestSlug: "misteriya-zvuka" });
    expect(Array.isArray(apps)).toBe(true);

    const csvData = await adminCaller.applications.exportCsv({ contestSlug: "misteriya-zvuka" });
    expect(csvData.csv).toBeDefined();
    expect(csvData.filename).toContain("misteriya-zvuka");
    expect(csvData.csv).toContain('"ID";"Дата";"Конкурс";"Номинация";"Участник / Коллектив"');
  });
});
