if (window.location.protocol != "http:") {
    window.location.href = "http:" + window.location.href.substring(window.location.protocol.length);
}
