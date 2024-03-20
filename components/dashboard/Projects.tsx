"use client";

import { useState } from "react";

import { CustomButton } from "..";
import CreateProject from "./CreateProject";
import ProjectList from "./ProjectList";
import Pagination from "./Pagination";

const Projects = () => {
  const [createProject, setCreateProject] = useState(false);

  return (
    <div className="padding-x padding-y max-width">
      <CreateProject
        createProject={createProject}
        setCreateProject={setCreateProject}
      />
      <div className="flex justify-end mb-8">
        <CustomButton
          title="Explore Tools"
          containerStyles="bg-primary-blue text-white rounded-md mt-10"
          handleClick={() => setCreateProject(true)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          }
        />
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
