import { useState } from "react";
import StudentService from "../../services/student.services";

const CreateStudentManually: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [college, setCollege] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await StudentService.createStudent({ name, email, phone, college });
      console.log("Student created successfully");
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response.data.message);
    }
  };
  return (
    <div>
      {isError && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm break-words">
          ⚠️ {errorMsg}
        </div>
      )}
      <div>
        <div>Name:</div>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>
      <div>
        <div>Email:</div>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div>
        <div>Phone:</div>
        <input
          type="text"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
        />
      </div>
      <div>
        <div>College:</div>
        <input
          type="text"
          onChange={(e) => setCollege(e.target.value)}
          value={college}
        />
      </div>
      <button onClick={handleSubmit}>Create Studet</button>
    </div>
  );
};

export default CreateStudentManually;
