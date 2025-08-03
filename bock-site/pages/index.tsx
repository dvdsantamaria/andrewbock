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

const normalizeImagePath = (path?: string | null): string =>
  path?.startsWith("http") ? path : path ? `/${path.replace(/^\/+/, "")}` : "";

type Thumb = { src: string; href: string; alt: string };

const sampleN = <T,>(arr: T[], n: number, hasImg: (item: T) => boolean) => {
  const withImg = arr.filter(hasImg);
  return [...withImg]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(n, withImg.length));
};

interface HomeProps {
  writingData: any[];
  photoData: any[];
  designData: any[];
  aboutData: any[];
}

export default function Home({
  writingData,
  photoData,
  designData,
  aboutData,
}: HomeProps) {
  const writingLinks = writingData.slice(0, 18).map((a) => ({
    label: a.title,
    href: `/writing/${a.category}/${a.slug}`,
  }));

  const [photoThumbs, setPhotoThumbs] = useState<Thumb[]>([]);
  const [designThumbs, setDesignThumbs] = useState<Thumb[]>([]);
  const [pubThumbs, setPubThumbs] = useState<Thumb[]>([]);

  useEffect(() => {
    setPhotoThumbs(
      sampleN(
        photoData,
        3,
        (p: any) => p.imageThumbCenter || p.imageThumbTop || p.imageThumbBottom
      ).map((p: any) => ({
        src: normalizeImagePath(
          p.imageThumbCenter || p.imageThumbTop || p.imageThumbBottom
        ),
        href: `/photography/${p.category}/${p.slug}`,
        alt: p.title,
      }))
    );

    setDesignThumbs(
      sampleN(
        designData,
        3,
        (d: any) =>
          d.imageThumbCenter ||
          d.imageThumbTop ||
          d.imageThumbBottom ||
          d.imageFull
      ).map((d: any) => {
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

    setPubThumbs(
      sampleN(aboutData, 1, (p: any) => p.imageThumb || p.imageFull).map(
        (p: any) => ({
          src: normalizeImagePath(p.imageThumb || p.imageFull),
          href: `/about/${p.slug}`,
          alt: p.title,
        })
      )
    );
  }, [photoData, designData, aboutData]);

  return (
    <>
      <Head>
        <title>Andrew Bock – Home</title>
      </Head>

      <MainLayout section="" subMenuItems={[]} theme={{}}>
        <TopStrokes />

        <div className="col-span-12 grid grid-cols-12 gap-x-4">
          {/* WRITING */}
          <SectionHeading title="Writing" />

          {/* Mobile list */}
          <ul className="col-span-12 md:hidden space-y-3 text-[19px] leading-relaxed mt-6 mb-8 px-6">
            {writingLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[var(--accent)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop marquee (ends at col 11, gradients visible) */}
          <div className="hidden md:flex md:col-start-3 md:col-span-9 md:min-h-[160px] items-center">
            <div className="relative w-full overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />
              <div className="marquee whitespace-nowrap relative z-0">
                <div className="marquee-track inline-flex gap-12 pr-12">
                  {writingLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="hover:text-[var(--accent)] text-[22px] leading-snug"
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
                        className="hover:text-[var(--accent)] text-[22px] leading-snug"
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

          {/* PHOTOGRAPHY */}
          <SectionHeading title="Photography" />
          <ThumbRow thumbs={photoThumbs} />

          <div className="col-span-full my-4">
            <MidStrokes />
          </div>

          {/* DESIGN */}
          <SectionHeading title="Design" />
          <ThumbRow thumbs={designThumbs} />

          <div className="col-span-full my-4">
            <MidStrokes />
          </div>

          {/* ABOUT — lower height + fine centering vs footer */}
          <SectionHeading title="About" footerCompensate />
          <ThumbRow thumbs={pubThumbs} footerCompensate />

          <Footer />
        </div>
      </MainLayout>

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

/* UI helpers */
function SectionHeading({
  title,
  footerCompensate = false,
}: {
  title: string;
  footerCompensate?: boolean;
}) {
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
      }}
    >
      {/* mobile: match image width and centering (same as 90% imgs) */}
      <span className="block w-full px-6 md:px-0">
        <span className="block max-w-[90%] md:max-w-none mx-auto md:mx-0">
          {title}
        </span>
      </span>
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
