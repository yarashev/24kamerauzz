import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { Article } from "@shared/schema";

export default function News() {
  const { t, language } = useLanguage();

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(
      language === "uz" ? "uz-UZ" : language === "ru" ? "ru-RU" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    ).format(new Date(date));
  };

  return (
    <section id="news" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-secondary mb-4">
            {t("news")}
          </h3>
          <p className="text-gray-600 text-lg">
            {language === "uz" && "Xavfsizlik va texnologiya bo'yicha eng so'nggi yangiliklar"}
            {language === "ru" && "Последние новости о безопасности и технологиях"}
            {language === "en" && "Latest news on security and technology"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            articles.slice(0, 3).map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="text-sm text-primary font-medium mb-2">
                    {formatDate(article.publishedAt!)}
                  </div>
                  <h4 className="text-xl font-semibold text-secondary mb-3">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <button className="text-primary hover:text-primary/80 font-medium inline-flex items-center">
                    {language === "uz" && "Batafsil o'qish"}
                    {language === "ru" && "Читать далее"}
                    {language === "en" && "Read more"}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
