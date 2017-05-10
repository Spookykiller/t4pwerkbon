class UpdateForeignKey < ActiveRecord::Migration
  def change
    # remove the old foreign_key
    remove_foreign_key :items, :regels
    remove_foreign_key :items, :leveranciers

    # add the new foreign_key
    add_foreign_key :items, :regels, on_delete: :cascade
    add_foreign_key :items, :leveranciers, on_delete: :cascade
  end
end
