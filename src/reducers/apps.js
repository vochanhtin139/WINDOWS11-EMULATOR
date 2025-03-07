import { allApps } from "../utils";

var dev = "";
if (import.meta.env.MODE == "development") {
  dev = ""; // set the name (lowercase) of the app you are developing so that it will be opened on refresh
}

const defState = {};
for (var i = 0; i < allApps.length; i++) {
  defState[allApps[i].icon] = allApps[i];
  defState[allApps[i].icon].size = "full";
  defState[allApps[i].icon].hide = true;
  defState[allApps[i].icon].max = null;
  defState[allApps[i].icon].z = 0;

  if (allApps[i].icon == dev) {
    defState[allApps[i].icon].size = "mini";
    defState[allApps[i].icon].hide = false;
    defState[allApps[i].icon].max = true;
    defState[allApps[i].icon].z = 1;
  }
}

defState.hz = 2;

const appReducer = (state = defState, action) => {
  var tmpState = { ...state };

  switch (action.type) {
    case "EDGELINK":
      var obj = { ...tmpState["edge"] };
      if (action.payload && action.payload.startsWith("http")) {
        obj.url = action.payload;
        obj.pdfPath = null;
      } else if (action.payload && action.payload.startsWith("/cv")) {
        obj.pdfPath = action.payload;
        obj.url = null;
      } else if (action.payload && action.payload.length != 0) {
        obj.url = "https://www.bing.com/search?q=" + action.payload;
      } else {
        obj.url = null;
      }

      obj.size = "full";
      obj.hide = false;
      obj.max = true;
      tmpState.hz += 1;
      obj.z = tmpState.hz;
      tmpState["edge"] = obj;
      return tmpState;

    case "SHOWDSK":
      var keys = Object.keys(tmpState);

      for (var i = 0; i < keys.length; i++) {
        var obj = tmpState[keys[i]];
        if (obj.hide == false) {
          obj.max = false;
          if (obj.z == tmpState.hz) {
            tmpState.hz -= 1;
          }
          obj.z = -1;
          tmpState[keys[i]] = obj;
        }
      }

      return tmpState;

    case "EXTERNAL":
      window.open(action.payload, "_blank");

    case "OPENTERM":
      var obj = { ...tmpState["terminal"] };
      obj.dir = action.payload;

      obj.size = "full";
      obj.hide = false;
      obj.max = true;
      tmpState.hz += 1;
      obj.z = tmpState.hz;
      tmpState["terminal"] = obj;
      return tmpState;

    case "ADDAPP":
      tmpState[action.payload.icon] = action.payload;
      tmpState[action.payload.icon].size = "full";
      tmpState[action.payload.icon].hide = true;
      tmpState[action.payload.icon].max = null;
      tmpState[action.payload.icon].z = 0;

      return tmpState;

    case "DELAPP":
      delete tmpState[action.payload];
      return tmpState;

    case "OPEN_PDF":
      console.log("OPEN_PDF", action.payload)
      var obj = { ...tmpState["edge"] };
      if (action.payload && action.payload.startsWith("/cv")) {
        obj.pdfPath = action.payload;
        obj.url = null;
      } else if (action.payload && action.payload.length != 0) {
        obj.url = "https://www.bing.com/search?q=" + action.payload;
      } else {
        obj.url = null;
      }

      obj.size = "full";
      obj.hide = false;
      obj.max = true;
      tmpState.hz += 1;
      obj.z = tmpState.hz;
      tmpState["edge"] = obj;
      return tmpState;
      
    case "OPEN_WEB":
      // return {
      //   ...state,
      //   edge: {
      //     ...state.edge,
      //     url: action.payload,
      //     pdfPath: null,
      //   },
      // };
      console.log("OPEN_WEB", action.payload)
      var obj = { ...tmpState["edge"] };
      if (action.payload && action.payload.startsWith("http")) {
        obj.url = action.payload;
        obj.pdfPath = null;
      } else if (action.payload && action.payload.length != 0) {
        obj.url = "https://www.bing.com/search?q=" + action.payload;
      } else {
        obj.url = null;
      }

      obj.size = "full";
      obj.hide = false;
      obj.max = true;
      tmpState.hz += 1;
      obj.z = tmpState.hz;
      tmpState["edge"] = obj;
      return tmpState;

    case "EXPLORER":
      var obj = { ...tmpState["explorer"] };
      obj.dir = action.payload;
      console.log("EXPLORER payload", action.payload)

      if (action.payload == "full") {
        obj.size = "full";
        obj.hide = false;
        obj.max = true;
        tmpState.hz += 1;
        obj.z = tmpState.hz;
      } else if (action.payload == "close") {
        obj.hide = true;
        obj.max = null;
        obj.z = -1;
        tmpState.hz -= 1;
      } else if (action.payload == "mxmz") {
        obj.size = ["mini", "full"][obj.size != "full" ? 1 : 0];
        obj.hide = false;
        obj.max = true;
        tmpState.hz += 1;
        obj.z = tmpState.hz;
      } else if (action.payload == "togg") {
        if (obj.z != tmpState.hz) {
          obj.hide = false;
          if (!obj.max) {
            tmpState.hz += 1;
            obj.z = tmpState.hz;
            obj.max = true;
          } else {
            obj.z = -1;
            obj.max = false;
          }
        } else {
          obj.max = !obj.max;
          obj.hide = false;
          if (obj.max) {
            tmpState.hz += 1;
            obj.z = tmpState.hz;
          } else {
            obj.z = -1;
            tmpState.hz -= 1;
          }
        }
      } else if (action.payload == "mnmz") {
        obj.max = false;
        obj.hide = false;
        if (obj.z == tmpState.hz) {
          tmpState.hz -= 1;
        }
        obj.z = -1;
      } else if (action.payload == "resize") {
        obj.size = "cstm";
        obj.hide = false;
        obj.max = true;
        if (obj.z != tmpState.hz) tmpState.hz += 1;
        obj.z = tmpState.hz;
        obj.dim = action.dim;
      } else if (action.payload == "front") {
        obj.hide = false;
        obj.max = true;
        if (obj.z != tmpState.hz) {
          tmpState.hz += 1;
          obj.z = tmpState.hz;
        }
      } else if (action.payload == "Projects" || action.payload == "HeyDucks-CVs") {
        obj.dir = action.payload;
        obj.path = "C:\\Users\\Blue\\" + action.payload;
        obj.size = "full";
        obj.hide = false;
        obj.max = true;
        tmpState.hz += 1;
        obj.z = tmpState.hz;
      } else {
        obj.dir = null;
        obj.size = "full";
        obj.hide = false;
        obj.max = true;
        tmpState.hz += 1;
        obj.z = tmpState.hz;
      }

      tmpState["explorer"] = obj;
      return tmpState;

    default:
      var keys = Object.keys(state);
      for (var i = 0; i < keys.length; i++) {
        var obj = state[keys[i]];
        if (obj.action == action.type) {
          tmpState = { ...state };

          if (action.payload == "full") {
            obj.size = "full";
            obj.hide = false;
            obj.max = true;
            tmpState.hz += 1;
            obj.z = tmpState.hz;
          } else if (action.payload == "close") {
            obj.hide = true;
            obj.max = null;
            obj.z = -1;
            tmpState.hz -= 1;
          } else if (action.payload == "mxmz") {
            obj.size = ["mini", "full"][obj.size != "full" ? 1 : 0];
            obj.hide = false;
            obj.max = true;
            tmpState.hz += 1;
            obj.z = tmpState.hz;
          } else if (action.payload == "togg") {
            if (obj.z != tmpState.hz) {
              obj.hide = false;
              if (!obj.max) {
                tmpState.hz += 1;
                obj.z = tmpState.hz;
                obj.max = true;
              } else {
                obj.z = -1;
                obj.max = false;
              }
            } else {
              obj.max = !obj.max;
              obj.hide = false;
              if (obj.max) {
                tmpState.hz += 1;
                obj.z = tmpState.hz;
              } else {
                obj.z = -1;
                tmpState.hz -= 1;
              }
            }
          } else if (action.payload == "mnmz") {
            obj.max = false;
            obj.hide = false;
            if (obj.z == tmpState.hz) {
              tmpState.hz -= 1;
            }
            obj.z = -1;
          } else if (action.payload == "resize") {
            obj.size = "cstm";
            obj.hide = false;
            obj.max = true;
            if (obj.z != tmpState.hz) tmpState.hz += 1;
            obj.z = tmpState.hz;
            obj.dim = action.dim;
          } else if (action.payload == "front") {
            obj.hide = false;
            obj.max = true;
            if (obj.z != tmpState.hz) {
              tmpState.hz += 1;
              obj.z = tmpState.hz;
            }
          }

          tmpState[keys[i]] = obj;
          return tmpState;
        }
      }
      return state;
  
    }
};

export default appReducer;
