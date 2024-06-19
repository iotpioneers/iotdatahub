import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "../api/auth/authOptions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }

  return (
    <main className="overflow-hidden p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Overview Cards */}
        <OverviewCard
          title="Total Revenue"
          value="$53,009.89"
          change="2% increase from last month"
        />
        <OverviewCard
          title="Projects"
          value="95 / 100"
          change="10% decrease from last month"
        />
        <OverviewCard
          title="Time Spent"
          value="1022 / 1300 Hrs"
          change="8% increase from last month"
        />
        <OverviewCard
          title="Resources"
          value="101 / 120"
          change="2% increase from last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Project Summary */}
        <ProjectSummary />

        {/* Overall Progress */}
        <OverallProgress />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Today Task */}
        <TodayTask />

        {/* Projects Workload */}
        <ProjectsWorkload />
      </div>
    </main>
  );
}

interface OverviewCardProps {
  title: string;
  value: string;
  change: string;
}

function OverviewCard({ title, value, change }: OverviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{change}</p>
    </div>
  );
}

interface ProjectRowProps {
  name: string;
  manager: string;
  dueDate: string;
  status: string;
  progress: string;
}

function ProjectSummary() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Project Summary</h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Project Manager</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          <ProjectRow
            name="Nelsa web development"
            manager="Om Prakash Sao"
            dueDate="May 25, 2023"
            status="Completed"
            progress="100%"
          />
          <ProjectRow
            name="Datasource AI app"
            manager="Nelsan Mando"
            dueDate="Jun 20, 2023"
            status="Delayed"
            progress="60%"
          />
          <ProjectRow
            name="Media channel branding"
            manager="Truvelly Priya"
            dueDate="Jul 13, 2023"
            status="At Risk"
            progress="30%"
          />
          <ProjectRow
            name="Corlax iOS app development"
            manager="Matte Harney"
            dueDate="Dec 27, 2023"
            status="Completed"
            progress="100%"
          />
          <ProjectRow
            name="Website builder development"
            manager="Sukumar Rao"
            dueDate="Mar 15, 2024"
            status="On Going"
            progress="80%"
          />
        </tbody>
      </table>
    </div>
  );
}

function ProjectRow({
  name,
  manager,
  dueDate,
  status,
  progress,
}: ProjectRowProps) {
  return (
    <tr className="border-t">
      <td className="py-2">{name}</td>
      <td>{manager}</td>
      <td>{dueDate}</td>
      <td>{status}</td>
      <td>{progress}</td>
    </tr>
  );
}

interface OverallProgressProps {}

function OverallProgress({}: OverallProgressProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r="50%"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <circle
              cx="50%"
              cy="50%"
              r="50%"
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray="314"
              strokeDashoffset="88"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">72%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type Status = "Approved" | "In Review" | "New" | "Ongoing";

interface TodayTaskProps {}

function TodayTask({}: TodayTaskProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Today Task</h3>
      <ul>
        <TaskItem
          title="Create a user flow of social application design"
          status="Approved"
        />
        <TaskItem
          title="Create a user flow of social application design"
          status="In Review"
        />
        <TaskItem
          title="Landing page design for Fintech project of Singapore"
          status="New"
        />
        <TaskItem
          title="Interactive prototype for app screens of Deltamine project"
          status="Ongoing"
        />
        <TaskItem
          title="Interactive prototype for app screens of Deltamine project"
          status="Ongoing"
        />
      </ul>
    </div>
  );
}

interface TaskItemProps {
  title: string;
  status: Status;
}

function TaskItem({ title, status }: TaskItemProps) {
  const statusClasses: { [key in Status]: string } = {
    Approved: "text-green-500",
    "In Review": "text-yellow-500",
    New: "text-red-500",
    Ongoing: "text-blue-500",
  };

  return (
    <li className="border-t py-2">
      <div className="flex justify-between">
        <span>{title}</span>
        <span className={statusClasses[status]}>{status}</span>
      </div>
    </li>
  );
}

interface ProjectsWorkloadProps {}

function ProjectsWorkload({}: ProjectsWorkloadProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Projects Workload</h3>
      <ul className="flex space-x-4">
        <WorkloadItem name="Sam" tasks={7} />
        <WorkloadItem name="Maddy" tasks={8} />
        <WorkloadItem name="Ken" tasks={6} />
        <WorkloadItem name="Dmitry" tasks={10} />
        <WorkloadItem name="Vega" tasks={5} />
      </ul>
    </div>
  );
}

interface WorkloadItemProps {
  name: string;
  tasks: number;
}

function WorkloadItem({ name, tasks }: WorkloadItemProps) {
  return (
    <li className="flex flex-col items-center">
      <span className="text-lg font-semibold">{tasks}</span>
      <span className="text-gray-500">{name}</span>
    </li>
  );
}
