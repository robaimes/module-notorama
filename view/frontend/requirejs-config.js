/**
 * Copyright © Rob Aimes - https://aimes.dev
 */

var config = {
    map: {
        '*': {
            "notorama": 'Aimes_Notorama/js/notorama',
            'vimeo/player': '//player.vimeo.com/api/player.js'
        }
    },
    config: {
        mixins: {
            'Magento_ConfigurableProduct/js/configurable': {
                'Aimes_Notorama/js/configurable-mixin': true
            },
            'Magento_Swatches/js/swatch-renderer': {
                'Aimes_Notorama/js/swatch-renderer-mixin': true
            },
            'Aimes_Notorama/js/slick-lightbox': {
                'Aimes_Notorama/js/slick-lightbox-mixin' : true
            }
        }
    }
};
