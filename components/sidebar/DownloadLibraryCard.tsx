"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Archive, CheckCircle, AlertCircle } from "lucide-react";

// ==============================|| DOWNLOAD PROGRESS ||============================== //

const DownloadProgress = ({
  progress,
  isDownloading,
}: {
  progress: number;
  isDownloading: boolean;
}) => {
  return (
    <div className="space-y-3 mt-6">
      <div className="flex justify-between items-center">
        <h6 className="text-sm font-medium text-primary/80">
          {isDownloading ? "Downloading..." : "Ready to Download"}
        </h6>
        <span className="text-sm font-medium">
          {isDownloading ? `${Math.round(progress)}%` : "0%"}
        </span>
      </div>
      <Progress value={progress} className="h-2.5 bg-background" />
    </div>
  );
};

const DownloadLibraryCard = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "success" | "error"
  >("idle");

  // Google Drive direct download link
  const DRIVE_FILE_ID = "16TcSrOxWP5wYB8HqF9Mvh8R4vPd93ohj";

  const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadStatus("downloading");
      setDownloadProgress(0);

      // Simulate download progress for user feedback
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = DOWNLOAD_URL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Complete the progress and show success
      setTimeout(() => {
        clearInterval(progressInterval);
        setDownloadProgress(100);
        setDownloadStatus("success");

        // Reset after 3 seconds
        setTimeout(() => {
          setIsDownloading(false);
          setDownloadProgress(0);
          setDownloadStatus("idle");
        }, 3000);
      }, 1000);
    } catch (error) {
      console.error("Download error:", error);
      setDownloadStatus("error");
      setIsDownloading(false);
      setDownloadProgress(0);

      setTimeout(() => {
        setDownloadStatus("idle");
      }, 3000);
    }
  };

  const getButtonContent = () => {
    switch (downloadStatus) {
      case "downloading":
        return (
          <>
            <Download className="h-4 w-4 animate-bounce" />
            Downloading...
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="h-4 w-4" />
            Downloaded
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="h-4 w-4" />
            Try Again
          </>
        );
      default:
        return (
          <>
            <Download className="h-4 w-4" />
            Release v1.0.0
          </>
        );
    }
  };

  const getButtonColor = () => {
    switch (downloadStatus) {
      case "downloading":
        return "bg-blue-500 hover:bg-blue-600";
      case "success":
        return "bg-green-500 hover:bg-green-600";
      case "error":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-orange-50 hover:bg-orange-50/90";
    }
  };

  return (
    <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute -top-20 -right-24 w-40 h-40 bg-primary/10 rounded-full" />

      <CardContent className="p-2 relative">
        <h5 className="text-sm font-semibold text-primary/90">
          IoT Data Hub Library{" "}
          <span className="text-xs text-red-500">(Latest)</span>
        </h5>

        {(isDownloading || downloadProgress > 0) && (
          <DownloadProgress
            progress={downloadProgress}
            isDownloading={isDownloading}
          />
        )}

        <div className="mt-2 flex justify-start">
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className={`shadow-none ${getButtonColor()}`}
          >
            {getButtonContent()}
          </Button>
        </div>

        {downloadStatus === "success" && (
          <div className="mt-2">
            <p className="text-xs text-green-600">
              Download initiated successfully
            </p>
          </div>
        )}

        {downloadStatus === "error" && (
          <div className="mt-2">
            <p className="text-xs text-red-600">
              Download failed. Please check your connection.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(DownloadLibraryCard);
