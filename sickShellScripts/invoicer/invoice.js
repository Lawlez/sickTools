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

const invoice = {
  logo: "https://hosting.cybertap.ch/images/logos/g0OExnSQHAk.gif",
  from: "CyberTap -hosting\nFeger IT & Security\nBadenerstrasse 56\n8104 Weiningen ZH",
  to: "Rangsarit Ehrsam",
  currency: "chf",
  number: "HOS-INV-106",
  payment_terms: "Payment 30 days after invoice date",
  items: [
    {
      name: "CyberTap 1GB Simple Hosting",
      description:
        "5 years subscription, 1GB webspace, 50GB/month traffic, up to 10 E-Mail accounts, up to 2 Domains & 4 Databases.",
      quantity: 5,
      unit_cost: 59,
    },
    {
      name: "massage-geroldswil.ch domain",
      quantity: 5,
      description: "5 years subscription",
      unit_cost: 9.97,
    },
    {
      name: "massagegeroldswil.ch",
      quantity: 5,
      description: "5 years subscription",
      unit_cost: 9.97,
    },
    {
      name: "chalida-wellness.ch domain",
      quantity: 5,
      description: "5 years subscription",
      unit_cost: 9.97,
    },
  ],
  fields: {
    tax: "%",
  },
  tax: 7.7,
  notes: "Thanks for being an awesome customer!",
  };

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
