<?php
namespace App\Http\Requests\Filters;

use \Elegant\Sanitizer\Contracts\Filter;

/**
 * Class Zentohan
 */
class Zentohan implements Filter
{
    /**
     * @param mixed $value
     * @param array $options
     * @return mixed|string|string[]
     */
    public function apply($value, $options = [])
    {
        return mb_convert_kana($value, 'KVa', 'UTF-8');
    }
}
