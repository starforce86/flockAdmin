<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class UploadController extends Controller
{
    public function software(Request $request)
    {
        try {
            $version = $request->get('version');
            $uploadedFile = $request->file('file');
            $clientOriginalName = $uploadedFile->getClientOriginalName();
            $fileExt = File::extension($clientOriginalName);

            if($fileExt == 'dmg') {
                $os = 'mac';
            }
            else if($fileExt == 'zip') {
                $os = 'win';
            }
            else {
                return response()->json(['success' => 0, 'errMsg' => 'Unsupported file format! Upload either dmg or zip.']);
            }

            Storage::disk('local')->putFileAs(
                'installer',
                $uploadedFile,
                "PATCH APP.{$fileExt}"
            );

            DB::table('settings')
                ->where([
                    ['key', '=', 'LAST_UPLOADED_SOFTWARE_VERSION'],
                    ['param1', '=', $os],
                ])
                ->update(['value' => $version]);

            return response()->json(['success' => 1]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg' => $e->getMessage()]);
        }
    }

    public function firmware(Request $request)
    {
        try {
            $version = $request->get('version');
            $uploadedFile = $request->file('file');
            $clientOriginalName = $uploadedFile->getClientOriginalName();
            $fileExt = File::extension($clientOriginalName);

            Storage::disk('local')->putFileAs(
                'installer',
                $uploadedFile,
                "Firmware.{$fileExt}"
            );

            DB::table('settings')
                ->where([
                    ['key', '=', 'LAST_UPLOADED_FIRMWARE_VERSION'],
                ])
                ->update(['value' => $version]);

            return response()->json(['success' => 1]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg' => $e->getMessage()]);
        }
    }
}
