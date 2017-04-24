class AddRegelToItems < ActiveRecord::Migration
  def change
    add_reference :items, :regel, index: true, foreign_key: true
  end
end
