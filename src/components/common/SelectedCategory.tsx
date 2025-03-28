import { Card, CardHeader } from "@/components/ui/card";
import { categoryItems } from "./MapFilterItems";
import { useState } from "react";

export function SelctetCategory() {
  const [selectedCategory, setSelectredCategory] = useState<string | undefined>(undefined);

  return (
    <div className="grid grid-cols-4 gap-8 mt-10 w-3/5 mx-auto mb-36">
      <input type="hidden" name="categoryName" value={selectedCategory as string} />
      {categoryItems.map(({ id, label, icon: Icon }) => (
        <div key={id} className="cursor-pointer">
          <Card
            className={selectedCategory === label ? "border-primary" : ""}
            onClick={() => setSelectredCategory(label)}
          >
            <CardHeader className="flex flex-col items-center gap-2">
              <Icon height={32} width={32} className="w-8 h-8" />
              <h3 className="font-medium text-center">{label}</h3>
            </CardHeader>
          </Card>
        </div>
      ))}
    </div>
  );
}
