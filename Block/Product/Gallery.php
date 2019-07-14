<?php
/**
 * Copyright © Rob Aimes - https://aimes.dev
 */

namespace Aimes\Notorama\Block\Product;

use Magento\Catalog\Block\Product\Context;
use Magento\Catalog\Block\Product\View\Gallery as MagentoGallery;
use Magento\Catalog\Model\Product\Gallery\ImagesConfigFactoryInterface;
use Magento\Catalog\Model\Product\Image\UrlBuilder;
use Magento\Framework\Json\EncoderInterface;
use Magento\Framework\Serialize\Serializer\Json as JsonEncoder;
use Magento\Framework\Stdlib\ArrayUtils;

class Gallery extends MagentoGallery
{
    /**
     * @var JsonEncoder
     */
    protected $encoder;

    /**
     * Gallery constructor.
     * @param Context $context
     * @param ArrayUtils $arrayUtils
     * @param EncoderInterface $jsonEncoder
     * @param JsonEncoder $encoder
     * @param array $data
     * @param ImagesConfigFactoryInterface|null $imagesConfigFactory
     * @param array $galleryImagesConfig
     * @param UrlBuilder|null $urlBuilder
     */
    public function __construct(
        Context $context,
        ArrayUtils $arrayUtils,
        EncoderInterface $jsonEncoder,
        JsonEncoder $encoder,
        array $data = [],
        ImagesConfigFactoryInterface $imagesConfigFactory = null,
        array $galleryImagesConfig = [],
        UrlBuilder $urlBuilder = null
    ) {
        parent::__construct($context, $arrayUtils, $jsonEncoder, $data, $imagesConfigFactory, $galleryImagesConfig, $urlBuilder);
        $this->encoder = $encoder;
    }

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

    /**
     * @return string
     */
    public function getJsConfig() : string
    {
        return $this->encoder->serialize([
           'initialImages' => $this->getGalleryImagesJson()
        ]);
    }
}
