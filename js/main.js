window.onload = function() {
    var dropZone = document.getElementById("drop_zone");
    dropZone.addEventListener("drop", dropHandler);
    dropZone.addEventListener("dragover", dragOverHandler);
    dropZone.addEventListener("dragleave", dragLeaveHandler);
    dropZone.addEventListener("dragenter", dragEnterHandler);
}

function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                upload(file);
                console.log('... file[' + i + '].name = ' + file.name);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            var file =  ev.dataTransfer.files[i];
            upload(file);
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    } 
    
    // Pass event to removeDragData for cleanup
    removeDragData(ev)
}

function dragOverHandler(ev) {
    console.log('File(s) in drop zone');
    ev.currentTarget.classList.add('hover');
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function removeDragData(ev) {
    console.log('Removing drag data')
    ev.currentTarget.classList.remove('hover');
    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to remove the drag data
        ev.dataTransfer.items.clear();
    } else {
        // Use DataTransfer interface to remove the drag data
        ev.dataTransfer.clearData();
    }
}

function dragEnterHandler(ev) {
    // ev.currentTarget.classList.add('hover');
}
function dragLeaveHandler(ev) {
    ev.currentTarget.classList.remove('hover');
}

function upload(file) {
    var xhr = new XMLHttpRequest();
    var progressBar = document.getElementById("progress_bar");
    // обработчик для закачки
    xhr.upload.onprogress = function(event) {
        log(event.loaded + ' / ' + event.total);
        changeProgressBar(progressBar, (event.loaded * 100 / event.total));
    }

    // обработчики успеха и ошибки
    // если status == 200, то это успех, иначе ошибка
    xhr.onload = xhr.onerror = function() {
        if (this.status == 200) {
        log("success");
        } else {
        log("error " + this.status);
        }
        setTimeout(() => {
            document.getElementById("progress_bar").style.width = "0";
            document.getElementById('log').innerHTML = "Drag one or more files to this Drop Zone ...";
        }, 2000);
    };

    var formElement = document.querySelector("form");
    xhr.open("POST", "https://evstar.000webhostapp.com/upload-files/upload.php", true);
    var formData = new FormData();
    formData.append("userfile", file);
    xhr.send(formData);
}

function log(html) {
    document.getElementById('log').innerHTML = html;
}

function changeProgressBar(progressBar, percents) {
    progressBar.style.width = percents + "%";
}