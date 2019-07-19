/**
 * Copyright © Rob Aimes - https://aimes.dev
 */

/**
 * Lots of functions to separate the code in a semi-neat fashion, and to allow easy access for mixins.
 */

define([
    'jquery',
    'vimeo/player',
    'jquery/ui',
    'Aimes_Notorama/js/vendor/slick',
    'Aimes_Notorama/js/vendor/slick-lightbox-custom',
], function ($, Vimeo) {
    'use strict';

    var viewerSelector = '#notorama-viewer',
        carouselSelector = '#notorama-carousel',
        galleryDots = '#notorama-dots',
        nextArrowHtml = '<button type="button" class="slick-arrow slick-next"><svg viewBox="0 0 32 32" width="32" height="32"><path d="m 12.59,20.34 4.58,-4.59 -4.58,-4.59 1.41,-1.41 6,6 -6,6 z" fill="currentColor"></path></svg></button>',
        prevArrowHtml = '<button type="button" class="slick-arrow slick-prev"><svg viewBox="0 0 32 32" width="32" height="32"><path d="M 19.41,20.09 14.83,15.5 19.41,10.91 18,9.5 l -6,6 6,6 z" fill="currentColor"></path></svg></button>';

    $.widget('aimes.notorama', {
        options: {
            initialImages: [],
            images: null,
            zoom: true,
            viewerOptions: {
                asNavFor: carouselSelector,
                rows: 0,
                slidesToShow: 1,
                slidesToScroll: 1,
                lazyLoad: 'ondemand',
                nextArrow: nextArrowHtml,
                prevArrow: prevArrowHtml,
                dots: true,
                appendDots: '#notorama-dots',
                mobileFirst: true
            },
            carouselOptions: {
                asNavFor: viewerSelector,
                rows: 0,
                slidesToShow: 4,
                slidesToScroll: 1,
                lazyLoad: 'ondemand',
                nextArrow: nextArrowHtml,
                prevArrow: prevArrowHtml,
                mobileFirst: true,
                vertical: true
            },
            lightboxOptions: {
                src: 'data-fullscreen-src',
                rows: 0,
                lazy: true,
                itemSelector: '.slick-item img, .slick-item iframe, .slick-item .iframe-loader',
                slick: {
                    nextArrow: nextArrowHtml,
                    prevArrow: prevArrowHtml,
                    mobileFirst: true
                },
                shouldOpen: function(slickLightbox, element){
                    return !element.hasClass('iframe-loader');
                },
                useHistoryApi: true,
                imageMaxHeight: 1.1 // I don't know either...
            }
        },

        galleryViewer: '',
        galleryCarousel: '',
        galleryDots: '',
        images: '',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/',
        vimeoEmbedUrl: 'https://player.vimeo.com/video/',

        /**
         * Constructor
         * @private
         */
        _create: function () {
            var self = this;

            self.galleryViewer = $(viewerSelector);
            self.galleryCarousel = $(carouselSelector);
            self.galleryDots = $(galleryDots);
            self.initialImages = JSON.parse(this.options.initialImages);
            self.images = this.options.images;

            this._initImages();
            this.options.zoom ? this._initZoom() : null;

            this.validateSettings();
            this.clearPlaceholderData();
        },

        _initImages: function () {
            var self = this;

            this.options.images ?
                self.images = this.options.images :
                self.images = this.options.initialImages;

            typeof self.images === 'string' ?
                self.images = JSON.parse(self.images) : '';
        },

        _init: function() {
            this._initGalleryItems();
            this._initSlick();
            this._initSlickLightbox();

            this._initVideoEvents();

            this.element.removeClass('loading');
        },

        _initGalleryItems: function() {
            for (var i = 0; i < this.images.length; i++) {
                if (this.images[i].type === 'image') {
                    this.galleryViewer.append(this.renderViewerImage(this.images[i]));
                    this.galleryCarousel.append(this.renderCarouselImage(this.images[i]));
                } else {
                    this.galleryViewer.append(this.renderViewerVideo(this.images[i]));
                    this.galleryCarousel.append(this.renderCarouselVideo(this.images[i]));
                }
            }
        },

        _initSlick: function() {
            this.galleryViewer.slick(this.options.viewerOptions);
            this.galleryCarousel.slick(this.options.carouselOptions);

            this._initCarouselClickFunctions();
        },

        _initSlickLightbox: function() {
            this.galleryViewer.slickLightbox(this.options.lightboxOptions);
            this._initModalEvents();
        },

        _initModalEvents: function() {
            $('body').on({
                'show.slickLightbox': function () {
                    $('body').addClass('lightbox-open');
                },
                'hide.slickLightbox': function () {
                    $('body').removeClass('lightbox-open');
                }
            });
        },

        _initCarouselClickFunctions: function () {
            var carouselItems = $(carouselSelector + ' .slick-item');

            $.each(carouselItems, function (i, element) {
                $(element).on('click', function () {
                    $(viewerSelector).slick('slickGoTo', $(this).data('slick-index'));
                })
            })
        },

        _initBreakpoints: function() {
            // Try to use slick breakpoints options if possible. Failing that, enquire.
        },

        _initZoom: function() {
            var self = this;

            $('.notorama-zoom').on('click', function () {
                var imageIndex = self.galleryViewer.find('.slick-active').data('slick-index');
                self.galleryViewer.get(0).slickLightbox.init(imageIndex);
            });
        },

        _initVideoEvents: function () { // Pause video when slide is changed or zoom/fullscreen opened
            $('body').on('show.slickLightbox beforeChange', function() { // Using body selector to account for lightbox modal
                $('.slick-item.video.vimeo iframe, .slick-lightbox-slick-item-inner.vimeo iframe').each(function () {
                    var iframe = new Vimeo(this);
                    iframe.pause();
                });
                $('.slick-item.video.youtube iframe, .slick-lightbox-slick-item-inner.youtube iframe').each(function () {
                    this.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
                });
            });

            // iframe isn't initialised until the placeholder is clicked to help load time.
            this.galleryViewer.on('click', '.iframe-wrapper', function (event) {
                var parent = $(event.target).closest('.slick-item'),
                    video = parent.find('.iframe-loader'),
                    src = video.data('src'),
                    service = video.data('service');

                parent.empty();
                parent.append(`<iframe class="embed-video ${service}" allowfullscreen frameBorder="0" src="${src}" data-fullscreen-src="${src}"></iframe>`);
                parent.find('.embed-video.vimeo').on('load', function (e) {
                    var iframe = new Vimeo(this);
                    iframe.play();
                });
                parent.find('.embed-video.youtube').on('load', function (e) {
                    this.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
                });
            });
        },

        _destroy: function() {
            this.galleryViewer.unslickLightbox();
            this.galleryViewer.off('click.slickLightbox');
            this.galleryViewer.slick('unslick');
            this.galleryCarousel.slick('unslick');
        },

        clearPlaceholderData: function () {
            this.galleryViewer.empty();
            this.galleryCarousel.empty();
            this.galleryDots.empty();
        },

        renderViewerImage: function(image) {
            if (image.isMain) {
                return $(`<div class="slick-item"><img src="${image.img}" data-fullscreen-src="${image.full}" alt="${image.caption}"></div>`);
            }

            return $(`<div class="slick-item"><img data-lazy="${image.img}" data-fullscreen-src="${image.full}" alt="${image.caption}"></div>`);
        },

        renderCarouselImage: function(image) {
            return $(`<div class="slick-item"><img src="${image.thumb}" alt="${image.caption}"></div>`);
        },

        renderViewerVideo: function(video) {
            return $(`<div class="slick-item video ${this.getVideoService(video.videoUrl)}"><div class="iframe-wrapper"><img class="iframe-loader" src="${video.full}" data-service="${this.getVideoService(video.videoUrl)}" data-src="${this.getVideoEmbedUrl(video.videoUrl)}" data-fullscreen-src="${this.getVideoEmbedUrl(video.videoUrl)}" /></div></div>`);
        },

        renderCarouselVideo: function(video) {
            return $(`<div class="slick-item video"><img src="${video.thumb}" alt="${video.caption}"></div>`);
        },

        getVideoService: function(url) {
            if (url.indexOf('vimeo.com') !== -1) {
                return 'vimeo';
            }

            return 'youtube';
        },

        getVideoEmbedUrl: function (url) {
            var videoId;

            if (url.indexOf('vimeo.com') !== -1) {
                videoId = url.split('vimeo.com/').pop();
                return this.vimeoEmbedUrl + videoId +'?api=1&title=false'
            }

            if (url.indexOf('youtube.com') !== -1) {
                videoId = url.split('?v=').pop();
                return this.youtubeEmbedUrl + videoId + '?enablejsapi=1&rel=0&showinfo=0'
            }

            if (url.indexOf('youtu.be') !== -1) {
                videoId = url.split('youtube.be/').pop();
                return this.youtubeEmbedUrl + videoId + '?enablejsapi=1&rel=0&showinfo=0'
            }
        },

        /**
         * Validate the slick settings before initialising to prevent unnecessary errors.
         */
        validateSettings: function() {
            this.validateInitalisation();
            this.validateViewerFade();

            this.validateCarouselItems();
        },

        /**
         * The infinite option is useful for when there are more images than the slidesToShow value.
         * Not so much when we have equal or less. Using the finite settings prevents calculation errors and extra whitespace.
         */
        validateCarouselItems: function() {
            if (this.images.length <= this.options.carouselOptions.slidesToShow) {
                this.options.carouselOptions.slidesToShow = this.images.length;
                this.options.carouselOptions.slidesToScroll = this.images.length;
                this.options.carouselOptions.infinite = false;
            } else {
                this.options.carouselOptions.infinite = true;
            }
        },

        /**
         * The fade option only works when slidesToShow is 1.
         */
        validateViewerFade: function() {
            if (this.options.viewerOptions.fade === true) {
                this.options.viewerOptions.slidesToShow = 1;
                this.options.viewerOptions.slidesToScroll = 1;
            }
        },

        validateInitalisation: function () {
            if (this.galleryViewer.hasClass('slick-initialized')) {
                this._destroy();
            }
        },

        reloadGallery: function (images) {
            this.element.addClass('loading');
            this.options.images = images;

            this._initImages();

            this._destroy();
            this.clearPlaceholderData();

            this._init();
        }
    });

    return $.aimes.notorama;
});
