/* pages/index.tsx — Home */

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import TopStrokes from "@/components/TopStrokes";
import MidStrokes from "@/components/MidStrokes";

import { getAboutArticles } from "@/lib/about";
import { getDesignArticles } from "@/lib/design";
import { getPhotographyPhotos } from "@/lib/photography";
import { getWritingArticles } from "@/lib/writing";

/* helpers -------------------------------------------- */
const normalizeImagePath = (path?: string | null): string =>
  path?.startsWith("http") ? path : path ? `/${path.replace(/^\/+/, "")}` : "";

type Thumb = { src: string; href: string; alt: string };

const pickRandom = <T,>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

/* page props ----------------------------------------- */
interface HomeProps {
  writingData: any[];
  photoData: any[];
  designData: any[];
  aboutData: any[];
}

/* ---------------------------------------------------- */
export default function Home({
  writingData,
  photoData,
  designData,
  aboutData,
}: HomeProps) {
  /* writing links ------------------------------------ */
  const writingLinks = writingData.slice(0, 18).map((a) => ({
    label: a.title,
    href: `/writing/${a.category}/${a.slug}`,
  }));

  /* thumbs state ------------------------------------- */
  const [photoThumbs, setPhotoThumbs] = useState<Thumb[]>([]);
  const [designThumbs, setDesignThumbs] = useState<Thumb[]>([]);
  const [pubThumbs, setPubThumbs] = useState<Thumb[]>([]);

  /* pick thumbs -------------------------------------- */
  useEffect(() => {
    /* photography: 1 random de cada categoría (nature / travel / blur) */
    const orderedCats = ["nature", "travel", "blur"];
    setPhotoThumbs(
      orderedCats
        .map((cat) => {
          const pool = photoData.filter((p: any) => p.category === cat);
          if (!pool.length) return null;
          const p = pickRandom(pool);
          const thumb =
            p.imageThumbCenter || p.imageThumbTop || p.imageThumbBottom;
          return {
            src: normalizeImagePath(thumb),
            href: `/photography/${p.category}/${p.slug}`,
            alt: p.title,
          } as Thumb;
        })
        .filter(Boolean) as Thumb[]
    );

    /* design: 3 random con imagen */
    setDesignThumbs(
      [...designData]
        .filter(
          (d: any) =>
            d.imageThumbCenter ||
            d.imageThumbTop ||
            d.imageThumbBottom ||
            d.imageFull
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((d: any) => {
          const thumb =
            d.imageThumbCenter ||
            d.imageThumbTop ||
            d.imageThumbBottom ||
            d.imageFull;
          return {
            src: normalizeImagePath(thumb),
            href: `/design/${d.slug}`,
            alt: d.title,
          };
        })
    );

    /* about: 1 random */
    setPubThumbs(
      aboutData
        .filter((p: any) => p.imageThumb || p.imageFull)
        .slice(0, 1)
        .map((p: any) => ({
          src: normalizeImagePath(p.imageThumb || p.imageFull),
          href: `/about/${p.slug}`,
          alt: p.title,
        }))
    );
  }, [photoData, designData, aboutData]);

  /* -------------------------------------------------- */
  return (
    <>
      <Head>
        <title>Andrew Bock – Home</title>
      </Head>

      <MainLayout section="" subMenuItems={[]} theme={{}}>
        <TopStrokes />

        <div className="col-span-12 grid grid-cols-12 gap-x-4">
          {/* WRITING --------------------------------------------------- */}
          <SectionHeading title="Writing" />

          {/* mobile list */}
          <ul className="col-span-12 md:hidden space-y-3 text-[19px] leading-relaxed mt-6 mb-8 px-6 max-w-[90%] mx-auto">
            {writingLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[var(--accent)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* desktop marquee */}
          <div className="hidden md:flex md:col-start-3 md:col-span-9 md:min-h-[160px] items-center">
            <div className="relative w-full overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />
              <div className="marquee whitespace-nowrap relative z-0 text-black">
                <div className="marquee-track inline-flex gap-12 pr-12">
                  {writingLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="hover:text-[var(--accent)] text-[22px] leading-snug text-black"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
                <div
                  className="marquee-track inline-flex gap-12 pr-12"
                  aria-hidden="true"
                >
                  {writingLinks.map((l, i) => (
                    <span key={`${l.href}-dup-${i}`}>
                      <Link
                        href={l.href}
                        className="hover:text-[var(--accent)] text-[22px] leading-snug text-black"
                      >
                        {l.label}
                      </Link>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-full my-4">
            <MidStrokes />
          </div>

          {/* PHOTOGRAPHY ---------------------------------------------- */}
          <SectionHeading title="Photography" />
          <ThumbRow thumbs={photoThumbs} />

          <div className="col-span-full my-4">
            <MidStrokes />
          </div>

          {/* DESIGN ---------------------------------------------------- */}
          <SectionHeading title="Design" />
          <ThumbRow thumbs={designThumbs} />

          <div className="col-span-full my-4">
            <MidStrokes />
          </div>

          {/* ABOUT ----------------------------------------------------- */}
          <SectionHeading title="About" footerCompensate />
          <ThumbRow thumbs={pubThumbs} footerCompensate />

          <Footer />
        </div>
      </MainLayout>

      {/* marquee anim */}
      <style jsx>{`
        .marquee {
          display: flex;
          width: 200%;
        }
        .marquee-track {
          flex: 0 0 50%;
          will-change: transform;
          animation: marquee 28s linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
}

/* ISR ----------------------------------------------- */
export async function getStaticProps() {
  const [writingData, photoData, designData, aboutData] = await Promise.all([
    getWritingArticles(),
    getPhotographyPhotos(),
    getDesignArticles(),
    getAboutArticles(),
  ]);

  return {
    props: { writingData, photoData, designData, aboutData },
    revalidate: 60,
  };
}

/* UI helpers ---------------------------------------- */
function SectionHeading({
  title,
  footerCompensate = false,
}: {
  title: string;
  footerCompensate?: boolean;
}) {
  /* slug path */
  const path = `/${title.toLowerCase()}`;

  return (
    <h2
      className={`col-span-12 md:col-span-2 md:col-start-1 italic text-2xl md:text-3xl
      flex items-center md:px-0 mt-8 mb-3 md:mt-0 md:mb-0
      ${
        footerCompensate
          ? "md:min-h-[140px] md:translate-y-[18px]"
          : "md:min-h-[160px]"
      }`}
      style={{
        fontFamily: `"Palatino Linotype","Book Antiqua",Palatino,serif`,
        color: "rgb(108 108 108)",
      }}
    >
      {/* mobile wrapper for alignment */}
      <Link
        href={path}
        className="block w-full px-6 md:px-0 no-underline hover:underline-none focus:outline-none"
      >
        <span className="block max-w-[90%] md:max-w-none mx-auto md:mx-0">
          {title}
        </span>
      </Link>
    </h2>
  );
}

function ThumbRow({
  thumbs,
  footerCompensate = false,
}: {
  thumbs: Thumb[];
  footerCompensate?: boolean;
}) {
  return (
    <>
      {thumbs.map((t, i) => (
        <div
          key={t.href}
          className={`col-span-12 md:col-span-2 ${
            i === 0 ? "md:col-start-3" : ""
          }
          md:flex md:items-center px-6 md:px-0 py-4 md:py-0
          ${
            footerCompensate
              ? "md:min-h-[140px] md:translate-y-[18px]"
              : "md:min-h-[160px]"
          }`}
        >
          <Link href={t.href} className="block group w-full">
            <img
              src={t.src}
              alt={t.alt}
              className="aspect-[3/2] max-w-[90%] md:max-w-[75%] mx-auto my-2 object-cover
              border border-gray-300 group-hover:border-[var(--accent)] transition"
            />
          </Link>
        </div>
      ))}
    </>
  );
}
