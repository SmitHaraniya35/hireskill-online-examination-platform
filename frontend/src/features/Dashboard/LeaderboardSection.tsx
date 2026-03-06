const data = [
  { rank: 1, name: "Rahul Gupta", time: "1h 25min",status:"Accepted", test: "Technical Assessment 12" },
  { rank: 2, name: "Priya Shah", time: "1h 30min", status:"Partially Accepted", test: "Programming Test 202" },
  { rank: 3, name: "Ankit Verma", time: "1h 35min", status:"Failed", test: "CodeChallenge 101" }
];

const LeaderboardSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border-inherit p-6">
      <h2 className="text-lg font-semibold mb-4">
        Leaderboard
      </h2>

      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-3 px-2 w-16">Rank</th>
            <th className="text-left py-3 px-2">Student</th>
            <th className="text-left py-3 px-2">Test</th>
            <th className="text-left py-3 px-2">Status</th>
            <th className="text-right py-3 px-2 w-20">Time</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((row) => (
            <tr
              key={row.rank}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-2 font-medium text-gray-700">
                {row.rank}
              </td>

              <td className="py-3 px-2 text-gray-700">
                {row.name}
              </td>

              
              <td className="py-3 px-2 text-gray-600">
                {row.test}
              </td>

              <td className="py-3 px-2 text-gray-600">
                {row.status}
              </td>

              <td className="py-3 px-2 text-right font-semibold text-green-600">
                {row.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardSection;