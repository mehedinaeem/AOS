import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      body: "<html><body>Embed test placeholder</body></html>",
      contentType: "text/html",
    }),
  );
  await page.route("https://i.ytimg.com/**", (route) => route.abort());
});
test("archive counts, pagination, combined filters, and browser history", async ({
  page,
}) => {
  await page.goto("/videos");
  await expect(
    page.getByRole("heading", { name: "From Our YouTube Channel" }),
  ).toBeVisible();
  await expect(
    page.getByText("149 official videos across 9 categories"),
  ).toBeVisible();
  await expect(page.locator(".official-video-card")).toHaveCount(12);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByRole("status")).toContainText("Showing 13–24");
  await page
    .getByRole("combobox", { name: "Video category" })
    .selectOption("medical-admission");
  await expect(page.getByRole("status")).toContainText("2 videos");
  await expect(page.locator(".official-video-card")).toHaveCount(2);
  await expect(page).not.toHaveURL(/page=/);
  await page.getByRole("button", { name: "Clear video filters" }).click();
  await page
    .getByRole("combobox", { name: "University tag" })
    .selectOption("pust");
  await expect(page.getByRole("status")).not.toContainText("149 videos");
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "University tag" }),
  ).toHaveValue("pust");
  await page.getByRole("searchbox").fill("no-matching-video-title");
  await expect(
    page.getByRole("heading", { name: "No videos match these filters" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear video filters" }).click();
  await page
    .getByRole("combobox", { name: "Sort videos" })
    .selectOption("oldest");
  await expect(page.locator(".official-video-card").first()).toHaveAttribute(
    "href",
    "/videos/BdNEVeygFUo",
  );
  await page
    .getByRole("combobox", { name: "Sort videos" })
    .selectOption("newest");
  await expect(page.locator(".official-video-card").first()).toHaveAttribute(
    "href",
    "/videos/mSuRD2dQcUY",
  );
  await page.goBack();
  await expect(page.getByRole("combobox", { name: "Sort videos" })).toHaveValue(
    "oldest",
  );
});
test("category deep links, player, related videos, previous/next and unknown IDs", async ({
  page,
}) => {
  await page.goto("/videos/category/medical-admission");
  await expect(page.locator("h1")).toHaveText("Medical Admission");
  await expect(page.locator(".official-video-card")).toHaveCount(2);
  await page.locator(".official-video-card").first().click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /https:\/\/www.youtube-nocookie.com\/embed\/[A-Za-z0-9_-]{11}$/,
  );
  await expect(
    page.getByRole("link", { name: "Watch on YouTube" }),
  ).toHaveAttribute("href", /https:\/\/www.youtube.com\/watch\?v=/);
  await expect(page.locator(".official-video-card")).toHaveCount(1);
  await page.getByRole("link", { name: "Next video", exact: false }).click();
  await expect(page).toHaveURL("/videos/blNZvEVCW5I");
  await page
    .getByRole("link", { name: "Previous video", exact: false })
    .click();
  await expect(page).toHaveURL("/videos/9p3SXdjRz0o");
  await page.goto("/videos/invalid");
  await expect(page.getByText("PAGE NOT FOUND")).toBeVisible();
  await page.goto("/videos/category/invalid");
  await expect(page.getByText("PAGE NOT FOUND")).toBeVisible();
});
test("responsive archive and detail pages have no overflow or accessibility violations", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [320, 390, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/videos",
      "/videos/category/merit-subject-migration",
      "/videos/mSuRD2dQcUY",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width} ${path}`,
      ).toBe(true);
    }
  }
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (theme) =>
        localStorage.setItem("aos:v1:learning", JSON.stringify({ theme })),
      theme,
    );
    for (const path of ["/videos", "/videos/mSuRD2dQcUY"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
  await page.goto("/videos");
  await expect(page.locator("h1")).toBeVisible();
  await page.screenshot({
    path: "test-results/videos-desktop.png",
    fullPage: true,
  });
});
