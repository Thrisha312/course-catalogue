
const express = require("express");
const path = require("path");
const courses = require("./data/courses");

const app = express();
const PORT = 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("pages/index", { courses });
});

app.get("/courses", (req, res) => {
    const search = (req.query.search || "").toLowerCase();
    const category = req.query.category || "";

    const filteredCourses = courses.filter(course => {
        const matchesSearch =
            course.title.toLowerCase().includes(search) ||
            course.description.toLowerCase().includes(search);

        const matchesCategory =
            !category || course.category === category;

        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(courses.map(course => course.category))];

    res.render("pages/courses", {
        courses: filteredCourses,
        categories,
        search,
        category
    });
});

app.get("/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === Number(req.params.id));

    if (!course) {
        return res.status(404).render("pages/404");
    }

    res.render("pages/course-detail", { course });
});

app.get("/about", (req, res) => {
    res.render("pages/about");
});

app.use((req, res) => {
    res.status(404).render("pages/404");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
