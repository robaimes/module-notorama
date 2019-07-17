/**
 * Copyright © Rob Aimes - https://aimes.dev
 */

define([
    'jquery',
    'notorama',
    'jquery/ui',
], function ($) {
    'use strict';

    return function (configurable) {
        $.widget('mage.configurable', configurable, {
            options: {
                notoramaGallery: '#notorama-gallery'
            },

            _changeProductImage: function () {
                var images = this.options.spConfig.images[this.simpleProduct];

                this._reloadGallery(images);
            },

            _reloadGallery: function (images) {
                $(this.options.notoramaGallery).notorama('reloadGallery', images);
            }
        });

        return $.mage.configurable;
    };
});
