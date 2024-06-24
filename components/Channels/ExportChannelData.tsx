import React from "react";
import { Button, DropdownMenu } from "@radix-ui/themes";

import { FaFileCsv, FaFileExcel } from "react-icons/fa6";
import { TextAlignRightIcon } from "@radix-ui/react-icons";
import { GiBracers } from "react-icons/gi";

interface Props {
  channelId: string;
}

const ExportChannelData = ({ channelId }: Props) => {
  const handleDownload = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="ghost">
            Export
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onSelect={() =>
              handleDownload(
                `/api/channels/${channelId}/export?format=csv`,
                "data.csv"
              )
            }
          >
            <div className="flex items-center gap-5 cursor-pointer">
              <FaFileCsv /> CSV
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() =>
              handleDownload(
                `/api/channels/${channelId}/export?format=xlsx`,
                "data.xlsx"
              )
            }
          >
            <div className="flex items-center gap-5 cursor-pointer">
              <FaFileExcel /> XLSX
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            onSelect={() =>
              handleDownload(
                `/api/channels/${channelId}/export?format=json`,
                "data.json"
              )
            }
          >
            <div className="flex items-center gap-5 cursor-pointer">
              <GiBracers /> JSON
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() =>
              handleDownload(
                `/api/channels/${channelId}/export?format=txt`,
                "data.txt"
              )
            }
          >
            <div className="flex items-center gap-5 cursor-pointer">
              <TextAlignRightIcon /> TEXT
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

export default ExportChannelData;
