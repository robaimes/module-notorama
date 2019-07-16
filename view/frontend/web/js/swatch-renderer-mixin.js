/**
 * Copyright © Rob Aimes - https://aimes.dev
 */

define([
    'jquery',
    'jquery/ui',
    'notorama'
], function ($) {
    'use strict';

    return function (swatchRenderer) {
        $.widget('mage.SwatchRenderer', swatchRenderer, {
            options: {
                notoramaGallery: '#notorama-gallery'
            },

            _loadMedia: function (eventName) {
                if (this.options.useAjax) {
                    this._debouncedLoadProductMedia();
                } else {
                    var images = this.options.jsonConfig.images[this.getProduct()];

                    this._reloadGallery(images);

                }
            },

            _changeProductImage: function () {
                var images = this.options.spConfig.images[this.simpleProduct];

                this._reloadGallery(images);
            },

            _reloadGallery: function (images) {
                $(this.options.notoramaGallery).notorama('reloadGallery', images);
            }
        });

        return $.mage.SwatchRenderer;
    };
});
