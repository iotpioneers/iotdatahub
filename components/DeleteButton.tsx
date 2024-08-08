"use client";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import LoadingProgressBar from "./LoadingProgressBar";

const DeleteButton = () => {
  const [error, setError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" disabled={isDeleting}>
            <TrashIcon width={15} height={15} /> Delete
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          {isDeleting && <LoadingProgressBar />}
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this ? This action cannot be undone.
          </AlertDialog.Description>
          <Flex mt="4" gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red">Delete</Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>
            This issue could not be deleted.
          </AlertDialog.Description>
          <Button
            color="gray"
            variant="soft"
            mt="2"
            onClick={() => setError(false)}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteButton;
