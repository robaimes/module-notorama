<?php
/**
 * Copyright © Rob Aimes - https://aimes.dev
 */

declare(strict_types=1);

namespace Aimes\Notorama\Block\Product;

use Magento\Catalog\Block\Product\View\Gallery as MagentoGallery;

/**
 * Class Gallery
 * @package Aimes\Notorama\Block\Product
 */
class Gallery extends MagentoGallery
{
    /**
     * @return 0|array
     */
    public function getPlaceholderGalleryImages()
    {
        return array_slice($this->getGalleryImages()->getItems(), 0, 4);
    }

    /**
     * @return mixed
     */
    public function getPlaceholderImage()
    {
        return $this->getGalleryImages()->getFirstItem()->getData('medium_image_url');
    }

    /**
     * @return mixed
     */
    public function getPlaceholderImageCaption()
    {
        return $this->getGalleryImages()->getFirstItem()->getData('label');
    }
}
