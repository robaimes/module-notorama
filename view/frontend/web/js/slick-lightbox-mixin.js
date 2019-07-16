/**
 * Copyright © Rob Aimes - https://aimes.dev
 */

define([
    'jquery',
    'mage/utils/wrapper'
], function ($, wrapper) {
    'use strict';

    return function (SlickLightbox) {

        /** Override place-order-mixin for set-payment-information action as they differs only by method signature */
        return wrapper.wrap(SlickLightbox, function (originalAction) {

            originalAction.createModalItems = function () {
                /* Creates individual slides to be used with slick. If `options.images` array is specified, it uses it's contents, otherwise loops through elements' `options.itemSelector`. */
                var $items, createItem, itemTemplate, lazyPlaceholder, length, links;
                lazyPlaceholder = this.options.lazyPlaceholder || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                itemTemplate = function (source, caption, lazy, placeholder) {
                    var imgSourceParams;
                    if (lazy === true) {
                        imgSourceParams = ' data-lazy="' + source + '" src="' + lazyPlaceholder + '" ';
                    } else {
                        imgSourceParams = ' src="' + source + '" ';
                    }

                    // The video implementation is custom as lightbox library does not support it
                    // Custom code begins here
                    var videoService,
                        isVideo = false;

                    if(source.indexOf('vimeo.com') !== -1) {
                        isVideo = true;
                        videoService = 'vimeo';
                    } else if (source.indexOf('youtube.com') !== -1) {
                        isVideo = true;
                        videoService = 'youtube';
                    }

                    if (isVideo) {
                        return '<div class="slick-lightbox-slick-item">\n  <div class="slick-lightbox-slick-item-inner video ' + videoService + '">\n    <iframe frameborder="0" allowfullscreen src="' + source + '" class="slick-lightbox-slick-img" height="1080" width="1920"></iframe>\n    ' + caption + '\n  </div>\n</div>';
                    }
                    // Custom code ends

                    return '<div class="slick-lightbox-slick-item">\n  <div class="slick-lightbox-slick-item-inner">\n    <img class="slick-lightbox-slick-img" ' + imgSourceParams + ' />\n    ' + caption + '\n  </div>\n</div>';
                };
                if (this.options.images) {
                    links = $.map(this.options.images, function (_this) {
                        return function (img) {
                            return itemTemplate(img, _this.options.lazy);
                        };
                    }(this));
                } else {
                    $items = this.filterOutSlickClones(this.$element.find(this.options.itemSelector));
                    length = $items.length;
                    createItem = function (_this) {
                        return function (el, index) {
                            var caption, info, src, placeholder;
                            info = {
                                index: index,
                                length: length
                            };
                            caption = _this.getElementCaption(el, info);
                            src = _this.getElementSrc(el);
                            placeholder = $(el).attr('src');
                            return itemTemplate(src, caption, _this.options.lazy, placeholder); //4th parameter is custom, adds placeholder image
                        };
                    }(this);
                    links = $.map($items, createItem);
                }
                return links;
            };

            return originalAction();
        });
    };
});