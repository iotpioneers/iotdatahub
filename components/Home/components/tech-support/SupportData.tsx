import {
  Article,
  Code,
  PlayArrow,
  Message,
  CloudUpload,
  BarChart,
  DeviceHub,
  NetworkCheck,
  Security,
  Speed,
} from "@mui/icons-material";

export const faqItems = [
  {
    question: "How do I connect my device to the platform?",
    answer:
      "To connect your device, follow these steps: 1) Create a new device in your dashboard. 2) Copy the generated API key. 3) Use our SDK to establish a connection using the API key. 4) Verify the connection in the device status page.",
  },
  {
    question: "What data formats are supported for device communication?",
    answer:
      "Our platform supports various data formats including JSON, CSV, and our custom binary format. JSON is recommended for most use cases due to its flexibility and readability.",
  },
  {
    question: "How can I visualize my device data?",
    answer:
      "You can use our built-in data visualization tools in the dashboard. Navigate to your device page, select the data points you want to visualize, and choose from various chart types like line graphs, bar charts, or custom widgets.",
  },
  {
    question: "What is the data retention policy?",
    answer:
      "The data retention period depends on your subscription plan. Free tier users have 30 days of data retention, while paid plans offer up to 2 years or custom retention periods. You can also export your data for long-term storage.",
  },
  {
    question: "How do I set up alerts for my devices?",
    answer:
      'To set up alerts: 1) Go to the Alerts section in your dashboard. 2) Click "Create New Alert". 3) Select the device and data point to monitor. 4) Define the alert conditions (e.g., threshold values). 5) Choose notification methods (email, SMS, webhook). 6) Save and activate the alert.',
  },
  {
    question: "Can I integrate my IoT data with third-party services?",
    answer:
      "Yes, we offer various integration options. You can use our REST API to pull data into your own applications, set up webhooks for real-time data pushing, or use our pre-built integrations with popular services like AWS, Google Cloud, and Microsoft Azure.",
  },
  {
    question: "How secure is my device data on your platform?",
    answer:
      "We take security seriously. All data is encrypted in transit and at rest. We use industry-standard TLS for all communications, and your data is stored in secure, redundant cloud storage. We also offer features like two-factor authentication and IP whitelisting for added security.",
  },
];

export const supportResources = [
  { title: "Documentation", icon: <Article />, link: "#" },
  { title: "API Reference", icon: <Code />, link: "#" },
  { title: "Tutorials", icon: <PlayArrow />, link: "#" },
  { title: "Community Forum", icon: <Message />, link: "#" },
  { title: "Webinars", icon: <CloudUpload />, link: "#" },
  { title: "Case Studies", icon: <BarChart />, link: "#" },
];

export const troubleshootingGuide = [
  {
    title: "Connection Issues",
    icon: <NetworkCheck />,
    content:
      "If you're having trouble connecting your device, ensure your API key is correct and your device is properly configured. Check your network settings and firewall rules.",
  },
  {
    title: "Data Not Updating",
    icon: <DeviceHub />,
    content:
      "Check your device's internet connection and verify that it's sending data at the expected intervals. Ensure that your device's clock is synchronized and that you're not exceeding your data rate limits.",
  },
  {
    title: "Visualization Problems",
    icon: <BarChart />,
    content:
      "Clear your browser cache or try a different browser if charts are not rendering correctly. Verify that your data format matches the expected format for the visualization tool you're using.",
  },
  {
    title: "Performance Issues",
    icon: <Speed />,
    content:
      "If you're experiencing slow performance, try reducing the amount of data you're querying at once. Use date ranges and filters to limit the dataset. For large-scale applications, consider using our data aggregation APIs.",
  },
  {
    title: "Security Concerns",
    icon: <Security />,
    content:
      "Regularly rotate your API keys and use strong, unique passwords. Enable two-factor authentication for all user accounts. Review our security best practices guide for more advanced security configurations.",
  },
];
