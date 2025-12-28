import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

interface DeviceConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  organizationName?: string;
  deviceToken?: string;
}

const DeviceConfigurationModal = ({
  isOpen,
  onClose,
  userName,
  organizationName,
  deviceToken,
}: DeviceConfigurationModalProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-black text-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Device Configuration</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4 mb-6 font-mono text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div className="flex-1">
              <div className="text-gray-400">IoTDATAHUB_USER_NAME</div>
              <div className="text-orange-50">"{userName}"</div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`#define IoTDATAHUB_USER_NAME "${userName}"`);
                setCopiedField('user');
                setTimeout(() => setCopiedField(null), 2000);
              }}
              className="ml-2 p-2 hover:bg-gray-700 rounded transition-colors"
            >
              {copiedField === 'user' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div className="flex-1">
              <div className="text-gray-400">IoTDATAHUB_ORGANIZATION_NAME</div>
              <div className="text-blue-400">"{organizationName}"</div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`#define IoTDATAHUB_ORGANIZATION_NAME "${organizationName}"`);
                setCopiedField('org');
                setTimeout(() => setCopiedField(null), 2000);
              }}
              className="ml-2 p-2 hover:bg-gray-700 rounded transition-colors"
            >
              {copiedField === 'org' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div className="flex-1">
              <div className="text-gray-400">IoTDATAHUB_DEVICE_TOKEN</div>
              <div className="text-green-400">"{deviceToken}"</div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`#define IoTDATAHUB_DEVICE_TOKEN "${deviceToken}"`);
                setCopiedField('token');
                setTimeout(() => setCopiedField(null), 2000);
              }}
              className="ml-2 p-2 hover:bg-gray-700 rounded transition-colors"
            >
              {copiedField === 'token' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              const allDefines = [
                `#define IoTDATAHUB_USER_NAME "${userName}"`,
                `#define IoTDATAHUB_ORGANIZATION_NAME "${organizationName}"`,
                `#define IoTDATAHUB_DEVICE_TOKEN "${deviceToken}"`
              ].join('\n');
              navigator.clipboard.writeText(allDefines);
              setCopiedField('all');
              setTimeout(() => setCopiedField(null), 2000);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center space-x-2"
          >
            {copiedField === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedField === 'all' ? 'Copied!' : 'Copy All'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceConfigurationModal;