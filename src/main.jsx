import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import { LocalProvider } from "./hooks/useLocal";
import { ErrorBoundary, LoadingSkeleton } from "./components/ui";
import "./styles.css";
const load = (file, name) =>
  lazy(() => file().then((m) => ({ default: m[name] })));
const catalog = () => import("./pages/Catalog");
const info = () => import("./pages/Info");
const learn = () => import("./pages/Learn");
const videoPages = () => import("./pages/Videos");
const Videos = load(videoPages, "Videos");
const OfficialVideoDetail = load(videoPages, "OfficialVideoDetail");
const Classes = load(catalog, "Classes"),
  ClassDetail = load(catalog, "ClassDetail"),
  SubjectDetail = load(catalog, "SubjectDetail"),
  Courses = load(catalog, "Courses"),
  CourseDetail = load(catalog, "CourseDetail"),
  Playlists = load(catalog, "Playlists"),
  PlaylistDetail = load(catalog, "PlaylistDetail"),
  SearchPage = load(catalog, "SearchPage"),
  NotFound = load(catalog, "NotFound"),
  About = load(info, "About"),
  Contact = load(info, "Contact"),
  Policy = load(info, "Policy"),
  Learn = load(learn, "Learn"),
  MyLearning = load(learn, "MyLearning");
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LocalProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSkeleton />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="classes" element={<Classes />} />
                <Route path="classes/:classSlug" element={<ClassDetail />} />
                <Route
                  path="subjects/:subjectSlug"
                  element={<SubjectDetail />}
                />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:courseSlug" element={<CourseDetail />} />
                <Route path="playlists" element={<Playlists />} />
                <Route
                  path="playlists/:playlistSlug"
                  element={<PlaylistDetail />}
                />
                <Route
                  path="learn/:courseSlug/:lessonSlug"
                  element={<Learn />}
                />
                <Route path="videos" element={<Videos />} />
                <Route
                  path="videos/category/:categorySlug"
                  element={<Videos />}
                />
                <Route
                  path="videos/:videoId"
                  element={<OfficialVideoDetail />}
                />
                <Route path="search" element={<SearchPage />} />
                <Route path="about" element={<About />} />
                <Route path="founder" element={<About founder />} />
                <Route path="contact" element={<Contact />} />
                <Route path="privacy" element={<Policy type="privacy" />} />
                <Route path="terms" element={<Policy type="terms" />} />
                <Route
                  path="attribution"
                  element={<Policy type="attribution" />}
                />
                <Route path="my-learning" element={<MyLearning />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LocalProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
