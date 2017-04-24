class AddOrderToOrderforms < ActiveRecord::Migration
  def change
    add_reference :orderforms, :order, index: true, foreign_key: true
  end
end
