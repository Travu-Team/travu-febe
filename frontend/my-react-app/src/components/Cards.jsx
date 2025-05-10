import React from "react";
import { IconButtonCustom } from "./icon-button";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid";
import ButtonCustom from "./Button";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

export function CardCustom({
  image,
  title,
  buttonText,
  headerColor = "blue-gray",
  variant = "default",
  category,
  rating,
  location,
  handleEdit,
  handleDelete,
  item = {},
}) {
  const renderRating = () => (
    <div className="flex items-center gap-2">
      <div className="flex">
        {Array(5)
          .fill()
          .map((_, i) => (
            <StarIcon key={i} className="h-5 w-5 text-yellow-800" />
          ))}
      </div>
      <Typography className="text-lg text-black font-normal">
        ({rating})
      </Typography>
    </div>
  );

  const renderLocation = () => (
    <div className="flex items-center gap-1">
      <MapPinIcon className="h-6 w-6 text-red-800" />
      <Typography className="text-lg font-normal text-black">
        {location}
      </Typography>
    </div>
  );

  const renderButtons = () => (
    <div className="flex gap-4">
      <IconButtonCustom variant="edit" onClick={() => handleEdit(item.id)} />
      <IconButtonCustom variant="delete" onClick={() => handleDelete(item.id)} />
    </div>
  );

  const renderCategory = () => (
    <div className="px-3 py-1 border border-blue-600 rounded-md text-blue-600 text-lg font-semibold">
      {category}
    </div>
  );

  const sharedTextContent = (
    <div className="flex flex-col justify-center p-4 gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        {renderCategory()}
        {renderButtons()}
      </div>
      {renderRating()}
      <Typography className="text-xl font-semibold text-black">
        {title}
      </Typography>
      {renderLocation()}
    </div>
  );

  const sharedTextContent2 = (
    <div className="flex flex-col justify-center p-4 gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        {renderCategory()}
      </div>
      {renderRating()}
      <Typography className="text-xl font-semibold text-black">
        {title}
      </Typography>
      {renderLocation()}
    </div>
  );

  if (variant === "horizontal-1") {
    return (
      <div className="flex w-full max-w-xl bg-white shadow-md border border-gray-400 rounded-[14px] overflow-hidden flex-col md:flex-row">
        <img
          src={image}
          alt="card-image"
          className="w-full md:w-[250px] h-[215px] object-cover rounded-t-[14px] md:rounded-l-[14px] md:rounded-t-none"
        />
        {sharedTextContent}
      </div>
    );
  }

  if (variant === "horizontal-2") {
    return (
      <Card className="w-full max-w-lg flex-col md:flex-row shadow-md border border-gray-400 items-center overflow-hidden">
        <CardHeader
          shadow={false}
          floated={false}
          className="m-0 w-full md:w-2/5 rounded-b-none md:rounded-r-none"
        >
          <img
            src={image}
            alt="card-image"
            className="h-full w-full object-cover"
          />
        </CardHeader>
        <div className="w-full md:w-3/5 flex items-center">
          <CardBody>
            <Typography variant="h4" color="blue-gray" className="mb-2">
              {title}
            </Typography>
          </CardBody>
          <CardFooter className="pt-0">{renderButtons()}</CardFooter>
        </div>
      </Card>
    );
  }
  if (variant === "horizontal-3"){
    return (
      <div className="flex w-full max-w-xl bg-white shadow-md border border-gray-400 rounded-[14px] overflow-hidden flex-col md:flex-row">
        <img
          src={image}
          alt="card-image"
          className="w-full md:w-[250px] h-[215px] object-cover rounded-t-[14px] md:rounded-l-[14px] md:rounded-t-none"
        />
        {sharedTextContent2}
      </div>
    );
  }

  // vertical card
  return (
    <Card className="w-full max-w-xs shadow-md border border-gray-400">
      <CardHeader color={headerColor} className="relative h-56 m-0">
        <img
          src={image}
          alt="card-image"
          className="w-full h-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2 text-center">
          {title}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <ButtonCustom>{buttonText}</ButtonCustom>
      </CardFooter>
    </Card>
  );
}