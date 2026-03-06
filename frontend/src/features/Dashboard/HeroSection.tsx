const stats = [
  { title: "Total Students", value: "1,200" },
  { title: "Total Tests", value: "24" },
  { title: "Total Attempts", value: "3,560" },
  { title: "Total Submissions", value: "2,980" },
  { title: "Average Score", value: "67%" },
  { title: "Active Tests", value: "5" }
];

const HeroSection = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-xl shadow-sm p-4 border-inherit"
        >
          <p className="text-gray-500 text-sm">{item.title}</p>
          <h2 className="text-xl font-semibold">{item.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default HeroSection;