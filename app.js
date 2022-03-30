const express = require("express");
const app = express();
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: `cfc848c5ede827644b039c66a953dce9-us5`,
  server: `us5`,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailAddress = req.body.emailAddress;

  const run = async () => {
    const response = await client.lists.batchListMembers("4561a68191", {
      members: [
        {
          email_address: emailAddress,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          },
        },
      ],
    });
    if (response.errors.length > 0) {
      console.log(response.errors[0].error);
      res.sendFile(`${__dirname}/failure.html`);
    } else {
      console.log("Success");
      res.sendFile(`${__dirname}/success.html`);
    }
  };
  run();
});

app.post("/success", (req, res) => {
  res.redirect("/");
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.POR || 3000, () => {
  console.log(`Server is running`);
});
