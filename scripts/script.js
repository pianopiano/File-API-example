// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var $fileList, $resContainer, LOCAL_STRAGE_KEY, arr, commify, draw, f, handleDragOver, handleFileSelect, i, init, loadFile, maxFlag, resizeHandler, setLocalStrage, totalNum, _arr, _i, _len;
    LOCAL_STRAGE_KEY = 'FileAPI_test';
    $fileList = $('#file-list');
    $resContainer = $('.resContainer');
    totalNum = 0;
    arr = [];
    maxFlag = false;
    setLocalStrage = function(n, f) {
      arr.push(f);
      try {
        return window.localStorage[LOCAL_STRAGE_KEY] = JSON.stringify(arr);
      } catch (error) {
        $('#drop-zone').text('LocalStorageの容量が一杯です。').css({
          color: '#cc0000',
          'border-color': '#cc0000'
        });
        maxFlag = true;
        return false;
      }
    };
    loadFile = function(f, callbak, i) {
      var reader;
      reader = new FileReader();
      reader.onload = function(e) {
        if (!maxFlag) {
          f.result = e.target.result;
          setLocalStrage(totalNum, f);
          draw(f, e.target.result);
          totalNum++;
          return callbak();
        }
      };
      return reader['readAsDataURL'](f, 'utf-8');
    };
    handleFileSelect = function(e) {
      var callBackFunc, files, i, length;
      e.stopPropagation();
      e.preventDefault();
      files = e.dataTransfer.files;
      length = files.length;
      i = 0;
      callBackFunc = function() {
        if (length === (i - 1)) {
          return;
        }
        i++;
        return loadFile(files[i], callBackFunc, i);
      };
      return loadFile(files[i], callBackFunc, i);
    };
    resizeHandler = function() {
      return setTimeout(function() {
        return $fileList.masonry({
          itemSelector: '.resContainer'
        });
      }, 100);
    };
    commify = function(num) {
      if (typeof num === 'number') {
        return num.toString().replace(/(\d{1,3})(?=(?:\d\d\d)+(?!\d))/g, '$1,');
      } else {
        return num;
      }
    };
    draw = function(f, resData) {
      var content, lastModifiedDate, size, _d;
      lastModifiedDate = '';
      if (typeof f.lastModifiedDate === 'object') {
        lastModifiedDate = f.lastModifiedDate.toLocaleDateString();
      } else if (typeof f.lastModifiedDate === 'string') {
        _d = f.lastModifiedDate.split('-');
        lastModifiedDate = _d[0] + '年' + _d[1] + '月' + _d[2].split('T')[0] + '日';
      }
      size = commify(f.size);
      content = '<div class="resContainer">' + '<img src="' + resData + '" width="175" />' + '<p>' + f.name + '<p>' + '<p>' + f.type + '<p>' + '<p>' + size + 'KB</p>' + '<p>' + lastModifiedDate + '</p>' + '</div>';
      $fileList.prepend(content).masonry('destroy');
      return resizeHandler();
    };
    handleDragOver = function(e) {
      e.stopPropagation();
      e.preventDefault();
      return e.dataTransfer.dropEffect = 'copy';
    };
    $(window).resize(function() {
      return resizeHandler();
    });
    $('#clear-btn').on('click', function() {
      if (window.confirm('クリアするよろしい？')) {
        window.localStorage.removeItem(LOCAL_STRAGE_KEY);
        return $fileList.empty();
      }
    });
    $(document).on('dblclick', $('.resContainer').find('img'), function(e) {
      var index;
      index = $('.resContainer').find('img').index(e.target);
      $('.resContainer').eq(index).remove();
      arr.splice(arr.length - (index + 1), 1);
      window.localStorage.removeItem(LOCAL_STRAGE_KEY);
      window.localStorage[LOCAL_STRAGE_KEY] = JSON.stringify(arr);
      $fileList.masonry('destroy');
      return resizeHandler();
    });
    init = function() {
      var dropZone;
      $fileList.masonry({
        itemSelector: '.resContainer'
      });
      dropZone = document.getElementById('drop-zone');
      dropZone.addEventListener('dragover', handleDragOver, false);
      return dropZone.addEventListener('drop', handleFileSelect, false);
    };
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      init();
      if (window.localStorage.getItem(LOCAL_STRAGE_KEY)) {
        _arr = JSON.parse(window.localStorage[LOCAL_STRAGE_KEY]);
        arr = _arr;
        _len = arr.length;
        totalNum = _len;
        for (i = _i = 0; 0 <= _len ? _i < _len : _i > _len; i = 0 <= _len ? ++_i : --_i) {
          f = arr[i];
          draw(f, f.result);
        }
      }
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
    return this;
  });

}).call(this);
