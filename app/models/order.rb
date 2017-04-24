class Order < ActiveRecord::Base
    has_many :orderforms, dependent: :destroy
    
    validates :inmeetdatum, presence: true
    validates :email, presence: true
    validates :contactpersoon, presence: true
    
    def self.search(query)
      where("LOWER(project_naam) like ?", "%#{query}%") 
    end
end
