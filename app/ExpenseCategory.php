<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ExpenseCategory extends Model
{
  /**
   * Get the purchases for the expense category.
   */
  public function purchases()
  {
      return $this->hasMany('App\Purchase');
  }
}
