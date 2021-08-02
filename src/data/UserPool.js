import { fetch_ } from "../utils";
import store from "./store";

class UserPool {
    constructor() {
        this.map = new Map();
        this.updateUsers();
    }

    updateUsers(all = false) {
        setTimeout(() => {
            const state = store.getState();
            let ids = [...state.info.contact];
            state.conversations.forEach((c) => {
                if (!c.is_group) ids.push(c.counterpart);
            });
            ids = new Set(ids);
            ids = [...ids];
            if (state.info.user) {
                ids.push(state.info.user.id); //self
            }
            this.requestUsers(ids);
        }, 500);
    }

    async getUsers(ids, realtime = false) {
        if (realtime) {
            return this.requestUsers(ids);
        } else {
            let users = [];
            for (const id of ids) {
                const user = await this.getUser(id);
                users.push(user);
            }
            return Promise.resolve(users);
        }
    }

    async getUser(id, realtime = false) {
        if (!id) return Promise.resolve(null);
        if (realtime) {
            return this.requestUser(id);
        } else {
            let user = this.map.get(id);
            if (!user) {
                return this.requestUser(id);
            }
            return Promise.resolve(user);
        }
    }

    async requestUsers(ids) {
        console.log("ids", ids);
        if (ids.length === 0) return Promise.resolve(null);
        const res = await fetch_("/users", "post", {
            ids,
        });
        if (res.success) {
            res.users.forEach((user) => {
                this.map.set(user.id, user);
            });
            return Promise.resolve(res.users);
        }
        return Promise.resolve(null);
    }

    async requestUser(id) {
        if (!id) return Promise.resolve(null);
        let user = null;
        const res = await fetch_(`/user/${id}`);
        if (res.success) {
            user = res.user;
            this.map.set(res.user.id, user);
        }
        return Promise.resolve(user);
    }
}

const user_pool = new UserPool();

export default user_pool;
