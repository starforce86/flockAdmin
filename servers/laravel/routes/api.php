<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function(){
  return response()->json(['status' => 200, 'message' => 'succcesful',]);
});  //generate token
Route::post('register', 'AuthController@register');  //generate token
Route::post('login', 'AuthController@login');  //generate token
Route::post('logout', 'AuthController@logout'); // logout will make the token to blacklisted you have to create token again from login route
Route::post('refresh', 'AuthController@refresh'); //can refresh token with existing token
Route::post('changePassword', 'AuthController@changePassword');
Route::post('secret/test', 'AuthController@test');

Route::post('unit/ajaxPushSoftwareUpdateNotification', 'UnitController@ajaxPushSoftwareUpdateNotification');
Route::post('unit/ajaxPushFirmwareUpdateNotification', 'UnitController@ajaxPushFirmwareUpdateNotification');
Route::post('unit/ajaxList', 'UnitController@ajaxList');
Route::post('unit/ajaxAdd', 'UnitController@ajaxAdd');
Route::post('upload/software', 'UploadController@software');
Route::post('upload/firmware', 'UploadController@firmware');
Route::post('message/ajaxAdd', 'MessageController@ajaxAdd');

//On Unauthorized Login
Route::get('error', function(){
  return response()->json(['error' => 'Invalid Token']);
})->name('login');

// API for PATCH APP & Installer
Route::match(['get', 'post'], 'installer/getInstallerInfo', ['as' => 'installer.getInfo', 'uses' => 'InstallerController@getInstallerInfo']);
Route::match(['get', 'post'], 'installer/getInstaller/{os}', ['as' => 'installer.get', 'uses' => 'InstallerController@getInstaller']);
Route::match(['get', 'post'], 'patchApp/getLastSoftwareVersion/{os}', ['as' => 'installer.getLastSoftwareVersion', 'uses' => 'InstallerController@getLastSoftwareVersion']);
Route::match(['get', 'post'], 'patchApp/getLastFirmwareVersion', ['as' => 'installer.getLastFirmwareVersion', 'uses' => 'InstallerController@getLastFirmwareVersion']);
Route::match(['get', 'post'], 'message/getNewMessages', ['as' => 'getNewMessages', 'uses' => 'MessageController@getNewMessages']);
Route::match(['get', 'post'], 'message/getNewGeneralMessages', ['as' => 'getNewGeneralMessages', 'uses' => 'MessageController@getNewGeneralMessages']);
Route::match(['get', 'post'], 'unit/checkRegKey', ['as' => 'checkRegKey', 'uses' => 'UnitController@checkRegKey']);
Route::match(['get', 'post'], 'unit/useRegKey', ['as' => 'useRegKey', 'uses' => 'UnitController@useRegKey']);

// API for User Portal
Route::post('unit/signUpUser', 'UnitController@signUpUser');
Route::post('unit/registerNewDevice', 'UnitController@registerNewDevice');