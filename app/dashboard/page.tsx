"use client";

import React from "react";
import {
  MdRouter,
  MdMusicNote,
  MdLightbulb,
  MdPrecisionManufacturing,
} from "react-icons/md";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "../api/auth/authOptions";
import Chat from "@/components/Chat/Chat";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { Button, Heading, Switch, Text, Avatar } from "@radix-ui/themes";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";

const dataLine = [
  { name: "Jan", value: 50 },
  { name: "Feb", value: 80 },
  { name: "Mar", value: 30 },
  { name: "Apr", value: 70 },
  { name: "May", value: 60 },
  { name: "Jun", value: 90 },
  { name: "Jul", value: 100 },
];

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen font-sans text-gray-800 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Welcome and Devices Section */}
        <div className="space-y-5">
          <div className="bg-orange-200 p-5 rounded-lg shadow-md">
            <div>
              <Heading as="h1" className="text-2xl font-bold mb-5">
                Hello, Scarlett!
              </Heading>
              <Text className="text-gray-600">
                Welcome Home! The air quality is good & fresh you can go out
                today.
              </Text>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-lg border">
            <div className="flex justify-between items-center mb-5">
              <Heading as="h2" className="text-xl font-semibold">
                My Devices
              </Heading>
              <Link href="#">
                <Button variant="outline" className="w-10 h-10">
                  <PlusIcon className="w-4 h-4" /> Add Device
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="bg-blue-500 text-white p-5 rounded-lg shadow-md flex flex-col justify-between h-32">
                <div className="flex space-x-3 justify-between">
                  <MdPrecisionManufacturing className="h-6 w-6" />
                  <Switch color="orange" className="h-6 w-6" />
                </div>
                <div>Tractor</div>
              </div>
              <div className="bg-yellow-500 text-white p-5 rounded-lg shadow-md flex flex-col justify-between h-32">
                <div className="flex space-x-3 justify-between">
                  <MdRouter className="h-6 w-6" />
                  <Switch color="gray" highContrast className="h-6 w-6" />
                </div>
                <div>Router</div>
              </div>
              <div className="bg-red-500 text-white p-5 rounded-lg shadow-md flex flex-col justify-between h-32">
                <div className="flex space-x-3 justify-between">
                  <MdMusicNote className="h-6 w-6" />
                  <Switch color="cyan" className="h-6 w-6" />
                </div>
                <div>Music System</div>
              </div>
              <div className="bg-teal-500 text-white p-5 rounded-lg shadow-md flex flex-col justify-between h-32">
                <div className="flex space-x-3 justify-between">
                  <MdLightbulb className="h-6 w-6" />
                  <Switch color="crimson" className="h-6 w-6" />
                </div>
                <div>Lamps</div>
              </div>
            </div>
          </div>
        </div>

        {/* Members, and Power Consumption Section */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-lg shadow-lg border">
            <Heading as="h2" className="text-xl font-semibold mb-5">
              Members
            </Heading>
            <div className="flex space-x-8 overflow-x-auto">
              <div className="flex flex-col items-center">
                <Avatar
                  fallback="S"
                  className="h-10 w-10 bg-purple-500 rounded-full text-white flex items-center justify-center"
                />
                <div className="mt-2">Scarlett</div>
                <Text className="text-green-500 text-sm">Admin</Text>
              </div>
              <div className="flex flex-col items-center">
                <Avatar
                  fallback="N"
                  className="h-10 w-10 bg-red-500 rounded-full text-white flex items-center justify-center"
                />
                <Text className="mt-2">Nariya</Text>
                <Text className="text-blue-500  text-sm">Full Access</Text>
              </div>
              <div className="flex flex-col items-center">
                <Avatar
                  fallback="R"
                  className="h-10 w-10 bg-green-500 rounded-full text-white flex items-center justify-center"
                />
                <Text className="mt-2">Riya</Text>
                <Text className="text-blue-500  text-sm">Full Access</Text>
              </div>
              <div className="flex flex-col items-center">
                <Avatar
                  fallback="D"
                  className="h-10 w-10 bg-orange-500 rounded-full text-white flex items-center justify-center"
                />
                <Text className="mt-2">Dad</Text>
                <Text className="text-blue-500  text-sm">Full Access</Text>
              </div>
              <div className="flex flex-col items-center">
                <Avatar
                  fallback="M"
                  className="h-10 w-10 bg-teal-500 rounded-full text-white flex items-center justify-center"
                />
                <Text className="mt-2">Mom</Text>
                <Text className="text-blue-500  text-sm">Full Access</Text>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-lg border">
            <h2 className="text-xl font-semibold mb-5">Data Generateded</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                width={730}
                height={250}
                data={dataLine}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// "use client";

// import React from "react";

// import {
//   BellIcon,
//   CalendarIcon,
//   HomeIcon,
//   LightBulbIcon,
//   UserIcon,
// } from "@heroicons/react/24/outline";
// import {
//   CartesianGrid,
//   Cell,
//   Line,
//   LineChart,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// const dataPie = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 },
// ];

// const dataLine = [
//   { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
//   { name: "Page B", uv: 300, pv: 4567, amt: 2400 },
//   { name: "Page C", uv: 300, pv: 1398, amt: 2400 },
//   { name: "Page D", uv: 200, pv: 9800, amt: 2400 },
//   { name: "Page E", uv: 278, pv: 3908, amt: 2400 },
//   { name: "Page F", uv: 189, pv: 4800, amt: 2400 },
// ];

// const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const Dashboard = () => {
//   return (
//     <div className="flex flex-col p-5 font-sans text-textColor">
//       <div className="mb-5">
//         <h1 className="text-3xl font-bold">Good morning, Christophe!</h1>
//         <p>
//           Find out how easy it is to make your home comfortable, more functional
//           and more.
//         </p>
//         <button className="mt-2 bg-primary text-white py-2 px-4 rounded-lg">
//           My journey
//         </button>
//       </div>

//       <div className="flex">
//         <div className="w-64 mr-5">
//           <h2 className="text-xl font-semibold">My product</h2>
//           <div className="flex justify-between mt-2 mb-5">
//             <div className="w-10 h-10 bg-lightGray rounded-lg flex items-center justify-center">
//               <BellIcon className="h-6 w-6 text-primary" />
//             </div>
//             <div className="w-10 h-10 bg-lightGray rounded-lg flex items-center justify-center">
//               <HomeIcon className="h-6 w-6 text-primary" />
//             </div>
//             <div className="w-10 h-10 bg-lightGray rounded-lg flex items-center justify-center">
//               <LightBulbIcon className="h-6 w-6 text-primary" />
//             </div>
//             <div className="w-10 h-10 bg-lightGray rounded-lg flex items-center justify-center">
//               <UserIcon className="h-6 w-6 text-primary" />
//             </div>
//           </div>

//           <h2 className="text-xl font-semibold">Schedule</h2>
//           <div className="bg-secondary p-3 rounded-lg mb-3">
//             <h3 className="font-semibold">Sat 21</h3>
//             <p>8:00 am - 12:00 am</p>
//             <p>Go to work</p>
//           </div>
//           <div className="bg-secondary p-3 rounded-lg">
//             <h3 className="font-semibold">Sat 21</h3>
//             <p>2:00 pm - 6:00 pm</p>
//             <p>Come back at home</p>
//           </div>
//         </div>

//         <div className="flex-grow">
//           <div className="flex flex-col mb-5">
//             <div className="flex-grow bg-secondary p-3 rounded-lg mb-5">
//               <h3 className="font-semibold">Pie Chart</h3>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={dataPie}
//                       dataKey="value"
//                       outerRadius={80}
//                       fill="#8884d8"
//                       label
//                     >
//                       {dataPie.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={colors[index % colors.length]}
//                         />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//             <div className="flex-grow bg-secondary p-3 rounded-lg">
//               <h3 className="font-semibold">Chart Latency</h3>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={dataLine}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           <div className="bg-secondary p-3 rounded-lg mb-5">
//             <h3 className="font-semibold">August 2021</h3>
//             <div className="h-80 flex items-center justify-center">
//               <CalendarIcon className="h-16 w-16 text-primary" />
//             </div>
//           </div>

//           <div className="bg-secondary p-3 rounded-lg">
//             <h3 className="font-semibold">Column Chart</h3>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={dataLine}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//             <p className="text-2xl mt-2">21°</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import authOptions from "../api/auth/authOptions";
// import { Box, Card, Heading, Link, Text } from "@radix-ui/themes";
// import Chat from "@/components/Chat/Chat";

// export default async function Dashboard() {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return redirect("/login");
//   }

//   return (
//     <main className="overflow-hidden p-6 min-h-screen">
//       <Heading className="text-3xl font-semibold mb-6">Dashboard</Heading>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//         {/* Overview Cards */}
//         <OverviewCard title="Channels" value="5" url="/dashboard/channels" />
//         <OverviewCard title="Devices" value="2" url="/dashboard/devices" />
//         <Box>
//           <Card asChild>
//             <a href="#">
//               <Text as="div" size="3" weight="bold" mb="4">
//                 Quick start
//               </Text>
//               <Text as="div" color="gray" size="2">
//                 Start building your next project in minutes
//               </Text>
//             </a>
//           </Card>
//         </Box>

//         <div>
//           <Chat />
//         </div>
//       </div>
//     </main>
//   );
// }

// interface OverviewCardProps {
//   title: string;
//   value: string;
//   url: string;
// }

// function OverviewCard({ title, value, url }: OverviewCardProps) {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <div className="flex justify-between items-center">
//         <Text className="text-lg font-semibold">{title}</Text>
//         <Text className="text-2xl font-bold">{value}</Text>
//       </div>
//       <Link href={url} className="text-sm text-gray-500">
//         Learn More
//       </Link>
//     </div>
//   );
// }

// interface ProjectRowProps {
//   name: string;
//   manager: string;
//   dueDate: string;
//   status: string;
//   progress: string;
// }

// function ProjectSummary() {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h3 className="text-lg font-semibold mb-4">Project Summary</h3>
//       <table className="w-full text-left">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Project Manager</th>
//             <th>Due Date</th>
//             <th>Status</th>
//             <th>Progress</th>
//           </tr>
//         </thead>
//         <tbody>
//           <ProjectRow
//             name="Nelsa web development"
//             manager="Om Prakash Sao"
//             dueDate="May 25, 2023"
//             status="Completed"
//             progress="100%"
//           />
//           <ProjectRow
//             name="Datasource AI app"
//             manager="Nelsan Mando"
//             dueDate="Jun 20, 2023"
//             status="Delayed"
//             progress="60%"
//           />
//           <ProjectRow
//             name="Media channel branding"
//             manager="Truvelly Priya"
//             dueDate="Jul 13, 2023"
//             status="At Risk"
//             progress="30%"
//           />
//           <ProjectRow
//             name="Corlax iOS app development"
//             manager="Matte Harney"
//             dueDate="Dec 27, 2023"
//             status="Completed"
//             progress="100%"
//           />
//           <ProjectRow
//             name="Website builder development"
//             manager="Sukumar Rao"
//             dueDate="Mar 15, 2024"
//             status="On Going"
//             progress="80%"
//           />
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function ProjectRow({
//   name,
//   manager,
//   dueDate,
//   status,
//   progress,
// }: ProjectRowProps) {
//   return (
//     <tr className="border-t">
//       <td className="py-2">{name}</td>
//       <td>{manager}</td>
//       <td>{dueDate}</td>
//       <td>{status}</td>
//       <td>{progress}</td>
//     </tr>
//   );
// }

// interface OverallProgressProps {}

// function OverallProgress({}: OverallProgressProps) {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>
//       <div className="flex items-center justify-center">
//         <div className="relative w-40 h-40">
//           <svg className="w-full h-full">
//             <circle
//               cx="50%"
//               cy="50%"
//               r="50%"
//               fill="none"
//               stroke="#e5e7eb"
//               strokeWidth="10"
//             />
//             <circle
//               cx="50%"
//               cy="50%"
//               r="50%"
//               fill="none"
//               stroke="#10b981"
//               strokeWidth="10"
//               strokeDasharray="314"
//               strokeDashoffset="88"
//             />
//           </svg>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="text-2xl font-bold">72%</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// type Status = "Approved" | "In Review" | "New" | "Ongoing";

// interface TodayTaskProps {}

// function TodayTask({}: TodayTaskProps) {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h3 className="text-lg font-semibold mb-4">Today Task</h3>
//       <ul>
//         <TaskItem
//           title="Create a user flow of social application design"
//           status="Approved"
//         />
//         <TaskItem
//           title="Create a user flow of social application design"
//           status="In Review"
//         />
//         <TaskItem
//           title="Landing page design for Fintech project of Singapore"
//           status="New"
//         />
//         <TaskItem
//           title="Interactive prototype for app screens of Deltamine project"
//           status="Ongoing"
//         />
//         <TaskItem
//           title="Interactive prototype for app screens of Deltamine project"
//           status="Ongoing"
//         />
//       </ul>
//     </div>
//   );
// }

// interface TaskItemProps {
//   title: string;
//   status: Status;
// }

// function TaskItem({ title, status }: TaskItemProps) {
//   const statusClasses: { [key in Status]: string } = {
//     Approved: "text-green-500",
//     "In Review": "text-yellow-500",
//     New: "text-red-500",
//     Ongoing: "text-blue-500",
//   };

//   return (
//     <li className="border-t py-2">
//       <div className="flex justify-between">
//         <span>{title}</span>
//         <span className={statusClasses[status]}>{status}</span>
//       </div>
//     </li>
//   );
// }

// interface ProjectsWorkloadProps {}

// function ProjectsWorkload({}: ProjectsWorkloadProps) {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h3 className="text-lg font-semibold mb-4">Projects Workload</h3>
//       <ul className="flex space-x-4">
//         <WorkloadItem name="Sam" tasks={7} />
//         <WorkloadItem name="Maddy" tasks={8} />
//         <WorkloadItem name="Ken" tasks={6} />
//         <WorkloadItem name="Dmitry" tasks={10} />
//         <WorkloadItem name="Vega" tasks={5} />
//       </ul>
//     </div>
//   );
// }

// interface WorkloadItemProps {
//   name: string;
//   tasks: number;
// }

// function WorkloadItem({ name, tasks }: WorkloadItemProps) {
//   return (
//     <li className="flex flex-col items-center">
//       <span className="text-lg font-semibold">{tasks}</span>
//       <span className="text-gray-500">{name}</span>
//     </li>
//   );
// }
