import React from "react";

export default function page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <title>Admin | Dashboard</title>
      {/* Card 1 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold">Card 1</h2>
        <p className="text-gray-600">Some content here.</p>
      </div>

      {/* Card 2 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold">Card 2</h2>
        <p className="text-gray-600">Some content here.</p>
      </div>

      {/* Card 3 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold">Card 3</h2>
        <p className="text-gray-600">Some content here.</p>
      </div>
    </div>
  );
}
