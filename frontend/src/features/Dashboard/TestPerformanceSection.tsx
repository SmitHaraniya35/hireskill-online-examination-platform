const data = [
  {
    title: "Technical Assessment 12",
    attempts: 740,
    completed: 90,
    avg: "86%"
  },
  {
    title: "CodeChallenge 101",
    attempts: 339,
    completed: 147,
    avg: "71%"
  },
  {
    title: "Programming Test 202",
    attempts: 496,
    completed: 145,
    avg: "91%"
  }
];

const TestPerformanceSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border-inherit p-6">
      <h2 className="text-lg font-semibold mb-4">
        Test Performance
      </h2>

      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-2">Test Title</th>
            <th>Attempts</th>
            <th>Completed</th>
            <th>Avg Score</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.title} className="border-b">
              <td className="py-3">{row.title}</td>
              <td className="text-center">{row.attempts}</td>
              <td className="text-center">{row.completed}</td>
              <td className="text-center">{row.avg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestPerformanceSection;