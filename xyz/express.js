const exp = require('express');
const app = exp();
const fs = require('fs');
const bp = require('body-parser');
const port = 4020;

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.get("/", function (req, res) {
    res.send("<h1>Welcome to express</h1>");
});

app.get("/list", function (req, res) {
    fs.readFile("stu.json", function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        res.send(data);  // Simplified response
    });
});

app.post("/", function (req, res) {
    const newStu = req.body;
    // Ensure the new student data is complete and valid
    if (!newStu.name || !newStu.roll || !newStu.branch || !newStu.year || !newStu.cgpa) {
        res.send("Incomplete student data.");
        return;
    }
    fs.readFile("stu.json", function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        let stu = JSON.parse(data);
        stu.push(newStu);
        mywrite(stu);
        res.send("Inserted");
    });
});

app.put("/", function (req, res) {
    const upStu = req.body;
    fs.readFile("stu.json", function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        let stu = JSON.parse(data);
        for (let s in stu) {
            if (stu[s]['roll'] == upStu['roll']) {
                stu[s]['name'] = upStu['name'];
            }
        }
        mywrite(stu);
        res.send("Updated");
    });
});

app.delete("/", function (req, res) {
    const delStu = req.body;
    fs.readFile("stu.json", function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        let stu = JSON.parse(data);
        for (let s in stu) {
            if (stu[s]['roll'] == delStu['roll']) {
                stu.splice(s, 1);
                mywrite(stu);
                res.send("Deleted");
                return;
            }
        }
        res.send("Student not found");
    });
});

function mywrite(stu) {
    fs.writeFile("stu.json", JSON.stringify(stu), function (err) {
        if (err) throw err;
    });
}

app.listen(port, function () {
    console.log("Server is listening on:" + port);
});
