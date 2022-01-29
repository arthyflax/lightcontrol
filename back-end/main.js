import Lamp from "./lamp.js";
import express from "express";
import path from "path";
import axios from "axios";
import * as fs from "fs";
const app = express();

const __dirname = path.resolve();
const port = 3000;
const bridge = "192.168.2.108";

let Lamps = [];

(async () => {
  let response = await axios.get(
    `http://${bridge}/api/cd-HHUamWYg4ex-DrjykwDK2V5n6pUeIiHBiZDm4/lights/`
  );
  response = response.data;
  for (let i = 0; i < Object.keys(response).length; i++) {
    Lamps.push(
      new Lamp(
        `http://${bridge}/api/cd-HHUamWYg4ex-DrjykwDK2V5n6pUeIiHBiZDm4/lights/${
          i + 1
        }`,
        i
      )
    );
  }

  if (
    fs.existsSync(path.join(__dirname, "stored.json")) &&
    Object.keys(response).length === Object.keys(storedToggleBools).length
  ) {
    let storedToggleBools = fs.readFileSync(
      path.join(__dirname, "stored.json")
    );
    storedToggleBools = JSON.parse(storedToggleBools);

    for (let i = 0; i < storedToggleBools.length; i++) {
      Lamps[i].toggle(storedToggleBools[i]);
    }
  } else {
    let toggleBools = [];
    for (let i = 0; i < Lamps.length; i++) {
      toggleBools.push(Lamps[i].toggleBool);
    }
    fs.writeFileSync(
      path.join(__dirname, "stored.json"),
      JSON.stringify(toggleBools)
    );
  }
})();

setInterval(() => {
  for (let i = 0; i < Lamps.length; i++) {
    Lamps[i].preserveState();
  }
}, 500);

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "build")));

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/state", async (req, res) => {
  let response = [];
  for (let i = 0; i < Lamps.length; i++) {
    response.push({ name: Lamps[i].name, toggleBool: Lamps[i].toggleBool });
  }

  res.send(response);
});

app.post("/toggle", async (req, res) => {
  await Lamps[req.body.id].toggle();
  let toggleBools = JSON.parse(
    fs.readFileSync(path.join(__dirname, "stored.json"))
  );
  toggleBools[req.body.id] = !toggleBools[req.body.id];
  fs.writeFileSync(
    path.join(__dirname, "stored.json"),
    JSON.stringify(toggleBools)
  );

  res.send();
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
