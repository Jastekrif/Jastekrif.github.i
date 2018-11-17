document.addEventListener('DOMContentLoaded', function () {
  // Destroy the database before doing anything, because I want 
  // you to see the same thing if you reload.
  // Ignore the man behind the curtain!
  var inputFile = document.querySelector('#inputFile');
  var imageMetaData = document.querySelector('#img_meta_data');
  var uploadedFile = {};

  function fileUpload() {
      var getFile = inputFile.files[0];
      uploadedFile = {
          file: getFile,
          size: getFile.size,
          type: getFile.type,
          name: getFile.name
      };


      new PouchDB('sample').destroy().then(function () {
        return new PouchDB('sample');
      }).then(function (db) {
        //
        // IMPORTANT CODE STARTS HERE
        //
        db.put({
          _id: 'image', 
          _attachments: {
            "file": {
              size: uploadedFile.size,
              type: uploadedFile.type,
              data: uploadedFile.file
            }
          }
        }).then(function () {
          return db.getAttachment('image', 'file');
        }).then(function (blob) {
          var url = URL.createObjectURL(blob);
          var img = document.createElement('img');
          img.src = url;
          document.body.appendChild(img);
          imageMetaData.innerText = 'Filesize: ' + JSON.stringify(Math.floor(blob.size/1024)) + 'KB, Content-Type: ' + JSON.stringify(blob.type);
        }).catch(function (err) {
          console.log(err);
        });
        //
        // IMPORTANT CODE ENDS HERE
        //
      });
  }

  // wait for change, then call the function
  inputFile.addEventListener('change', fileUpload, false);
});