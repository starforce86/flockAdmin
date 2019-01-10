<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    /**
	* The table associated with the model.
	*
	* @var string
	*/
	protected $table = 'units';

	/**
	* Indicates if the model should be timestamped.
	*
	* @var bool
	*/
    public $timestamps = true;
    
    function __construct() {
        parent::__construct();
    }
}
