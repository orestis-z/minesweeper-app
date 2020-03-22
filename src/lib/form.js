import { Linking } from "react-native";

export function postForm(path, form) {
  const str = [];
  for (let p in form) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(form[p]));
  }
  const body = str.join("&");
  const req = {
    method: "post",
    // headers: {
    //   "Content-Type": "application/x-www-form-urlencoded",
    // },
    body,
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  return fetch(path, req);
}

export function getForm(path, form) {
  const str = [];
  for (let p in form) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(form[p]));
  }
  const body = str.join("&");
  const url = path + "?" + body;

  return Linking.openURL(url);
}
