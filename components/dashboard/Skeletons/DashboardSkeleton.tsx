"use client";
import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Skeleton from "@/components/Skeleton";

const LoadingSkeleton = () => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="space-y-5">
          <Skeleton
            height={200}
            className="bg-orange-200 p-5 rounded-lg shadow-md"
          />
          <div className="bg-white p-5 rounded-lg shadow-lg border">
            <Skeleton
              height={30}
              className="flex justify-between items-center mb-5"
            />

            <div className="grid grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton
                  key={index}
                  className="bg-blue-500 text-white p-5 rounded-lg shadow-md flex flex-col justify-between h-32"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-5">
              <Skeleton width="100%" height={30} />
            </h2>
            <div className="flex space-x-5 overflow-x-auto overflow-hidden">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton width={70} height={50} className="rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-lg border">
            <h2 className="text-xl font-semibold mb-5">
              <Skeleton width="100%" height={30} />
            </h2>
            <div style={{ width: "100%", height: 200 }}>
              <Skeleton width="100%" height="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;

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
