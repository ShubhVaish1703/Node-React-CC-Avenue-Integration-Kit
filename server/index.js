const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ccavService = require("./ccavenueService");
require('dotenv').config()

const SAMPLE_ORDER = {
  order_id: 128848,
  currency: "INR",
  amount: "100",
  redirect_url: encodeURIComponent(`http://localhost:3000/about`),
  billing_name: "John Doe",
  integration_type: 'iframe_normal',
  email: "john.doe@gmail.com",
};

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.get("/api", (req, res) => {
  res.status(200).send("server is live!");
});

app.get("/api/encrypt", (req, res) => {
  const { payload } = req.query;
  const data = {
    ...SAMPLE_ORDER,
    ...payload,
  };
  console.log(data)

  const encryptedData = ccavService.encrypt(data);
  if (encryptedData) {
    res.status(200).json({
      data: encryptedData,
      status: "SUCCESS",
    });
  } else {
    res.status(400).json({
      data: null,
      status: "FAILURE",
    });
  }
});

app.post("/api/handle-response", (req, res) => {
  const { encResp } = req.body;
  const paymentStatus = ccavService.decrypt(encResp).responceCode;

  if (paymentStatus === "Success") {
    res.redirect("/api/payment-success");
    console.log('success')
  } else {
    res.redirect("/api/payment-failure");
    console.log('failed')
  }
});

app.get("/api/payment-success", (req, res) => {
  res.redirect('http://localhost:3000/success')
});

app.get("/api/payment-failure", (req, res) => {
  res.redirect('http://localhost:3000/failure')
});

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
