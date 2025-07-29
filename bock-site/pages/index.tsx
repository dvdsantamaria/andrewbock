/* pages/index.tsx — Home */

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import Footer from "@/components/Footer";
import TopStrokes from "@/components/TopStrokes";
import MidStrokes from "@/components/MidStrokes";

/* API helpers */
import { getAboutArticles } from "@/lib/about";
import { getDesignArticles } from "@/lib/design";
import { getPhotographyPhotos } from "@/lib/photography";
import { getWritingArticles } from "@/lib/writing";

/* helpers */
const normalizeImagePath = (path?: string | null): string =>
  path?.startsWith("http") ? path : path ? `/${path.replace(/^\/+/, "")}` : "";

type Thumb = { src: string; href: string; alt: string };

const sampleN = <T,>(arr: T[], n: number, hasImg: (item: T) => boolean) => {
  const withImg = arr.filter(hasImg);
  return [...withImg]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(n, withImg.length));
};

/* props */
interface HomeProps {
  writingData: any[];
  photoData: any[];
  designData: any[];
  aboutData: any[];
}

/* component */
export default function Home({
  writingData,
  photoData,
  designData,
  aboutData,
}: HomeProps) {
  /* Writing links */
  const writingLinks = writingData.slice(0, 18).map((a) => ({
    label: a.title,
    href: `/writing/${a.category}/${a.slug}`,
  }));

  const [photoThumbs, setPhotoThumbs] = useState<Thumb[]>([]);
  const [designThumbs, setDesignThumbs] = useState<Thumb[]>([]);
  const [pubThumbs, setPubThumbs] = useState<Thumb[]>([]);

  useEffect(() => {
    /* PHOTOGRAPHY */
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

    /* DESIGN */
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

    /* ABOUT / PUBLICATIONS */
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
          {/* Mobile: keep current list */}
          <ul className="col-span-12 md:hidden space-y-1 text-[18px] leading-snug mt-2 pl-[5%]">
            {writingLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[var(--accent)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: marquee with subtle side gradients */}
          <div className="hidden md:block col-span-10 md:col-start-3 py-8">
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[var(--background)] to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[var(--background)] to-transparent" />
              <div className="marquee whitespace-nowrap">
                <div className="marquee-track inline-flex gap-12 pr-12">
                  {writingLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="hover:text-[var(--accent)] text-[18px] leading-snug"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
                {/* duplicate for seamless loop */}
                <div
                  className="marquee-track inline-flex gap-12 pr-12"
                  aria-hidden="true"
                >
                  {writingLinks.map((l, i) => (
                    <span key={`${l.href}-dup-${i}`}>
                      <Link
                        href={l.href}
                        className="hover:text-[var(--accent)] text-[18px] leading-snug"
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

          {/* ABOUT */}
          <SectionHeading title="About" />
          <ThumbRow thumbs={pubThumbs} />

          <Footer />
        </div>
      </MainLayout>

      {/* Minimal CSS for marquee */}
      <style jsx>{`
        .marquee {
          display: flex;
          width: 100%;
        }
        .marquee-track {
          animation: marquee 28s linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}

/* getStaticProps */
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
function SectionHeading({ title }: { title: string }) {
  return (
    <h2
      className="col-span-12 md:col-span-2 md:col-start-1 py-8 md:py-10 italic text-2xl md:text-3xl pl-[5%] md:pl-0 flex items-center"
      style={{
        fontFamily: `"Palatino Linotype","Book Antiqua",Palatino,serif`,
      }}
    >
      {title}
    </h2>
  );
}

function ThumbRow({ thumbs }: { thumbs: Thumb[] }) {
  return (
    <>
      {thumbs.map((t, i) => (
        <div
          key={t.href}
          className={`col-span-12 md:col-span-2 ${
            i === 0 ? "md:col-start-3" : ""
          } py-8 md:py-10`}
        >
          <Link href={t.href} className="block group">
            <img
              src={t.src}
              alt={t.alt}
              className="aspect-[3/2] max-w-[90%] mx-auto object-cover border border-gray-300 group-hover:border-[var(--accent)] transition"
            />
          </Link>
        </div>
      ))}
    </>
  );
}
