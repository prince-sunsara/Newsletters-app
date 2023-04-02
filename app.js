const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");

// Mainchimp setup 
mailchimp.setConfig({
    apiKey: "ae025bdcbbf3db0099215947251c5e01-us21",
    server: "us21",
  });

//   app uses 
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data); // convert to json 

    const url = "https://us21.api.mailchimp.com/3.0/lists/3238143bba";
    const options = {
        method: "POST",
        auth: "prince:ae025bdcbbf3db0099215947251c5e01-us21"
    }

    console.log(jsonData);
    
    const request = https.request(url, options, (response) => {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
    
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started at port 3000.")
});




// Unique Id : 3238143bba
// API key : ae025bdcbbf3db0099215947251c5e01-us21
