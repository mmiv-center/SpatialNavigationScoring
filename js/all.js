
function upload(data) {
    //console.log(JSON.stringify(data));
    var filename = data[0].name;
    var fr = new FileReader();
    fr.onload = function () {
        var csv = fr.result;

        var lines = csv.split("\n");
        var object = "";
        var accuracy = "";
        for (var i = 0; i < lines.length; i++) {
            // detect a line with the name of an object
            // ScriptLog: 1944 96.46 Show Neuro2.Obj.t_bucket X -2161.00 Y -261.00
            if (lines[i].indexOf(" Show ") != -1) {
                var rx = /ScriptLog: ([0-9.]+) ([0-9.]+) ([^ ]+) ([^ ]+)/g;
                var arr = rx.exec(lines[i]);
                object = arr[1];
            }
            // detect the gap
            // ScriptLog: how accurately placed = 2691.07

            // if gap
            //     add those to the spreadsheet

        }

        // once the table is filled we can compute a download version of the data
        jQuery('#jsonV').text(JSON.stringify(jsonVersion, null, 2));
        if (1) { // download
            var downloadLink = document.createElement("a");
            downloadLink.download = filename.replace(".csv", ".json");
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
            upload(e.originalEvent.dataTransfer.files);
        }
        return false;
    });
});
