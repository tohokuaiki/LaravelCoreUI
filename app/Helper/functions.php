<?php
// Helper global functions.

/**
 * 
 * ファイルサイズをphp.iniで許可された単位付きにする。（あるいはその逆）
 * 
 * @param int | string  $size ファイルサイズ(数字 or php.iniで許可された単位付きファイルサイズ)
 * @param boolean $reverse true なら 単位付き => 数字
 * @return string | int ファイルサイズ(数字 or php.iniで許可された単位付きファイルサイズ)
 */
function iniFilesizeStr($size, $reverse = false)
{
    $units = ['B', 'K', 'M', 'G'];
    if (! $reverse) {
        $i = intval(floor(log($size, 1024)));
        if ($i == 0) return $size;
        if ($i >= count($units)) {
            $i = count($units) - 1;
        }
        $unit = $size / pow(1024, $i);
        // 小数点以下2桁までに丸めて、単位とともに返す
        return round($unit, 2) . $units[$i];
    } else {
        $size = str_replace(" ", "", $size);
        foreach ($units as $i => $unit) {
            if (strlen($size) -1  === strrpos($size, $unit)) {
                if ($i === 0) {
                    return $size;
                }
                return (1024 ** $i) * (substr($size, 0, strlen($size) - 1));
            }
        }
        return $size;
    }
}
