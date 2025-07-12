"use client";
import { useParams } from "next/navigation";

export default function TicketPage() {
  const params = useParams();
  const rawGroupId = params?.groupId;

  // Safely cast groupId to an integer
  const groupId =
    typeof rawGroupId === "string" ? parseInt(rawGroupId, 10) : null;

  const imageUrl =
    typeof groupId === "number" && !isNaN(groupId)
      ? `/tickets/${groupId}.png`
      : "/images/default-group.png";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${groupId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-blue-200 px-4 py-12 text-black">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1a3a9a] mb-4">
          🎟️ Your Ticket
        </h1>
        <p className="text-lg mb-6">
          Group:{" "}
          <span className="font-mono text-xl text-gray-800">
            {groupId ?? "Unknown"}
          </span>
        </p>
        <div className="w-full flex justify-center">
          <img
            src={imageUrl}
            alt={`Group ${groupId ?? "Unknown"} Ticket`}
            className="rounded-xl shadow-lg w-full max-w-[1600px] border border-gray-200"
          />
        </div>
        <button
          onClick={handleDownload}
          className="mt-8 bg-[#1a3a9a] hover:bg-blue-800 transition-colors duration-200 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
        >
          ⬇️ Download Ticket
        </button>
      </div>
    </div>
  );
}
