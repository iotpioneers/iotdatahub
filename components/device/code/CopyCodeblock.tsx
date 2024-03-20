"use client";

const someText =
  '<div class="flex justify-center items-center bg-blue-500 text-white p-4">\n  <h1 class="text-2xl">Hello, Tailwind CSS!</h1> \n</div>';
const CopyCodeblock = () => {
  const copyToClipBoard = async (copyMe: any) => {
    try {
      await navigator.clipboard.writeText(copyMe);
    } catch (err) {}
  };

  return (
    <div>
      <div className="bg-gray-900 text-white p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Code:</span>
          <button
            className="code bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-md"
            onClick={() => copyToClipBoard(someText)}
          >
            Copy
          </button>
        </div>
        <div className="overflow-x-auto">
          <pre id="code" className="text-gray-300">
            <code>{someText}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CopyCodeblock;
