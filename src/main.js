import "./style.css";
import { bootstrap } from "./state/store.js";
import { mountApp } from "./ui/app.js";

bootstrap();
mountApp(document.getElementById("app"));
