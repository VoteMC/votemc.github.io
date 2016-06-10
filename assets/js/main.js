var asciiHex = {
    "20": " ",
    "21": "!",
    "22": "\"",
    "23": "#",
    "24": "$",
    "25": "%",
    "26": "&",
    "27": "'",
    "28": "(",
    "29": ")",
    "2a": "*",
    "2b": "+",
    "2c": ",",
    "2d": "-",
    "2e": ".",
    "2f": "/",
    "30": "0",
    "31": "1",
    "32": "2",
    "33": "3",
    "34": "4",
    "35": "5",
    "36": "6",
    "37": "7",
    "38": "8",
    "39": "9",
    "3a": ":",
    "3b": ";",
    "3c": "<",
    "3d": "=",
    "3e": ">",
    "3f": "?",
    "40": "@",
    "41": "A",
    "42": "B",
    "43": "C",
    "44": "D",
    "45": "E",
    "46": "F",
    "47": "G",
    "48": "H",
    "49": "I",
    "4a": "J",
    "4b": "K",
    "4c": "L",
    "4d": "M",
    "4e": "N",
    "4f": "O",
    "50": "P",
    "51": "Q",
    "52": "R",
    "53": "S",
    "54": "T",
    "55": "U",
    "56": "V",
    "57": "W",
    "58": "X",
    "59": "Y",
    "5a": "Z",
    "5b": "[",
    "5c": "\\",
    "5d": "]",
    "5e": "^",
    "5f": "_",
    "60": "`",
    "61": "a",
    "62": "b",
    "63": "c",
    "64": "d",
    "65": "e",
    "66": "f",
    "67": "g",
    "68": "h",
    "69": "i",
    "6a": "j",
    "6b": "k",
    "6c": "l",
    "6d": "m",
    "6e": "n",
    "6f": "o",
    "70": "p",
    "71": "q",
    "72": "r",
    "73": "s",
    "74": "t",
    "75": "u",
    "76": "v",
    "77": "w",
    "78": "x",
    "79": "y",
    "7a": "z",
    "7b": "{",
    "7c": "|",
    "7d": "}",
    "7e": "~",
};

function swapData(string, map, keyLength, reverse) {
    if (reverse) {
        var reverseMap = {};
        
        for (var key in map)
            if (map.hasOwnProperty(key))
                reverseMap[map[key]] = key;
        
        map = reverseMap;
    }
    
    var swapped = "";
    
    for (var i = 0, length = string.length; i < length; i += keyLength) {
        swapped += map[string.substring(i, i + keyLength)];
    }
    
    return swapped;
}

function reRegisterClose() {
    $(".close").off("click").click(function() {
        $(this).fadeOut(function() {
            $(this).remove();
        }).next().fadeOut(function() {
            $(this).remove();
        });
    });
}

$("#import input").keypress(function(event) {
    if (event.which === 13) {
        $("#import button").trigger("click");
        return false;
    }
});

$("#import button").click(function() {
    var config = $("#import input").val().toLowerCase();
    var start, end;
    
    for (var i = 0, length = config.length; i + 1 < length; ++i) {
        if (i + 2 === length)
            end = length;
        else {
            if ((config.charAt(i) === "0" && config.charAt(i + 1) === "0") || (config.charAt(i) === "f" && config.charAt(i + 1) === "f")) {
                if (isNaN(start))
                    start = i;
                else
                    end = i;
            }
        }
        
        if (!(isNaN(start) || isNaN(end))) {
            $("<iframe></iframe>").attr("src", (config.charAt(start) + config.charAt(start + 1) === "00" ? "http://" : "https://") + swapData(config.substring(start + 2, end), asciiHex, 2, false)).insertBefore("#add").before('<i class="close fa fa-close fa-lg"></i>');
            reRegisterClose();
            
            start = i;
            end = undefined;
        }
    }
});

$("#export button").eq(0).click(function() {
    var config = "";
    
    $("iframe").each(function() {
        var target = $(this).attr("src").substring(7);
        var protocol = "00";
        
        if ($(this).attr("src").match(/^https/)) {
            target = target.substring(1);
            protocol = "ff";
        }
        
        config += protocol + swapData(target, asciiHex, 1, true);
    });
    
    $("#export input").val(config);
});

var clipboard = new Clipboard("#copy button");

clipboard.on("success", function(event) {
    $("#copy button").attr("data-original-title", "Copied!");
    $("#copy button").tooltip("show");
    event.clearSelection();
}).on("error", function(event) {
    $("#copy button").attr("data-original-title", "Error; please copy manually.");
    $("#copy button").tooltip("show");
});

$("#copy button").click(function() {
    if (!$("#export input").val()) {
        $(this).attr("data-original-title", "There's nothing to copy!");
        $(this).tooltip("show");
        return false;
    }
});

$("#copy button").mouseleave(function() {
    $(this).tooltip("hide");
});

$("#add input").keypress(function(event) {
    if (event.which === 13) {
        $("#add button").trigger("click");
        return false;
    }
});

$("#add button").click(function() {
    target = $("#add input").val();
    
    if (!target.match(/\s/g) && target.match(/\.\w/g)) {
        if (!target.match(/^https?:\/\//))
            target = "http://" + target;
        
        $("<iframe></iframe>").attr("src", target).insertBefore("#add").before('<i class="close fa fa-close fa-lg"></i>');
        reRegisterClose();
    }
});
