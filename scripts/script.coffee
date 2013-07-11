$ ->
	LOCAL_STRAGE_KEY = 'FileAPI_test'
	$fileList = $('#file-list')
	$resContainer = $('.resContainer')
	totalNum = 0
	arr = []
	maxFlag = false
			
	setLocalStrage = (n, f) ->
		arr.push(f)
		try
			window.localStorage[LOCAL_STRAGE_KEY] = JSON.stringify(arr)
		catch error
			$('#drop-zone').text('LocalStorageの容量が一杯です。').css
				color: '#cc0000', 'border-color': '#cc0000'
			maxFlag = true
			return false
	
	loadFile = (f, callbak, i) ->
		reader = new FileReader()
		reader.onload = (e) ->
			if !maxFlag
				f.result = e.target.result
				setLocalStrage totalNum, f
				draw f, e.target.result
				totalNum++
				callbak()
		reader['readAsDataURL'](f, 'utf-8')
	
	handleFileSelect = (e) ->
		e.stopPropagation()
		e.preventDefault()
		
		files = e.dataTransfer.files
		length = files.length
		i = 0
		callBackFunc = ->
			if length is (i-1) then return
			i++
			loadFile(files[i], callBackFunc, i)
			
		loadFile(files[i], callBackFunc, i)
					
	resizeHandler = ->
		setTimeout ->
			$fileList.masonry
				itemSelector: '.resContainer'
		, 100
	
	commify = (num) ->
	    if typeof num is 'number'
	        return num.toString().replace(/(\d{1,3})(?=(?:\d\d\d)+(?!\d))/g, '$1,')
	    else
	        return num
	
	draw = (f, resData) ->
		lastModifiedDate = ''
		if typeof f.lastModifiedDate is 'object'
			lastModifiedDate = f.lastModifiedDate.toLocaleDateString()
		else if typeof f.lastModifiedDate is 'string'
			_d = f.lastModifiedDate.split('-')
			lastModifiedDate = _d[0]+'年'+_d[1]+'月'+_d[2].split('T')[0]+'日'
		size = commify(f.size)
		content = '<div class="resContainer">'+
					'<img src="'+resData+'" width="175" />'+
					'<p>'+f.name+'<p>'+
					'<p>'+f.type+'<p>'+
					'<p>'+size+'KB</p>'+
					'<p>'+lastModifiedDate+'</p>'+
					'</div>'
		
		$fileList.prepend(content).masonry 'destroy'
		resizeHandler()
		
	handleDragOver = (e) ->
		e.stopPropagation()
		e.preventDefault()
		e.dataTransfer.dropEffect = 'copy'
		
	$(window).resize ->
		resizeHandler()
		
	$('#clear-btn').on 'click', ->
		if window.confirm('クリアするよろしい？')
			window.localStorage.removeItem(LOCAL_STRAGE_KEY)
			$fileList.empty()
			
	$(document).on 'dblclick', $('.resContainer').find('img'), (e) ->
		index = $('.resContainer').find('img').index(e.target)
		$('.resContainer').eq(index).remove()
		arr.splice (arr.length-(index+1)), 1
		window.localStorage.removeItem(LOCAL_STRAGE_KEY)
		window.localStorage[LOCAL_STRAGE_KEY] = JSON.stringify(arr)
		$fileList.masonry 'destroy'
		resizeHandler()
	
	init = ->
		$fileList.masonry
			itemSelector: '.resContainer'
		dropZone = document.getElementById 'drop-zone'
		dropZone.addEventListener 'dragover', handleDragOver, false
		dropZone.addEventListener 'drop', handleFileSelect, false
	
	if window.File && window.FileReader && window.FileList && window.Blob
		init()
		if window.localStorage.getItem(LOCAL_STRAGE_KEY)
			_arr = JSON.parse window.localStorage[LOCAL_STRAGE_KEY]
			arr = _arr
			_len = arr.length
			totalNum = _len
			for i in [0..._len]
				f = arr[i]
				draw f, f.result
	else
		alert 'The File APIs are not fully supported in this browser.'
	
	return @
