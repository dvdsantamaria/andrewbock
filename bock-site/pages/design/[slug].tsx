/* pages/design/[slug].tsx */
import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import {
  getDesignArticles,
  getDesignIntro,
  getDesignSlugs,
  DesignItem,
} from "@/lib/design";

const DesignPage = dynamic(() => import("@/components/DesignPage"), {
  ssr: false,
});

interface PageProps {
  initialData: {
    articles: DesignItem[];
    intro: ReturnType<typeof getDesignIntro> extends Promise<infer T>
      ? T
      : never;
  };
  slug: string;
}

export default function DesignDetail({ initialData, slug }: PageProps) {
  return <DesignPage initialData={initialData} initialSlug={slug} />;
}

/* ---------- paths ---------- */
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getDesignSlugs();
  return {
    paths: slugs.map((s) => ({ params: { slug: s } })),
    fallback: "blocking",
  };
};

/* ---------- props ---------- */
export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  const [articles, intro] = await Promise.all([
    getDesignArticles(),
    getDesignIntro(),
  ]);

  if (!intro || articles.length === 0) {
    return { notFound: true };
  }

  const exists = articles.some((a) => a.slug === slug);
  if (!exists) {
    return { notFound: true };
  }

  return {
    props: {
      initialData: { articles, intro },
      slug,
    },
    revalidate: 60,
  };
};
