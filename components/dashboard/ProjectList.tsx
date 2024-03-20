import Link from "next/link";

const ProjectList = () => {
  const projects = [
    {
      name: "IoT Monitoring",
      description:
        "Capturing all the sensor nitrogen, phosphourous and potassium",
      deviceId: "213424262376",
      lastSeen: "3h ago",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "Activation NPK",
      description: "calibration of the sensors",
      deviceId: "213424262376",
      lastSeen: "3h ago",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "Soil Moisture sensor",
      description: "Soil moisture sensor",
      deviceId: "213424262376",
      lastSeen: null,
    },
    {
      name: "Accelerometer",
      description:
        "Testing the accelerometer to make sure the car movements are detected in case of crash Testing the accelerometer to make sure the car movements are detected in case of crash Testing the accelerometer to make sure the car movements are detected in case of crash",
      deviceId: "213424262376",
      lastSeen: "3h ago",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "Capacitance",
      description: "home appliances activation",
      deviceId: "213424262376r",
      lastSeen: "3h ago",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "Lighting bulb",
      description: "Automation of my house",
      deviceId: "213424262376",
      lastSeen: null,
    },
  ];
  return (
    <ul role="list">
      {projects.map((project) => (
        <li
          key={project.description}
          className="flex justify-between gap-x-6 py-5 rounded-sm mt-2 padding-x border border-gray-200"
        >
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-lg font-semibold leading-6 text-primary-blue">
                <Link href={`dashboard/device`}>{project.name}</Link>
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {project.description}
              </p>
            </div>
          </div>
          <div className="shrink-0 sm:flex sm:flex-col sm:items-end flex flex-auto">
            <p className="text-sm leading-6 text-gray-900">
              <span>Device ID: </span>{" "}
              <span className="font-semibold"># {project.deviceId}</span>
            </p>
            {project.lastSeen ? (
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Last seen{" "}
                <time dateTime={project.lastSeenDateTime}>
                  {project.lastSeen}
                </time>
              </p>
            ) : (
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs leading-5 text-gray-500">Online</p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
