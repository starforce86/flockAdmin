<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class InstallerController extends Controller
{
    public function getInstallerInfo(Request $request) {

        try {
            if($request->get("os") == "win") {
                $installerFileName = "PATCH APP.zip";
                $installerPath = url("/Api/installer/getInstaller", ["os" => "win"]);
            }
            else if($request->get("os") == "mac") {
                $installerFileName = "PATCH APP.dmg";
                $installerPath = url("/Api/installer/getInstaller", ["os" => "mac"]);
            }
            else {
                return response()->json(["success" => 0, "errMsg" => "OS(win or mac) required!"]);
            }

            $size = Storage::size("installer/{$installerFileName}");
            $fileExt = File::extension($installerFileName);

            return response()->json(["success" => 1, "installerPath" => $installerPath, "fileSizeBytes" => $size, "fileExt" => $fileExt]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg' => $e->getMessage()]);
        }
    }

    public function getInstaller(Request $request, $os) {

        try {
            if($os == "win") {
                $installerFileName = "PATCH APP.zip";
                $installerPath = url("/Api/installer/getInstaller", ["os" => "win"]);
            }
            else if($os == "mac") {
                $installerFileName = "PATCH APP.dmg";
                $installerPath = url("/Api/installer/getInstaller", ["os" => "mac"]);
            }
            else {
                return response()->json(["success" => 0, "errMsg" => "OS(win or mac) required!"]);
            }

            $installerAbsolutePath = storage_path("app/installer/{$installerFileName}");

            return response()->file($installerAbsolutePath);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg' => $e->getMessage()]);
        }
    }

    public function getLastSoftwareVersion(Request $request, $os) {

        try {
            if($os != "win" && $os != "mac") {
                return response()->json(["success" => 0, "errMsg" => "OS(win or mac) required!"]);
            }
            $version = DB::table('settings')
                ->where([
                    ['key', '=', 'LAST_PUSHED_SOFTWARE_VERSION'],
                    ['param1', '=', $os],
                ])
                ->value('value');

            return response()->json(["success" => 1, "version" => $version]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg' => $e->getMessage()]);
        }
    }

    public function getLastFirmwareVersion(Request $request) {

        try {
            $version = DB::table('settings')
                ->where([
                    ['key', '=', 'LAST_PUSHED_FIRMWARE_VERSION'],
                ])
                ->value('value');

            return response()->json(["success" => 1, "version" => $version]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg' => $e->getMessage()]);
        }
    }
}
