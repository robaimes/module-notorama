<?php
/**
 * Copyright © Rob Aimes - https://aimes.dev
 */

declare(strict_types=1);

namespace Aimes\Notorama\ViewModel\Product;

use Magento\Framework\Serialize\Serializer\Json as JsonEncoder;
use Magento\Framework\View\Element\Block\ArgumentInterface;

/**
 * Class Gallery
 * @package Aimes\Notorama\ViewModel\Product
 */
class Gallery implements ArgumentInterface
{
    /**
     * @var JsonEncoder
     */
    private $encoder;

    /**
     * Gallery constructor.
     * @param JsonEncoder $encoder
     */
    public function __construct(
        JsonEncoder $encoder
    ) {
        $this->encoder = $encoder;
    }

    /**
     * @param string $initialImagesJson
     * @return string
     */
    public function getJsConfig(string $initialImagesJson) : string
    {
        return $this->encoder->serialize([
            'initialImages' => $initialImagesJson
        ]);
    }
}
