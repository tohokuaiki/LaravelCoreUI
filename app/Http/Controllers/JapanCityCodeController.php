<?php

namespace App\Http\Controllers;

use App\Models\JapanCityCode;
use Illuminate\Http\Request;

class JapanCityCodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($code = null)
    {
        return response()->json($code ? JapanCityCode::find($code) : JapanCityCode::all());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JapanCityCode $japanCityCode)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JapanCityCode $japanCityCode)
    {
        //
    }
}
