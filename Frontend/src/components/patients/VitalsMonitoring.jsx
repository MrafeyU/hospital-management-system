// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { getAuth } from 'firebase/auth';
// import '../../styles/patients/VitalsMonitoring.css';

// const VitalsMonitoring = () => {
//   const [formData, setFormData] = useState({
//     heart_rate: '',
//     respiratory_rate: '',
//     temperature: '',
//     oxygen_level: '',
//     bp_systolic: '',
//     bp_diastolic: ''
//   });

//   const [status, setStatus] = useState('');
//   const [patientId, setPatientId] = useState(null);
//   const auth = getAuth();

//   // 🔄 Fetch patient_id from Firebase UID
//   useEffect(() => {
//     const uid = auth.currentUser?.uid;
//     if (uid) {
//       axios.post("http://localhost:5001/getPatientId", { uid })
//         .then(res => setPatientId(res.data.patient_id))
//         .catch(err => {
//           console.error("❌ Could not fetch patient ID:", err);
//           setStatus("❌ Could not fetch your patient ID. Try again.");
//         });
//     }
//   }, []);

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!patientId) {
//       setStatus("❌ Cannot submit vitals without a valid patient ID.");
//       return;
//     }

//     try {
//       const res = await axios.post('http://localhost:5001/vitals/submit', {
//         patient_id: patientId,
//         ...formData
//       });

//       setStatus(res.data.label === 0
//         ? "🟥 Patient is CRITICAL! Doctor has been notified."
//         : "🟩 Patient is stable.");
//     } catch (err) {
//       console.error("❌ Error submitting vitals:", err);
//       setStatus("❌ Error submitting vitals.");
//     }
//   };

//   return (
//     <div className="vitals-monitor">
//       <h2>Realtime Vitals Monitoring</h2>
//       <form onSubmit={handleSubmit}>
//         {["heart_rate", "respiratory_rate", "temperature", "oxygen_level", "bp_systolic", "bp_diastolic"].map(field => (
//           <input
//             key={field}
//             name={field}
//             placeholder={field.replace('_', ' ').toUpperCase()}
//             value={formData[field]}
//             onChange={handleChange}
//             required
//             type="number"
//           />
//         ))}
//         <button type="submit">Add Vitals</button>
//       </form>
//       {status && <div className="vitals-status">{status}</div>}
//     </div>
//   );
// };

// export default VitalsMonitoring;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import '../../styles/patients/VitalsMonitoring.css';

const VitalsMonitoring = () => {
  const [formData, setFormData] = useState({
    heart_rate: '',
    respiratory_rate: '',
    temperature: '',
    oxygen_level: '',
    bp_systolic: '',
    bp_diastolic: ''
  });

  const [status, setStatus] = useState('');
  const [patientId, setPatientId] = useState(null);
  const auth = getAuth();

  // ✅ Get patient_id from Firebase UID
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      axios.post("http://localhost:5001/getPatientId", { uid })
        .then(res => setPatientId(res.data.patient_id))
        .catch(err => {
          console.error("❌ Could not fetch patient ID:", err);
          setStatus("❌ Could not fetch your patient ID.");
        });
    }
  }, []);

  // ✅ Manual fetch from ESP32
  const handleFetchVitals = async () => {
    try {
      const res = await axios.get("http://localhost:5001/vitals/latest");
      if (res.data && Object.keys(res.data).length > 0) {
        setFormData(prev => ({ ...prev, ...res.data }));
        setStatus("✅ Vitals fetched from ESP32.");
      } else {
        setStatus("⚠️ No vitals data received from ESP32 yet.");
      }
    } catch (err) {
      console.error("❌ Error fetching ESP32 data:", err);
      setStatus("❌ Error fetching ESP32 vitals.");
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      setStatus("❌ Cannot submit vitals without a valid patient ID.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5001/vitals/submit', {
        patient_id: patientId,
        ...formData
      });

      setStatus(res.data.label === 0
        ? "🟥 Patient is CRITICAL! Doctor has been notified."
        : "🟩 Patient is stable.");
    } catch (err) {
      console.error("❌ Error submitting vitals:", err);
      setStatus("❌ Error submitting vitals.");
    }
  };

  return (
    <div className="vitals-monitor">
      {/* <h2>Realtime Vitals Monitoring</h2>
      <button onClick={handleFetchVitals} style={{ marginBottom: '10px' }}>
        📡 Fetch from ESP32
      </button> */}

      <form onSubmit={handleSubmit}>
        {["heart_rate", "respiratory_rate", "temperature", "oxygen_level", "bp_systolic", "bp_diastolic"].map(field => (
          <input
            key={field}
            name={field}
            placeholder={field.replace('_', ' ').toUpperCase()}
            value={formData[field]}
            onChange={handleChange}
            required
            type="number"
          />
        ))}
        <button type="submit">Add Vitals</button>
      </form>
      {status && <div className="vitals-status">{status}</div>}
    </div>
  );
};

export default VitalsMonitoring;
