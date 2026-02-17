// DisplayProblem.tsx
interface DisplayProblemProps {
  problemData: any;
}

const DisplayProblem: React.FC<DisplayProblemProps> = ({ problemData }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{problemData.title}</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Problem Description</h2>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: problemData.problem_description }}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Constraints</h2>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: problemData.constraint }}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Input Format</h2>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: problemData.input_format }}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Output Format</h2>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: problemData.output_format }}
          />
        </section>
      </div>
    </div>
  );
};

export default DisplayProblem;