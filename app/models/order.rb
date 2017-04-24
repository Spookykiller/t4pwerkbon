class Order < ActiveRecord::Base
    has_many :orderforms, dependent: :destroy
    
    validates :inmeetdatum, presence: true
    validates :email, presence: true
    validates :contactpersoon, presence: true
    
    scope :backup_orderforms, -> { joins(:orderforms).group(:id).where(orderforms: { backup: true, group_id: nil }) }
    scope :yet_to_process_orderforms, -> { joins(:orderforms).group(:id).where(orderforms: { backup: nil, group_id: nil }) }
    scope :empty_orderforms, -> { joins(:orderforms).group(:id).where(orderforms: { id: nil }) }

end
