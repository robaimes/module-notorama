<?php
/**
 * Copyright © Rob Aimes - https://aimes.dev
 */

declare(strict_types=1);

namespace Aimes\Notorama\ViewModel\Product;

use Magento\Framework\Serialize\Serializer\Json as JsonEncoder;
use Magento\Framework\View\ConfigInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;

/**
 * Class Gallery
 * @package Aimes\Notorama\ViewModel\Product
 */
class Gallery implements ArgumentInterface
{
    const MODULE_NAME = 'Aimes_Notorama';

    /**
     * @var JsonEncoder
     */
    private $encoder;

    /**
     * View config model
     *
     * @var ConfigInterface
     */
    protected $config;

    /**
     * Gallery constructor.
     * @param JsonEncoder $encoder
     * @param ConfigInterface $config
     */
    public function __construct(
        JsonEncoder $encoder,
        ConfigInterface $config
    ) {
        $this->encoder = $encoder;
        $this->config = $config;
    }

    /**
     * @param string $initialImagesJson
     * @return string
     */
    public function getJsConfig(string $initialImagesJson) : string
    {
        return $this->encoder->serialize([
            'initialImages' => $initialImagesJson,
            'zoom' => $this->isZoomEnabled(),
            'viewerOptions' => [
                'arrows' => $this->isViewerArrowsEnabled(),
                'dots' => $this->isDotsEnabled(),
                'lazyload' => $this->isViewerLazyloadEnabled(),
                'fade' => $this->isViewerFadeEnabled(),
                'caption' => $this->isViewerCaptionEnabled()
            ],
            'carouselOptions' => [
                'vertical' => (bool)$this->getIsVertical(),
                'arrows' => $this->isCarouselArrowsEnabled(),
                'slidesToShow' => $this->getCarouselSlidesToShow(),
                'centerMode' => $this->isCarouselCenterMode()
            ],
            'lightboxOptions' => [
                'slick' => [
                    'fade' => $this->isLightBoxFadeEnabled(),
                    'arrows' => $this->isLightBoxArrowsEnabled(),
                    'lazyload' => $this->isLightBoxLazyloadEnabled(),
                    'caption' => $this->isLightBoxCaptionEnabled()
                ]
            ]
        ]);
    }

    // General

    /**
     * @param $var
     * @param string $module
     * @return array|false|string
     */
    private function getConfigValue($var, $module = self::MODULE_NAME)
    {
        return $this->config->getViewConfig()->getVarValue($module, $var);
    }

    // Viewer

    public function isViewerArrowsEnabled() : bool
    {
        return $this->getConfigValue('gallery/viewer/arrows');
    }

    public function isDotsEnabled() : bool
    {
        return $this->getConfigValue('gallery/viewer/dots');
    }

    private function isViewerFadeEnabled() : bool
    {
        return $this->getConfigValue('gallery/viewer/fade');
    }

    private function isViewerLazyloadEnabled() : bool
    {
        return $this->getConfigValue('gallery/viewer/lazyload');
    }

    private function isViewerCaptionEnabled() : bool
    {
        return $this->getConfigValue('gallery/viewer/caption');
    }

    // Carousel

    public function getIsVertical() : bool
    {
        return $this->getConfigValue('gallery/carousel/vertical');
    }

    public function getCarouselSlidesToShow() : int
    {
        return (int) $this->getConfigValue('gallery/carousel/slides_to_show');
    }

    public function isCarouselArrowsEnabled() : bool
    {
        return $this->getConfigValue('gallery/carousel/arrows');
    }

    private function isCarouselCenterMode() : bool
    {
        return $this->getConfigValue('gallery/carousel/center');
    }

    // Lightbox / fullscreen

    private function isLightBoxArrowsEnabled() : bool {
        return $this->getConfigValue('gallery/lightbox/arrows');
    }

    private function isLightBoxFadeEnabled() : bool {
        return $this->getConfigValue('gallery/lightbox/fade');
    }

    private function isLightBoxLazyloadEnabled() : bool {
        return $this->getConfigValue('gallery/lightbox/lazyload');
    }

    private function isLightBoxCaptionEnabled() : bool {
        return $this->getConfigValue('gallery/lightbox/caption');
    }

    // Zoom

    public function isZoomEnabled() : bool
    {
        return $this->getConfigValue('gallery/zoom/enabled');
    }

    public function getZoomPosition() : string
    {
        return $this->getConfigValue('gallery/zoom/position');
    }
}
