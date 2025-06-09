import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator as CalculatorIcon, Lightbulb } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";

interface CalculationResult {
  recommendedCount: number;
  coverage: number;
  suggestions: string[];
}

export default function Calculator() {
  const { t, language } = useLanguage();
  const [area, setArea] = useState("");
  const [angle, setAngle] = useState("90");
  const [distance, setDistance] = useState("15");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/calculator", {
        area: parseFloat(area),
        angle: parseFloat(angle),
        distance: parseFloat(distance)
      });
      return response.json();
    },
    onSuccess: (data: CalculationResult) => {
      setResult(data);
    },
    onError: () => {
      setResult({
        recommendedCount: Math.ceil(parseFloat(area) / 50) || 1,
        coverage: parseFloat(area) || 0,
        suggestions: [
          "Kameralarni strategik joylarga o'rnating",
          "Yoritish sharoitlarini hisobga oling",
          "Backup tizimi o'rnating"
        ]
      });
    }
  });

  const handleCalculate = () => {
    if (!area || parseFloat(area) <= 0) return;
    calculateMutation.mutate();
  };

  const getLocalizedSuggestions = (suggestions: string[]) => {
    if (language === "ru") {
      return [
        "Установите камеры в стратегических местах",
        "Учитывайте условия освещения",
        "Установите резервную систему"
      ];
    }
    if (language === "en") {
      return [
        "Install cameras in strategic locations",
        "Consider lighting conditions",
        "Install backup system"
      ];
    }
    return suggestions;
  };

  return (
    <section id="calculator" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-secondary mb-4">
            {t("calculator-title")}
          </h3>
          <p className="text-gray-600 text-lg">
            {t("calculator-desc")}
          </p>
        </div>

        <Card className="bg-gray-50">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="area" className="text-sm font-medium text-gray-700 mb-2">
                  {t("area-label")}
                </Label>
                <Input
                  id="area"
                  type="number"
                  placeholder={language === "uz" ? "Maydonni kiriting" : language === "ru" ? "Введите площадь" : "Enter area"}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="angle" className="text-sm font-medium text-gray-700 mb-2">
                  {t("angle-label")}
                </Label>
                <Input
                  id="angle"
                  type="number"
                  placeholder="90"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  {language === "uz" && "Tavsiya etilgan kameralar soni"}
                  {language === "ru" && "Рекомендуемое количество камер"}
                  {language === "en" && "Recommended camera count"}
                </Label>
                <Input
                  type="number"
                  placeholder={language === "uz" ? "Avtomatik hisoblanadi" : language === "ru" ? "Автоматически рассчитывается" : "Automatically calculated"}
                  value={result?.recommendedCount || ""}
                  readOnly
                  className="mt-1 bg-gray-100"
                />
              </div>
              
              <div>
                <Label htmlFor="distance" className="text-sm font-medium text-gray-700 mb-2">
                  {t("distance-label")}
                </Label>
                <Input
                  id="distance"
                  type="number"
                  placeholder="15"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              onClick={handleCalculate}
              disabled={!area || calculateMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold mb-6"
            >
              <CalculatorIcon className="mr-2 h-5 w-5" />
              {calculateMutation.isPending ? (
                language === "uz" ? "Hisoblanmoqda..." : 
                language === "ru" ? "Рассчитывается..." : "Calculating..."
              ) : t("calculate")}
            </Button>

            {result && (
              <Card className="border-l-4 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("recommendation")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    {language === "uz" && `Tavsiya: ${result.recommendedCount} ta kamera bilan ${area} m² maydonni ${angle}° burchakda qamrab olish mumkin. Masofa: ${distance}m.`}
                    {language === "ru" && `Рекомендация: ${result.recommendedCount} камер для покрытия ${area} м² с углом ${angle}° на расстоянии ${distance}м.`}
                    {language === "en" && `Recommendation: ${result.recommendedCount} cameras to cover ${area} m² with ${angle}° angle at ${distance}m distance.`}
                  </p>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-primary mb-2 flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      {language === "uz" && "Qo'shimcha tavsiyalar:"}
                      {language === "ru" && "Дополнительные рекомендации:"}
                      {language === "en" && "Additional recommendations:"}
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {getLocalizedSuggestions(result.suggestions).map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
