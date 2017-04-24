class AddGroupIdToOrderforms < ActiveRecord::Migration
  def change
    add_column :orderforms, :group_id, :integer
  end
end
