# <div align="center">🌐 IOT DATA HUB</div>

<div align="center">
  <img src="https://img.shields.io/badge/Next.js%2014-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Material--UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="Material-UI" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  
  <p align="center" class="tagline">
    <em>Connecting Devices, Analyzing Data & Enabling Smart Decisions</em><br>
    <strong>A comprehensive Next.js 14 IoT data management & visualization platform</strong>
  </p>
</div>

<div class="project-badges" align="center">
  <a href="#features">
    <img src="https://img.shields.io/badge/✓-Real_Time_Data-blue" alt="Real-time Data" />
  </a>
  <a href="#tech-stack">
    <img src="https://img.shields.io/badge/✓-Device_Management-orange" alt="Device Management" />
  </a>
  <a href="#features">
    <img src="https://img.shields.io/badge/✓-Data_Visualization-green" alt="Data Visualization" />
  </a>
  <a href="#features">
    <img src="https://img.shields.io/badge/✓-Multi_Organization-purple" alt="Multi-organization" />
  </a>
</div>

## 📑 Table of Contents

- [👀 Project Overview](#project-overview)
- [✨ Key Features](#key-features)
- [🛠️ Tech Stack](#️tech-stack)
- [📊 Project Structure](#project-structure)
- [🚀 Getting Started](#getting-started)
- [🖥️ Usage & Portals](#️usage--portals)
- [📁 Folder Structure](#📁-folder-structure)
- [🤝 Contributing](#contributing)
- [📞 Contact](#contact)

## 👀 Project Overview

IoT Data Hub is a comprehensive platform designed for Internet of Things (IoT) data management, visualization, and analytics. The system provides a complete solution for connecting IoT devices, collecting sensor data, and transforming it into actionable insights through interactive dashboards and real-time monitoring.

The platform addresses the complexity of IoT data management by providing:

- **Device Management**: Centralized device registration, monitoring, and status tracking
- **Data Collection**: Real-time data ingestion from multiple IoT devices and sensors
- **Channel Organization**: Structured data organization through customizable channels and fields
- **Visualization**: Interactive charts, graphs, and dashboards for data analysis
- **Collaboration**: Multi-user organizations with role-based access control
- **API Integration**: RESTful APIs for seamless device integration and data access

## ✨ Key Features

### 🔌 IoT Device Management

Complete device lifecycle management with:

- Device registration and configuration
- Real-time status monitoring (Online/Offline/Disconnected)
- Device grouping and organization
- Automated device discovery and setup
- Device health monitoring and alerts

### 📊 Data Collection & Channels

Flexible data organization system:

- Custom channel creation for different data streams
- Configurable data fields with validation
- Real-time data point collection
- Batch data import/export capabilities
- Data retention and archival policies

### 📈 Data Visualization & Analytics

Comprehensive visualization tools:

- Interactive line charts and bar graphs
- Real-time gauge components
- Customizable dashboard widgets
- Historical data analysis
- Trend identification and forecasting
- Export capabilities for reports

### 🏢 Multi-Organization Support

Enterprise-ready organization management:

- Multi-tenant architecture
- Organization-specific data isolation
- Member invitation and management
- Role-based access control (Viewer, Editor, Admin)
- Subscription and billing management

### 🔐 Authentication & Security

Robust security framework:

- NextAuth.js integration with multiple providers
- JWT-based session management
- API key authentication for devices
- Role-based permissions
- Secure data transmission

### 🌐 Real-time Collaboration

Live collaboration features:

- Real-time data updates
- Collaborative editing with Liveblocks
- Live comments and annotations
- Shared dashboards and views
- Activity tracking and notifications

### 💳 Subscription Management

Flexible pricing and billing:

- Multiple subscription tiers (Free, Premium, Enterprise)
- Usage-based billing
- Stripe payment integration
- Invoice generation and management
- Feature access control

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Material-UI (MUI)
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MongoDB with Prisma for type-safe queries
- **Authentication**: NextAuth.js with multiple providers
- **Real-time**: Liveblocks for collaboration features
- **Styling**: Tailwind CSS, Material-UI components
- **Charts**: Recharts, ApexCharts for data visualization
- **Maps**: React Leaflet for geospatial data
- **State Management**: Redux Toolkit, React Context
- **Validation**: Zod for schema validation
- **File Upload**: Cloudinary integration
- **Monitoring**: Sentry for error tracking
- **Payments**: Stripe for subscription management

## 📊 Project Structure

<details>
<summary>📂 <b>View Complete Folder Structure</b></summary>

```
iot-data-hub/
│
├── app/
│   ├── (account)/                          # User dashboard routes
│   │   ├── dashboard/
│   │   │   ├── channels/                   # Channel management
│   │   │   ├── devices/                    # Device management
│   │   │   ├── organization/               # Organization settings
│   │   │   ├── settings/                   # User settings
│   │   │   └── subscription/               # Billing management
│   │   └── layout.tsx
│   │
│   ├── (admin)/                            # Admin portal
│   │   └── admin/
│   │       ├── feedback/                   # Feedback management
│   │       ├── pricing/                    # Pricing management
│   │       └── users/                      # User management
│   │
│   ├── (auth)/                             # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── verify-account/
│   │
│   ├── (home)/                             # Public pages
│   │   ├── blogs/
│   │   ├── developer-resources/
│   │   ├── pricing/
│   │   └── tech-support/
│   │
│   └── api/                                # API endpoints
│       ├── auth/                           # Authentication APIs
│       ├── channels/                       # Channel management APIs
│       ├── devices/                        # Device management APIs
│       ├── organizations/                  # Organization APIs
│       └── users/                          # User management APIs
│
├── components/
│   ├── Admin/                              # Admin components
│   ├── Auth/                               # Authentication components
│   ├── Channels/                           # Channel management UI
│   │   ├── charts/                         # Data visualization
│   │   ├── collaboration/                  # Real-time collaboration
│   │   └── navigation/                     # Channel navigation
│   ├── dashboard/                          # Dashboard components
│   │   ├── Overview/                       # Dashboard cards
│   │   ├── Header/                         # Navigation header
│   │   └── settings/                       # Settings forms
│   ├── Forms/                              # Reusable forms
│   └── Home/                               # Landing page components
│
├── prisma/
│   └── schema.prisma                       # Database schema
│
├── types/                                  # TypeScript definitions
├── lib/                                    # Utility functions
├── constants/                              # Application constants
└── validations/                            # Schema validations
```

</details>

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB instance (local or cloud)
- Environment variables configuration

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/your-org/iot-data-hub.git
cd iot-data-hub
```

#### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

#### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
DATABASE_URL="mongodb://localhost:27017/iotdatahub"
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
LIVEBLOCKS_SECRET_KEY=your-liveblocks-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
STRIPE_SECRET_KEY=your-stripe-key
```

#### 4. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

#### 5. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 🖥️ Usage & Portals

### User Dashboard

Navigate to `/dashboard` to:

- Monitor device status and connectivity
- View real-time data streams and analytics
- Create and manage data channels
- Configure device settings and parameters
- Export data and generate reports

### Device Management

Access `/dashboard/devices` to:

- Register new IoT devices
- Monitor device health and status
- Configure device parameters
- View device-specific data streams
- Manage device groups and categories

### Channel Management

Use `/dashboard/channels` to:

- Create custom data channels
- Define data fields and validation rules
- Set up data visualization widgets
- Configure real-time alerts and notifications
- Share channels with team members

### Organization Management

Visit `/dashboard/organization` to:

- Manage organization settings
- Invite and manage team members
- Configure access permissions
- Monitor usage and billing
- Set up organization-wide policies

### Admin Portal

Access `/admin` for:

- User management and analytics
- Pricing tier configuration
- Feedback and support management
- System monitoring and maintenance

### API Integration

Use the REST API endpoints:

```bash
# Device data submission
POST /api/channels/[channelId]/datapoint

# Device registration
POST /api/devices

# Channel creation
POST /api/channels

# Organization management
GET /api/organizations/[id]
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

For questions or support:

Emmanuel SHYIRAMBERE - [LinkedIn Profile](https://www.linkedin.com/in/emashyirambere)

<div class="contact-section">
  <p align="center">
    <a href="mailto:emashyirambere1@gmail.com">Mail</a> | 
    <a href="https://github.com/EmmanuelSHYIRAMBERE">GitHub</a>
  </p>
</div>

<div align="center">
  <a href="#" class="back-to-top">
    <img src="https://img.shields.io/badge/↑-Back_to_Top-blue" alt="Back to Top" />
  </a>
</div>