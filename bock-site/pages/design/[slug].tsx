/* pages/design/[slug].tsx */
import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import {
  getDesignArticles,
  getDesignIntro,
  getDesignSlugs,
} from "@/lib/design";
import type { DesignItem } from "@/lib/design";

const DesignPage = dynamic(() => import("@/components/DesignPage"), {
  ssr: false,
});

interface PageProps {
  initialData: {
    articles: DesignItem[];
    intro: DesignItem;
  };
  slug: string;
}

export default function DesignDetail({ initialData, slug }: PageProps) {
  return <DesignPage initialData={initialData} initialSlug={slug} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  // 1) Sacamos todos los slugs válidos
  const slugs = await getDesignSlugs();

  // 2) Construimos los paths
  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: "blocking", // si viene un slug nuevo, Next lo generará al vuelo
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  // 1) Traemos todos los artículos y el intro
  const articles = await getDesignArticles();
  const intro = await getDesignIntro();

  // 2) Si no hay intro o no hay artículos -> 404
  if (!intro || articles.length === 0) {
    return { notFound: true };
  }

  // 3) Si el slug no existe en la lista -> 404
  const exists = articles.some((a) => a.slug === slug);
  if (!exists) {
    return { notFound: true };
  }

  // 4) Listo, devolvemos todo al componente
  return {
    props: {
      initialData: { articles, intro },
      slug,
    },
    revalidate: 60, // ISR cada minuto
  };
};
