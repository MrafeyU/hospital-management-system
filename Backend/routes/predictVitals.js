// const express = require("express");
// const router = express.Router();
// const tf = require("@tensorflow/tfjs-node");
// const fs = require("fs");
// const path = require("path");

// let model;
// let scaler = { mean: [], scale: [] };

// // Load model and scaler
// (async () => {
//   try {
//     model = await tf.loadLayersModel(`file://${path.resolve("model/tfjs_model/model.json")}`);

//     const scalerData = fs.readFileSync(path.resolve("model/scaler.json"));
//     const parsed = JSON.parse(scalerData);
//     scaler.mean = parsed.mean;
//     scaler.scale = parsed.scale;

//     console.log("✅ ML model and scaler loaded.");
//   } catch (error) {
//     console.error("❌ Error loading model or scaler:", error);
//   }
// })();

// function standardize(input) {
//   return input.map((val, i) => (val - scaler.mean[i]) / scaler.scale[i]);
// }

// router.post("/predict-vitals", async (req, res) => {
//   try {
//     const { heart_rate, respiratory_rate, temperature, oxygen_level, bp_systolic, bp_diastolic } = req.body;

//     if ([heart_rate, respiratory_rate, temperature, oxygen_level, bp_systolic, bp_diastolic].some(v => v === undefined)) {
//       return res.status(400).json({ error: "Missing vital sign inputs." });
//     }

//     const input = [
//       parseFloat(heart_rate),
//       parseFloat(respiratory_rate),
//       parseFloat(temperature),
//       parseFloat(oxygen_level),
//       parseFloat(bp_systolic),
//       parseFloat(bp_diastolic)
//     ];

//     const scaledInput = standardize(input);
//     const tensor = tf.tensor2d([scaledInput]);

//     const prediction = model.predict(tensor);
//     const predVal = (await prediction.data())[0];

//     res.json({
//       critical: predVal > 0.5,
//       confidence: predVal
//     });
//   } catch (err) {
//     console.error("❌ Prediction Error:", err);
//     res.status(500).json({ error: "Prediction failed." });
//   }
// });

// module.exports = router;


const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { spawn } = require("child_process");

// Load scaler.json
const scalerPath = path.join(__dirname, "../model/sklearn/scaler.json");
const scaler = JSON.parse(fs.readFileSync(scalerPath, "utf-8"));


// POST /predict-vitals
router.post("/predict-vitals", (req, res) => {
    const input = req.body;
    const inputArray = [
      input.heart_rate,
      input.respiratory_rate,
      input.temperature,
      input.oxygen_level,
      input.bp_systolic,
      input.bp_diastolic
    ];
  
    const normalized = inputArray.map((val, i) => (val - scaler.mean[i]) / scaler.std[i]);
  
    const py = spawn("python3", ["predict_rf.py", JSON.stringify(normalized)]);
  
    let responded = false;
  
    py.stdout.on("data", (data) => {
      if (responded) return;
      responded = true;
      try {
        const result = JSON.parse(data.toString());
        res.json(result);
      } catch (err) {
        console.error("❌ JSON parse error:", err);
        res.status(500).json({ error: "Invalid model response" });
      }
    });
  
    py.stderr.on("data", (err) => {
      if (responded) return;
      responded = true;
      console.error("❌ Prediction error:", err.toString());
      res.status(500).json({ error: "Prediction failed" });
    });
  });
  

module.exports = router;
