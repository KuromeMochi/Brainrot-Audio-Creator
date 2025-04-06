// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
//import date
const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Suppose we serve static files from "public_output" if we want
app.use(
  "/output-audio",
  express.static(path.join(__dirname, "createAudio", "output_audio"))
);
const condaPythonPath = "C:\\Users\\tigger\\miniconda3\\envs\\song\\python.exe";

// POST endpoint to process audio
app.post("/process-audio", (req, res) => {
  const { audio1, audio2 } = req.body;
  console.log("Received audio files:", audio1, audio2);
  if (!audio1 || !audio2) {
    return res
      .status(400)
      .json({ error: "Two filenames (audio1, audio2) are required." });
  }

  // Path to our Python interpreter in the virtual environment
  // const pythonPath = path.join(__dirname, "venv", "Scripts", "python.exe");
  // For Mac/Linux, might be: path.join(__dirname, 'venv', 'bin', 'python');

  // Path to the Python script
  const scriptPath = path.join(__dirname, "createAudio", "testBackend.py");
  // get current date and time
  const date = new Date().toISOString().replace(/:/g, "-").split(".")[0];
  const pythonProcess = spawn(condaPythonPath, [
    scriptPath,
    audio1,
    audio2,
    date,
  ]);

  // Spawn the Python process, passing 2 arguments
  // const pythonProcess = spawn(pythonPath, [
  //   scriptPath,
  //   audio1.toL,
  //   audio2,
  //   date,
  // ]);
  scriptOutput = "";
  // Collect script output (if any)
  pythonProcess.stdout.on("data", (data) => {
    scriptOutput += data.toString();
    console.log("Python stdout:", data.toString());
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python script error: ${data.toString()}`);
  });

  // When the script ends
  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
    console.log(`Script output: ${scriptOutput}`);

    if (code !== 0) {
      // Something went wrong in Python
      return res.status(500).json({ error: "Python script failed." });
    }

    // Optionally, if your script outputs or saves a file named "remixed_output.wav"
    // in "public_output" folder, we can respond with a URL:
    const fileUrl = "output-audio/" + date + ".wav"; // e.g. /output-audio/remixed_output.wav

    // Return a JSON response to the React app
    res.json({
      message: "Audio processed successfully!",
      fileUrl: fileUrl, // e.g. /output-audio/remixed_output.wav
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
