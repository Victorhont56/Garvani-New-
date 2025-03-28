import { IconType } from "react-icons";
import { categoryItems } from "./MapFilterItems";
import { useLocation } from "react-router-dom";
import qs from "query-string";

interface CategoryShowcaseProps {
  icon?: IconType;
  label: string;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  icon: Icon,
  label,
}) => {
  const location = useLocation();
  const queryParams = qs.parse(location.search);
  const search = queryParams.filter as string | undefined;
  const category = categoryItems.find((item) => item.label === search);

  if (!category) {
    return null;
  }

  return (
    <div className="flex items-center">
      {Icon && <Icon size={28} />}
      <div className="flex flex-col ml-4">
        <h3 className="font-medium">{category.label}</h3>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </div>
    </div>
  );
};