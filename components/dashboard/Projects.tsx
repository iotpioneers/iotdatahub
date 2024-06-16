"use client";

import { useState } from "react";
import { CustomButton } from "..";
import CreateProject from "./CreateProject";
import ProjectList from "./ProjectList";
import Pagination from "./Pagination";
import { Box, Button, Flex, TextField } from "@radix-ui/themes";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const Projects = () => {
  const [createProject, setCreateProject] = useState(false);

  return (
    <div className="padding-x padding-y max-width">
      <CreateProject
        createProject={createProject}
        setCreateProject={setCreateProject}
      />
      <div className="flex justify-between items-center mb-8">
        <div className="flex ustify-between items-center w-full">
          <Button
            title="Explore Tools"
            size="3"
            className="bg-primary-blue h-16 w-16 text-white rounded-md justify-center"
            onClick={() => setCreateProject(true)}
          >
            Explore Tools <PlusCircleIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div>
        <ProjectList />
      </div>
      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default Projects;
