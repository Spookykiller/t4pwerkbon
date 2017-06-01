class RemoveManurenFromOrderforms < ActiveRecord::Migration
  def change
    remove_column :orderforms, :manuren, :string
  end
end
