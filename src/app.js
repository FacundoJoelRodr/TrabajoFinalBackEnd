import express from "express";
import passport from "passport";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import productRouter from "./routers/api/products.router.js";
import cartRouter from "./routers/api/carts.router.js";
import viewSessionRouter from "./routers/views/views.router.js";
import sessionRouter from "./routers/api/sessions.router.js";
import { URI } from "./db/mongodb.js";
import User from "./models/user.model.js";
import { init as initPassaportConfig } from "./config/passport.config.js";

const app = express();

const SESSION_SECRET = "I5B4£2Ep7iQY4Z6XmPpF}O4oXG7LhMYGPaXi8r";

app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: URI,
      mongoOptions: {},
      ttl: 120,
    }),
  })
);

app.get("/", (req, res) => {
  res.redirect("/api/login");
});

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "ADMIN" });

    if (!existingAdmin) {
      const adminUser = new User({
        first_name: "ADMIN",
        last_name: "ADMIN",
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        role: "ADMIN",
      });

      const newUser = await adminUser.save();
      console.log("Usuario administrador creado con éxito:", newUser);
    }
  } catch (error) {
    console.error("Error al crear usuario administrador:", error);
  }
};

createAdminUser();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "handlebars");

initPassaportConfig();

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api", viewSessionRouter);
app.use("/api", sessionRouter);

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error desconocido : ${error.message}`;
  console.log(message);
  res.status(500).json({ status: "error", message });
});

export default app;
