<?php

namespace App\Http\Controllers;

use App\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Facades\JWTFactory;
use App\User;
use Hash;
use Exception;

class AuthController extends Controller
{
    protected $username = 'username';
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'changePassword']]);
    }
    /**
     * Create a User
     * @param  Request $request
     * @return [type]
     */
    public function register(Request $request)
    {
    	$input = $request->all();
    	$input['password'] = Hash::make($input['password']);
        try {
            User::create($input);
            return response()->json(['result'=>true]);
        } catch (Exception $e) {
            return response()->json(['error'=> 'Something Went Wrong!!']);
        }
    }

    /**
     * Get a JWT token via given credentials.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');
        $user = User::where('username', $request->username)->first();
        if (Hash::check($request->password, $user->password))
        {
            $token = $this->guard()->attempt($credentials);
            if ($token) {
                $last_user_log = Log::where('type', 'LOGIN')
                    ->where('user_id', $user->id)
                    ->orderBy('id', 'desc')
                    ->first();
                $new_log = new Log();
                $new_log->type = 'LOGIN';
                $new_log->user_id = $user->id;
                $new_log->value1 = $request->ip();
                $new_log->value3 = date('Y-m-d H:i:s');
                $new_log->save();

                return response()->json([
                    'token' => $token,
                    'token_type' => 'bearer',
                    'expiredAt' => $this->guard()->factory()->getTTL() * 60,
                    'last_accessed' => $last_user_log ? $last_user_log->value3 : '',
                    'last_ip' => $last_user_log ? $last_user_log->value1 : ''
                ]);
            }
        }
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    /**
     * Get the authenticated User
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function test()
    {
        return response()->json(['status' => 200, 'message' => 'succcesful',]);
    }

    /**
     * Log the user out (Invalidate the token)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        $this->guard()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function changePassword(Request $request)
    {
        $username = $request->get('username');
        $old_password = $request->get('oldPassword');
        $new_password = $request->get('newPassword');

        $user = User::where('username', $username)->first();

        if(empty($user)) {
            return response()->json(['success' => 0, 'errMsg'=> 'Username invalid!']);
        }

        if(!Hash::check($old_password, $user->password)) {
            return response()->json(['success' => 0, 'errMsg'=> 'Old password invalid!']);
        }

        $user->password = Hash::make($new_password);
        $user->save();

        return response()->json(['success' => 1]);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken($this->guard()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'expiredAt' => $this->guard()->factory()->getTTL() * 60
        ]);
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\Guard
     */
    public function guard()
    {
        return Auth::guard();
    }
}
