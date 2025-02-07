import React from "react";

const PasswordValidationPopup = () => {
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">
          Your password must include:
        </h3>
        <ul className="space-y-2">
          <li>Uppercase letter A-Z</li>
          <li>Lowercase letter a-z</li>
          <li>Number 0-9 or Symbol such as !@#$%^&*()</li>
          <li>8-16 characters</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordValidationPopup;
