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
            'enableBreakpoints' => $this->isBreakpointsEnabled(),
            'zoom' => $this->isZoomEnabled(),
            'viewerOptions' => [
                'arrows' => $this->isViewerArrowsEnabled(),
                'dots' => $this->isDotsEnabled(),
                'lazyload' => $this->isViewerLazyloadEnabled(),
                'fade' => $this->isViewerFadeEnabled(),
                'caption' => $this->isViewerCaptionEnabled(),
                'responsive' => $this->getBreakpoints('viewer')
            ],
            'carouselOptions' => [
                'vertical' => (bool)$this->getIsVertical(),
                'arrows' => $this->isCarouselArrowsEnabled(),
                'slidesToShow' => $this->getCarouselSlidesToShow(),
                'centerMode' => $this->isCarouselCenterMode(),
                'responsive' => $this->getBreakpoints('carousel')
            ],
            'lightboxOptions' => [
                'slick' => [
                    'fade' => $this->isLightBoxFadeEnabled(),
                    'arrows' => $this->isLightBoxArrowsEnabled(),
                    'lazyload' => $this->isLightBoxLazyloadEnabled(),
                    'caption' => $this->isLightBoxCaptionEnabled(),
                    'responsive' => $this->getBreakpoints('lightbox')
                ]
            ]
        ]);
    }

    /**
     * @param $var
     * @param string $module
     * @return array|bool|string
     */
    private function getConfigValue($var, $module = self::MODULE_NAME)
    {
        return $this->config->getViewConfig()->getVarValue($module, $var);
    }

    /**
     * @return bool
     */
    public function isViewerArrowsEnabled() : bool
    {
        return $this->getConfigValue('gallery/viewer/arrows');
    }

    /**
     * @return bool
     */
    public function isDotsEnabled() : bool
    {
        return $this->getConfigValue('gallery/viewer/dots');
    }

    /**
     * @return bool
     */
    private function isViewerFadeEnabled() : bool
    {
        return $this->getConfigValue('gallery/viewer/fade');
    }

    /**
     * @return bool
     */
    private function isViewerLazyloadEnabled() : bool
    {
        return $this->getConfigValue('gallery/viewer/lazyload');
    }

    /**
     * @return bool
     */
    private function isViewerCaptionEnabled() : bool
    {
        return $this->getConfigValue('gallery/viewer/caption');
    }

    /**
     * @return bool
     */
    public function getIsVertical() : bool
    {
        return $this->getConfigValue('gallery/carousel/vertical');
    }

    /**
     * @return int
     */
    public function getCarouselSlidesToShow() : int
    {
        return (int) $this->getConfigValue('gallery/carousel/slidesToShow');
    }

    /**
     * @return bool
     */
    public function isCarouselArrowsEnabled() : bool
    {
        return $this->getConfigValue('gallery/carousel/arrows');
    }

    /**
     * @return bool
     */
    private function isCarouselCenterMode() : bool
    {
        return $this->getConfigValue('gallery/carousel/center');
    }

    /**
     * @return bool
     */
    private function isLightBoxArrowsEnabled() : bool {
        return $this->getConfigValue('gallery/lightbox/arrows');
    }

    /**
     * @return bool
     */
    private function isLightBoxFadeEnabled() : bool {
        return $this->getConfigValue('gallery/lightbox/fade');
    }

    /**
     * @return bool
     */
    private function isLightBoxLazyloadEnabled() : bool {
        return $this->getConfigValue('gallery/lightbox/lazyload');
    }

    /**
     * @return bool
     */
    private function isLightBoxCaptionEnabled() : bool {
        return $this->getConfigValue('gallery/lightbox/caption');
    }

    /**
     * @return bool
     */
    public function isZoomEnabled() : bool
    {
        return $this->getConfigValue('gallery/zoom/enabled');
    }

    /**
     * @return string
     */
    public function getZoomPosition() : string
    {
        return $this->getConfigValue('gallery/zoom/position');
    }

    /**
     * @return bool
     */
    public function isBreakpointsEnabled() : bool
    {
        return $this->getConfigValue('gallery/enable_breakpoints');
    }

    /**
     * @param string $elementName
     * @return array
     */
    public function getBreakpoints(string $elementName) : array
    {
        $breakpoints = [];

        if ($this->isBreakpointsEnabled()) {
            foreach ($this->getConfigValue('breakpoints') as $breakpoint) {
                if (key_exists($elementName, $breakpoint)) {
                    $breakpoints[] = [
                        'breakpoint' => (int)$breakpoint['min-width'],
                        'settings' => $breakpoint[$elementName]
                    ];
                }
            }
        }

        return $breakpoints;
    }
}
