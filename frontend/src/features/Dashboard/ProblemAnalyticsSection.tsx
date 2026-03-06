const data = [
  { problem: "Array Sum", difficulty: "Easy", attempts: 1906, avgScore: "75%",  pass: "69%" },
  { problem: "Binary Search", difficulty: "Medium", attempts: 380,avgScore: "85%", pass: "69%" },
  { problem: "Graph Path", difficulty: "Hard", attempts: 670,avgScore: "95%", pass: "90%" },
  { problem: "Dynamic Array", difficulty: "Medium", attempts: 290,avgScore: "55%", pass: "26%" }
];

const ProblemAnalyticsSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border-inherit p-6">
      <h2 className="text-lg font-semibold mb-4">
        Problem Analytics
      </h2>

      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-2">Problem</th>
            <th>Difficulty</th>
            <th>Attempts</th>
            <th>Avg. Score</th>
            <th>Pass %</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.problem} className="border-b">
              <td className="py-3">{row.problem}</td>
              <td className="text-center">{row.difficulty}</td>
              <td className="text-center">{row.attempts}</td>
              <td className="text-center">{row.avgScore}</td>
              <td className="text-center">{row.pass}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemAnalyticsSection;