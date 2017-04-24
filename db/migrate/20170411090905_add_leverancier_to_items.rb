class AddLeverancierToItems < ActiveRecord::Migration
  def change
    add_reference :items, :leverancier, index: true, foreign_key: true
  end
end
