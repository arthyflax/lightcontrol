import axios from "axios";

export default class Lamp {
  constructor(url, index) {
    this.toggleBool = false;
    this.caller = axios.create({ baseURL: url });

    (async (context) => {
      let res = await context.caller.get("/");
      res = res.data;
      context.name = res.name;
      context.isColorLight = !!res.state.hue;
    })(this);
  }

  async toggle(force) {
    if (!this.toggleBool || force === true) {
      let res = await this.caller.get("/");
      res = res.data;
      this.bri = res.state.bri;
      if (res.capabilities.control.colorgamuttype) {
        this.color = res.state.xy;
      }
    }
    if (typeof force !== undefined) {
      this.toggleBool = force;
    } else {
      this.toggleBool = !this.toggleBool;
    }
  }

  preserveState() {
    if (this.toggleBool === true) {
      this.caller.put("/state", { bri: this.bri });
      if (this.isColorLight) {
        this.caller.put("/state", { xy: this.color });
      }
    }
  }
}
