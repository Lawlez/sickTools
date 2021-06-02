const https = require("https");
const fs = require("fs");
const crypto = require("crypto")
const invoiceTemplate = require("./json/template.json");
const hash = crypto.randomBytes(8).toString("hex")

const generateInvoice = (invoice, filename, success, error) => {
  const postData = JSON.stringify(invoice);
  const options = {
    hostname: "invoice-generator.com",
    port: 443,
    path: "/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const file = fs.createWriteStream(filename);

  const req = https.request(options, function (res) {
    res
      .on("data", function (chunk) {
        file.write(chunk);
      })
      .on("end", function () {
        file.end();

        if (typeof success === "function") {
          success();
        }
      });
  });
  req.write(postData);
  req.end();

  if (typeof error === "function") {
    req.on("error", error);
  }
}

generateInvoice(
  invoiceTemplate,
  "CyberTap-invoice-"+hash+".pdf",
   () => {
    console.log("Saved invoice to "+"CyberTap-invoice-"+hash+".pdf");
  },
  (error) => {
    console.error(error);
  }
);
