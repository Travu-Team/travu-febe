import { IconButton } from "@material-tailwind/react";
import { TrashIcon, PencilIcon, StarIcon, MapPinIcon  } from "@heroicons/react/24/solid";

export function IconButtonCustom({ variant, onClick }) {
  let icon = null;
  let colorClass = "";
  let ariaLabel = "";

  if (variant === "delete") {
    icon = <TrashIcon className="h-5 w-5 text-red-600" />;
    colorClass = "bg-primary/15";
    ariaLabel = "Hapus";
  } else if (variant === "edit") {
    icon = <PencilIcon className="h-5 w-5 text-orange-500" />;
    colorClass = "bg-primary/15";
    ariaLabel = "Edit";
  } else if (variant === "rating") {
    icon = <StarIcon className="h-5 w-5 text-orange-500" />;
    ariaLabel = "Rating";
  } else if (variant === "location") {
    icon = <MapPinIcon className="h-5 w-5 text-red-500" />;
    colorClass = "bg-white";
    ariaLabel = "Location";
  }

  return (
    <IconButton 
        onClick={onClick}
        className={`rounded-full ${colorClass}`} aria-label={ariaLabel}>
      {icon}
    </IconButton>
  );
}