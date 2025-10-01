"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  useMediaQuery,
  Theme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendIcon from "@mui/icons-material/Send";

// types
import { Field } from "@/types/uni-types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface CodeSnippet {
  language: string;
  getCode: (fieldsCount: number) => string;
}

const codeSnippets: Record<string, CodeSnippet> = {
  ArduinoIDE: {
    language: "cpp",
    getCode: (fieldsCount: number) =>
      `
#include <ESP8266WiFi.h>  // Use <WiFi.h> for ESP32

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* server = "${process.env.NEXT_PUBLIC_BASE_URL}"; 
const int port = 443;  // Assuming HTTPS
String url = "/api/channels/datapoint";

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");
}

void sendData(${Array.from(
        { length: fieldsCount },
        (_, i) => `float field${i + 1}`
      ).join(", ")}) {
  WiFiClientSecure client;
  client.setInsecure();  // Note: This is not secure, consider using proper certificate validation
  if (!client.connect(server, port)) {
    Serial.println("Connection failed");
    return;
  }

  String urlWithData = url + "?api_key=YOUR_WRITE_API_KEY";
  ${Array.from(
    { length: fieldsCount },
    (_, i) => `urlWithData += "&field${i + 1}=" + String(field${i + 1});`
  ).join("\n  ")}

  String httpRequest = "POST " + urlWithData + " HTTP/1.1\\r\\n" +
                       "Host: " + server + "\\r\\n" +
                       "Connection: close\\r\\n\\r\\n";
  client.print(httpRequest);

  while (client.available()) {
    String line = client.readStringUntil('\\n');
    Serial.println(line);
  }
  Serial.println("Data sent successfully");
  client.stop();
}

void loop() {
  // Replace these with your actual sensor readings
  ${Array.from(
    { length: fieldsCount },
    (_, i) =>
      `float field${i + 1} = random(20, 30);  // Simulated value for field${
        i + 1
      }`
  ).join("\n  ")}

  sendData(${Array.from(
    { length: fieldsCount },
    (_, i) => `field${i + 1}`
  ).join(", ")});

  delay(15000);  // Wait for 15 seconds before the next reading
}
    `.trim(),
  },
  "Raspberry Pi": {
    language: "python",
    getCode: (fieldsCount: number) =>
      `
import requests

url = '${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/datapoint'
api_key = 'YOUR_WRITE_API_KEY'

# Replace these with your actual sensor readings
${Array.from(
  { length: fieldsCount },
  (_, i) =>
    `field${i + 1}_value = 0  # Replace with actual value for field${i + 1}`
).join("\n")}

data = {
    'api_key': api_key,
    ${Array.from(
      { length: fieldsCount },
      (_, i) => `'field${i + 1}': field${i + 1}_value`
    ).join(",\n    ")}
}

response = requests.get(url, params=data)
print(response.status_code)
    `.trim(),
  },
  cURL: {
    language: "bash",
    getCode: (fieldsCount: number) =>
      `
curl -X POST "${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/channels/datapoint?api_key=YOUR_WRITE_API_KEY${Array.from(
        { length: fieldsCount },
        (_, i) => `&field${i + 1}=\${FIELD${i + 1}_VALUE}`
      ).join("")}"
    `.trim(),
  },
};

const SampleCodeSnippet: React.FC<{ fields: Field[] }> = ({ fields }) => {
  const [value, setValue] = useState(0);
  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCopy = (code: string, lang: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 3000);
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/datapoint`;
    const queryParams = new URLSearchParams({ api_key: apiKey });

    Object.entries(fieldValues).forEach(([key, value], index) => {
      queryParams.append(`field${index + 1}`, value);
    });

    const url = `${baseUrl}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, { method: "POST" });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSuccess("Data sent successfully!");
      return data;
    } catch (error) {
      setError(
        `Error sending data: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendData = () => {
    handleSubmit();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={3}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="IoT Data Hub code examples"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
        >
          {Object.keys(codeSnippets).map((lang, index) => (
            <Tab label={lang} id={`simple-tab-${index}`} key={lang} />
          ))}
        </Tabs>
        {Object.entries(codeSnippets).map(([lang, snippet], index) => (
          <TabPanel value={value} index={index} key={lang}>
            <Paper
              elevation={1}
              sx={{ p: 2, position: "relative", overflow: "hidden" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" component="div">
                  {lang} Code
                </Typography>
                <Button
                  startIcon={<ContentCopyIcon />}
                  onClick={() =>
                    handleCopy(snippet.getCode(fields.length), lang)
                  }
                  size="small"
                  variant="outlined"
                >
                  {copiedLang === lang ? "Copied!" : "Copy"}
                </Button>
              </Box>
              <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                <pre>
                  <code>{snippet.getCode(fields.length)}</code>
                </pre>
              </Box>
            </Paper>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                fullWidth
                margin="normal"
              />
              {fields.map((field) => (
                <TextField
                  key={field.name}
                  label={field.name}
                  value={fieldValues[field.name] || ""}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
              ))}
              <Button
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                onClick={handleSendData}
                disabled={isLoading || !apiKey}
                sx={{ mt: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Send Data"}
              </Button>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
            </Box>
          </TabPanel>
        ))}
      </Paper>
    </Box>
  );
};

export default SampleCodeSnippet;
