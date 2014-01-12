EPUBJS.reader.TocController = function(toc) {
	var book = this.book;

	var $list = $("#tocView"),
			docfrag = document.createDocumentFragment();

	var currentChapter = false;

	var generateTocItems = function(toc, level) {
		var container = document.createElement("ul");

		if(!level) level = 1;

		toc.forEach(function(chapter) {
			var listitem = document.createElement("li"),
					link = document.createElement("a");
					toggle = document.createElement("a");

			var subitems;

			listitem.id = "toc-"+chapter.id;
			listitem.classList.add('list_item');

			link.textContent = chapter.label;
			link.href = chapter.href;
			
			link.classList.add('toc_link');

			listitem.appendChild(link);

			if(chapter.subitems.length > 0) {
				level++;
				subitems = generateTocItems(chapter.subitems, level);
				toggle.classList.add('toc_toggle');

				listitem.insertBefore(toggle, link);
				listitem.appendChild(subitems);
			}


			container.appendChild(listitem);

		});

		return container;
	};

	var onShow = function() {
		$list.show();
	};

	var onHide = function() {
		$list.hide();
	};

	var chapterChange = function(e) {
		var id = e.id,
				$item = $list.find("#toc-"+id),
				$current = $list.find(".currentChapter"),
				$open = $list.find('.openChapter');

		if($item.length){

			if($item != $current && $item.has(currentChapter).length > 0) {
				$current.removeClass("currentChapter");
			}

			$item.addClass("currentChapter");

			// $open.removeClass("openChapter");
			$item.parents('li').addClass("openChapter");
		}	  
	};

	book.on('renderer:chapterDisplayed', chapterChange);

	var tocitems = generateTocItems(toc);

	docfrag.appendChild(tocitems);

	$list.append(docfrag);
	$list.find(".toc_link").on("click", function(event){
			var url = this.getAttribute('href');

			//-- Provide the Book with the url to show
			//   The Url must be found in the books manifest
			book.goto(url);

			$list.find(".currentChapter")
					.addClass("openChapter")
					.removeClass("currentChapter");

			$(this).parent('li').addClass("currentChapter");

			event.preventDefault();
	});

	$list.find(".toc_toggle").on("click", function(event){
			var $el = $(this).parent('li'),
					open = $el.hasClass("openChapter");

			if(open){
				$el.removeClass("openChapter");
			} else {
				$el.addClass("openChapter");
			}
			event.preventDefault();
	});
	
	var $nav = $("#navigation");
	var $line = $("#line");
	var height = $(window).height() - 100;
	
	var limitedToc = toc.slice(0, 50);
	var dotHeight = (height - 150) / limitedToc.length;
	$nav.height(height);
	
	limitedToc.forEach(function(chapter){
		var $item = $("<li>");
		var $link = $("<a>");
		var $dot = $("<span>");
		var $text = $("<span>");
		$item.css("height", dotHeight + "px");
		$dot.addClass("dot");
		$text.addClass("hover-text");
		$link.attr("id", "dot-"+chapter.id);
		$link.attr('href', chapter.href);
		$text.text(chapter.label);
		
		$link.append($dot);
		$link.append($text);
		$item.append($link);
		$nav.append($item);
	});
	
	$nav.find("a").on("click", function(event){
			var url = this.getAttribute('href');
	
			//-- Provide the Book with the url to show
			//   The Url must be found in the books manifest
			book.goto(url);
	
			$nav.find(".active")
					.removeClass("active");
	
			$(this).parent('li').addClass("active");
	
			event.preventDefault();
	});
	
	var chapterChangeTwo = function(e) {
		var id = e.id,
				$item = $("#dot-toc-"+id),
				$current = $nav.find(".active"),
				$open = $nav.find('.active');

		// if($item.length){
			console.log(id, $item.parents('li'))
			$item.parents('li').addClass("active");
		// }	  
	};
	
	book.on('renderer:chapterDisplayed', chapterChangeTwo);
	
	return {
		"show" : onShow,
		"hide" : onHide
	};
};
