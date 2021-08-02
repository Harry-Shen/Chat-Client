import { combineReducers, createStore } from "redux";

/*  Conversations Schema
[
    {
        counterpart: id  //id of a group or a person
        is_group: false or ture
        msgs:[
            msg1:{
                content:"xxxxx"
                receiver: pseron id,
                group: group id
                ...
            }
            msg2:{ ... //second msg with same counterpart }
        ]
    }
    {  ... // second conversation with another counterpart }
] */

let initial_cons = window.localStorage.getItem("conversations");
initial_cons = initial_cons ? JSON.parse(initial_cons) : [];

const initial_info = {
    contact: [],
    group: [],
    user: null,
    login: false,
};

function conversations(state = initial_cons, action) {
    console.log("store action:", action);
    let newConvs = cons_copy(state);
    switch (action.type) {
        case "MSG":
            handleMsg(newConvs, action.msg, action.counterpart);
            window.localStorage.setItem("conversations", JSON.stringify(newConvs));
            break;
        case "STORE-DATA":
            window.localStorage.setItem("conversations", JSON.stringify(newConvs));
            break;
        case "LOGOUT":
            window.localStorage.setItem("conversations", "");
            return [];
        case "SET-CONVERSATIONS":
            return cons_copy(action.conversations);
        case "SET-PREV-MSGS":
            setPrevMsgs(newConvs, action.msgs, action.counterpart, action.is_group);
            break;
        case "DELETE-CONVERSATION":
            newConvs = newConvs.filter(
                (c) => !(c.counterpart === action.counterpart && c.is_group === action.is_group)
            );
            break;
        default:
            return newConvs;
    }
    return newConvs;
}

function info(state = initial_info, action) {
    let contact = [...state.contact];
    let group = [...state.group];
    let user = { ...state.user };
    let login = state.login;
    let round_screen = state.round_screen;

    switch (action.type) {
        case "LOGIN":
            login = true;
            user = action.user;
            break;
        case "LOGOUT":
            return initial_info;
        case "SET-CONTACT":
            contact = [...action.contact];
            break;
        case "SET-GROUP":
            group = action.group;
            break;
        case "LEAVE-GROUP":
            group = group.filter((g) => g.group_id !== action.group_id);
            break;
        case "JOIN-GROUP":
            group.push(action.group);
            break;
        default:
            return state;
    }
    return { contact, group, user, login, round_screen };
}

const reducer = combineReducers({ conversations, info });
const store = createStore(reducer);

export default store;

store.subscribe(() => {
    console.log(store.getState());
});

function setPrevMsgs(cons, msgs, counterpart, is_group) {
    for (const con of cons) {
        if (counterpart === con.counterpart && is_group === con.is_group) {
            con.msgs = msgs_copy(msgs.concat(con.msgs));
            return;
        }
    }
    const con = {
        counterpart,
        is_group, // msg to a group or a person
        msgs: msgs_copy(msgs),
    };
    cons.push(con);
}

function handleMsg(cons, msg, counterpart) {
    const is_group = msg.group ? true : false;
    for (const con of cons) {
        if (counterpart === con.counterpart && is_group === con.is_group) {
            con.msgs.push(msg);
            return; //match a exist conversation
        }
    }
    const con = {
        counterpart,
        is_group, // msg to a group or a person
        msgs: [msg],
    };
    cons.push(con);
}

function cons_copy(cons) {
    return cons.map((con) => {
        const msgs = msgs_copy(con.msgs);
        return {
            counterpart: con.counterpart,
            is_group: con.is_group,
            msgs: msgs,
        };
    });
}

function msgs_copy(msgs) {
    return msgs.map((msg) => {
        return { ...msg };
    });
}
