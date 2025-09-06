import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import '../../styles/patients/PatientMedicalHistory.css';

const PatientMedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      axios.post('http://localhost:5001/getPatientId', { uid })
        .then(res => setPatientId(res.data.patient_id))
        .catch(err => console.error('❌ Failed to fetch patient ID', err));
    }
  }, []);

  useEffect(() => {
    if (patientId) {
      axios.get(`http://localhost:5001/medical-history/${patientId}`)
        .then(res => setRecords(res.data))
        .catch(err => console.error('❌ Failed to fetch medical history', err));
    }
  }, [patientId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !description || !patientId) return alert('Please fill in all fields.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('patient_id', patientId);

    try {
      await axios.post('http://localhost:5001/medical-history/upload', formData);
      alert('✅ Record uploaded!');
      setDescription('');
      setFile(null);
      const res = await axios.get(`http://localhost:5001/medical-history/${patientId}`);
      setRecords(res.data);
    } catch (err) {
      console.error('❌ Upload failed', err);
      alert('❌ Failed to upload record');
    }
  };

  const renderPreview = (record) => {   
    const fileUrl = `http://localhost:5001/medical-history/files/${record.file_path}`;
    const ext = record.file_path.split('.').pop().toLowerCase();
    if (["jpg", "jpeg", "png"].includes(ext)) {
      return <img src={fileUrl} alt="Preview" className="preview-img" />;
    } else if (ext === "pdf") {
      return <embed src={fileUrl} type="application/pdf" width="100%" height="300px" />;
    } else {
      return <a href={fileUrl} target="_blank" rel="noopener noreferrer">📄 Open File</a>;
    }
  };

  return (
    <div className="history-card">
      <h2>Medical History</h2>
      <form className="history-upload-form" onSubmit={handleUpload}>
        <input type="file" accept=".pdf,.jpg,.png,.docx,.doc" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          value={description}
          placeholder="Description of the record"
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Upload Record</button>
      </form>

      <div className="history-list">
        <h3>Previous Records</h3>
        {records.length > 0 ? records.map((record, idx) => (
          <div className="history-item" key={idx}>
            <p><strong>{record.title}</strong> — {record.description}</p>
            <p><em>{new Date(record.uploaded_at).toLocaleDateString()}</em></p>
            {renderPreview(record)}
            <hr />
          </div>
        )) : <p>No records uploaded yet.</p>}
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
