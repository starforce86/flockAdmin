<?php

namespace App\Http\Controllers;

use App\Unit;
use Illuminate\Http\Request;
use App\Message;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function getNewGeneralMessages(Request $request)
    {
        try {
            $message = Message::where('serial', '')
                ->orWhere('serial', null)
                ->orderBy('id', 'DESC')
                ->first();

            if(empty($message)) {
                return response()->json(['success' => 0, 'errMsg'=> 'There is no new message.']);
            }

            return response()->json(['success' => 1, 'message'=> $message->msg, 'id' => $message->id]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg'=> $e->getMessage()]);
        }
    }

    public function getNewMessages(Request $request)
    {
        try {
            $serial = $request->get('serial');

            if(empty($serial)) {
                return response()->json(['success' => 0, 'errMsg'=> 'Serial # is empty!']);
            }

            $messages = Message::where('serial', $serial)
                ->where('read_status', 0)
                ->orderBy('id', 'ASC')
                ->get();

            foreach ($messages as $message) {
                $message->read_status = 1;
                $message->save();
            }

            return response()->json(['success' => 1, 'data'=> $messages]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg'=> $e->getMessage()]);
        }
    }

    public function ajaxAdd(Request $request)
    {
        try {
            $message = $request->get('message');

            if(empty($message)) {
                return response()->json(['success' => 0, 'errMsg'=> 'Message content is empty!']);
            }

//            $units = Unit::whereRaw('1=1')
//                ->orderBy('created_at', 'DESC')
//                ->get();
//
//            foreach ($units as $unit) {
//                $msg = new Message();
//
//                $msg->serial = $unit->serial;
//                $msg->msg = $message;
//
//                $msg->save();
//            }

            $msg = new Message();

            $msg->msg = $message;

            $msg->save();

            return response()->json(['success' => 1]);
        }
        catch (\Exception $e) {
            return response()->json(['success' => 0, 'errMsg'=> $e->getMessage()]);
        }
    }
}
