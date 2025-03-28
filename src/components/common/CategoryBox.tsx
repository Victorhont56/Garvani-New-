import { useNavigate, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { useCallback } from 'react';
import { IconType } from 'react-icons';

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback(() => {
    // Parse current query parameters
    const currentQuery = qs.parse(location.search);
    
    // Create updated query
    const updatedQuery = {
      ...currentQuery,
      category: currentQuery.category === label ? undefined : label
    };

    // Stringify new URL
    const url = qs.stringifyUrl(
      {
        url: location.pathname,
        query: updatedQuery,
      },
      { skipNull: true }
    );

    // Navigate to new URL
    navigate(url);
  }, [label, navigate, location]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex 
        flex-col 
        items-center 
        justify-center 
        gap-2
        min-w-[120px]
        border-b-2
        hover:text-neutral-800
        transition
        cursor-pointer
        ${selected ? 'border-b-neutral-800' : 'border-transparent'}
        ${selected ? 'text-neutral-800' : 'text-neutral-500'}
      `}
    >
      <Icon size={28} />
      <div className="font-medium text-sm text-center">{label}</div>
    </div>
  );
};

export default CategoryBox;