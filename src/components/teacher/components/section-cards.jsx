import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";

export function SectionCards({ cards }) {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            {card.change && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {card.trend === "up" && (
                  <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                )}
                {card.trend === "down" && (
                  <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                )}
                {card.trend === "neutral" && (
                  <MinusIcon className="mr-1 h-4 w-4 text-gray-500" />
                )}
                <span
                  className={
                    card.trend === "up"
                      ? "text-green-500"
                      : card.trend === "down"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {card.change}
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
