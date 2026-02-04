import { useState } from "react";
import DatePicker from "react-datepicker";
import testLinkService from '../../services/testLinkService';
import './GenerateNewTest.css'

interface GenerateProps {
    closeModal: () => void;
    refreshLinks: () => void;
}

const GenerateNewTest: React.FC<GenerateProps> = ({ closeModal, refreshLinks }) => {
    const [title, setTitle] = useState("");
    const [selectDate, setSelectDate] = useState<Date | null>(null);
    const [expiryTime, setExpiryTime] = useState<string>("23:59");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!title.trim() || !selectDate || !time || !expiryTime) {
            alert('Please fill all fields');
            setLoading(false);
            return;
        }

        // combine selected date and expiry time (HH:MM) into a single ISO timestamp
        const parts = expiryTime.split(":");
        let hh = Number(parts[0] ?? 0);
        let mm = Number(parts[1] ?? 0);

        if (!Number.isInteger(hh) || hh < 0 || hh > 23) hh = 23;
        if (!Number.isInteger(mm) || mm < 0 || mm > 59) mm = 59;

        // Build a UTC timestamp so the resulting ISO string matches exactly "YYYY-MM-DDTHH:MM:59Z"
        const year = selectDate.getFullYear();
        const month = selectDate.getMonth(); // zero-based
        const day = selectDate.getDate();
        const utcTs = Date.UTC(year, month, day, hh, mm, 59);
        const expirationDate = new Date(utcTs);

        if (isNaN(expirationDate.getTime())) {
            alert('Invalid expiry date/time');
            setLoading(false);
            return;
        }

        const testData = {
            title: title.trim(),
            duration_minutes: Number(time), // backend expects minutes field
            // remove milliseconds to match exact format: 2026-02-04T23:59:59Z
            expiration_at: expirationDate.toISOString().replace('.000', ''), // backend expects expiration_at
        };

        let res;
        try {
            res = await testLinkService.createTestLink(testData);
        } catch (err) {
            res = { success: false, message: (err as any)?.message || 'Request failed' };
        }

        if (res.success) {
            refreshLinks(); // Reload the list to show the new test
            closeModal(); // Close the modal on success
        } else {
            alert(res.message || 'Failed to create test');
        }

        setLoading(false);
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
                        {loading ? "Creating..." : "Create Test"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default GenerateNewTest;