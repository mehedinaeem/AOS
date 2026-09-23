import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("routes, deep links, responsive overflow, and console", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/classes",
      "/classes/class-6",
      "/classes/class-9?group=science",
      "/subjects/class-6-mathematics",
      "/courses",
      "/playlists",
      "/search?q=mathematics",
      "/about",
      "/founder",
      "/contact",
      "/privacy",
      "/terms",
      "/attribution",
      "/my-learning",
      "/missing",
      "/courses/unpublished",
      "/learn/unpublished/lesson",
      "/playlists/unpublished",
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
  expect(errors).toEqual([]);
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
});
test("search filters and mobile keyboard navigation", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("searchbox").fill("Mathematics");
  await expect(page).toHaveURL(/q=Mathematics/);
  await expect(page.getByRole("status")).toContainText("5 results");
  await page
    .getByRole("combobox", { name: "Class", exact: true })
    .selectOption("class-6");
  await expect(page.getByRole("status")).toContainText("1 results");
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await page.setViewportSize({ width: 320, height: 800 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("accessibility in light and dark themes", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.addInitScript(
      (theme) =>
        localStorage.setItem("aos:v1:learning", JSON.stringify({ theme })),
      theme,
    );
    for (const path of [
      "/",
      "/classes",
      "/search",
      "/contact",
      "/my-learning",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        audit.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        `${theme} ${path}`,
      ).toEqual([]);
    }
  }
});
test("corrupt or unavailable storage does not break the site", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("aos:v1:learning", "{broken"),
  );
  await page.goto("/my-learning");
  await expect(
    page.getByRole("heading", { name: "Your learning space" }),
  ).toBeVisible();
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Unavailable");
    };
  });
  await page.reload();
  await expect(page.getByRole("status")).toContainText(
    "Storage is unavailable",
  );
});

test("lesson progress, notes, bookmarks, and curated playlist with isolated fixtures", async ({
  page,
}) => {
  await page.route("**/src/data/catalog.js*", async (route) => {
    const response = await route.fetch();
    let body = await response.text();
    const course = {
      id: "test-course",
      slug: "test-course",
      title: "Test course",
      classId: "class-6",
      subjectId: "class-6-mathematics",
      group: "general",
      published: true,
      chapterIds: ["test-chapter"],
    };
    const chapter = {
      id: "test-chapter",
      slug: "test-chapter",
      courseId: "test-course",
      title: "Test chapter",
      number: 1,
    };
    const lessons = [1, 2].map((i) => ({
      id: `test-lesson-${i}`,
      slug: `lesson-${i}`,
      courseId: "test-course",
      chapterId: "test-chapter",
      title: `Test lesson ${i}`,
      youtubeVideoId: i === 1 ? "abcdefghijk" : "lmnopqrstuv",
      published: true,
      order: i,
      sourceType: "third-party",
      sourceChannel: "Test fixture",
      sourceChannelUrl: "https://www.youtube.com/",
      attribution: "Test fixture only; not public catalog content.",
    }));
    body = body
      .replace(
        "const courses = [];",
        `const courses = ${JSON.stringify([course])};`,
      )
      .replace(
        "const chapters = [];",
        `const chapters = ${JSON.stringify([chapter])};`,
      )
      .replace(
        "const lessons = [];",
        `const lessons = ${JSON.stringify(lessons)};`,
      )
      .replace(
        "const playlists = [];",
        `const playlists = ${JSON.stringify([{ id: "test-playlist", slug: "test-playlist", title: "Test playlist", classId: "class-6", courseId: "test-course", lessonIds: ["test-lesson-2"], published: true }])};`,
      );
    await route.fulfill({ response, body });
  });
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      body: "<html><body>Offline test player</body></html>",
      contentType: "text/html",
    }),
  );
  await page.goto("/learn/test-course/lesson-1");
  await expect(
    page.getByRole("heading", { name: "Test lesson 1" }),
  ).toBeVisible();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    "https://www.youtube-nocookie.com/embed/abcdefghijk",
  );
  await page.getByRole("button", { name: "Mark complete" }).click();
  await page.getByRole("button", { name: "Save for later" }).click();
  await page
    .getByRole("textbox", { name: "Your lesson notes" })
    .fill("Remember this idea.");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Completed", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("textbox", { name: "Your lesson notes" }),
  ).toHaveValue("Remember this idea.");
  await page.getByRole("link", { name: "Next lesson" }).click();
  await expect(
    page.getByRole("heading", { name: "Test lesson 2" }),
  ).toBeVisible();
  await page.goto("/playlists/test-playlist");
  await expect(
    page.locator("main").getByRole("link", { name: /Test lesson 2/ }),
  ).toBeVisible();
  await expect(
    page.locator("main").getByRole("link", { name: /Test lesson 1/ }),
  ).toHaveCount(0);
  await page.goto("/my-learning");
  await expect(page.getByText("1 lessons marked complete.")).toBeVisible();
  await page.getByRole("button", { name: "Clear local learning data" }).click();
  await page.getByRole("button", { name: "Yes, clear local data" }).click();
  await expect(page.getByText("0 lessons marked complete.")).toBeVisible();
});
