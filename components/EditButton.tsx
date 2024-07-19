import { Button } from "@radix-ui/themes";
import React from "react";
import Link from "@/components/Link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const EditButton = () => {
  return (
    <Button className="flex">
      <PencilSquareIcon width={15} height={15} />
      <Link href="#">Edit</Link>
    </Button>
  );
};

export default EditButton;
