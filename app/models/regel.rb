class Regel < ActiveRecord::Base
    has_many :articles
    has_many :dropdowns, dependent: :destroy
    has_many :second_dropdowns, dependent: :destroy
    belongs_to :orderform
    belongs_to :leverancier

    accepts_nested_attributes_for :dropdowns, reject_if: :all_blank, allow_destroy: true
    accepts_nested_attributes_for :second_dropdowns, reject_if: :all_blank, allow_destroy: true
    
    validates :werkbon, presence: true
    validates :label, presence: true
end
