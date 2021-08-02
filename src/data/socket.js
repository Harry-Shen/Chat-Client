import { io } from "socket.io-client";
import store from "./store";
import { getCookie } from "../utils";

const ENDPOINT = "http://39.108.89.105:5000";
let socket = io(ENDPOINT, {
    auth: {
        token: getCookie("token"),
    },
});

// export function initSocket() {
//     socket = io(ENDPOINT, {
//         auth: {
//             token: getCookie("token"),
//         },
//     });
// }

socket.on("connect", () => {
    socket.auth.token = getCookie("token");
});

socket.on("disconnect", () => {
    console.log("disconnected");
});

socket.on("msg", (msg) => {
    console.log("receive msg:", msg);
    let counterpart = msg.group ? msg.group : msg.sender;
    store.dispatch({ type: "MSG", msg, counterpart });
});

export default socket;
