<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Unit;

class UnitController extends Controller
{
    /**
     * Return Units response as Json.
     *
     * @return \Illuminate\Http\Response
     */

    public function ajaxPushSoftwareUpdateNotification()
    {
        try {
            $oses = ['mac', 'win'];
            foreach ($oses as $os) {
                $version = DB::table('settings')
                    ->where([
                        ['key', '=', 'LAST_UPLOADED_SOFTWARE_VERSION'],
                        ['param1', '=', $os],
                    ])
                    ->value('value');
                DB::table('settings')
                    ->where([
                        ['key', '=', 'LAST_PUSHED_SOFTWARE_VERSION'],
                        ['param1', '=', $os],
                    ])
                    ->update(['value' => $version]);
            }
            return response()->json(['success' => 1]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg'=> $e->getMessage()]);
        }
    }

    public function ajaxPushFirmwareUpdateNotification()
    {
        try {
            $version = DB::table('settings')
                ->where([
                    ['key', '=', 'LAST_UPLOADED_FIRMWARE_VERSION'],
                ])
                ->value('value');
            DB::table('settings')
                ->where([
                    ['key', '=', 'LAST_PUSHED_FIRMWARE_VERSION'],
                ])
                ->update(['value' => $version]);
            return response()->json(['success' => 1]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg'=> $e->getMessage()]);
        }
    }

    public function ajaxList(Request $request)
    {
        try {
            $filterField = $request->get('filterField');
            if(empty($filterField)) {
                $units = Unit::whereRaw('1=1')
                    ->orderBy('created_at', 'DESC')
                    ->get();
            }
            else {
                $filterKeyword = $request->get('filterKeyword', '');
                $units = Unit::where($filterField, 'like', '%'.$filterKeyword.'%')
                    ->orderBy('created_at', 'DESC')
                    ->get();
            }

            return response()->json(['success' => 1, 'data'=> $units]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg'=> $e->getMessage()]);
        }
    }

    public function ajaxAdd(Request $request)
    {
        try {
            $serial = $request->get('serial');

            if(empty($serial)) {
                return response()->json(['success' => 0, 'errMsg'=> 'Unit Serial # is empty!']);
            }

            $id = $request->get('id');

            if(empty($id)) {
                $unit = new Unit();
            }
            else {
                $unit = Unit::find($id);
            }

            $unit->serial = $serial;
            $unit->assembly_date = $request->get('assembly_date');
            $unit->qaqc = $request->get('qaqc');
            $unit->mainboard = $request->get('mainboard');
            $unit->mcuboard = $request->get('mcuboard');
            $unit->inputboard1 = $request->get('inputboard1');
            $unit->inputboard2 = $request->get('inputboard2');
            $unit->inputboard3 = $request->get('inputboard3');
            $unit->inputboard4 = $request->get('inputboard4');
            $unit->software_reg_key = $request->get('software_reg_key');
            $unit->status = $request->get('status');
            $unit->active_date = $request->get('active_date');
            $unit->os = $request->get('os');
            $unit->active_licenses_count = $request->get('active_licenses_count');
            $unit->firstname = $request->get('firstname');
            $unit->lastname = $request->get('lastname');
            $unit->location = $request->get('location');
            $unit->email = $request->get('email');
            $unit->phone = $request->get('phone');
            $unit->warranty_type = $request->get('warranty_type');
            $unit->warranty_claims = $request->get('warranty_claims');
            $unit->warranty_active_date = $request->get('warranty_active_date');
            $unit->customer_notes = $request->get('customer_notes');
            $unit->is_repairing = $request->get('is_repairing');
            $unit->is_decommissioned = $request->get('is_decommissioned');

            $unit->save();

            $units = Unit::whereRaw('1=1')->orderBy('created_at', 'DESC')->get();

            return response()->json(['success' => 1, 'data'=> $units]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg'=> $e->getMessage()]);
        }
    }
}
