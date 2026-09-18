import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contests: router({
    list: publicProcedure.query(async () => {
      await db.seedInitialPlatformDataIfEmpty();
      return await db.listContests(false);
    }),

    listAllForAdmin: adminProcedure.query(async () => {
      await db.seedInitialPlatformDataIfEmpty();
      return await db.listContests(true);
    }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        await db.seedInitialPlatformDataIfEmpty();
        const contest = await db.getContestBySlug(input.slug);
        if (!contest) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Конкурс не найден" });
        }
        return contest;
      }),

    create: adminProcedure
      .input(
        z.object({
          slug: z.string().min(2),
          title: z.string().min(3),
          shortTitle: z.string().optional(),
          discipline: z.enum(["vocal", "choreography", "theater", "instrumental", "circus", "art"]),
          disciplineLabel: z.string().min(2),
          badge: z.string().default("Регулярный проект"),
          status: z.enum(["active", "archived", "draft"]).default("active"),
          receptionPeriod: z.string().min(2),
          resultsPeriod: z.string().min(2),
          feeAmount: z.number().default(790),
          cardImage: z.string().min(1),
          bannerImage: z.string().optional(),
          accentColor: z.string().default("#2563eb"),
          description: z.string().min(10),
          juryNames: z.string().min(3),
          isSeasonal: z.boolean().default(false),
          sortOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        const id = await db.createContest(input);
        return { success: true, id };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          shortTitle: z.string().optional(),
          disciplineLabel: z.string().optional(),
          badge: z.string().optional(),
          status: z.enum(["active", "archived", "draft"]).optional(),
          receptionPeriod: z.string().optional(),
          resultsPeriod: z.string().optional(),
          feeAmount: z.number().optional(),
          cardImage: z.string().optional(),
          accentColor: z.string().optional(),
          description: z.string().optional(),
          juryNames: z.string().optional(),
          isSeasonal: z.boolean().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateContest(id, data);
        return { success: true };
      }),

    duplicate: adminProcedure
      .input(
        z.object({
          sourceId: z.number(),
          newSlug: z.string().min(2),
          newTitle: z.string().min(3),
        })
      )
      .mutation(async ({ input }) => {
        const newId = await db.duplicateContest(input.sourceId, input.newSlug, input.newTitle);
        return { success: true, newId };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteContest(input.id);
        return { success: true };
      }),

    saveRegulation: adminProcedure
      .input(
        z.object({
          contestId: z.number(),
          sectionKey: z.string().min(1),
          title: z.string().min(1),
          content: z.string().min(1),
          sortOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        const id = await db.saveRegulationSection(input);
        return { success: true, id };
      }),
  }),

  reports: router({
    list: publicProcedure.query(async () => {
      await db.seedInitialPlatformDataIfEmpty();
      return await db.listReports();
    }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        await db.seedInitialPlatformDataIfEmpty();
        const report = await db.getReportBySlug(input.slug);
        if (!report) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Отчет не найден" });
        }
        return report;
      }),

    create: adminProcedure
      .input(
        z.object({
          slug: z.string().min(2),
          title: z.string().min(3),
          category: z.string().default("Официальный отчет"),
          publishedDate: z.string().min(2),
          periodLabel: z.string().optional(),
          summary: z.string().min(5),
          fullReport: z.string().min(10),
          protocolUrl: z.string().optional(),
          isFeatured: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        const id = await db.createReport(input);
        return { success: true, id };
      }),

    uploadProtocol: adminProcedure
      .input(
        z.object({
          fileName: z.string().min(1).max(180),
          contentType: z.string().min(1).max(120),
          base64Data: z.string().min(1).max(20_000_000),
        })
      )
      .mutation(async ({ input }) => {
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(input.contentType)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Разрешены только PDF и документы Word (.doc, .docx)",
          });
        }

        const safeFileName = input.fileName.replace(/[^a-zA-Zа-яА-Я0-9._-]/g, "_");
        const bytes = Buffer.from(input.base64Data, "base64");
        const uploaded = await storagePut(`artcode/reports/${Date.now()}-${safeFileName}`, bytes, input.contentType);
        return { success: true, url: uploaded.url, key: uploaded.key };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          publishedDate: z.string().optional(),
          periodLabel: z.string().optional(),
          summary: z.string().optional(),
          fullReport: z.string().optional(),
          protocolUrl: z.string().optional(),
          isFeatured: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateReport(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteReport(input.id);
        return { success: true };
      }),
  }),

  applications: router({
    submit: publicProcedure
      .input(
        z.object({
          contestId: z.number(),
          contestSlug: z.string(),
          contestTitle: z.string(),
          discipline: z.string(),
          participantName: z.string().min(2, "Укажите ФИО участника"),
          collectiveName: z.string().optional(),
          ageCategory: z.string().min(1, "Выберите возрастную категорию"),
          nomination: z.string().min(2, "Укажите номинацию"),
          performanceTitle: z.string().min(2, "Укажите название конкурсного номера"),
          videoUrl: z.string().url("Введите корректную ссылку на видеозапись"),
          teacherName: z.string().optional(),
          institution: z.string().optional(),
          city: z.string().min(2, "Укажите город"),
          email: z.string().email("Введите корректный email"),
          phone: z.string().min(6, "Введите контактный номер телефона"),
          comment: z.string().optional(),
          paymentAmount: z.number().default(790),
        })
      )
      .mutation(async ({ input }) => {
        const orderId = `ART-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const appId = await db.createApplication({
          ...input,
          status: "new",
          paymentStatus: "pending",
          paymentInvoiceId: orderId,
        });

        // Создаем каркас транзакции PayKeeper
        await db.createPaymentTransaction({
          applicationId: appId,
          orderId,
          amount: input.paymentAmount,
          clientEmail: input.email,
          clientPhone: input.phone,
          serviceName: `Оргвзнос: ${input.contestTitle}`,
          status: "created",
        });

        return {
          success: true,
          applicationId: appId,
          orderId,
          paymentAmount: input.paymentAmount,
          message: "Заявка успешно зарегистрирована. Перейдите к оплате организационного взноса.",
        };
      }),

    list: adminProcedure
      .input(z.object({ contestSlug: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.listApplications(input?.contestSlug);
      }),

    exportCsv: adminProcedure
      .input(z.object({ contestSlug: z.string().optional() }).optional())
      .mutation(async ({ input }) => {
        const csvContent = await db.exportApplicationsCsv(input?.contestSlug);
        return {
          csv: csvContent,
          filename: `artcode-applications-${input?.contestSlug || "all"}-${new Date().toISOString().slice(0, 10)}.csv`,
        };
      }),
  }),

  payment: router({
    createInvoice: publicProcedure
      .input(
        z.object({
          orderId: z.string(),
          amount: z.number(),
          clientId: z.string().min(2),
          clientEmail: z.string().email(),
          clientPhone: z.string().optional(),
          serviceName: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const paykeeperServer = process.env.PAYKEEPER_SERVER_URL?.replace(/\/+$/, "");
        const apiToken = process.env.PAYKEEPER_API_TOKEN;
        const callbackUrl = process.env.PAYKEEPER_RESULT_CALLBACK_URL;

        if (!paykeeperServer || !apiToken) {
          return {
            orderId: input.orderId,
            amount: input.amount,
            isConfigured: false,
            paymentUrl: null,
            instructions:
              "Оплата временно недоступна: организатор еще не внес серверный URL и API-токен PayKeeper.",
          };
        }

        const serviceName = JSON.stringify({
          service_name: input.serviceName,
          lang: "ru",
          user_result_callback: callbackUrl,
          custom_data: JSON.stringify({ orderId: input.orderId }),
        });

        const formData = new URLSearchParams({
          pay_amount: input.amount.toFixed(2),
          clientid: input.clientId,
          orderid: input.orderId,
          service_name: serviceName,
          client_email: input.clientEmail,
          client_phone: input.clientPhone || "",
          token: apiToken,
        });

        try {
          const response = await fetch(`${paykeeperServer}/change/invoice/preview/`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
          });

          if (!response.ok) {
            throw new Error(`PayKeeper returned HTTP ${response.status}`);
          }

          const invoice = (await response.json()) as { invoice_id?: string; invoice_url?: string };
          if (!invoice.invoice_id || !invoice.invoice_url) {
            throw new Error("PayKeeper returned an incomplete invoice response");
          }

          await db.setPaymentInvoice(input.orderId, invoice.invoice_id, invoice.invoice_url);
          return {
            orderId: input.orderId,
            amount: input.amount,
            isConfigured: true,
            paymentUrl: invoice.invoice_url,
            invoiceId: invoice.invoice_id,
          };
        } catch (error) {
          console.error("[PayKeeper] Failed to create invoice", error);
          throw new TRPCError({
            code: "BAD_GATEWAY",
            message: "Не удалось создать счет PayKeeper. Попробуйте позже или свяжитесь с организатором.",
          });
        }
      }),

    callbackSimulation: adminProcedure
      .input(
        z.object({
          orderId: z.string(),
          status: z.enum(["paid", "failed"]),
        })
      )
      .mutation(async ({ input }) => {
        await db.updatePaymentTransaction(input.orderId, input.status, JSON.stringify({ simulated: true }));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
