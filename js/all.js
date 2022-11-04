
function upload(data) {
    //console.log(JSON.stringify(data));
    var filename = data[0].name;
    var fr = new FileReader();
    fr.onload = function () {
        var csv = fr.result;
        var jsonVersion = [];

        var lines = csv.split("\n");
        var object = "";
        var accuracy = "";
        for (var i = 0; i < lines.length; i++) {
            // detect a line with the name of an object
            // ScriptLog: 1944 96.46 Show Neuro2.Obj.t_bucket X -2161.00 Y -261.00
            if (lines[i].indexOf(" Show ") != -1) {
                var rx = /ScriptLog: ([0-9.]+) ([0-9.]+) ([^ ]+) ([^ ]+)/g;
                var arr = rx.exec(lines[i]);
                if (arr.length == 5)
                    object = arr[4];
            }
            // detect the gap
            // ScriptLog: how accurately placed = 2691.07
            if (lines[i].indexOf("ScriptLog: ") != -1) {
                var rx = /ScriptLog: how accurately placed = ([0-9.-]+)/g;
                var arr = rx.exec(lines[i]);
                if (arr != null && arr.length == 2) {
                    accuracy = arr[1];
                    jsonVersion.push({ object: object, accuracy: accuracy, record_id: jQuery('#InputParticipantID').val(), redcap_event: jQuery('#Event').val()  });
                    jQuery('#tbody').append('<tr><td>' + object + "</td><td>" + accuracy + "</td></tr>");

                    object = "";
                }
            }

        }


        // once the table is filled we can compute a download version of the data
        jQuery('#jsonV').text(JSON.stringify(jsonVersion, null, 2));
        if (1) { // download
            var downloadLink = document.createElement("a");
            downloadLink.download = filename.replace(".log", ".json");
            var myBlob = new Blob([JSON.stringify(jsonVersion, null, 2)], { type: "application/json" });
            downloadLink.href = window.URL.createObjectURL(myBlob);
            downloadLink.onclick = function (e) {
                document.body.removeChild(e.target);
            };
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();
        }


    };
    fr.readAsText(data[0]);
    return false;
}

jQuery(document).ready(function () {
    //console.log("HI");

    $('#drop-here').on(
        'dragover',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            //console.log("dragover");
            return true;
        }
    )
    $('#drop-here').on(
        'dragenter',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            //console.log("dragenter");
        }
    );

    jQuery('#drop-here').on('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        //console.log("drop here");
        if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
            /*UPLOAD FILES HERE*/
            //console.log("got a file");
            jQuery('#jsonV').val("");
            jQuery("#tbody").children().remove();
            upload(e.originalEvent.dataTransfer.files);
        }
        return false;
    });
});
