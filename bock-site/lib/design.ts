/* lib/design.ts */
const API =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1337";

/* ---------- helpers ---------- */
const normalize = <T = any>(v: T | undefined): T | null =>
  v === undefined ? null : v;

const abs = (u?: string | null): string | null => {
  if (!u) return null;
  return /^https?:\/\//i.test(u) ? u : `${API}${u}`;
};

const getUrl = (v: any): string | null => {
  if (!v) return null;
  if (typeof v === "string") return abs(v);
  const url =
    v?.url ??
    v?.data?.attributes?.url ??
    v?.data?.url ??
    v?.attributes?.url ??
    null;
  return abs(url);
};

/* ---------- tipos ---------- */
export interface DesignItem {
  id: number;
  title: string;
  subtitle?: string | null;
  body: any;
  slug: string;
  thumbPos?: "top" | "center" | "bottom" | null;
  imageWatermarked?: string | null;
  imageThumbTop?: string | null;
  imageThumbCenter?: string | null;
  imageThumbBottom?: string | null;
  imageThumb?: string | null; // legado
  imageFull?: string | null;
}

export interface DesignIntro {
  title: string;
  subtitle?: string | null;
  body: any;
  heroImage?: string | null;
}

/* ---------- intro ---------- */
export async function getDesignIntro(): Promise<DesignIntro> {
  try {
    const res = await fetch(`${API}/api/design-intro?populate=*`);
    const json = await res.json();
    const attr = json?.data?.attributes ?? json?.data ?? {};

    return {
      title: attr.title || "Design",
      subtitle: normalize(attr.subtitle),
      body: attr.content || [],
      heroImage: getUrl(attr.heroImage),
    };
  } catch (err) {
    console.error("Error design intro", err);
    return { title: "Design", subtitle: null, body: [], heroImage: null };
  }
}

/* ---------- artículos ---------- */
export async function getDesignArticles(): Promise<DesignItem[]> {
  try {
    const res = await fetch(
      `${API}/api/designs?populate=*&pagination[pageSize]=100`
    );
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];

    return list.map((item: any): DesignItem => {
      const attr = item?.attributes ?? item ?? {};
      const pos =
        attr.thumbPos === "top" ||
        attr.thumbPos === "center" ||
        attr.thumbPos === "bottom"
          ? (attr.thumbPos as "top" | "center" | "bottom")
          : null;

      return {
        id: item.id,
        title: attr.title || "Untitled",
        subtitle: normalize(attr.subtitle),
        body: Array.isArray(attr.body) ? attr.body : attr.content ?? [],
        slug: attr.slug || `no-slug-${item.id}`,
        thumbPos: pos,
        imageWatermarked: getUrl(attr.imageWatermarked),
        imageThumbTop: getUrl(attr.imageThumbTop),
        imageThumbCenter: getUrl(attr.imageThumbCenter),
        imageThumbBottom: getUrl(attr.imageThumbBottom),
        imageThumb: getUrl(attr.imageThumb),
        imageFull: getUrl(attr.imageFull),
      };
    });
  } catch (err) {
    console.error("Error design articles", err);
    return [];
  }
}

/* ---------- slugs ---------- */
export async function getDesignSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${API}/api/designs?fields[0]=slug&pagination[pageSize]=100`
    );
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];
    return list.map((i: any) => i.attributes?.slug || i.slug).filter(Boolean);
  } catch (err) {
    console.error("Error design slugs", err);
    return [];
  }
}
