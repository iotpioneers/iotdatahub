import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "../api/auth/authOptions";
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Link,
  Popover,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }

  return (
    <main className="overflow-hidden p-6 bg-gray-100 min-h-screen">
      <Heading className="text-3xl font-semibold mb-6">Dashboard</Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Overview Cards */}
        <OverviewCard title="Channels" value="5" url="/dashboard/channels" />
        <OverviewCard title="Devices" value="2" url="/dashboard/devices" />
        <Box>
          <Card asChild>
            <a href="#">
              <Text as="div" size="3" weight="bold" mb="4">
                Quick start
              </Text>
              <Text as="div" color="gray" size="2">
                Start building your next project in minutes
              </Text>
            </a>
          </Card>
        </Box>

        <Popover.Root>
          <Popover.Trigger>
            <Button variant="soft">
              <ChatBubbleLeftIcon width="16" height="16" />
              Need help or support?
            </Button>
          </Popover.Trigger>
          <Popover.Content width="360px">
            <Flex gap="3">
              <Avatar size="2" src="/person-4.png" fallback="A" radius="full" />
              <Box flexGrow="1">
                <TextArea
                  placeholder="Write a message…"
                  style={{ height: 80 }}
                />
                <Flex gap="3" mt="3" justify="between">
                  <Popover.Close>
                    <Button size="1">Send</Button>
                  </Popover.Close>
                </Flex>
              </Box>
            </Flex>
          </Popover.Content>
        </Popover.Root>
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
  url: string;
}

function OverviewCard({ title, value, url }: OverviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <Text className="text-lg font-semibold">{title}</Text>
        <Text className="text-2xl font-bold">{value}</Text>
      </div>
      <Link href={url} className="text-sm text-gray-500">
        Learn More
      </Link>
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
