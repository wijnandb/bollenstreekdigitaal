import { test, expect } from "@playwright/test";

const pages = [
  { path: "/", title: "AI & Digitaal Advies", h1: false },
  { path: "/diensten/", title: "Diensten", h1: "Diensten" },
  { path: "/diensten/workshops/", title: "Workshops", h1: "Workshops & trainingen" },
  { path: "/diensten/advies/", title: "Advies", h1: "Advies & implementatie" },
  { path: "/diensten/strategie/", title: "Strategie", h1: "Strategie" },
  { path: "/diensten/websites/", title: "Websites", h1: "Websites die converteren" },
  { path: "/tarieven/", title: "Tarieven", h1: "Tarieven" },
  { path: "/tarieven/websites/", title: "Website Pakketten", h1: "Een professionele website" },
  { path: "/tarieven/workshops/", title: "Tarieven Workshops", h1: "Workshops & trainingen" },
  { path: "/tarieven/advies/", title: "Tarieven Advies", h1: "Advies & implementatie" },
  { path: "/tarieven/strategie/", title: "Tarieven Strategie", h1: "Strategie & transformatie" },
  { path: "/over-ons/", title: "Over ons", h1: "Over ons" },
  { path: "/resultaten/", title: "Resultaten", h1: "Resultaten" },
  { path: "/faq/", title: "Veelgestelde vragen", h1: "Veelgestelde vragen" },
  { path: "/contact/", title: "Contact", h1: "Contact" },
  { path: "/ai-scan/", title: "AI-scan", h1: false },
  { path: "/privacybeleid/", title: "Privacybeleid", h1: "Privacybeleid" },
  { path: "/algemene-voorwaarden/", title: "Algemene voorwaarden", h1: "Algemene voorwaarden" },
];

for (const page of pages) {
  test(`${page.path} loads and has correct title`, async ({ page: p }) => {
    const response = await p.goto(page.path);
    expect(response?.status()).toBe(200);
    await expect(p).toHaveTitle(new RegExp(page.title));
  });

  if (page.h1) {
    test(`${page.path} has correct h1`, async ({ page: p }) => {
      await p.goto(page.path);
      await expect(p.locator("h1").first()).toContainText(page.h1 as string);
    });
  }
}

test("homepage has hero section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Slimmer ondernemen");
  await expect(page.locator("h1")).toContainText("Bollenstreek");
});

test("homepage has typewriter element", async ({ page }) => {
  await page.goto("/");
  const typewriter = page.locator("#typewriter");
  await expect(typewriter).toBeVisible();
  // Wait for first word to be typed
  await page.waitForFunction(() => {
    const el = document.getElementById("typewriter");
    return el && el.textContent && el.textContent.length > 0;
  }, null, { timeout: 5000 });
});

test("navigation links work", async ({ page }) => {
  await page.goto("/");
  // Check desktop nav exists
  const nav = page.locator("header nav").first();
  await expect(nav).toBeVisible();

  // Click diensten link in desktop nav
  await nav.locator('a[href="/diensten/"]').click();
  await expect(page).toHaveURL(/\/diensten\//);
  await expect(page.locator("h1")).toContainText("Diensten");
});

test("breadcrumbs present on subpages", async ({ page }) => {
  await page.goto("/diensten/");
  const breadcrumb = page.locator('nav[aria-label="Kruimelpad"]');
  await expect(breadcrumb).toBeVisible();
  await expect(breadcrumb).toContainText("Home");
  await expect(breadcrumb).toContainText("Diensten");
});

test("breadcrumbs have JSON-LD", async ({ page }) => {
  await page.goto("/faq/");
  const jsonLd = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const s of scripts) {
      try {
        const data = JSON.parse(s.textContent || "");
        if (data["@type"] === "BreadcrumbList") return data;
      } catch {}
    }
    return null;
  });
  expect(jsonLd).not.toBeNull();
  expect(jsonLd["@type"]).toBe("BreadcrumbList");
});

test("contact page has form", async ({ page }) => {
  await page.goto("/contact/");
  await expect(page.locator("form")).toBeVisible();
  await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible();
});

test("footer has contact info", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer).toContainText("Bollenstreek Digitaal");
  await expect(footer).toContainText("Gooweg 14");
  await expect(footer).toContainText("071");
});

test("footer has KvK and legal links", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer).toContainText("KvK 76903885");
  await expect(footer.locator('a[href="/privacybeleid/"]')).toBeVisible();
  await expect(footer.locator('a[href="/algemene-voorwaarden/"]')).toBeVisible();
});

test("CTA section is visually distinct from footer", async ({ page }) => {
  await page.goto("/");
  // CTA should have light background (primary-50), not dark
  const cta = page.locator("text=Ontdek wat AI voor jouw bedrijf kan opleveren").locator("..");
  await expect(cta).toBeVisible();
});

test("no broken internal links", async ({ page }) => {
  await page.goto("/");
  const links = await page.locator('a[href^="/"]').all();
  const hrefs = new Set<string>();
  for (const link of links) {
    const href = await link.getAttribute("href");
    if (href) hrefs.add(href);
  }

  for (const href of hrefs) {
    const response = await page.goto(href);
    expect(response?.status(), `Broken link: ${href}`).toBe(200);
  }
});
