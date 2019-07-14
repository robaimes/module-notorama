# Aimes_Notorama

Magento 2 module: Remove's Fotorama and, hopefully, headaches.

Replaces the Magento 2 standard Fotorama gallery with a slick variant, as also used in PageBuilder for Magento Commerce stores.

WARNING:
--------
This module is currently considered unstable and should not be used outside of development.
* This project is still a work in progress. There are currently no options available through layout arguments or view.xml as intended.
* CSS is added via the layout `<head>` argument which is bad and will be moved to `_module.less` in future.

Features
------------
* Replaces / Removes Fotorama
* Uses [slick](https://kenwheeler.github.io/slick/) (Magento PageBuilder also uses this)
* Uses [slick lightbox](https://github.com/mreq/slick-lightbox) for fullscreen image viewing 
* Adds placeholder / preview content before the Gallery fully initialises, leading to a much smoother page load experience
* Images that are not immediately visible on the page are lazyloaded appropriately
* Supports video from YouTube and Vimeo
* Only initialises `iframe` elements when the relevant video thumbnail is clicked (and automatically plays the video to save clicking twice!)
* Moderately flexible styling, although the base CSS still needs work