import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/account", (req, res) => {
  let account = req.body;

  fs.readFile("accounts.json", "utf-8", (err, data) => {
    if (!err) {
      try {
        let json = JSON.parse(data);
        account = { id: json.nextId++, ...account };
        json.accounts.push(account);
        fs.writeFile("accounts.json", JSON.stringify(json), (err) => {
          if (err) {
            res.status(400).send({ error: err.message });
          } else {
            res.send("POST Account");
          }
        });
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});

app.listen(port, () => {
  try {
    fs.readFile("accounts.json", "utf-8", (err, data) => {
      if (err) {
        const initialJson = {
          nextId: 1,
          accounts: [],
        };
        fs.writeFile("accounts.json", JSON.stringify(initialJson), (err) => {
          if (err) {
            console.log("Arquivo criado com sucesso!");
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
