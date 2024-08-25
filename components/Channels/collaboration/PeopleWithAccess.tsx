"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
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
import { DeleteOutline } from "@mui/icons-material";

const PeopleWithAccess = ({
  roomId,
  creator,
  receiverEmail,
  collaborator,
  user,
  onCollaboratorRemoved,
}: CollaboratorProps & {
  onCollaboratorRemoved: (email: string) => void;
}) => {
  const [userType, setUserType] = useState(collaborator.userType || "viewer");
  const [loading, setLoading] = useState(false);
  const [pendingAccessChange, setPendingAccessChange] =
    useState<UserAccessType | null>(null);
  const invisibleTriggerRef = useRef<HTMLButtonElement>(null);

  const channelAccessChangeHandler = (
    event: SelectChangeEvent<"editor" | "viewer">
  ) => {
    const newAccessType = event.target.value as UserAccessType;
    setPendingAccessChange(newAccessType);
    setTimeout(() => invisibleTriggerRef.current?.click(), 0);
  };

  const HandleAccessChange = async () => {
    if (pendingAccessChange) {
      setLoading(true);
      await updateChannelAccess({
        roomId,
        collaborators: [
          { email: receiverEmail, userType: pendingAccessChange },
        ],
        notifyPeople: true,
        updatedBy: user,
      });
      setUserType(pendingAccessChange);
      setPendingAccessChange(null);
      setLoading(false);
    }
  };

  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);

    const result = await removeCollaborator({ roomId, email });

    if (result) {
      onCollaboratorRemoved(email);
    } else {
      console.log("Failed to remove collaborator. Please try again.");
    }

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

          {pendingAccessChange && (
            <CollaborationActionModal
              triggerComponent={
                <button ref={invisibleTriggerRef} style={{ display: "none" }} />
              }
              title="Change Collaborator Access"
              description={`Are you sure you want to change ${collaborator.name}'s access to ${pendingAccessChange}?`}
              warning="This action will update the collaborator's permissions."
              confirmButtonText="Confirm"
              onConfirm={HandleAccessChange}
              iconSrc="/icons/edit.svg"
            />
          )}
          <CollaborationActionModal
            triggerComponent={
              <Button>
                <DeleteOutline />
              </Button>
            }
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

export default PeopleWithAccess;
