// components/AboutPage.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Article, Intro } from "@/lib/about";
import { useMediaQuery } from "react-responsive";

/* ---------- tema local ---------- */
const theme: Record<string, string> = {
  background: "#A7A9AC",
  accent: "#EDBE1C",
  menuText: "#000000",
  menuHover: "#EDBE1C",
  logoText: "#000000",
  sectionColor: "#000000",
};

type AboutSectionProps = {
  initialData: { intro: Intro; articles: Article[] };
  initialSlug?: string;
};

/** Devuelve el thumb correcto según thumbPos (o -center por defecto) */
const pickThumb = (a: Partial<Article & Intro>): string | null => {
  if (!("thumbPos" in a)) return null;

  const pos = (a.thumbPos ?? "center") as "top" | "center" | "bottom";
  const key = `imageThumb${pos[0].toUpperCase()}${pos.slice(1)}` as const;
  return (a as any)[key] ?? null;
};

export default function AboutPage({
  initialData,
  initialSlug,
}: AboutSectionProps) {
  const { query } = useRouter();
  const slug = (initialSlug ?? query.slug) as string | undefined;
  const { intro, articles } = initialData;

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const subMenuItems = isMobile ? [] : ["", "", ""];

  const active = slug ? articles.find((a) => a.slug === slug) ?? intro : intro;
  const related =
    active === intro ? articles : articles.filter((a) => a.slug !== slug);

  const hero =
    ("imageWatermarked" in active && active.imageWatermarked) ||
    ("imageFull" in active && active.imageFull) ||
    ("heroImage" in active && active.heroImage) ||
    null;

  const thumb = pickThumb(active) || intro.heroImage || null;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
    return () =>
      Object.keys(theme).forEach((k) => root.style.removeProperty(`--${k}`));
  }, []);
  return (
    <>
      <Head>
        <title>{active.title || "About"}</title>
      </Head>

      <MainLayout section="about" subMenuItems={subMenuItems} theme={theme}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slug ?? "about-intro"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="col-span-8 md:col-span-12 grid grid-cols-8 md:grid-cols-12 gap-x-4"
          >
            {/* ► Thumb SOLO en la intro (sin slug) */}
            {!slug && thumb && (
              <div className="col-span-8 mb-8">
                <img
                  src={thumb}
                  alt="Thumbnail"
                  className="w-full max-w-[900px] object-cover rounded-md border border-gray-300"
                  loading="lazy"
                />
              </div>
            )}

            {/* ► menú desplegable mobile */}
            {related.length > 0 && (
              <div className="col-span-8 md:hidden px-4 pt-4">
                <details className="border border-gray-300 rounded-md bg-white">
                  <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-[var(--menuText)] hover:text-[var(--accent)]">
                    Explore&nbsp;more
                  </summary>
                  <ul className="px-4 py-2 space-y-1">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/about/${r.slug}`}
                          className="block text-sm hover:text-[var(--accent)]"
                        >
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            )}

            {/* ► main article */}
            <article className="col-span-12 md:col-start-3 md:col-span-6 text-black p-6 md:pt-10 md:px-0 space-y-6">
              {slug && hero && (
                <img
                  src={hero}
                  alt={active.title}
                  className="w-full rounded-md border border-gray-300 object-cover"
                />
              )}

              {slug && (
                <hr className="border-t-4 border-[var(--accent)] my-6 w-1/2" />
              )}

              <h1 className="text-3xl font-semibold">{active.title}</h1>
              {"subtitle" in active && active.subtitle && (
                <p className="italic text-gray-500">{active.subtitle}</p>
              )}

              {/* body */}
              {Array.isArray(active.body)
                ? active.body.map((block: any, i) =>
                    block.type === "paragraph" ? (
                      <p key={i}>
                        {block.children?.map((child: any, j: number) => (
                          <span key={j}>{child.text}</span>
                        ))}
                      </p>
                    ) : null
                  )
                : typeof active.body === "string"
                ? active.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)
                : null}
            </article>

            {/* ► aside desktop */}
            {related.length > 0 && (
              <aside className="hidden md:block col-start-10 col-span-2 md:pt-[42px]">
                <h3
                  className="uppercase tracking-wider text-sm mb-4"
                  style={{ color: "var(--sectionColor)" }}
                >
                  Explore&nbsp;more
                </h3>
                <ul className="space-y-4">
                  {related.map((r) => {
                    const thumbR = pickThumb(r) || r.imageThumb || null;
                    return (
                      <li key={r.slug}>
                        <Link href={`/about/${r.slug}`} className="group block">
                          {thumbR && (
                            <img
                              src={thumbR}
                              alt={r.title}
                              className="w-full aspect-video object-cover rounded-md border border-gray-300 group-hover:border-[var(--accent)] transition"
                              loading="lazy"
                            />
                          )}
                          <span className="mt-1 block text-xs leading-snug group-hover:text-[var(--accent)]">
                            {r.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            )}

            <Footer />
          </motion.div>
        </AnimatePresence>
      </MainLayout>
    </>
  );
}
