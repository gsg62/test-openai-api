import { config } from "dotenv";
import express from "express";
import OpenAIApi from "openai";
import ip from "ip";

config();

// initialize app
const app = express();
const PORT = process.env.PORT || 3000; // uses 8080 for local dev
const API_KEY = process.env.API_KEY;
// used for local mobile app testing, remove for deployment
const ipAddress = ip.address();
app.use(express.json());

// initialize openai
const openai = new OpenAIApi({ apiKey: API_KEY });

app.get("/test", (req, res) => {
  return res.status(200).send("hello world");
});

app.post("/chat", (req, res) => {
  const { messages } = req.body;
  console.log("messages:", messages);
  openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: messages,
      // messages: [{ role: "user", content: message }],
    })
    .then((openaiResponse) => {
      console.log("openaiResponse.choices: ", openaiResponse.choices);
      return res.status(200).send({
        body: openaiResponse,
      });
    });
});

app.put("/test/:queryParam", (req, res) => {
  const { queryParam } = req.params;
  const { data } = req.body;
  // do stuff to update data
  return res.status(200).send({
    queryParam: queryParam,
    body: data,
  });
});

app.listen(PORT, () => {
  console.log(`its alive on http://${ipAddress}:${PORT}`);
});
