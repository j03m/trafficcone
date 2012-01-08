var deviceIphone = "iphone";
var deviceIpod = "ipod";
var deviceIpad = "ipad";

//Initialize our user agent string to lower case.
var uagent = navigator.userAgent.toLowerCase();

//**************************
// Detects if the current device is an iPhone.
function DetectIphone() {
    if (uagent.search(deviceIphone) > -1)
        return true;
    else
        return false;
}

//**************************
// Detects if the current device is an iPod Touch.
function DetectIpod() {
    if (uagent.search(deviceIpod) > -1)
        return true;
    else
        return false;
}

function DetectIpad()
{
    if (uagent.search(deviceIpad) > -1)
        return true;
    else
        return false;

}

//**************************
// Detects if the current device is an iPhone or iPod Touch.
function DetectAppleMobile() {
    if (DetectIphone()) {
        return true;
    }
    else if (DetectIpod()) {
        return true;
    }
    else if (DetectIpad()) {
        return true;
    }
    else {
        return false;
    }
}

var deviceAndroid = "android";

//**************************
// Detects if the current device is an Android OS-based device.
function DetectAndroid() {
    if (uagent.search(deviceAndroid) > -1)
        return true;
    else
        return false;
}


//**************************
// Detects if the current device is an Android OS-based device and
//   the browser is based on WebKit.
function DetectAndroidWebKit() {
    if (DetectAndroid()) {
        if (DetectWebkit())
            return true;
        else
            return false;
    }
    else
        return false;
}