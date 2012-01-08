function loadScript(src, callback, params)
{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = function () { callback(params); };
    head.appendChild(script);
};
