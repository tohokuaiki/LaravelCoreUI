<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('japan_city_codes', function (Blueprint $table) {
                $table->string('code', 5)->primary()->comment('標準地域コード');
                $table->string('prefecture', 8)->comment('都道府県');
                $table->string('city_g', 32)->comment('政令市･郡･支庁･振興局等');
                $table->string('city_g_kana', 32)->comment('政令市･郡･支庁･振興局等（ふりがな）');
                $table->string('city', 32)->comment('市区町村');
                $table->string('city_kana', 32)->comment('市区町村（ふりがな）');
                $table->date('abolition_division_date')->comment('廃置分合等施行年月日');
                $table->string('abolition_division_yn', 2)->comment('廃置分合等情報有無');
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('japan_city_codes');
    }
};
