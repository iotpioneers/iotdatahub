"use client";

import { useState } from "react";
import CreateProject from "./CreateProject";
import ProjectList from "./ProjectList";
import Pagination from "./Pagination";
import { Flex } from "@radix-ui/themes";
import BackButton from "../BackButton";
import ChannelAction from "../device/ChannelAction";

const Projects = () => {
  const [createProject, setCreateProject] = useState(false);

  return (
    <div className="padding-x padding-y max-width">
      <CreateProject
        createProject={createProject}
        setCreateProject={setCreateProject}
      />
      <div className="flex justify-between items-center mb-8">
        <ChannelAction />
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
