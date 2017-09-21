<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AgencyType extends Model
{
  /**
   * Get the purchases for the agency type.
   */
  public function purchases()
  {
      return $this->hasMany('App\Purchase');
  }
}
