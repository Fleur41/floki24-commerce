import { home } from "@/content/home";
import { BlogPosts } from "@/components/home/BlogPosts";
import { CategoryList } from "@/components/home/CategoryList";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { Highlights } from "@/components/home/Highlights";
import { ImageTiles } from "@/components/home/ImageTiles";
import { Slideshow } from "@/components/home/Slideshow";

export default function HomePage() {
  return (
    <>
      <h1 className="visually-hidden">floki24 – Saunen, Infrarotkabinen, Massagesessel & Möbel</h1>
      <Slideshow slides={home.slides} />
      <Highlights items={home.highlights} />
      <ImageTiles items={home.promoMosaic} layout="mosaic" label="Empfohlene Kategorien" />
      {home.categoryLists.map((list) => (
        <CategoryList key={list.cta.href} list={list} />
      ))}
      <BlogPosts
        title={home.blog.title}
        blogHandle={home.blog.handle}
        articleCount={home.blog.articleCount}
      />
      {home.featuredCollections.map((section) => (
        <FeaturedCollection key={section.collectionHandle} section={section} />
      ))}
      <ImageTiles items={home.promoGrid} layout="grid" label="Weitere Kategorien" />
    </>
  );
}
