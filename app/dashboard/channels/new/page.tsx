"use client";

import { CustomButton } from "@/components";
import { useState, ChangeEvent, FormEvent } from "react";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";

const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

export default function NewChannel() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fields, setFields] = useState<string[]>([""]);
  const [deviceId, setDeviceId] = useState<string>("");

  const handleFieldChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
  };

  const addNewField = () => {
    setFields([...fields, ""]);
  };

  const deleteField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidObjectId(deviceId)) {
      console.error("Invalid device ID");
      return;
    }

    const data = {
      name,
      description,
      deviceId,
      fields,
    };

    try {
      const response = await fetch("/api/channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error("Failed to create channel");
      }

      const result = await response.json();
      console.log("Channel created successfully:", result);
      // Clear the form or redirect the user as needed
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <main className="overflow-hidden p-4">
      <h1>Add a new channel</h1>
      <div className="mt-10 border-t border-gray-200"></div>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            Channel Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter a unique channel name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter channel description"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        {fields.map((field, index) => (
          <div className="mb-4 flex items-center" key={index}>
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`field${index}`}
              >
                Field {index + 1}
              </label>
              <input
                type="text"
                id={`field${index}`}
                placeholder={`Enter field ${index + 1} label`}
                value={field}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange(index, e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => deleteField(index)}
              className="ml-2 mt-6 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <ArchiveBoxXMarkIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </button>
          </div>
        ))}
        <CustomButton
          title="Add New Field"
          containerStyles="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          handleClick={addNewField}
        />

        <div className="mb-4 mt-3">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="deviceId"
          >
            Device ID
          </label>
          <input
            type="text"
            id="deviceId"
            placeholder="Enter device ID"
            value={deviceId}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDeviceId(e.target.value)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Channel
        </button>
      </form>
    </main>
  );
}
