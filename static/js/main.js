/* ================================================
----------- Boss ---------- */
(function ($) {
	"use strict";
	var Boss = {
		initialised: false,
		mobile: false,
		container : $('#portfolio-item-container'),
		blogContainer: $('#blog-item-container'),
		portfolioElAnimation: true,
		init: function () {

			if(!this.initialised) {
				this.initialised = true;
			} else {
				return;
			}

			// Call Boss Functions
			this.queryLoad();
			this.checkMobile();
			this.pageHeaderTitleAlign();
			this.menuHover();
			this.stickyMenu();
			this.mobileMenuDropdownFix();
			this.navbarBtnClassToggle();
			this.headerSearchFormFix();
			this.headerSearchFormClose();
			this.toggleBtn();
			this.toggleOverlayClick();
			this.fullHeight();
			this.sideMenuCollapse();
			this.ratings();
			this.collapseArrows();
			this.scrollToTopAnimation();
			this.scrollToClass();
			this.menuOnClick();
			this.productZoomImage();
			this.filterColorBg();
			this.selectBox();
			this.boostrapSpinner();
			this.dateTimePicker();
			this.tooltip();
			this.popover();
			this.servicesHover();
			this.countTo();
			this.progressBars();
			this.registerKnob();
			this.flickerFeed();
			this.attachBg();
			this.parallax();
			this.twitterFeed();
			this.tabLavaHover();
			this.videoBg();

			/* Call function if Magnific Popup plugin is included */
			if ( $.fn.magnificPopup) {
				this.newsletterPopup();
				this.lightBox();
			}

			/* Call function if Media element plugin is included */
			if ($.fn.mediaelementplayer) {
				this.mediaElement();
			}

			/* Call function if Media noUiSlider plugin is included */
			if ($.fn.noUiSlider) {
				this.priceSlider();
			}

			var self = this;
			/* Imagesloaded plugin included in isotope.pkgd.min.js */
			/* Portfolio isotope + Blog masonry with images loaded plugin */
			if (typeof imagesLoaded === 'function') {
				/* */
				imagesLoaded(self.container, function() {
					self.isotopeActivate();
					// recall for plugin support
					self.isotopeFilter();

					self.infiniteScroll( $('#portfolio-item-container') , '.portfolio-item');
				});

				/* check images for blog masonry/grid */
				imagesLoaded(self.blogContainer, function() {
					self.blogMasonry();
					self.infiniteScroll( $('#blog-item-container') , '.entry' );
				});
			}

		},
		queryLoad: function () {
			var self = this;
			if ($.fn.queryLoader2) {
				$("body").queryLoader2({
					barColor: "#2a2a2a",
					backgroundColor: "rgba(255, 255, 255, 0.1)",
					percentage: true,
					barHeight: 2,
					minimumTime: 400,
					fadeOutTime:200,
					onComplete: function() {
						/* fadeout then remove loader*/
						/* You can change width-height to achieve different animations after load*/
	                    $(".boss-loader-overlay").fadeOut(400, function() {
	                       $(this).remove();
	                    });

	                    /* Trigger Scroll Animations - Call wow plugin */
						self.scrollAnimations();
                	}
				});
			}
		},
		checkMobile: function () {
			/* Mobile Detect*/
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				this.mobile = true;
			} else {
				this.mobile = false;
			}
		},
		navbarBtnClassToggle: function () {
			$('#main-navbar-container').on('show.bs.collapse hide.bs.collapse', function (e) {
				$('.navbar-toggle').toggleClass('opened');
			});
		},
		toggleBtn: function () {
			var self = this;
			$('.btn-toggle').on('click', function (e) {
				$(this).toggleClass('opened');

				if ($(this).hasClass('side-menu-btn')) {
					self.toggleClassSideMenu();
				}
				e.preventDefault();
			});
		},
		toggleOverlayClick:function () {
			var self = this;
			$('.boss-menu-overlay').on('click', function (e) {
				$('.side-menu, .btn-toggle.side-menu-btn').toggleClass('opened');
				e.preventDefault();
			});
		},
		toggleClassSideMenu: function () {
			$('.side-menu').toggleClass('opened');
		},
		fullHeight: function () {
			$('.fullheight').each(function () {
				var winHeight = $(window).height();

				$(this).css('height', winHeight);
			});
		},
		pageHeaderTitleAlign: function () {
			/* Vertical align duo to absolute header*/
			if ($('.page-header-welcome.fullheight')) {
				var winHeight = $(window).height(),
					navbarHeight = $('#header').find('.navbar').outerHeight(),
					titleHeight = $('.page-header-welcome.fullheight').find('h1').height(),
					addTopSpace = ( winHeight - ( navbarHeight + titleHeight + 150 ) ) / 2;
				$('.page-header-welcome.fullheight').find('h1').css('padding-top', addTopSpace);
			}
		},
		menuHover: function () {
			if (Modernizr.mq('only all and (min-width: 768px)') && !Modernizr.touch) {
				if ($.fn.hoverIntent) {
					$('#header').find('.navbar-nav').hoverIntent({
						over: function() {
							var  $this = $(this);
							if($this.find('ul, div').length) {
								$this.addClass('open');
								$this.find('.dropdown-toggle').addClass('disabled');
							}
						},
						out: function() {
							var  $this = $(this);
							if($this.hasClass('open')) {
								$this.removeClass('open');
								$this.find('.dropdown-toggle').removeClass('disabled');
							}
						},
						selector: 'li',
						timeout: 145,
						interval: 55
					});
				}
			}
		},
		mobileMenuDropdownFix : function () {
			if (Modernizr.mq('only all and (max-width: 767px)') || Modernizr.touch) {
				$('.navbar-nav').find('.dropdown-toggle').on('click', function (e) {
					var parent = $(this).closest('li');
	                // close all the siblings and their children
	                parent.siblings().removeClass('open').find('li').removeClass('open');
	                // open which one is clicked
	                parent.toggleClass('open');

	                // prevent
	                e.preventDefault();
	                e.stopPropagation();
				});
			}
		},
		stickyMenu: function () {
			// Stickymenu with waypoint and waypoint sticky plugins
			if ($.fn.waypoint && $(window).width() >= 992) {
				$('.sticky-menu').waypoint('sticky', {
					stuckClass:'fixed',
					offset: -300
				});
			}
		},
		destroyStickyMenu: function () {
			// Destroy Stickymenu for smaller devices
			if($.fn.waypoint && $(window).width() <= 991) {
				$('.sticky-menu').waypoint('unsticky');
			}
		},
		headerSearchFormFix: function () {
			// Fix for header search form when fixed menu is active
			$("[data-target='#header-search-form']").on('click', function(e) {
		        if($('.sticky-menu').hasClass('fixed')) {
		        	$('#header-search-form').toggleClass('fixed')
		        }

		        e.preventDefault();
			});
		},
		headerSearchScrollFix: function () {
			// If header search forn oppen on fixed menu fix when fixed header is over
			if ($('#header-search-form').hasClass('fixed')) {
				var winTop = $(window).scrollTop();

				if (winTop <= 300) {
					$('#header-search-form').removeClass('fixed');
				}
			}
		},
		headerSearchFormClose: function () {
			// Close searh form when document is clicked
			$('body').on('click', function(e) {
			    if ($('#header-search-form').hasClass('in') && !$(e.target).closest('#header-search-form').length) {
			        $('#header-search-form').collapse('hide').removeClass('fixed');

			        e.preventDefault();
			    }
			});
		},
		sideMenuCollapse: function () {
			$('.side-menu').find('.navbar-nav').find('a').on('click', function(e) {

				if ($(this).siblings('ul').length) {
					$(this).siblings('ul').slideToggle(400, function () {
						$(this).closest('li').toggleClass('open');
					});
					e.preventDefault();
				} else {
					return;
				}

			});
		},
		sideMenuScrollbar: function () {
			/* Side Menu Custom Scrollbar  with slimscroll plugin */
			if ($.fn.niceScroll) {

				var sideMenu = $('.side-menu'),
					bgColor;

				/* change rail color via sie menu coloring */
				if( sideMenu.hasClass('navbar-default') ) {
					bgColor = '#7a7a7a';
				} else if ( sideMenu.hasClass('navbar-inverse')) {
					bgColor = '#9a9a9a';
				} else {
					bgColor = '#505050';
				}

				/* if data-railalign attribute is set change rail align duo to it's value */
				if (sideMenu.data('railalign')) {
					var alignRail = sideMenu.data('railalign');
				}

				$('.side-menu-wrapper').niceScroll({
					zindex: 9999,
					autohidemode: true,
					background: 'rgba(0,0,0, 0.03)' ,
					cursorcolor: bgColor,
					cursorwidth: '6px',
					cursorborder: '1px solid transparent',
					cursorborderradius: '4px',
					railalign: alignRail
				});
			}
		},
		collapseArrows : function () {
			// Sidebar category collapse (category.html )
			$('.category-widget-btn').on('click', function (e) {
				var $this = $(this),
					parent= $this.closest('li');

				if (parent.hasClass('open')) {
					parent.find('ul').slideUp(400, function() {
						parent.removeClass('open');
					});
				} else {
					parent.find('ul').slideDown(400, function() {
						parent.addClass('open');
					});
				}
				e.preventDefault();
			});
		},
		twitterFeed: function () {
			/* Twitter Feeds require jquery.tweet.min.js file and twitter api */
			if ($.fn.tweet && $('.twitter-feed-widget').length) {
				/* Twitter feed for user*/
		        $('.twitter-feed-widget').tweet({
		            modpath: './js/twitter/',
		            avatar_size: '',
					count: 3,
					username: 'eonythemes', // write your username here
					loading_text:  'searching twitter...',
		            join_text: '',
		            retweets: false,
		            template: '<div class="twitter-icon"><i class="fa fa-twitter"></i></div><div class="tweet-content">{text}{time}</div>'
		            /* etc... */
		        });
		    }
		},
		tabLavaHover: function () {
			/* Require jquery.lavalamp.min.js file */
			/* Hover Animation which is used for tabs ( checkout elements-tabs.html page to see ) */
			if ($.fn.lavalamp) {
				$('.nav-tabs-lava').lavalamp({
					setOnClick: true,
					duration: 500,
					autoUpdate: true
				});

				$('.nav-tabs-border').lavalamp({
					setOnClick: true,
					duration: 300,
					autoUpdate: true
				});
			}
		},
		ratings : function () {
			/* Calculate Ratings % and set width */
			$.each($('.ratings-result'), function () {
				var $this = $(this),
					parentWidth = $this.closest('.ratings').width(),
					rating = $(this).data('result'),
					newWidth = (parentWidth / 100) * rating;
					
				$(this).css('width', newWidth);
			});
		},
		scrollTopBtnAppear: function () {
			// This will be triggered at the bottom of code with window scroll event
			var windowTop = $(window).scrollTop(),
		            scrollTop = $('#scroll-top');

	        if (windowTop >= 300) {
	            scrollTop.addClass('fixed');
	        } else {
	            scrollTop.removeClass('fixed');
	        }
		    
		},
		scrollToAnimation: function (speed, offset, e) {
			/* General scroll to function */
			var targetEl = $(this).attr('href'),
				toTop = false;

			if (!$(targetEl).length) {
				if (targetEl === '#header' || targetEl === '#top' || targetEl === '#wrapper') {
					targetPos = 0;
					toTop = true;
				} else {
					return;
				}
			} else {
				var elem = $(targetEl),
					targetPos = offset ? ( elem.offset().top + offset ) : elem.offset().top;
			}
			
			if (targetEl || toTop) {
				$('html, body').animate({
		            'scrollTop': targetPos
		        }, speed || 1200);
		        e.preventDefault();
			}
		},
		scrollToTopAnimation: function () {
			var self = this;
			// Scroll to top animation when the scroll-top button is clicked
			$('#scroll-top').on('click', function (e) {
		        self.scrollToAnimation.call(this, 1200, 0, e);
		    });
		},
		scrollToClass: function () {
			var self = this;
			// Scroll to animation - predefined class
			// Just add this class to any element and 
			// add href attribute with target id (#targer like so ) for target 
			// you can change 0 offset to -60 (height of fixed header)
			$('.scroll-btn, .section-btn, .scrollto').on('click', function (e) {
				var offset = $(this).data('offset');
		        self.scrollToAnimation.call(this, 1200, offset, e);
		    });
		},
		menuOnClick: function() {
			var self = this;
			// Menu on click scroll animation
			$('.navbar-nav').find('a').on('click', function (e) {
				var target = $(this).attr('href');
				if ( target.indexOf('#') === -1 || !$(target).length ) {
					return;
				}

				self.scrollToAnimation.call(this, 1200, 0, e);
			});
		},
		priceSlider:function () {
			// Slider For category pages / filter price
			$('#price-range').noUiSlider({
				range: [0, 1000],
				start: [100, 900],
				handles: 2,
				connect: true,
				serialization: {
					to: [ $('#price-range-low'), $('#price-range-high') ]
				}
				
			});
		},
		filterColorBg: function () {
			/* Category-item filter color box background */
			$('.filter-color-box').each(function() {
				var $this = $(this),
					bgColor = $this.data('bgcolor');

					$this.css('background-color', bgColor);
			});
		},
		productZoomImage: function () {
			var self = this;
			// Product page zoom plugin settings
			if ($.fn.elevateZoom) {
				$('#product-zoom').elevateZoom({
					responsive: true,
					zoomType: 'inner', // lens or window can be used - options already set below
					borderColour: '#e1e1e1',
					zoomWindowPosition: 1,
					zoomWindowOffetx: 30,
					cursor: "crosshair", //
					zoomWindowFadeIn: 400,
					zoomWindowFadeOut: 250,
					lensBorderSize: 3, // lens border size
					lensOpacity: 1,
					lensColour: 'rgba(255, 255, 255, 0.5)', // lens color
					lensShape : "square", // circle lens shape can be uses
					lensSize : 200,
					scrollZoom : true
				});

				/* swap images for zoom on click event */
				$('.product-gallery').find('a').on('click', function (e) {
					var ez = $('#product-zoom').data('elevateZoom'),
						smallImg = $(this).data('image'),
						bigImg = $(this).data('zoom-image');

						ez.swaptheimage(smallImg, bigImg);
					e.preventDefault();
				});
			}
		},
		selectBox: function () {
			// Custom select box via selectbox plugin
			// Be sure to include jquery.selectbox.css and jquery.selectbox.min.js files
			if ($.fn.selectbox) {
				$('.selectbox').selectbox({
					effect: "fade"
				});
			}
			
		},
		boostrapSpinner: function () {
			// Custom spinners
			// Include jquery.bootstrap-touchspin.min.min.js file

			if ($.fn.TouchSpin) {
				// Vertical Spinner
				$(".vertical-spinner").TouchSpin({
					verticalbuttons: true
				});

				//Horizontal spinner
				$(".horizontal-spinner").TouchSpin();
			}
		},
		dateTimePicker: function () {
			// Date Time Picker
			// Include jquery.bootstrap-datetimepicker.min.min.js file

			if ($.fn.datetimepicker) {
				// Both date and time picker
				$('.form-datetime').datetimepicker({
			        weekStart: 1,
			        todayBtn:  1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					forceParse: 0,
			        showMeridian: 1
			    });

				// Date picker
				$('.form-date').datetimepicker({
			        weekStart: 1,
			        todayBtn:  1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					minView: 2,
					forceParse: 0
			    });

				// Time picker
				$('.form-time').datetimepicker({
			        weekStart: 1,
			        todayBtn:  1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 1,
					minView: 0,
					maxView: 1,
					forceParse: 0
			    });
			}
		},
		tooltip: function () {
			// Bootstrap tooltip
			if($.fn.tooltip) {
				$('.add-tooltip').tooltip();
			}
		},
		popover: function () {
			// Bootstrap tooltip
			if($.fn.popover) {
				$('.add-popover').popover({
					trigger: 'focus'
				});
			}
		},
		servicesHover: function () {
			/* Service Hover animation with animate.css */
			$('.service-hover').on('mouseover', function () {
				$.each($(this).find('.service-icon, .service-title, p'), function () {
					var animationClass= $(this).data('hover-anim');
					$(this).addClass('animated ' + animationClass);
				});
			}).on('mouseleave', function () {
				$.each($(this).find('.service-icon, .service-title, p'), function () {
					var animationClass= $(this).data('hover-anim');
					$(this).removeClass('animated ' + animationClass);
				});
			});
		},
		countTo: function () {
			// CountTo plugin used count animations for homepages
			if ($.fn.countTo) {
				if ($.fn.waypoint) {
					$('.count').waypoint(function () {
						$(this).countTo();
					}, {
						offset: function() {
							return ( $(window).height() - 100);
						},
						triggerOnce: true 
					});
				} else {
					$('.count').countTo();
				}	
			} else { 
				// fallback if count plugin doesn't included
				// Get the data-to value and add it to element
				$('.count').each(function () {
					var $this = $(this),
						countValue = $this.data('to');

						$this.text(countValue);
				});
			}
		},
		newsletterPopup : function () {
			// Newsletter form popup - require magnific-popup plugin on page load

			if ( document.getElementById('newsletter-popup-form') ) {
				jQuery.magnificPopup.open({
					items: {
						src: '#newsletter-popup-form'
					},
					type: 'inline'
				}, 0);
			}

		},
		lightBox: function () {
			/* Popup for gallery items and videso and etc.. */
			/* magnific-popup.css and jquery.magnific.popup.mi.js files need to be included */

			/* This is for gallery images */
			$('.popup-gallery').magnificPopup({
				delegate: '.zoom-item',
				type: 'image',
				closeOnContentClick: false,
				closeBtnInside: false,
				mainClass: 'mfp-with-zoom mfp-img-mobile',
				image: {
					verticalFit: true,
					titleSrc: function(item) {
						return item.el.attr('title') + '&nbsp;&nbsp;<a class="image-source-link" href="'+item.el.attr('href')+'" target="_blank">source &rarr;</a>';
					}
				},
				gallery: {
					enabled: true
				},
				zoom: {
					enabled: true,
					duration: 400, // Duration for zoom animation 
					opener: function(element) {
						return element.find('img');
					}
				}
			});

			/* Image Popup */
			$('.popup-image').magnificPopup({
				type: 'image',
				closeOnContentClick: true,
				closeBtnInside: false,
				fixedContentPos: true,
				mainClass: 'mfp-with-zoom mfp-img-mobile',
				image: {
					verticalFit: true
				},
				zoom: {
					enabled: true,
					duration: 400
				}
			});

			/* This is for iframe - youtube - vimeo videos - goole maps  with fade animation */
			$('.popup-iframe').magnificPopup({
				disableOn: 700,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,
				fixedContentPos: false
			});
		},
		videoBg: function () {
			// for index7.html 
			// This plugin doesnt work on mobile devices
			if (!this.mobile) {
				if ($.fn.mb_YTPlayer) {
					$(".player").mb_YTPlayer();
				} else {
					return;
				}
			}
		},
		progressBars: function () {
			var self = this;
			// Calculate and Animate Progress 
			// With waypoing plugin calculate width of the progress bar
			if ($.fn.waypoint) {
				$('.progress-animate').waypoint(function () {
					if (!$(this).hasClass('circle-progress')) {
						var $this = $(this),
							progressVal = $(this).data('width'),
							progressText = $this.find('.progress-text, .progress-tooltip');

						$this.css({ 'width' : progressVal + '%'}, 400);

						setTimeout(function() {
							progressText.fadeIn(400, function () {
								$this.removeClass('progress-animate');
							});
						}, 100);
						
					} else {
						// Animate knob --- Circle progrss bars
						self.animateKnob();
					}
				}, {
					offset: function() {
						return ( $(window).height() - 10);
					}
				});
				
			} else {
				// Fallback if the waypoint plugin isn't included
				// Get the value and calculate width of progress bar
				$('.progress-animate').each(function () {
					var $this = $(this),
						progressVal = $(this).data('width'),
						progressText = $this.find('.progress-text');

					$this.css({ 'width' : progressVal + '%'}, 400);
					progressText.fadeIn(500);
				});
			}
		},
		registerKnob: function() {
			// Register knob plugin
			if ($.fn.knob) {
				$('.knob').knob({
					bgColor : '#eaeaea'
				});

				$('.knob.whitebg').knob({
					bgColor : '#fff'
				});
			}
		},
		animateKnob: function() {
			// Animate knob
			if ($.fn.knob) {
				$('.knob').each(function() {
					var $this = $(this),
						container = $this.closest('.progress-animate'),
						animateTo = $this.data('animateto'),
						animateSpeed = $this.data('animatespeed')
					$this.animate(
			                { value: animateTo }, 
			                {   duration: animateSpeed,
			                    easing: 'swing',
		                    progress: function() {
		                      $this.val(Math.round(this.value)).trigger('change');
		                    },
		                    complete: function () {
		                    	container.removeClass('progress-animate');
		                    }
	               		});

				});
			}
		},
		mediaElement: function () {
			/* Media element plugin for video and audio support and styling */
			$('video, audio').mediaelementplayer();
		},
		scrollAnimations: function () {

			/* 	// Wowy Plugin
				Add Html elements wow and animation class 
				And you can add duration via data attributes
				data-wow-duration: Change the animation duration
				data-wow-delay: Delay before the animation starts
				data-wow-offset: Distance to start the animation (related to the browser bottom)
				data-wow-iteration: Number of times the animation is repeated
			*/

			// Check for class WOW // You need to call wow.min.js and animate.css for scroll animations to work
			if (typeof WOW === 'function') {
				new WOW({
					boxClass:     'wow',      // default
					animateClass: 'animated', // default
					offset:       0          // default
				}).init();
			}

		},
		flickerFeed: function () {
			/* Flickr feed plugin - Sidebar */
			if ($.fn.jflickrfeed) {
				$('ul.flickr-widget-two').jflickrfeed({
					limit: 8,
					qstrings: {
						id: '54297118@N03' // change with you flickr id
					},
					itemTemplate: '<li>' + '<a href="{{image}}" title="{{title}}">' + '<img src="{{image_s}}" alt="{{title}}" />' + '</a>' + '</li>'
				});

				$('ul.flickr-widget-three').jflickrfeed({
					limit: 15,
					qstrings: {
						id: '54297118@N03' // change with you flickr id
					},
					itemTemplate: '<li>' + '<a href="{{image}}" title="{{title}}">' + '<img src="{{image_s}}" alt="{{title}}" />' + '</a>' + '</li>'
				});
				
			}
		},
		attachBg: function () {
			// Attach background for sections via data-bgattach attribute
			var sectionBg = $('[data-bgattach]');

			$.each(sectionBg, function () {
				if ($(this).data('bgattach')){
		            $(this).css('background-image', 'url(' + $(this).data('bgattach') + ')');
		        }
			});
		},
		parallax: function () {
			// Parallax - if not mobile  with skrollr js plugin 
			if ( !this.mobile && typeof skrollr === 'object') {
				skrollr.init({
					forceHeight: false
				});
			} 

			if ( this.mobile ) {
				/* if mobile, delete background attachment fixed from parallax class */
				$('.parallax, .parallax-fixed').css('background-attachment', 'initial')
			}

		},
		isotopeActivate: function() {
			
			// if($.fn.isotope) {
			// 	var container = this.container,
			// 		layoutMode = container.data('layoutmode');

			// 	container.isotope({
   //              	itemSelector: '.portfolio-item',
   //              	layoutMode: (layoutMode) ? layoutMode : 'masonry',
   //              	transitionDuration: 0
   //          	});

            	
			// }
		},
		isotopeReinit: function () {
			// Recall for isotope plugin
			if($.fn.isotope) {
				this.container.isotope('destroy');
				this.isotopeActivate();
			}
		},
		isotopeFilter: function () {
			// Isotope plugin filter handle
			var self = this,
				filterContainer = $('#portfolio-filter');

			filterContainer.find('a').on('click', function(e) {
				var $this = $(this),
					selector = $this.attr('data-filter');

				filterContainer.find('.active').removeClass('active');

				// And filter now
				self.container.isotope({
					filter: selector,
					transitionDuration: '0.8s'
				});
				
				$this.closest('li').addClass('active');
				e.preventDefault();
			});
		},
		blogMasonry: function () {
			/* Masonry - Grid for blog pages with isotope.pkgd.min.js file */

			// This property is defined at the top of the file
			var blogContainer = this.blogContainer;

			blogContainer.isotope({
				itemSelector: '.entry',
				lasyoutMode: 'fitRows',
				masonry: {
					gutter: 15
				},
				transitionDuration: 0
			});
		},
		blogMasonryRefresh: function () {
			this.blogContainer.isotope('layout');
		},
		infiniteScroll: function (itemContainer, itemSelector) {
			if ($.fn.infinitescroll) {
				itemContainer.infinitescroll({
	                navSelector  : '#page-nav',    // selector for the paged navigation 
	                nextSelector : '#page-nav a:first',  // selector for the NEXT link (to page 2)
	                itemSelector : itemSelector,     // selector for all items you'll retrieve
	                loading: {
	                	msgText: 'Loading Posts...',
	                	finishedMsg: 'No more post to load.',
	                	img: '//eonythemes.com/themes/t/images/load.GIF' //images/load.gif // you need to give fullpath tp gif
	                }
	            }, function (newElements) {
					itemContainer.isotope('appended', $(newElements)).isotope('layout');
		            }
	        	);

				/* Unbind for manual trigger */
				if ($('#infinite-trigger').length) {
					$(window).unbind('.infscr');

	        		$('#infinite-trigger').on('click', function (e) {
	        			itemContainer.infinitescroll('retrieve');
	        			e.preventDefault();
	        		});

	        		$(document).ajaxError(function(e,xhr,opt){
	        			if(xhr.status==404)$('a#infinite-trigger').addClass('disabled');
	        		});
				}
        		
			}
		}

	};

	Boss.init();

	// Load Event
	$(window).on('load', function() {
		/* Trigger side menu scrollbar */
		Boss.sideMenuScrollbar();

		/* Small fix (vertical margin between masonry posts)
		index blog homepages refresh layout */
		if (Boss.blogContainer.length) {
			Boss.blogMasonryRefresh();
		}

	});

	// Scroll Event
	$(window).on('scroll', function () {
		/* Display Scroll to Top Button */
		Boss.scrollTopBtnAppear();

		/* Fix for header search for fixed header */
		Boss.headerSearchScrollFix();

	});

	// Resize Event 
	// Smart resize if plugin not found window resize event
	if($.event.special.debouncedresize) {
		$(window).on('debouncedresize', function() {

			/* Full Height recall */
			Boss.fullHeight();

			/*Destroy sticky menu for mobile */
			Boss.destroyStickyMenu();

	    });
	} else {
		$(window).on('resize', function () {
			
			/* Full Height recall */
			Boss.fullHeight();

			/*Destroy sticky menu for mobile */
			Boss.destroyStickyMenu();

		});
	}

})(jQuery);