"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  removeCollaborator,
  updateChannelAccess,
} from "@/lib/actions/room.actions";
import { CollaboratorProps, UserAccessType } from "@/types";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { CollaborationActionModal } from "./CollaborationActionModal";

const Collaborator = ({
  roomId,
  creator,
  receiverEmail,
  collaborator,
  user,
}: CollaboratorProps) => {
  const [userType, setUserType] = useState(collaborator.userType || "viewer");
  const [loading, setLoading] = useState(false);

  console.log("collaborator", collaborator);

  const shareChannelUpdateHandler = async (type: string) => {
    setLoading(true);

    await updateChannelAccess({
      roomId,
      receiverEmail,
      userType: type as UserAccessType,
      updatedBy: user,
    });

    setLoading(false);
  };

  const channelAccessChangeHandler = (
    event: SelectChangeEvent<"editor" | "viewer">
  ) => {
    setUserType(event.target.value as UserAccessType);
    shareChannelUpdateHandler(event.target.value);
  };

  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);

    await removeCollaborator({ roomId, email });

    setLoading(false);
  };

  return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2">
        <Image
          src={collaborator.avatar || ""}
          alt={collaborator.name}
          width={36}
          height={36}
          className="size-9 rounded-full"
        />
        <div>
          <p className="line-clamp-1 text-sm text-slate-950 font-semibold leading-4">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-red-600">
              {loading && "updating..."}
            </span>
          </p>
          <p className="text-sm font-light text-gray-500">
            {collaborator.email}
          </p>
        </div>
      </div>

      {creator === collaborator.id ? (
        <p className="bg-slate-100 px-2 py-1 rounded text-sm text-slate-800">
          Owner
        </p>
      ) : (
        <div className="flex items-center">
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Access</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={userType}
              label="Change Access"
              onChange={channelAccessChangeHandler}
            >
              <MenuItem value="viewer">view</MenuItem>
              <MenuItem value="editor">edit</MenuItem>
            </Select>
          </FormControl>

          <CollaborationActionModal
            triggerComponent={<Button>Remove</Button>}
            title="Remove Collaborator"
            description={`Are you sure you want to remove ${collaborator.name} from this room?`}
            warning="This action cannot be undone."
            confirmButtonText="Remove"
            onConfirm={() => removeCollaboratorHandler(collaborator.email)}
            iconSrc="/icons/delete.svg"
          />
        </div>
      )}
    </li>
  );
};

export default Collaborator;
