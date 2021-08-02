import store from "./data/store";

export const ENDPOINT = "http://39.108.89.105:5000";

export async function fetch_(url, method = "GET", body = null) {
    let p = new Promise((resolve) => {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: getCookie("token"),
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        fetch(ENDPOINT + url, options)
            .then((res) => res.json())
            .then((json) => {
                resolve(json);
            });
    });
    return p;
}

export function getCookie(name) {
    const regx = new RegExp(`${name}=(.+?)(;|$)`);
    const match = document.cookie.match(regx);
    if (match) return match[1];
    return "";
}

export function randInt(min = 1, max = Number.MAX_SAFE_INTEGER) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export async function updateContactAndGroup() {
    const state = store.getState();
    const user = state.info.user;
    if (!user) return;
    const res = await fetch_(`/contact-and-group/${user.id}`);
    if (res.success) {
        store.dispatch({ type: "SET-CONTACT", contact: res.contact });
        store.dispatch({ type: "SET-GROUP", group: res.group });
    }
}

export async function getGroup(group_id) {
    const group = await fetch_(`/group/${group_id}`);
    if (group.success) {
        return group;
    } else {
        console.log("Get group members failed group id: ", group_id);
        return null;
    }
}
