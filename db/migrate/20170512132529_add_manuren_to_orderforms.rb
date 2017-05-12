class AddManurenToOrderforms < ActiveRecord::Migration
  def change
    add_column :orderforms, :manuren, :string
  end
end
