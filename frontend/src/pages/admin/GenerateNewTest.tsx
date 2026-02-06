import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import testLinkService from '../../services/testLinkService';
import './GenerateNewTest.css'

interface GenerateProps {
    closeModal: () => void;
    refreshLinks: () => void;
    editData?:any;
    isEditMode?: boolean;
}

const GenerateNewTest: React.FC<GenerateProps> = ({ closeModal, refreshLinks, editData, isEditMode }) => {
    const [title, setTitle] = useState("");
    const [selectDate, setSelectDate] = useState<Date | null>(null);
    const [expiryTime, setExpiryTime] = useState<string>("23:59");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState("");
    const [duration,setDuration] = useState("");

    useEffect(() => {
    if (isEditMode && editData) {
        const testObj = editData.test || {};
        setTitle(testObj.title || "");
        setTime(String(testObj.duration_minutes || ""));

        const exp = testObj.expiration_at;
        if (exp) {
            const parsed = new Date(exp); // Automatically handles UTC string to Local Date
            if (!isNaN(parsed.getTime())) {
                setSelectDate(parsed);
                
                // Format HH:mm for the local time input
                const hh = String(parsed.getHours()).padStart(2, '0');
                const mm = String(parsed.getMinutes()).padStart(2, '0');
                setExpiryTime(`${hh}:${mm}`);
            }
        }
    } else {
        setTitle("");
        setSelectDate(null);
        setTime("");
        setExpiryTime("23:59");
    }
}, [editData, isEditMode]);

   // Inside handleSubmit in GenerateNewTest.tsx

   const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!title.trim() || !selectDate || !time || !expiryTime) {
            alert('Please fill all fields');
            setLoading(false);
            return;
        }

        // 1. Get HH and MM from the local time input
        const [hh, mm] = expiryTime.split(":").map(Number);

        // 2. Create a copy of the selected date
        const finalDate = new Date(selectDate);
        
        // 3. Set the hours and minutes based on local time input
        // We set seconds to 59 to match your backend requirement
        finalDate.setHours(hh, mm, 59, 0);

        // 4. Convert to UTC ISO string and strip milliseconds
        // Result format: "2026-02-04T23:59:59Z"
        const formattedExpiration = finalDate.toISOString().replace('.000', '');

        const testData = {
            title: title.trim(),
            duration_minutes: Number(time),
            expiration_at: formattedExpiration, 
        };

        

        try {
            let res;
            const editId = editData?.test?.id || editData?.id; 

            if (isEditMode && editId) {
                res = await testLinkService.updateTestLink(editId, testData);
            } else {
                res = await testLinkService.createTestLink(testData);
            }

            if (res?.success) {
                refreshLinks();
                closeModal();
            } else {
                alert(res?.message || "Input is not valid - please check date/time");
            }
        } catch (err) {
            alert("Server Error: Check console for details");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="generate-container">
            <div className="modal-header">
                <h2>Generate New Test</h2>
                <p>Set requirements for the new assessment link.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="generate-test-form">
                <div className="form-input-group">
                    <label>Title</label>
                    <input 
                        type="text"
                        placeholder="Enter the Role" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
            
                <div className="form-input-group">
                    <label>Select Date</label>
                    <DatePicker
                        selected={selectDate}
                        onChange={(date: Date | null) => setSelectDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Choose exam date"
                        className="custom-datepicker"
                        required
                    />
                </div>

                <div className="form-input-group">
                    <label> Duration Time (In Minutes)</label>
                    <input 
                        type="number"
                        placeholder="Enter duration"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        min={0}
                        required
                    />
                </div>
                <div className="form-input-group">
                    <label>Expiry Time</label>
                    <input
                        type="time"
                        placeholder="23:59"
                        value={expiryTime}
                        onChange={(e) => setExpiryTime(e.target.value)}
                        required
                    />
                </div>

                <div className="modal-actions">
                    <button type="submit" className="submit-test-btn" disabled={loading}>
                        {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Test" : "Create Test")}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default GenerateNewTest;