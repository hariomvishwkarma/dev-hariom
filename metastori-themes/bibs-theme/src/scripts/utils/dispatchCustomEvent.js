export function dispatchCustomEvent(eventName) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var detail = {
    detail: data,
  };
  var event = new CustomEvent(eventName, data ? detail : null);
  document.dispatchEvent(event);
}
